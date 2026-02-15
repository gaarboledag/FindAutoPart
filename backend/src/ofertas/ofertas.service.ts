import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOfertaDto } from './dto/create-oferta.dto';
import { CotizacionStatus } from '@prisma/client';

import { EventsGateway } from '../events/events.gateway';

@Injectable()
export class OfertasService {
    constructor(
        private prisma: PrismaService,
        private eventsGateway: EventsGateway,
    ) { }

    async create(tiendaId: string, cotizacionId: string, dto: CreateOfertaDto) {
        // Verify quotation exists and is open
        const cotizacion = await this.prisma.cotizacion.findUnique({
            where: { id: cotizacionId },
            include: {
                items: true,
            },
        });

        if (!cotizacion) {
            throw new NotFoundException('Quotation not found');
        }

        if (cotizacion.status !== CotizacionStatus.ABIERTA) {
            throw new BadRequestException('Quotation is not open for offers');
        }

        // Check if store already submitted an offer
        const existing = await this.prisma.oferta.findUnique({
            where: {
                cotizacionId_tiendaId: {
                    cotizacionId,
                    tiendaId,
                },
            },
        });

        if (existing) {
            throw new BadRequestException('You have already submitted an offer for this quotation');
        }

        // Map items with cotizacion data
        const itemsData = dto.items.map((item) => {
            // Find corresponding cotizacion item
            const cotItem = item.cotizacionItemId
                ? cotizacion.items.find(ci => ci.id === item.cotizacionItemId)
                : null;

            return {
                nombre: item.nombre || cotItem?.descripcion || 'Item',
                marca: item.marca || cotItem?.marca || null,
                cantidad: item.cantidad || cotItem?.cantidad || 1,
                precioUnitario: item.precioUnitario,
                disponible: item.disponible ?? true,
                repuestoId: item.repuestoId,
            };
        });

        // Use validezDias if provided, otherwise diasEntrega
        const diasEntrega = dto.diasEntrega ?? dto.validezDias ?? 7;
        const comentarios = dto.comentarios || dto.observaciones || null;

        // Create offer with items
        const oferta = await this.prisma.oferta.create({
            data: {
                cotizacionId,
                tiendaId,
                diasEntrega,
                comentarios,
                items: {
                    create: itemsData,
                },
            },
            include: {
                tienda: {
                    select: {
                        id: true,
                        nombre: true,
                        ciudad: true,
                    },
                },
                items: true,
            },
        });

        // Emit to the Taller who owns the quotation
        this.eventsGateway.emitToUser(cotizacion.tallerId, 'newOferta', oferta);

        return oferta;
    }

    async findByTienda(tiendaId: string, currentUserId?: string) {
        const ofertas = await this.prisma.oferta.findMany({
            where: { tiendaId },
            include: {
                cotizacion: {
                    include: {
                        taller: {
                            select: {
                                id: true,
                                nombre: true,
                                ciudad: true,
                            },
                        },
                    },
                },
                items: true,
                pedido: {
                    select: {
                        id: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
        });

        if (currentUserId && ofertas.length > 0) {
            // Find chats for these offers
            // Chat is unique per (cotizacionId, tiendaId)
            const chatKeys = ofertas.map(o => ({ cotizacionId: o.cotizacionId, tiendaId: o.tiendaId }));

            const chats = await this.prisma.chat.findMany({
                where: {
                    OR: chatKeys
                },
                select: {
                    id: true,
                    cotizacionId: true,
                    tiendaId: true
                }
            });

            if (chats.length > 0) {
                const chatIds = chats.map(c => c.id);

                const unreadCounts = await this.prisma.chatMessage.groupBy({
                    by: ['chatId'],
                    where: {
                        chatId: { in: chatIds },
                        isRead: false,
                        senderId: { not: currentUserId }
                    },
                    _count: {
                        _all: true
                    }
                });

                const unreadMap = new Map<string, number>(); // ofertaId -> count
                // We need to map chat -> oferta. 
                // Oferta is (cotizacionId, tiendaId). Chat is also (cotizacionId, tiendaId).

                unreadCounts.forEach(count => {
                    const chat = chats.find(c => c.id === count.chatId);
                    if (chat) {
                        const oferta = ofertas.find(o => o.cotizacionId === chat.cotizacionId && o.tiendaId === chat.tiendaId);
                        if (oferta) {
                            unreadMap.set(oferta.id, count._count._all);
                        }
                    }
                });

                return ofertas.map(o => ({
                    ...o,
                    seleccionada: !!o.pedido,
                    unreadCount: unreadMap.get(o.id) || 0
                }));
            }
        }

        return ofertas.map(o => ({
            ...o,
            seleccionada: !!o.pedido
        }));
    }

    async findByCotizacion(cotizacionId: string) {
        return this.prisma.oferta.findMany({
            where: { cotizacionId },
            include: {
                tienda: {
                    select: {
                        id: true,
                        nombre: true,
                        telefono: true,
                        ciudad: true,
                        region: true,
                    },
                },
                items: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: string) {
        const oferta = await this.prisma.oferta.findUnique({
            where: { id },
            include: {
                cotizacion: {
                    include: {
                        taller: true,
                        items: true,
                    },
                },
                tienda: {
                    select: {
                        id: true,
                        nombre: true,
                        telefono: true,
                        direccion: true,
                        ciudad: true,
                        region: true,
                    },
                },
                items: {
                    include: {
                        repuesto: true,
                    },
                },
            },
        });

        if (!oferta) {
            throw new NotFoundException('Offer not found');
        }

        return oferta;
    }

    async getComparison(cotizacionId: string) {
        const ofertas = await this.prisma.oferta.findMany({
            where: { cotizacionId },
            include: {
                tienda: {
                    select: {
                        id: true,
                        nombre: true,
                        ciudad: true,
                        region: true,
                    },
                },
                items: true,
            },
        });

        // Calculate totals and metrics
        const comparison = ofertas.map((oferta) => {
            const total = oferta.items.reduce(
                (sum, item) => sum + item.precioUnitario * item.cantidad,
                0,
            );

            const itemsCubiertos = oferta.items.filter((item) => item.disponible).length;
            const totalItems = oferta.items.length;

            return {
                ofertaId: oferta.id,
                tienda: oferta.tienda,
                total,
                diasEntrega: oferta.diasEntrega,
                itemsCubiertos,
                totalItems,
                cobertura: (itemsCubiertos / totalItems) * 100,
                comentarios: oferta.comentarios,
                createdAt: oferta.createdAt,
            };
        });

        // Sort by total price (lowest first)
        comparison.sort((a, b) => a.total - b.total);

        return comparison;
    }

    async remove(id: string, tiendaId: string) {
        const oferta = await this.prisma.oferta.findUnique({
            where: { id },
            include: {
                cotizacion: true,
                pedido: true,
            },
        });

        if (!oferta) {
            throw new NotFoundException('Offer not found');
        }

        if (oferta.tiendaId !== tiendaId) {
            throw new BadRequestException('Not authorized to delete this offer');
        }

        if (oferta.pedido) {
            throw new BadRequestException('Cannot delete offer with existing order');
        }

        if (oferta.cotizacion.status !== CotizacionStatus.ABIERTA) {
            throw new BadRequestException('Cannot delete offer for closed quotation');
        }

        return this.prisma.oferta.delete({
            where: { id },
        });
    }
}
