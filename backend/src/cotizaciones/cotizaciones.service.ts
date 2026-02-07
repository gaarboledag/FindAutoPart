import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCotizacionDto } from './dto/create-cotizacion.dto';
import { UpdateCotizacionDto } from './dto/update-cotizacion.dto';
import { CotizacionStatus } from '@prisma/client';

@Injectable()
export class CotizacionesService {
    constructor(private prisma: PrismaService) { }

    async create(tallerId: string, dto: CreateCotizacionDto) {
        return this.prisma.cotizacion.create({
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
    }

    async findAll(tallerId?: string, status?: CotizacionStatus) {
        const where: any = {};

        if (tallerId) {
            where.tallerId = tallerId;
        }

        if (status) {
            where.status = status;
        }

        return this.prisma.cotizacion.findMany({
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
    }

    async findAvailableForTienda(tiendaId: string) {
        // Get tienda to check coverage and categories
        const tienda = await this.prisma.tienda.findUnique({
            where: { id: tiendaId },
            select: { cobertura: true, categorias: true },
        });

        if (!tienda) {
            throw new NotFoundException('Store not found');
        }

        // Find open quotations in covered regions and matching categories
        return this.prisma.cotizacion.findMany({
            where: {
                status: CotizacionStatus.ABIERTA,
                taller: {
                    region: {
                        in: tienda.cobertura,
                    },
                },
                // Filter by categories
                categoria: {
                    in: tienda.categorias.length > 0 ? tienda.categorias : undefined,
                },
                // Exclude quotations where this store already submitted an offer
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

        return cotizacion;
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
}
