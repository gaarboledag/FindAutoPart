'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { adminAPI } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Navbar from '@/components/Navbar'
import ProtectedRoute from '@/components/ProtectedRoute'
import {
    ArrowLeft, FileText, ShoppingCart, DollarSign, TrendingUp,
    Calendar, Store, Users, Package, Percent
} from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface UserMetrics {
    profile: any
    metrics: any
    history: any[]
}

export default function UserDetailPage() {
    const params = useParams()
    const router = useRouter()
    const userId = params.id as string

    const [data, setData] = useState<UserMetrics | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchUserMetrics()
    }, [userId])

    const fetchUserMetrics = async () => {
        try {
            const response = await adminAPI.getUserMetrics(userId)
            setData(response)
        } catch (error) {
            console.error('Error fetching user metrics:', error)
        } finally {
            setLoading(false)
        }
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
        }).format(amount)
    }

    const formatDate = (date: string) => {
        return format(new Date(date), "dd/MM/yyyy HH:mm", { locale: es })
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-[#0B0F19]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        )
    }

    if (!data) {
        return (
            <ProtectedRoute allowedRoles={['ADMIN']}>
                <div className="min-h-screen bg-[#0B0F19]">
                    <Navbar role="ADMIN" />
                    <div className="container mx-auto px-4 py-8">
                        <p className="text-white">Usuario no encontrado</p>
                    </div>
                </div>
            </ProtectedRoute>
        )
    }

    const { profile, metrics } = data
    const isTaller = profile.role === 'TALLER'

    return (
        <ProtectedRoute allowedRoles={['ADMIN']}>
            <div className="min-h-screen bg-[#0B0F19]">
                <Navbar role="ADMIN" />

                <main className="container mx-auto px-4 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <Button
                            variant="ghost"
                            onClick={() => router.push('/admin/users')}
                            className="mb-4 text-muted-foreground hover:text-foreground"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Volver a Usuarios
                        </Button>

                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-heading font-bold bg-gradient-to-r from-primary-light via-secondary to-accent bg-clip-text text-transparent">
                                    {isTaller ? profile.taller?.nombre : profile.tienda?.nombre}
                                </h1>
                                <p className="text-muted-foreground mt-1">{profile.email}</p>
                            </div>
                            <Badge variant={profile.isActive ? 'default' : 'destructive'}>
                                {profile.isActive ? 'Activo' : 'Inactivo'}
                            </Badge>
                        </div>
                    </div>

                    {/* Profile Info Card */}
                    <Card className="mb-8 bg-white/5 backdrop-blur-sm border-white/10">
                        <CardHeader>
                            <CardTitle className="text-primary-light">Datos del Perfil</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                            <div>
                                <p className="text-muted-foreground">Rol</p>
                                <p className="text-foreground font-medium">
                                    {isTaller ? 'Taller Mecánico' : 'Tienda de Repuestos'}
                                </p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">RUT</p>
                                <p className="text-foreground font-medium">
                                    {isTaller ? profile.taller?.rut : profile.tienda?.rut}
                                </p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Teléfono</p>
                                <p className="text-foreground font-medium">
                                    {isTaller ? profile.taller?.telefono : profile.tienda?.telefono}
                                </p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Ciudad</p>
                                <p className="text-foreground font-medium">
                                    {isTaller ? profile.taller?.ciudad : profile.tienda?.ciudad}
                                </p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Departamento</p>
                                <p className="text-foreground font-medium">
                                    {isTaller ? profile.taller?.departamento : profile.tienda?.departamento}
                                </p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Miembro desde</p>
                                <p className="text-foreground font-medium">
                                    {format(new Date(profile.createdAt), "dd/MM/yyyy", { locale: es })}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Metrics Grid - Taller */}
                    {isTaller && metrics.cotizaciones && (
                        <>
                            <h2 className="text-2xl font-heading font-bold text-white mb-4">
                                Métricas de Uso
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                                <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:border-primary/50 transition-all">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <FileText className="h-10 w-10 text-blue-400" />
                                        </div>
                                        <h3 className="text-3xl font-bold text-white mb-1">
                                            {metrics.cotizaciones.total}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            Cotizaciones Creadas
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:border-green-500/50 transition-all">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <Package className="h-10 w-10 text-green-400" />
                                        </div>
                                        <h3 className="text-3xl font-bold text-white mb-1">
                                            {metrics.pedidos.total}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            Pedidos Realizados
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:border-purple-500/50 transition-all">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <DollarSign className="h-10 w-10 text-purple-400" />
                                        </div>
                                        <h3 className="text-3xl font-bold text-white mb-1">
                                            {formatCurrency(metrics.spending.total)}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            Gasto Total
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:border-secondary/50 transition-all">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <Percent className="h-10 w-10 text-secondary" />
                                        </div>
                                        <h3 className="text-3xl font-bold text-white mb-1">
                                            {metrics.conversion.rate}%
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            Tasa de Conversión
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                                    <CardContent className="p-6">
                                        <p className="text-sm text-muted-foreground mb-2">Cotizaciones Activas</p>
                                        <p className="text-2xl font-bold text-green-400">
                                            {metrics.cotizaciones.active}
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                                    <CardContent className="p-6">
                                        <p className="text-sm text-muted-foreground mb-2">Pedidos Completados</p>
                                        <p className="text-2xl font-bold text-green-400">
                                            {metrics.pedidos.completed}
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                                    <CardContent className="p-6">
                                        <p className="text-sm text-muted-foreground mb-2">Gasto Promedio</p>
                                        <p className="text-2xl font-bold text-white">
                                            {formatCurrency(metrics.spending.average)}
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                                    <CardContent className="p-6">
                                        <p className="text-sm text-muted-foreground mb-2">Items por Cotización</p>
                                        <p className="text-2xl font-bold text-white">
                                            {metrics.activity.avgItemsPerQuote}
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Activity & Favorites */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                                <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                                    <CardHeader>
                                        <CardTitle className="text-primary-light flex items-center gap-2">
                                            <Calendar className="h-5 w-5" />
                                            Actividad Reciente
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        {metrics.activity.lastQuote && (
                                            <div>
                                                <p className="text-sm text-muted-foreground">Última Cotización</p>
                                                <p className="text-foreground font-medium">
                                                    {formatDate(metrics.activity.lastQuote)}
                                                </p>
                                            </div>
                                        )}
                                        {metrics.activity.lastOrder && (
                                            <div>
                                                <p className="text-sm text-muted-foreground">Último Pedido</p>
                                                <p className="text-foreground font-medium">
                                                    {formatDate(metrics.activity.lastOrder)}
                                                </p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                                    <CardHeader>
                                        <CardTitle className="text-primary-light flex items-center gap-2">
                                            <Store className="h-5 w-5" />
                                            Tiendas Favoritas
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {metrics.favorites.stores.length > 0 ? (
                                            <ul className="space-y-2">
                                                {metrics.favorites.stores.map((store: any, idx: number) => (
                                                    <li key={idx} className="flex justify-between items-center">
                                                        <span className="text-foreground">{idx + 1}. {store.name}</span>
                                                        <Badge variant="secondary">{store.count} pedidos</Badge>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-muted-foreground text-sm">No hay tiendas favoritas aún</p>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        </>
                    )}

                    {/* Metrics Grid - Tienda */}
                    {!isTaller && metrics.ofertas && (
                        <>
                            <h2 className="text-2xl font-heading font-bold text-white mb-4">
                                Métricas de Rendimiento
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                                <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:border-blue-500/50 transition-all">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <ShoppingCart className="h-10 w-10 text-blue-400" />
                                        </div>
                                        <h3 className="text-3xl font-bold text-white mb-1">
                                            {metrics.ofertas.total}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            Ofertas Enviadas
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:border-green-500/50 transition-all">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <Package className="h-10 w-10 text-green-400" />
                                        </div>
                                        <h3 className="text-3xl font-bold text-white mb-1">
                                            {metrics.pedidos.total}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            Pedidos Recibidos
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:border-purple-500/50 transition-all">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <DollarSign className="h-10 w-10 text-purple-400" />
                                        </div>
                                        <h3 className="text-3xl font-bold text-white mb-1">
                                            {formatCurrency(metrics.revenue.total)}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            Ingresos Totales
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:border-secondary/50 transition-all">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <TrendingUp className="h-10 w-10 text-secondary" />
                                        </div>
                                        <h3 className="text-3xl font-bold text-white mb-1">
                                            {metrics.performance.winRate}%
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            Win Rate
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                                    <CardContent className="p-6">
                                        <p className="text-sm text-muted-foreground mb-2">Ofertas Seleccionadas</p>
                                        <p className="text-2xl font-bold text-green-400">
                                            {metrics.ofertas.selected}
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                                    <CardContent className="p-6">
                                        <p className="text-sm text-muted-foreground mb-2">Pedidos Entregados</p>
                                        <p className="text-2xl font-bold text-green-400">
                                            {metrics.pedidos.completed}
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                                    <CardContent className="p-6">
                                        <p className="text-sm text-muted-foreground mb-2">Cobertura Promedio</p>
                                        <p className="text-2xl font-bold text-white">
                                            {metrics.performance.avgCoverage}%
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                                    <CardContent className="p-6">
                                        <p className="text-sm text-muted-foreground mb-2">Valor Promedio Oferta</p>
                                        <p className="text-2xl font-bold text-white">
                                            {formatCurrency(metrics.performance.avgOfferValue)}
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Activity & Customers */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                                <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                                    <CardHeader>
                                        <CardTitle className="text-primary-light flex items-center gap-2">
                                            <Calendar className="h-5 w-5" />
                                            Actividad Reciente
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        {metrics.activity.lastOffer && (
                                            <div>
                                                <p className="text-sm text-muted-foreground">Última Oferta</p>
                                                <p className="text-foreground font-medium">
                                                    {formatDate(metrics.activity.lastOffer)}
                                                </p>
                                            </div>
                                        )}
                                        {metrics.activity.lastOrder && (
                                            <div>
                                                <p className="text-sm text-muted-foreground">Último Pedido</p>
                                                <p className="text-foreground font-medium">
                                                    {formatDate(metrics.activity.lastOrder)}
                                                </p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                                    <CardHeader>
                                        <CardTitle className="text-primary-light flex items-center gap-2">
                                            <Users className="h-5 w-5" />
                                            Clientes Frecuentes
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {metrics.favorites.customers.length > 0 ? (
                                            <ul className="space-y-2">
                                                {metrics.favorites.customers.map((customer: any, idx: number) => (
                                                    <li key={idx} className="flex justify-between items-center">
                                                        <span className="text-foreground">{idx + 1}. {customer.name}</span>
                                                        <Badge variant="secondary">{customer.count} pedidos</Badge>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-muted-foreground text-sm">No hay clientes frecuentes aún</p>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        </>
                    )}

                    {/* Order History */}
                    {data.history && data.history.length > 0 && (
                        <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                            <CardHeader>
                                <CardTitle className="text-primary-light">
                                    Historial de Pedidos (Últimos 10)
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-white/10">
                                                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                                                    Fecha
                                                </th>
                                                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                                                    {isTaller ? 'Tienda' : 'Taller'}
                                                </th>
                                                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                                                    Total
                                                </th>
                                                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                                                    Estado
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.history.map((order) => (
                                                <tr
                                                    key={order.id}
                                                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                                                >
                                                    <td className="py-3 px-4 text-sm text-foreground">
                                                        {format(new Date(order.createdAt), "dd/MM/yyyy", { locale: es })}
                                                    </td>
                                                    <td className="py-3 px-4 text-sm text-foreground">
                                                        {isTaller ? order.tienda : order.taller}
                                                    </td>
                                                    <td className="py-3 px-4 text-sm text-foreground font-medium">
                                                        {formatCurrency(order.total)}
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <Badge
                                                            variant={
                                                                order.status === 'ENTREGADO' ? 'success' :
                                                                    order.status === 'CONFIRMADO' ? 'default' :
                                                                        order.status === 'CANCELADO' ? 'destructive' :
                                                                            'default'
                                                            }
                                                        >
                                                            {order.status}
                                                        </Badge>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </main>
            </div>
        </ProtectedRoute>
    )
}
