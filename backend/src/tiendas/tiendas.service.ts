import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTiendaDto } from './dto/create-tienda.dto';
import { UpdateTiendaDto } from './dto/update-tienda.dto';

@Injectable()
export class TiendasService {
    constructor(private prisma: PrismaService) { }

    async create(userId: string, dto: CreateTiendaDto) {
        const existingTienda = await this.prisma.tienda.findUnique({
            where: { userId },
        });

        if (existingTienda) {
            throw new BadRequestException('User already has a store profile');
        }

        const rutExists = await this.prisma.tienda.findUnique({
            where: { rut: dto.rut },
        });

        if (rutExists) {
            throw new BadRequestException('RUT already registered');
        }

        return this.prisma.tienda.create({
            data: {
                userId,
                ...dto,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        role: true,
                    },
                },
            },
        });
    }

    async findAll() {
        return this.prisma.tienda.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        isActive: true,
                    },
                },
                _count: {
                    select: {
                        repuestos: true,
                        ofertas: true,
                        pedidos: true,
                    },
                },
            },
        });
    }

    async findOne(id: string) {
        const tienda = await this.prisma.tienda.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        role: true,
                        isActive: true,
                    },
                },
                repuestos: {
                    take: 20,
                    orderBy: { createdAt: 'desc' },
                },
                _count: {
                    select: {
                        ofertas: true,
                        pedidos: true,
                    },
                },
            },
        });

        if (!tienda) {
            throw new NotFoundException('Store not found');
        }

        return tienda;
    }

    async findByUserId(userId: string) {
        const tienda = await this.prisma.tienda.findUnique({
            where: { userId },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        role: true,
                    },
                },
            },
        });

        if (!tienda) {
            throw new NotFoundException('Store profile not found for this user');
        }

        return tienda;
    }

    async update(id: string, userId: string, dto: UpdateTiendaDto) {
        const tienda = await this.prisma.tienda.findUnique({
            where: { id },
        });

        if (!tienda) {
            throw new NotFoundException('Store not found');
        }

        if (tienda.userId !== userId) {
            throw new BadRequestException('Not authorized to update this store');
        }

        if (dto.rut && dto.rut !== tienda.rut) {
            const rutExists = await this.prisma.tienda.findUnique({
                where: { rut: dto.rut },
            });

            if (rutExists) {
                throw new BadRequestException('RUT already registered');
            }
        }

        return this.prisma.tienda.update({
            where: { id },
            data: dto,
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        role: true,
                    },
                },
            },
        });
    }

    async updateByUserId(userId: string, dto: UpdateTiendaDto) {
        const tienda = await this.prisma.tienda.findUnique({
            where: { userId },
        });

        if (!tienda) {
            throw new NotFoundException('Store profile not found');
        }

        return this.update(tienda.id, userId, dto);
    }

    async remove(id: string, userId: string) {
        const tienda = await this.prisma.tienda.findUnique({
            where: { id },
        });

        if (!tienda) {
            throw new NotFoundException('Store not found');
        }

        if (tienda.userId !== userId) {
            throw new BadRequestException('Not authorized to delete this store');
        }

        return this.prisma.tienda.delete({
            where: { id },
        });
    }
}
