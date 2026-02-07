import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTallerDto } from './dto/create-taller.dto';
import { UpdateTallerDto } from './dto/update-taller.dto';

@Injectable()
export class TalleresService {
    constructor(private prisma: PrismaService) { }

    async create(userId: string, dto: CreateTallerDto) {
        // Check if user already has a taller profile
        const existingTaller = await this.prisma.taller.findUnique({
            where: { userId },
        });

        if (existingTaller) {
            throw new BadRequestException('User already has a workshop profile');
        }

        // Check if RUT is already registered
        const rutExists = await this.prisma.taller.findUnique({
            where: { rut: dto.rut },
        });

        if (rutExists) {
            throw new BadRequestException('RUT already registered');
        }

        return this.prisma.taller.create({
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
        return this.prisma.taller.findMany({
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
                        cotizaciones: true,
                        pedidos: true,
                    },
                },
            },
        });
    }

    async findOne(id: string) {
        const taller = await this.prisma.taller.findUnique({
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
                cotizaciones: {
                    take: 10,
                    orderBy: { createdAt: 'desc' },
                },
                pedidos: {
                    take: 10,
                    orderBy: { createdAt: 'desc' },
                },
            },
        });

        if (!taller) {
            throw new NotFoundException('Workshop not found');
        }

        return taller;
    }

    async findByUserId(userId: string) {
        const taller = await this.prisma.taller.findUnique({
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

        if (!taller) {
            throw new NotFoundException('Workshop profile not found for this user');
        }

        return taller;
    }

    async update(id: string, userId: string, dto: UpdateTallerDto) {
        // Verify ownership
        const taller = await this.prisma.taller.findUnique({
            where: { id },
        });

        if (!taller) {
            throw new NotFoundException('Workshop not found');
        }

        if (taller.userId !== userId) {
            throw new BadRequestException('Not authorized to update this workshop');
        }

        // Check RUT uniqueness if updating
        if (dto.rut && dto.rut !== taller.rut) {
            const rutExists = await this.prisma.taller.findUnique({
                where: { rut: dto.rut },
            });

            if (rutExists) {
                throw new BadRequestException('RUT already registered');
            }
        }

        return this.prisma.taller.update({
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

    async updateByUserId(userId: string, dto: UpdateTallerDto) {
        // Find taller by userId
        const taller = await this.prisma.taller.findUnique({
            where: { userId },
        });

        if (!taller) {
            throw new NotFoundException('Workshop profile not found for this user');
        }

        // Check RUT uniqueness if updating
        if (dto.rut && dto.rut !== taller.rut) {
            const rutExists = await this.prisma.taller.findUnique({
                where: { rut: dto.rut },
            });

            if (rutExists) {
                throw new BadRequestException('RUT already registered');
            }
        }

        return this.prisma.taller.update({
            where: { userId },
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

    async remove(id: string, userId: string) {
        const taller = await this.prisma.taller.findUnique({
            where: { id },
        });

        if (!taller) {
            throw new NotFoundException('Workshop not found');
        }

        if (taller.userId !== userId) {
            throw new BadRequestException('Not authorized to delete this workshop');
        }

        return this.prisma.taller.delete({
            where: { id },
        });
    }
}
