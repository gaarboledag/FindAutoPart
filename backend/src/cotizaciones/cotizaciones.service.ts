import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../common/services/storage.service';
import { CreateCotizacionDto } from './dto/create-cotizacion.dto';
import { UpdateCotizacionDto } from './dto/update-cotizacion.dto';
import { CotizacionStatus } from '@prisma/client';

import { EventsGateway } from '../events/events.gateway';

@Injectable()
export class CotizacionesService {
    private readonly logger = new Logger(CotizacionesService.name);

    constructor(
        private prisma: PrismaService,
        private storageService: StorageService,
        private eventsGateway: EventsGateway,
    ) { }

    private async enrichWithImages(cotizacion: any) {
        if (!cotizacion || !cotizacion.items) return cotizacion;

        const enrichedItems = await Promise.all(cotizacion.items.map(async (item) => {
            if (item.imagenUrl) {
                try {
                    // Extract Key from URL
                    // The stored URL might be a full signed URL from R2
                    // We assume the key starts with 'cotizaciones/' based on StorageService naming

                    const urlString = item.imagenUrl;
                    const keyMarker = 'cotizaciones/';
                    const index = urlString.indexOf(keyMarker);

                    if (index !== -1) {
                        // Extract everything from 'cotizaciones/' until the end (or query params)
                        // Initial extraction
                        let key = urlString.substring(index);

                        // If there are query parameters (e.g. ?X-Amz-...), remove them
                        const questionMarkIndex = key.indexOf('?');
                        if (questionMarkIndex !== -1) {
                            key = key.substring(0, questionMarkIndex);
                        }

                        // Now we have the clean key (e.g. "cotizaciones/uuid-filename.jpg")
                        this.logger.debug(`Extracted key for signing: ${key}`);

                        const signedUrl = await this.storageService.signUrl(key);
                        if (signedUrl) {
                            return { ...item, imagenUrl: signedUrl };
                        }
                    } else {
                        this.logger.warn(`Could not find '${keyMarker}' in URL: ${urlString}`);
                    }
                } catch (e) {
                    this.logger.error(`Error enriching image for item ${item.id}`, e);
                }
            }
            return item;
        }));

        return { ...cotizacion, items: enrichedItems };
    }

    async create(tallerId: string, dto: CreateCotizacionDto) {
        const cotizacion = await this.prisma.cotizacion.create({
            data: {
                tallerId,
                titulo: dto.titulo,
                descripcion: dto.descripcion,
                categoria: dto.categoria,
                marca: dto.marca,
                modelo: dto.modelo,
                anio: dto.anio,
                patente: dto.patente,
                items: {
                    create: dto.items.map((item) => ({
                        codigo: item.codigo,
                        nombre: item.nombre,
                        descripcion: item.descripcion,
                        marca: item.marca,
                        cantidad: item.cantidad,
                        imagenUrl: item.imagenUrl,
                    })),
                },
            },
            include: {
                taller: {
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

        // Emit event to all Tiendas
        this.eventsGateway.emitToRole('TIENDA', 'newCotizacion', cotizacion);

        return cotizacion;
    }

    async findAll(tallerId?: string, status?: CotizacionStatus, currentUserId?: string) {
        const where: any = {};

        if (tallerId) {
            where.tallerId = tallerId;
        }

        if (status) {
            where.status = status;
        }

        const cotizaciones = await this.prisma.cotizacion.findMany({
            where,
            include: {
                taller: {
                    select: {
                        id: true,
                        nombre: true,
                        ciudad: true,
                        region: true,
                    },
                },
                items: true,
                _count: {
                    select: {
                        ofertas: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        // Enrich all results with fresh signed URLs
        const enriched = await Promise.all(cotizaciones.map(c => this.enrichWithImages(c)));

        if (currentUserId) {
            // Calculate unread counts for each cotizacion
            const cotizacionIds = cotizaciones.map(c => c.id);

            // Find all chats for these cotizaciones
            const chats = await this.prisma.chat.findMany({
                where: {
                    cotizacionId: { in: cotizacionIds }
                },
                select: {
                    id: true,
                    cotizacionId: true
                }
            });

            if (chats.length > 0) {
                const chatIds = chats.map(c => c.id);

                // Count unread messages for these chats excluding current user
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

                // Map counts back to cotizaciones
                const unreadMap = new Map<string, number>(); // cotizacionId -> count

                unreadCounts.forEach(count => {
                    const chat = chats.find(c => c.id === count.chatId);
                    if (chat && chat.cotizacionId) {
                        const current = unreadMap.get(chat.cotizacionId) || 0;
                        unreadMap.set(chat.cotizacionId, current + count._count._all);
                    }
                });

                return enriched.map(c => ({
                    ...c,
                    unreadCount: unreadMap.get(c.id) || 0
                }));
            }
        }

        return enriched;
    }

    async findAvailableForTienda(tiendaId: string) {
        const tienda = await this.prisma.tienda.findUnique({
            where: { id: tiendaId },
            select: { cobertura: true, categorias: true },
        });

        if (!tienda) {
            throw new NotFoundException('Store not found');
        }

        const cotizaciones = await this.prisma.cotizacion.findMany({
            where: {
                status: CotizacionStatus.ABIERTA,
                taller: {
                    region: {
                        in: tienda.cobertura,
                    },
                },
                categoria: {
                    in: tienda.categorias.length > 0 ? tienda.categorias : undefined,
                },
                ofertas: {
                    none: {
                        tiendaId,
                    },
                },
            },
            include: {
                taller: {
                    select: {
                        id: true,
                        nombre: true,
                        ciudad: true,
                        region: true,
                    },
                },
                items: true,
                _count: {
                    select: {
                        ofertas: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        // Create a map of viewed status
        const views = await this.prisma.cotizacionView.findMany({
            where: {
                tiendaId,
                cotizacionId: { in: cotizaciones.map(c => c.id) },
            },
            select: { cotizacionId: true },
        });

        const viewedIds = new Set(views.map(v => v.cotizacionId));

        return Promise.all(cotizaciones.map(async c => {
            const enriched = await this.enrichWithImages(c);
            return {
                ...enriched,
                isViewed: viewedIds.has(c.id),
            };
        }));
    }

    async findOne(id: string) {
        const cotizacion = await this.prisma.cotizacion.findUnique({
            where: { id },
            include: {
                taller: {
                    select: {
                        id: true,
                        nombre: true,
                        telefono: true,
                        direccion: true,
                        ciudad: true,
                        region: true,
                    },
                },
                items: true,
                ofertas: {
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
                },
                pedido: true,
            },
        });

        if (!cotizacion) {
            throw new NotFoundException('Quotation not found');
        }

        return this.enrichWithImages(cotizacion);
    }

    async update(id: string, tallerId: string, dto: UpdateCotizacionDto) {
        const cotizacion = await this.prisma.cotizacion.findUnique({
            where: { id },
        });

        if (!cotizacion) {
            throw new NotFoundException('Quotation not found');
        }

        if (cotizacion.tallerId !== tallerId) {
            throw new BadRequestException('Not authorized to update this quotation');
        }

        if (cotizacion.status !== CotizacionStatus.ABIERTA) {
            throw new BadRequestException('Cannot update a closed quotation');
        }

        return this.prisma.cotizacion.update({
            where: { id },
            data: dto,
            include: {
                taller: true,
                items: true,
            },
        });
    }

    async close(id: string, tallerId: string) {
        const cotizacion = await this.prisma.cotizacion.findUnique({
            where: { id },
        });

        if (!cotizacion) {
            throw new NotFoundException('Quotation not found');
        }

        if (cotizacion.tallerId !== tallerId) {
            throw new BadRequestException('Not authorized to close this quotation');
        }

        return this.prisma.cotizacion.update({
            where: { id },
            data: {
                status: CotizacionStatus.CERRADA,
                closedAt: new Date(),
            },
            include: {
                taller: true,
                items: true,
                ofertas: {
                    include: {
                        tienda: true,
                    },
                },
            },
        });
    }

    async cancel(id: string, tallerId: string) {
        const cotizacion = await this.prisma.cotizacion.findUnique({
            where: { id },
            include: {
                pedido: true
            }
        });

        if (!cotizacion) {
            throw new NotFoundException('Quotation not found');
        }

        if (cotizacion.tallerId !== tallerId) {
            throw new BadRequestException('Not authorized to cancel this quotation');
        }

        // Optional: Check if order exists? For now, we allow cancellation but maybe log it.
        // If an order exists, canceling the quotation might be weird, but user requested it.

        return this.prisma.cotizacion.update({
            where: { id },
            data: {
                status: CotizacionStatus.CANCELADA,
            },
            include: {
                taller: true,
                items: true,
            },
        });
    }

    async remove(id: string, tallerId: string) {
        const cotizacion = await this.prisma.cotizacion.findUnique({
            where: { id },
            include: {
                _count: {
                    select: {
                        ofertas: true,
                    },
                },
            },
        });

        if (!cotizacion) {
            throw new NotFoundException('Quotation not found');
        }

        if (cotizacion.tallerId !== tallerId) {
            throw new BadRequestException('Not authorized to delete this quotation');
        }

        if (cotizacion._count.ofertas > 0) {
            throw new BadRequestException('Cannot delete quotation with existing offers');
        }

        return this.prisma.cotizacion.delete({
            where: { id },
        });
    }

    async markAsViewed(cotizacionId: string, tiendaId: string) {
        // Check if already viewed
        const existingView = await this.prisma.cotizacionView.findUnique({
            where: {
                cotizacionId_tiendaId: {
                    cotizacionId,
                    tiendaId,
                },
            },
        });

        if (existingView) {
            return existingView;
        }

        return this.prisma.cotizacionView.create({
            data: {
                cotizacionId,
                tiendaId,
            },
        });
    }

    async getUnreadCount(tiendaId: string) {
        const tienda = await this.prisma.tienda.findUnique({
            where: { id: tiendaId },
            select: { cobertura: true, categorias: true },
        });

        if (!tienda) return 0;

        const unreadCount = await this.prisma.cotizacion.count({
            where: {
                status: CotizacionStatus.ABIERTA,
                taller: {
                    region: { in: tienda.cobertura },
                },
                categoria: {
                    in: tienda.categorias.length > 0 ? tienda.categorias : undefined,
                },
                ofertas: {
                    none: { tiendaId },
                },
                views: {
                    none: { tiendaId },
                },
            },
        });

        return unreadCount;
    }
}
