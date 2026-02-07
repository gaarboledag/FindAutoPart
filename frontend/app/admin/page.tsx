'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { adminAPI } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
    Users, Wrench, Store, Package, FileText,
    ShoppingCart, Truck, TrendingUp, Activity, Settings, BarChart3
} from 'lucide-react'

export default function AdminDashboard() {
    const [stats, setStats] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadStats()
    }, [])

    const loadStats = async () => {
        try {
            const data = await adminAPI.getStats()
            setStats(data)
        } catch (error) {
            console.error('Error loading stats:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold font-heading text-primary-light">
                    Panel de Administración
                </h1>
                <p className="text-muted-foreground mt-1">
                    Gestión y monitoreo de la plataforma FindPart
                </p>
            </div>

            {stats && (
                <>
                    {/* Platform Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Users Card */}
                        <Card className="hover:border-primary/50 transition-all duration-300">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Usuarios
                                </CardTitle>
                                <Users className="h-4 w-4 text-primary" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-primary-light">{stats.users.total}</div>
                                <div className="text-xs text-muted-foreground mt-1">
                                    <Badge variant="success" className="text-[10px] px-1 py-0 h-4">
                                        {stats.users.active} activos
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Talleres Card */}
                        <Card className="hover:border-secondary/50 transition-all duration-300">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Talleres
                                </CardTitle>
                                <Wrench className="h-4 w-4 text-secondary" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-secondary">{stats.talleres.total}</div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Mecánicos registrados
                                </p>
                            </CardContent>
                        </Card>

                        {/* Tiendas Card */}
                        <Card className="hover:border-accent/50 transition-all duration-300">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Tiendas
                                </CardTitle>
                                <Store className="h-4 w-4 text-accent" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-accent">{stats.tiendas.total}</div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Proveedores activos
                                </p>
                            </CardContent>
                        </Card>

                        {/* Repuestos Card */}
                        <Card className="hover:border-primary-light/50 transition-all duration-300">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Repuestos
                                </CardTitle>
                                <Package className="h-4 w-4 text-primary-light" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-primary-light">{stats.repuestos.total}</div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    En catálogo
                                </p>
                            </CardContent>
                        </Card>

                        {/* Cotizaciones Card */}
                        <Card className="hover:border-blue-500/50 transition-all duration-300">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Cotizaciones
                                </CardTitle>
                                <FileText className="h-4 w-4 text-blue-400" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-blue-400">{stats.cotizaciones.total}</div>
                                <div className="text-xs text-muted-foreground mt-1">
                                    <Badge variant="warning" className="text-[10px] px-1 py-0 h-4">
                                        {stats.cotizaciones.open} abiertas
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Ofertas Card */}
                        <Card className="hover:border-green-500/50 transition-all duration-300">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Ofertas
                                </CardTitle>
                                <ShoppingCart className="h-4 w-4 text-green-400" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-green-400">{stats.ofertas.total}</div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Propuestas enviadas
                                </p>
                            </CardContent>
                        </Card>

                        {/* Pedidos Card */}
                        <Card className="hover:border-purple-500/50 transition-all duration-300">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Pedidos
                                </CardTitle>
                                <Truck className="h-4 w-4 text-purple-400" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-purple-400">{stats.pedidos.total}</div>
                                <div className="text-xs text-muted-foreground mt-1">
                                    <Badge variant="info" className="text-[10px] px-1 py-0 h-4">
                                        {stats.pedidos.pending} pendientes
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Active Status (Overall Health) */}
                        <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20 transition-all duration-300">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-foreground">
                                    Estado del Sistema
                                </CardTitle>
                                <Activity className="h-4 w-4 text-green-400" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-green-400">Operativo</div>
                                <p className="text-xs text-foreground/70 mt-1">
                                    Todos los servicios activos
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Quick Actions */}
                    <div>
                        <h2 className="text-xl font-semibold font-heading tracking-tight mb-4">
                            Gestión Rápida
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Users Management */}
                            <Link href="/admin/users">
                                <Card className="hover:border-primary/50 cursor-pointer h-full group transition-all duration-300">
                                    <CardHeader>
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-md bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                                <Users className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-base">Usuarios</CardTitle>
                                                <p className="text-xs text-muted-foreground">
                                                    Gestiona usuarios de la plataforma
                                                </p>
                                            </div>
                                        </div>
                                    </CardHeader>
                                </Card>
                            </Link>

                            {/* Activity Monitor */}
                            <Link href="/admin/activity">
                                <Card className="hover:border-secondary/50 cursor-pointer h-full group transition-all duration-300">
                                    <CardHeader>
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-md bg-secondary/10 group-hover:bg-secondary/20 transition-colors">
                                                <TrendingUp className="h-5 w-5 text-secondary" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-base">Actividad</CardTitle>
                                                <p className="text-xs text-muted-foreground">
                                                    Monitorea actividad reciente
                                                </p>
                                            </div>
                                        </div>
                                    </CardHeader>
                                </Card>
                            </Link>

                            {/* Analytics Dashboard */}
                            <Link href="/admin/analytics">
                                <Card className="hover:border-accent/50 cursor-pointer h-full group transition-all duration-300">
                                    <CardHeader>
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-md bg-accent/10 group-hover:bg-accent/20 transition-colors">
                                                <BarChart3 className="h-5 w-5 text-accent" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-base">Analytics</CardTitle>
                                                <p className="text-xs text-muted-foreground">
                                                    Métricas y estadísticas
                                                </p>
                                            </div>
                                        </div>
                                    </CardHeader>
                                </Card>
                            </Link>

                            {/* Configuration */}
                            <Link href="/admin/config">
                                <Card className="hover:border-green-500/50 cursor-pointer h-full group transition-all duration-300">
                                    <CardHeader>
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-md bg-green-500/10 group-hover:bg-green-500/20 transition-colors">
                                                <Settings className="h-5 w-5 text-green-400" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-base">Configuración</CardTitle>
                                                <p className="text-xs text-muted-foreground">
                                                    Gestión completa
                                                </p>
                                            </div>
                                        </div>
                                    </CardHeader>
                                </Card>
                            </Link>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
