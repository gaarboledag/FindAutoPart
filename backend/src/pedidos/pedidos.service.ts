import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoStatusDto } from './dto/update-pedido-status.dto';
import { PedidoStatus, CotizacionStatus } from '@prisma/client';

import { EventsGateway } from '../events/events.gateway';

@Injectable()
export class PedidosService {
    constructor(
        private prisma: PrismaService,
        private eventsGateway: EventsGateway,
    ) { }

    async create(tallerId: string, dto: CreatePedidoDto) {
        // Verify oferta exists
        const oferta = await this.prisma.oferta.findUnique({
            where: { id: dto.ofertaId },
            include: {
                cotizacion: true,
                tienda: true,
                items: true,
            },
        });

        if (!oferta) {
            throw new NotFoundException('Offer not found');
        }

        // Verify quotation belongs to taller
        if (oferta.cotizacion.tallerId !== tallerId) {
            throw new BadRequestException('Not authorized to create order from this offer');
        }

        // Verify quotation is not already closed with another order
        const existingPedido = await this.prisma.pedido.findUnique({
            where: { cotizacionId: oferta.cotizacionId },
        });

        if (existingPedido) {
            throw new BadRequestException('An order already exists for this quotation');
        }

        // Calculate total
        const total = oferta.items.reduce(
            (sum, item) => sum + item.precioUnitario * item.cantidad,
            0,
        );

        // Calculate estimated delivery date
        const fechaEstimada = new Date();
        fechaEstimada.setDate(fechaEstimada.getDate() + oferta.diasEntrega);

        // Create order and close quotation
        const pedido = await this.prisma.pedido.create({
            data: {
                cotizacionId: oferta.cotizacionId,
                ofertaId: oferta.id,
                tallerId,
                tiendaId: oferta.tiendaId,
                total,
                direccionEntrega: dto.direccionEntrega,
                fechaEstimada,
                notas: dto.notas,
            },
            include: {
                cotizacion: {
                    include: {
                        items: true,
                    },
                },
                oferta: {
                    include: {
                        items: true,
                    },
                },
                taller: true,
                tienda: true,
            },
        });

        // Close the quotation
        await this.prisma.cotizacion.update({
            where: { id: oferta.cotizacionId },
            data: {
                status: CotizacionStatus.CERRADA,
                closedAt: new Date(),
            },
        });

        // Notify Tienda about new order
        this.eventsGateway.emitToUser(oferta.tiendaId, 'newPedido', pedido);

        return pedido;
    }

    async findAll(userId: string, role: string, status?: string) {
        const where: any = {};

        if (status) {
            where.status = status;
        }

        if (role === 'TALLER') {
            const taller = await this.prisma.taller.findUnique({
                where: { userId },
                select: { id: true },
            });
            if (taller) {
                where.tallerId = taller.id;
            }
        } else if (role === 'TIENDA') {
            const tienda = await this.prisma.tienda.findUnique({
                where: { userId },
                select: { id: true },
            });
            if (tienda) {
                where.tiendaId = tienda.id;
            }
        }

        return this.prisma.pedido.findMany({
            where,
            include: {
                cotizacion: {
                    select: {
                        id: true,
                        titulo: true,
                        marca: true,
                        modelo: true,
                        anio: true,
                    },
                },
                taller: {
                    select: {
                        id: true,
                        nombre: true,
                        ciudad: true,
                    },
                },
                tienda: {
                    select: {
                        id: true,
                        nombre: true,
                        ciudad: true,
                    },
                },
                oferta: {
                    include: {
                        items: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: string) {
        const pedido = await this.prisma.pedido.findUnique({
            where: { id },
            include: {
                cotizacion: {
                    include: {
                        items: true,
                    },
                },
                oferta: {
                    include: {
                        items: true,
                    },
                },
                taller: true,
                tienda: true,
            },
        });

        if (!pedido) {
            throw new NotFoundException('Order not found');
        }

        return pedido;
    }

    async updateStatus(id: string, userId: string, role: string, dto: UpdatePedidoStatusDto) {
        const pedido = await this.prisma.pedido.findUnique({
            where: { id },
            include: {
                taller: true,
                tienda: true,
            }
        });

        if (!pedido) {
            throw new NotFoundException('Order not found');
        }

        // Role-based validation
        if (role === 'TIENDA') {
            if (pedido.tienda.userId !== userId) {
                throw new BadRequestException('Not authorized to update this order');
            }
            // Tienda can only set to CONFIRMADO (or other intermediate statuses if they existed)
            // Tienda CANNOT set to ENTREGADO anymore
            if (dto.status === PedidoStatus.ENTREGADO) {
                throw new BadRequestException('Only the Workshop can mark the order as received/delivered');
            }
        } else if (role === 'TALLER') {
            if (pedido.taller.userId !== userId) {
                throw new BadRequestException('Not authorized to update this order');
            }
            // Taller can only set to ENTREGADO
            if (dto.status !== PedidoStatus.ENTREGADO) {
                throw new BadRequestException('Workshop can only mark the order as delivered');
            }
        } else if (role !== 'ADMIN') {
            throw new BadRequestException('Not authorized');
        }

        const updateData: any = {
            status: dto.status,
        };

        // Set delivery date when status is ENTREGADO
        if (dto.status === PedidoStatus.ENTREGADO) {
            updateData.fechaEntregado = new Date();
        }

        const updated = await this.prisma.pedido.update({
            where: { id },
            data: updateData,
            include: {
                cotizacion: true,
                taller: true,
                tienda: true,
            },
        });

        // Notify Taller about status update
        this.eventsGateway.emitToUser(pedido.tallerId, 'pedidoUpdate', updated);

        return updated;
    }

    async cancel(id: string, userId: string, role: string) {
        const pedido = await this.prisma.pedido.findUnique({
            where: { id },
            include: {
                taller: true,
                tienda: true,
            },
        });

        if (!pedido) {
            throw new NotFoundException('Order not found');
        }

        // Verify authorization
        if (role === 'TALLER' && pedido.taller.userId !== userId) {
            throw new BadRequestException('Not authorized to cancel this order');
        }

        if (role === 'TIENDA' && pedido.tienda.userId !== userId) {
            throw new BadRequestException('Not authorized to cancel this order');
        }

        // Can only cancel if not already delivered
        if (pedido.status === PedidoStatus.ENTREGADO) {
            throw new BadRequestException('Cannot cancel a delivered order');
        }

        const cancelled = await this.prisma.pedido.update({
            where: { id },
            data: {
                status: PedidoStatus.CANCELADO,
            },
            include: {
                cotizacion: true,
                taller: true,
                tienda: true,
            },
        });

        // Notify both parties? Or just the other party.
        // Simplification: Notify both or just target the other based on who initiated.
        // For simplicity, emit to both parties involved
        this.eventsGateway.emitToUser(pedido.tallerId, 'pedidoUpdate', cancelled);
        this.eventsGateway.emitToUser(pedido.tiendaId, 'pedidoUpdate', cancelled);

        return cancelled;
    }
}
