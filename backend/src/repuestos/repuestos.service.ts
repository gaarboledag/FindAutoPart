import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRepuestoDto } from './dto/create-repuesto.dto';
import { UpdateRepuestoDto } from './dto/update-repuesto.dto';
import { SearchRepuestosDto } from './dto/search-repuestos.dto';

@Injectable()
export class RepuestosService {
    constructor(private prisma: PrismaService) { }

    async create(tiendaId: string, dto: CreateRepuestoDto) {
        // Check if codigo already exists for this store
        const existing = await this.prisma.repuesto.findUnique({
            where: {
                tiendaId_codigo: {
                    tiendaId,
                    codigo: dto.codigo,
                },
            },
        });

        if (existing) {
            throw new BadRequestException('Part code already exists in your catalog');
        }

        return this.prisma.repuesto.create({
            data: {
                tiendaId,
                ...dto,
            },
            include: {
                tienda: {
                    select: {
                        id: true,
                        nombre: true,
                    },
                },
            },
        });
    }

    async findAll(tiendaId?: string) {
        return this.prisma.repuesto.findMany({
            where: tiendaId ? { tiendaId } : undefined,
            include: {
                tienda: {
                    select: {
                        id: true,
                        nombre: true,
                        ciudad: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async search(dto: SearchRepuestosDto) {
        const where: any = {};

        if (dto.query) {
            where.OR = [
                { nombre: { contains: dto.query, mode: 'insensitive' } },
                { codigo: { contains: dto.query, mode: 'insensitive' } },
                { marca: { contains: dto.query, mode: 'insensitive' } },
                { descripcion: { contains: dto.query, mode: 'insensitive' } },
            ];
        }

        if (dto.marca) {
            where.marca = { contains: dto.marca, mode: 'insensitive' };
        }

        if (dto.categoria) {
            where.categorias = { has: dto.categoria };
        }

        if (dto.tiendaId) {
            where.tiendaId = dto.tiendaId;
        }

        if (dto.enStock !== undefined) {
            if (dto.enStock) {
                where.stock = { gt: 0 };
            } else {
                where.stock = 0;
            }
        }

        return this.prisma.repuesto.findMany({
            where,
            include: {
                tienda: {
                    select: {
                        id: true,
                        nombre: true,
                        ciudad: true,
                        region: true,
                    },
                },
            },
            take: dto.limit || 50,
            skip: dto.offset || 0,
            orderBy: dto.orderBy
                ? { [dto.orderBy]: dto.order || 'asc' }
                : { createdAt: 'desc' },
        });
    }

    async findOne(id: string) {
        const repuesto = await this.prisma.repuesto.findUnique({
            where: { id },
            include: {
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
            },
        });

        if (!repuesto) {
            throw new NotFoundException('Part not found');
        }

        return repuesto;
    }

    async update(id: string, tiendaId: string, dto: UpdateRepuestoDto) {
        const repuesto = await this.prisma.repuesto.findUnique({
            where: { id },
        });

        if (!repuesto) {
            throw new NotFoundException('Part not found');
        }

        if (repuesto.tiendaId !== tiendaId) {
            throw new BadRequestException('Not authorized to update this part');
        }

        // Check codigo uniqueness if updating
        if (dto.codigo && dto.codigo !== repuesto.codigo) {
            const existing = await this.prisma.repuesto.findUnique({
                where: {
                    tiendaId_codigo: {
                        tiendaId,
                        codigo: dto.codigo,
                    },
                },
            });

            if (existing) {
                throw new BadRequestException('Part code already exists in your catalog');
            }
        }

        return this.prisma.repuesto.update({
            where: { id },
            data: dto,
            include: {
                tienda: {
                    select: {
                        id: true,
                        nombre: true,
                    },
                },
            },
        });
    }

    async remove(id: string, tiendaId: string) {
        const repuesto = await this.prisma.repuesto.findUnique({
            where: { id },
        });

        if (!repuesto) {
            throw new NotFoundException('Part not found');
        }

        if (repuesto.tiendaId !== tiendaId) {
            throw new BadRequestException('Not authorized to delete this part');
        }

        return this.prisma.repuesto.delete({
            where: { id },
        });
    }
}
