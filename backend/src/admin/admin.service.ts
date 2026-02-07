import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
    constructor(private prisma: PrismaService) { }

    async getStats() {
        const [
            totalUsers,
            totalTalleres,
            totalTiendas,
            totalRepuestos,
            totalCotizaciones,
            totalOfertas,
            totalPedidos,
            activeUsers,
            openCotizaciones,
            pendingPedidos,
        ] = await Promise.all([
            this.prisma.user.count(),
            this.prisma.taller.count(),
            this.prisma.tienda.count(),
            this.prisma.repuesto.count(),
            this.prisma.cotizacion.count(),
            this.prisma.oferta.count(),
            this.prisma.pedido.count(),
            this.prisma.user.count({ where: { isActive: true } }),
            this.prisma.cotizacion.count({ where: { status: 'ABIERTA' } }),
            this.prisma.pedido.count({ where: { status: 'PENDIENTE' } }),
        ]);

        return {
            users: {
                total: totalUsers,
                active: activeUsers,
            },
            talleres: {
                total: totalTalleres,
            },
            tiendas: {
                total: totalTiendas,
            },
            repuestos: {
                total: totalRepuestos,
            },
            cotizaciones: {
                total: totalCotizaciones,
                open: openCotizaciones,
            },
            ofertas: {
                total: totalOfertas,
            },
            pedidos: {
                total: totalPedidos,
                pending: pendingPedidos,
            },
        };
    }

    async getAllUsers() {
        return this.prisma.user.findMany({
            select: {
                id: true,
                email: true,
                role: true,
                isActive: true,
                createdAt: true,
                taller: {
                    select: {
                        id: true,
                        nombre: true,
                    },
                },
                tienda: {
                    select: {
                        id: true,
                        nombre: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async toggleUserStatus(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        return this.prisma.user.update({
            where: { id: userId },
            data: {
                isActive: !user.isActive,
            },
        });
    }

    async getRecentActivity() {
        const [recentCotizaciones, recentOfertas, recentPedidos] = await Promise.all([
            this.prisma.cotizacion.findMany({
                take: 10,
                orderBy: { createdAt: 'desc' },
                include: {
                    taller: {
                        select: { nombre: true },
                    },
                    _count: {
                        select: { ofertas: true },
                    },
                },
            }),
            this.prisma.oferta.findMany({
                take: 10,
                orderBy: { createdAt: 'desc' },
                include: {
                    tienda: {
                        select: { nombre: true },
                    },
                    cotizacion: {
                        select: { titulo: true },
                    },
                },
            }),
            this.prisma.pedido.findMany({
                take: 10,
                orderBy: { createdAt: 'desc' },
                include: {
                    taller: {
                        select: { nombre: true },
                    },
                    tienda: {
                        select: { nombre: true },
                    },
                },
            }),
        ]);

        return {
            cotizaciones: recentCotizaciones,
            ofertas: recentOfertas,
            pedidos: recentPedidos,
        };
    }

    // ==================== USER METRICS ====================

    async getUserMetrics(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                taller: true,
                tienda: true,
            },
        });

        if (!user) {
            throw new Error('User not found');
        }

        if (user.role === 'TALLER') {
            return this.getTallerMetrics(userId, user);
        } else if (user.role === 'TIENDA') {
            return this.getTiendaMetrics(userId, user);
        }

        return { profile: user, metrics: {} };
    }

    private async getTallerMetrics(userId: string, user: any) {
        const tallerId = user.taller?.id;
        if (!tallerId) return { profile: user, metrics: {} };

        const [
            cotizaciones,
            pedidos,
            pedidosWithDetails,
        ] = await Promise.all([
            this.prisma.cotizacion.findMany({
                where: { tallerId },
                include: {
                    ofertas: true,
                    items: true,
                },
            }),
            this.prisma.pedido.findMany({
                where: { tallerId },
            }),
            this.prisma.pedido.findMany({
                where: { tallerId },
                include: {
                    tienda: { select: { nombre: true } },
                },
                orderBy: { createdAt: 'desc' },
                take: 10,
            }),
        ]);

        const totalCotizaciones = cotizaciones.length;
        const activeCotizaciones = cotizaciones.filter(c => c.status === 'ABIERTA').length;
        const closedCotizaciones = cotizaciones.filter(c => c.status === 'CERRADA').length;
        const totalPedidos = pedidos.length;
        const completedPedidos = pedidos.filter(p => p.status === 'ENTREGADO').length;
        const cancelledPedidos = pedidos.filter(p => p.status === 'CANCELADO').length;

        const totalSpending = pedidos.reduce((sum, p) => sum + (p.total || 0), 0);
        const avgSpending = totalPedidos > 0 ? totalSpending / totalPedidos : 0;

        const conversionRate = totalCotizaciones > 0
            ? (totalPedidos / totalCotizaciones) * 100
            : 0;

        const avgItemsPerQuote = totalCotizaciones > 0
            ? cotizaciones.reduce((sum, c) => sum + c.items.length, 0) / totalCotizaciones
            : 0;

        // Last activity
        const lastCotizacion = cotizaciones.sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )[0];
        const lastPedido = pedidos.sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )[0];

        // Favorite stores
        const storeFrequency = pedidos.reduce((acc, p: any) => {
            const storeName = p.tienda?.nombre || 'Unknown';
            acc[storeName] = (acc[storeName] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const favoriteStores = Object.entries(storeFrequency)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 3)
            .map(([name, count]) => ({ name, count }));

        return {
            profile: user,
            metrics: {
                cotizaciones: {
                    total: totalCotizaciones,
                    active: activeCotizaciones,
                    closed: closedCotizaciones,
                },
                pedidos: {
                    total: totalPedidos,
                    completed: completedPedidos,
                    cancelled: cancelledPedidos,
                },
                spending: {
                    total: totalSpending,
                    average: avgSpending,
                },
                conversion: {
                    rate: Math.round(conversionRate * 10) / 10,
                },
                activity: {
                    lastQuote: lastCotizacion?.createdAt,
                    lastOrder: lastPedido?.createdAt,
                    avgItemsPerQuote: Math.round(avgItemsPerQuote * 10) / 10,
                },
                favorites: {
                    stores: favoriteStores,
                },
            },
            history: pedidosWithDetails.map(p => ({
                id: p.id,
                createdAt: p.createdAt,
                tienda: p.tienda?.nombre,
                total: p.total,
                status: p.status,
            })),
        };
    }

    private async getTiendaMetrics(userId: string, user: any) {
        const tiendaId = user.tienda?.id;
        if (!tiendaId) return { profile: user, metrics: {} };

        const [
            ofertas,
            pedidos,
            pedidosWithDetails,
        ] = await Promise.all([
            this.prisma.oferta.findMany({
                where: { tiendaId },
                include: {
                    items: true,
                    cotizacion: {
                        include: {
                            items: true,
                        },
                    },
                },
            }),
            this.prisma.pedido.findMany({
                where: { tiendaId },
            }),
            this.prisma.pedido.findMany({
                where: { tiendaId },
                include: {
                    taller: { select: { nombre: true } },
                },
                orderBy: { createdAt: 'desc' },
                take: 10,
            }),
        ]);

        const totalOfertas = ofertas.length;
        // Ofertas don't have status in schema - count based on pedidos
        const selectedOfertas = ofertas.filter((o: any) => o.pedido).length;
        const rejectedOfertas = 0; // Cannot determine from current schema

        const totalPedidos = pedidos.length;
        const completedPedidos = pedidos.filter(p => p.status === 'ENTREGADO').length;
        const cancelledPedidos = pedidos.filter(p => p.status === 'CANCELADO').length;

        const totalRevenue = pedidos.reduce((sum, p) => sum + (p.total || 0), 0);
        const avgRevenue = totalPedidos > 0 ? totalRevenue / totalPedidos : 0;

        const winRate = totalOfertas > 0
            ? (selectedOfertas / totalOfertas) * 100
            : 0;

        // Calculate total from oferta items
        const avgOfferValue = totalOfertas > 0
            ? ofertas.reduce((sum: number, o: any) => {
                const itemsTotal = o.items?.reduce((s: number, item: any) => s + (item.precioUnitario * item.cantidad), 0) || 0;
                return sum + itemsTotal;
            }, 0) / totalOfertas
            : 0;

        const avgCoverage = ofertas.length > 0
            ? ofertas.reduce((sum, o) => {
                const totalItems = o.cotizacion?.items.length || 0;
                const coveredItems = o.items.filter(i => i.disponible).length;
                return sum + (totalItems > 0 ? (coveredItems / totalItems) * 100 : 0);
            }, 0) / ofertas.length
            : 0;

        // Last activity
        const lastOferta = ofertas.sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )[0];
        const lastPedido = pedidos.sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )[0];

        // Frequent customers
        const tallerFrequency = pedidosWithDetails.reduce((acc, p) => {
            const tallerName = p.taller?.nombre || 'Unknown';
            acc[tallerName] = (acc[tallerName] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const frequentCustomers = Object.entries(tallerFrequency)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 3)
            .map(([name, count]) => ({ name, count }));

        return {
            profile: user,
            metrics: {
                ofertas: {
                    total: totalOfertas,
                    selected: selectedOfertas,
                    rejected: rejectedOfertas,
                },
                pedidos: {
                    total: totalPedidos,
                    completed: completedPedidos,
                    cancelled: cancelledPedidos,
                },
                revenue: {
                    total: totalRevenue,
                    average: avgRevenue,
                },
                performance: {
                    winRate: Math.round(winRate * 10) / 10,
                    avgOfferValue: Math.round(avgOfferValue),
                    avgCoverage: Math.round(avgCoverage * 10) / 10,
                },
                activity: {
                    lastOffer: lastOferta?.createdAt,
                    lastOrder: lastPedido?.createdAt,
                },
                favorites: {
                    customers: frequentCustomers,
                },
            },
            history: pedidosWithDetails.map(p => ({
                id: p.id,
                createdAt: p.createdAt,
                taller: p.taller?.nombre,
                total: p.total,
                status: p.status,
            })),
        };
    }

    // ==================== PLATFORM ANALYTICS ====================

    async getPlatformAnalytics(startDate?: string, endDate?: string) {
        const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const end = endDate ? new Date(endDate) : new Date();

        const [
            users,
            cotizaciones,
            ofertas,
            pedidos,
            allPedidos,
        ] = await Promise.all([
            this.prisma.user.findMany({
                select: { role: true, isActive: true, createdAt: true },
            }),
            this.prisma.cotizacion.findMany({
                where: {
                    createdAt: { gte: start, lte: end },
                },
                select: { createdAt: true, tallerId: true },
            }),
            this.prisma.oferta.findMany({
                where: {
                    createdAt: { gte: start, lte: end },
                },
                select: { createdAt: true, tiendaId: true },
            }),
            this.prisma.pedido.findMany({
                where: {
                    createdAt: { gte: start, lte: end },
                },
                select: {
                    createdAt: true,
                    total: true,
                    status: true,
                    tallerId: true,
                    tiendaId: true,
                },
            }),
            this.prisma.pedido.findMany({
                select: { total: true, tallerId: true, tiendaId: true },
            }),
        ]);

        // Summary
        const summary = {
            users: {
                total: users.length,
                active: users.filter(u => u.isActive).length,
                byRole: {
                    TALLER: users.filter(u => u.role === 'TALLER').length,
                    TIENDA: users.filter(u => u.role === 'TIENDA').length,
                    ADMIN: users.filter(u => u.role === 'ADMIN').length,
                },
            },
            cotizaciones: {
                total: cotizaciones.length,
            },
            ofertas: {
                total: ofertas.length,
            },
            pedidos: {
                total: pedidos.length,
            },
            revenue: {
                total: pedidos.reduce((sum, p) => sum + (p.total || 0), 0),
            },
        };

        // Trends by day
        const trendsByDay = this.aggregateByDay(cotizaciones, ofertas, pedidos, start, end);

        // Distribution
        const distribution = {
            usersByRole: summary.users.byRole,
            pedidosByStatus: {
                PENDIENTE: pedidos.filter(p => p.status === 'PENDIENTE').length,
                CONFIRMADO: pedidos.filter(p => p.status === 'CONFIRMADO').length,
                ENTREGADO: pedidos.filter(p => p.status === 'ENTREGADO').length,
                CANCELADO: pedidos.filter(p => p.status === 'CANCELADO').length,
            },
        };

        // Top performers
        const tallerSpending = allPedidos.reduce((acc, p) => {
            if (p.tallerId) {
                acc[p.tallerId] = (acc[p.tallerId] || 0) + (p.total || 0);
            }
            return acc;
        }, {} as Record<string, number>);

        const tiendaRevenue = allPedidos.reduce((acc, p) => {
            if (p.tiendaId) {
                acc[p.tiendaId] = (acc[p.tiendaId] || 0) + (p.total || 0);
            }
            return acc;
        }, {} as Record<string, number>);

        const topTalleres = Object.entries(tallerSpending)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5);

        const topTiendas = Object.entries(tiendaRevenue)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5);

        return {
            summary,
            trends: {
                daily: trendsByDay,
            },
            distribution,
            topPerformers: {
                talleres: topTalleres.map(([id, total]) => ({ id, total })),
                tiendas: topTiendas.map(([id, total]) => ({ id, total })),
            },
        };
    }

    private aggregateByDay(cotizaciones: any[], ofertas: any[], pedidos: any[], start: Date, end: Date) {
        const dailyData: Record<string, any> = {};

        // Initialize all days in range
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            const dateKey = d.toISOString().split('T')[0];
            dailyData[dateKey] = {
                date: dateKey,
                cotizaciones: 0,
                ofertas: 0,
                pedidos: 0,
                revenue: 0,
            };
        }

        // Aggregate cotizaciones
        cotizaciones.forEach(c => {
            const dateKey = new Date(c.createdAt).toISOString().split('T')[0];
            if (dailyData[dateKey]) {
                dailyData[dateKey].cotizaciones++;
            }
        });

        // Aggregate ofertas
        ofertas.forEach(o => {
            const dateKey = new Date(o.createdAt).toISOString().split('T')[0];
            if (dailyData[dateKey]) {
                dailyData[dateKey].ofertas++;
            }
        });

        // Aggregate pedidos
        pedidos.forEach(p => {
            const dateKey = new Date(p.createdAt).toISOString().split('T')[0];
            if (dailyData[dateKey]) {
                dailyData[dateKey].pedidos++;
                dailyData[dateKey].revenue += p.total || 0;
            }
        });

        return Object.values(dailyData);
    }

    // ========================================
    // COTIZACIONES MANAGEMENT
    // ========================================

    async getAllCotizaciones(filters?: {
        status?: string;
        startDate?: string;
        endDate?: string;
        tallerId?: string;
        page?: number;
        limit?: number;
    }) {
        const page = filters?.page || 1;
        const limit = filters?.limit || 50;
        const skip = (page - 1) * limit;

        const where: any = {};

        if (filters?.status) {
            where.status = filters.status;
        }

        if (filters?.tallerId) {
            where.tallerId = filters.tallerId;
        }

        if (filters?.startDate || filters?.endDate) {
            where.createdAt = {};
            if (filters.startDate) where.createdAt.gte = new Date(filters.startDate);
            if (filters.endDate) where.createdAt.lte = new Date(filters.endDate);
        }

        const [cotizaciones, total] = await Promise.all([
            this.prisma.cotizacion.findMany({
                where,
                include: {
                    taller: {
                        include: {
                            user: {
                                select: {
                                    email: true,
                                },
                            },
                        },
                    },
                    items: true,
                    ofertas: true,
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.cotizacion.count({ where }),
        ]);

        return {
            data: cotizaciones,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async getCotizacionById(id: string) {
        return this.prisma.cotizacion.findUnique({
            where: { id },
            include: {
                taller: {
                    include: {
                        user: {
                            select: {
                                email: true,
                            },
                        },
                    },
                },
                items: true,
                ofertas: {
                    include: {
                        tienda: {
                            include: {
                                user: {
                                    select: {
                                        email: true,
                                    },
                                },
                            },
                        },
                        items: true,
                    },
                },
            },
        });
    }

    async updateCotizacionStatus(id: string, status: string) {
        return this.prisma.cotizacion.update({
            where: { id },
            data: { status: status as any },
        });
    }

    async deleteCotizacion(id: string) {
        // Delete related items and ofertas first
        await this.prisma.cotizacionItem.deleteMany({
            where: { cotizacionId: id },
        });

        // Delete ofertas (which will cascade delete oferta items)
        await this.prisma.oferta.deleteMany({
            where: { cotizacionId: id },
        });

        return this.prisma.cotizacion.delete({
            where: { id },
        });
    }

    // ========================================
    // OFERTAS MANAGEMENT
    // ========================================

    async getAllOfertas(filters?: {
        status?: string;
        startDate?: string;
        endDate?: string;
        tiendaId?: string;
        cotizacionId?: string;
        page?: number;
        limit?: number;
    }) {
        const page = filters?.page || 1;
        const limit = filters?.limit || 50;
        const skip = (page - 1) * limit;

        const where: any = {};

        if (filters?.status) {
            where.status = filters.status;
        }

        if (filters?.tiendaId) {
            where.tiendaId = filters.tiendaId;
        }

        if (filters?.cotizacionId) {
            where.cotizacionId = filters.cotizacionId;
        }

        if (filters?.startDate || filters?.endDate) {
            where.createdAt = {};
            if (filters.startDate) where.createdAt.gte = new Date(filters.startDate);
            if (filters.endDate) where.createdAt.lte = new Date(filters.endDate);
        }

        const [ofertas, total] = await Promise.all([
            this.prisma.oferta.findMany({
                where,
                include: {
                    tienda: {
                        include: {
                            user: {
                                select: {
                                    email: true,
                                },
                            },
                        },
                    },
                    cotizacion: {
                        include: {
                            taller: {
                                include: {
                                    user: {
                                        select: {
                                            email: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                    items: true,
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.oferta.count({ where }),
        ]);

        return {
            data: ofertas,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async getOfertaById(id: string) {
        return this.prisma.oferta.findUnique({
            where: { id },
            include: {
                tienda: {
                    include: {
                        user: {
                            select: {
                                email: true,
                            },
                        },
                    },
                },
                cotizacion: {
                    include: {
                        taller: {
                            include: {
                                user: {
                                    select: {
                                        email: true,
                                    },
                                },
                            },
                        },
                        items: true,
                    },
                },
                items: true,
            },
        });
    }

    async updateOfertaStatus(id: string, status: string) {
        // Oferta doesn't have status field in schema
        // This method is a placeholder for future implementation
        throw new Error('Oferta status update not supported - no status field in schema');
    }

    async deleteOferta(id: string) {
        // Delete related items first
        await this.prisma.ofertaItem.deleteMany({
            where: { ofertaId: id },
        });

        return this.prisma.oferta.delete({
            where: { id },
        });
    }

    // ========================================
    // PEDIDOS MANAGEMENT
    // ========================================

    async getAllPedidos(filters?: {
        status?: string;
        startDate?: string;
        endDate?: string;
        tallerId?: string;
        tiendaId?: string;
        page?: number;
        limit?: number;
    }) {
        const page = filters?.page || 1;
        const limit = filters?.limit || 50;
        const skip = (page - 1) * limit;

        const where: any = {};

        if (filters?.status) {
            where.status = filters.status;
        }

        if (filters?.tallerId) {
            where.tallerId = filters.tallerId;
        }

        if (filters?.tiendaId) {
            where.tiendaId = filters.tiendaId;
        }

        if (filters?.startDate || filters?.endDate) {
            where.createdAt = {};
            if (filters.startDate) where.createdAt.gte = new Date(filters.startDate);
            if (filters.endDate) where.createdAt.lte = new Date(filters.endDate);
        }

        const [pedidos, total] = await Promise.all([
            this.prisma.pedido.findMany({
                where,
                include: {
                    taller: {
                        include: {
                            user: {
                                select: {
                                    email: true,
                                },
                            },
                        },
                    },
                    tienda: {
                        include: {
                            user: {
                                select: {
                                    email: true,
                                },
                            },
                        },
                    },
                    oferta: {
                        include: {
                            items: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.pedido.count({ where }),
        ]);

        return {
            data: pedidos,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async getPedidoById(id: string) {
        return this.prisma.pedido.findUnique({
            where: { id },
            include: {
                taller: {
                    include: {
                        user: {
                            select: {
                                email: true,
                            },
                        },
                    },
                },
                tienda: {
                    include: {
                        user: {
                            select: {
                                email: true,
                            },
                        },
                    },
                },
                oferta: {
                    include: {
                        items: true,
                        cotizacion: {
                            include: {
                                items: true,
                            },
                        },
                    },
                },
            },
        });
    }

    async updatePedidoStatus(id: string, status: string) {
        return this.prisma.pedido.update({
            where: { id },
            data: { status: status as any },
        });
    }

    async deletePedido(id: string) {
        return this.prisma.pedido.delete({
            where: { id },
        });
    }
}

