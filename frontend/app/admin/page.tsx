'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import ProtectedRoute from '@/components/ProtectedRoute'
import Navbar from '@/components/Navbar'
import { adminAPI, logout } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    Users, Wrench, Store, Package, FileText,
    ShoppingCart, Truck, TrendingUp, Activity, Settings, BarChart3, LogOut
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
            <div className="flex items-center justify-center h-screen bg-[#0B0F19]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <ProtectedRoute allowedRoles={['ADMIN']}>
            <div className="min-h-screen bg-[#0B0F19]">
                <Navbar role="ADMIN" />

                <main className="container mx-auto px-4 py-8">
                    {/* Header with Logout */}
                    <div className="mb-8 flex items-center justify-between animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div>
                            <h1 className="text-4xl font-bold font-heading text-primary-light mb-2">
                                Panel de Administración
                            </h1>
                            <p className="text-muted-foreground text-lg">
                                Gestión y monitoreo de la plataforma FindPart
                            </p>
                        </div>
                        <Button
                            onClick={logout}
                            variant="outline"
                            className="gap-2 border-white/10 hover:bg-destructive hover:text-white"
                        >
                            <LogOut className="h-4 w-4" />
                            Cerrar Sesión
                        </Button>
                    </div>

                    {stats && (
                        <>
                            {/* Platform Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                                {/* Users Card */}
                                <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:border-primary/50 transition-all duration-300 hover:scale-[1.02] animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
                                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                                        <CardTitle className="text-sm font-medium text-muted-foreground">
                                            Usuarios
                                        </CardTitle>
                                        <Users className="h-5 w-5 text-primary" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-bold text-primary-light">{stats.users.total}</div>
                                        <div className="text-xs text-muted-foreground mt-1">
                                            <Badge variant="success" className="text-xs">
                                                {stats.users.active} activos
                                            </Badge>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Talleres Card */}
                                <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:border-secondary/50 transition-all duration-300 hover:scale-[1.02] animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
                                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                                        <CardTitle className="text-sm font-medium text-muted-foreground">
                                            Talleres
                                        </CardTitle>
                                        <Wrench className="h-5 w-5 text-secondary" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-bold text-secondary">{stats.talleres.total}</div>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Mecánicos registrados
                                        </p>
                                    </CardContent>
                                </Card>

                                {/* Tiendas Card */}
                                <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:border-accent/50 transition-all duration-300 hover:scale-[1.02] animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
                                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                                        <CardTitle className="text-sm font-medium text-muted-foreground">
                                            Tiendas
                                        </CardTitle>
                                        <Store className="h-5 w-5 text-accent" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-bold text-accent">{stats.tiendas.total}</div>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Proveedores activos
                                        </p>
                                    </CardContent>
                                </Card>

                                {/* Repuestos Card */}
                                <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:border-primary-light/50 transition-all duration-300 hover:scale-[1.02] animate-in fade-in slide-in-from-bottom-4 duration-500 delay-250">
                                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                                        <CardTitle className="text-sm font-medium text-muted-foreground">
                                            Repuestos
                                        </CardTitle>
                                        <Package className="h-5 w-5 text-primary-light" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-bold text-primary-light">{stats.repuestos.total}</div>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            En catálogo
                                        </p>
                                    </CardContent>
                                </Card>

                                {/* Cotizaciones Card */}
                                <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:border-blue-500/50 transition-all duration-300 hover:scale-[1.02] animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
                                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                                        <CardTitle className="text-sm font-medium text-muted-foreground">
                                            Cotizaciones
                                        </CardTitle>
                                        <FileText className="h-5 w-5 text-blue-400" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-bold text-blue-400">{stats.cotizaciones.total}</div>
                                        <div className="text-xs text-muted-foreground mt-1">
                                            <Badge variant="warning" className="text-xs">
                                                {stats.cotizaciones.open} abiertas
                                            </Badge>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Ofertas Card */}
                                <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:border-green-500/50 transition-all duration-300 hover:scale-[1.02] animate-in fade-in slide-in-from-bottom-4 duration-500 delay-350">
                                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                                        <CardTitle className="text-sm font-medium text-muted-foreground">
                                            Ofertas
                                        </CardTitle>
                                        <ShoppingCart className="h-5 w-5 text-green-400" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-bold text-green-400">{stats.ofertas.total}</div>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Propuestas enviadas
                                        </p>
                                    </CardContent>
                                </Card>

                                {/* Pedidos Card */}
                                <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:scale-[1.02] animate-in fade-in slide-in-from-bottom-4 duration-500 delay-400">
                                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                                        <CardTitle className="text-sm font-medium text-muted-foreground">
                                            Pedidos
                                        </CardTitle>
                                        <Truck className="h-5 w-5 text-purple-400" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-bold text-purple-400">{stats.pedidos.total}</div>
                                        <div className="text-xs text-muted-foreground mt-1">
                                            <Badge variant="info" className="text-xs">
                                                {stats.pedidos.pending} pendientes
                                            </Badge>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Active Status (Overall Health) */}
                                <Card className="bg-gradient-to-br from-primary/20 to-secondary/20 backdrop-blur-sm border-primary/30 transition-all duration-300 hover:scale-[1.02] animate-in fade-in slide-in-from-bottom-4 duration-500 delay-450">
                                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                                        <CardTitle className="text-sm font-medium text-foreground">
                                            Estado del Sistema
                                        </CardTitle>
                                        <Activity className="h-5 w-5 text-green-400" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-bold text-green-400">Operativo</div>
                                        <p className="text-xs text-foreground/70 mt-1">
                                            Todos los servicios activos
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Quick Actions */}
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-500">
                                <h2 className="text-2xl font-bold font-heading mb-4 text-foreground">
                                    Gestión Rápida
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {/* Users Management */}
                                    <Link href="/admin/users">
                                        <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:border-primary/50 transition-all duration-300 hover:scale-[1.02] cursor-pointer group">
                                            <CardHeader>
                                                <div className="flex items-center gap-3">
                                                    <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                                        <Users className="h-6 w-6 text-primary" />
                                                    </div>
                                                    <div>
                                                        <CardTitle className="text-lg">Usuarios</CardTitle>
                                                        <p className="text-sm text-muted-foreground">
                                                            Gestiona usuarios de la plataforma
                                                        </p>
                                                    </div>
                                                </div>
                                            </CardHeader>
                                        </Card>
                                    </Link>

                                    {/* Activity Monitor */}
                                    <Link href="/admin/activity">
                                        <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:border-secondary/50 transition-all duration-300 hover:scale-[1.02] cursor-pointer group">
                                            <CardHeader>
                                                <div className="flex items-center gap-3">
                                                    <div className="p-3 rounded-lg bg-secondary/10 group-hover:bg-secondary/20 transition-colors">
                                                        <TrendingUp className="h-6 w-6 text-secondary" />
                                                    </div>
                                                    <div>
                                                        <CardTitle className="text-lg">Actividad</CardTitle>
                                                        <p className="text-sm text-muted-foreground">
                                                            Monitorea actividad reciente
                                                        </p>
                                                    </div>
                                                </div>
                                            </CardHeader>
                                        </Card>
                                    </Link>

                                    {/* Analytics Dashboard */}
                                    <Link href="/admin/analytics">
                                        <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:border-accent/50 transition-all duration-300 hover:scale-[1.02] cursor-pointer group">
                                            <CardHeader>
                                                <div className="flex items-center gap-3">
                                                    <div className="p-3 rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors">
                                                        <BarChart3 className="h-6 w-6 text-accent" />
                                                    </div>
                                                    <div>
                                                        <CardTitle className="text-lg">Analytics</CardTitle>
                                                        <p className="text-sm text-muted-foreground">
                                                            Métricas y estadísticas
                                                        </p>
                                                    </div>
                                                </div>
                                            </CardHeader>
                                        </Card>
                                    </Link>

                                    {/* Configuration */}
                                    <Link href="/admin/config">
                                        <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:border-green-500/50 transition-all duration-300 hover:scale-[1.02] cursor-pointer group">
                                            <CardHeader>
                                                <div className="flex items-center gap-3">
                                                    <div className="p-3 rounded-lg bg-green-500/10 group-hover:bg-green-500/20 transition-colors">
                                                        <Settings className="h-6 w-6 text-green-400" />
                                                    </div>
                                                    <div>
                                                        <CardTitle className="text-lg">Configuración</CardTitle>
                                                        <p className="text-sm text-muted-foreground">
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
                </main>
            </div>
        </ProtectedRoute>
    )
}
