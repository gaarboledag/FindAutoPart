'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { adminAPI } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    ArrowLeft, FileText, ShoppingCart, Truck,
    Activity, Package
} from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export default function AdminActivityPage() {
    const [activityData, setActivityData] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadActivity()
    }, [])

    const loadActivity = async () => {
        try {
            const data = await adminAPI.getActivity()
            setActivityData(data)
        } catch (error) {
            console.error('Error loading activity:', error)
        } finally {
            setLoading(false)
        }
    }

    const getStatusBadge = (status: string) => {
        const statusConfig: Record<string, { variant: any; label: string }> = {
            PENDIENTE: { variant: 'warning', label: 'Pendiente' },
            CONFIRMADO: { variant: 'info', label: 'Confirmado' },
            ENTREGADO: { variant: 'success', label: 'Entregado' },
            CANCELADO: { variant: 'destructive', label: 'Cancelado' },
            ABIERTA: { variant: 'success', label: 'Abierta' },
            CERRADA: { variant: 'default', label: 'Cerrada' },
        }
        return statusConfig[status] || { variant: 'default', label: status }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <Link href="/admin" className="w-fit">
                    <Button variant="ghost" className="gap-2 -ml-2 text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="h-4 w-4" />
                        Volver al Panel
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold font-heading text-primary-light">
                        Actividad de la Plataforma
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Monitorea las acciones recientes de los usuarios
                    </p>
                </div>
            </div>

            {!activityData ? (
                <Card>
                    <CardContent className="py-16">
                        <div className="text-center space-y-4">
                            <Activity className="h-16 w-16 mx-auto text-muted-foreground" />
                            <div>
                                <h3 className="text-xl font-semibold text-foreground">Sin actividad reciente</h3>
                                <p className="text-muted-foreground mt-2">
                                    No hay actividad registrada en este momento
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-6">
                    {/* Recent Cotizaciones */}
                    <Card className="border-blue-500/20 bg-blue-500/5">
                        <CardHeader className="border-b border-blue-500/10">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-blue-500/20">
                                    <FileText className="h-5 w-5 text-blue-500" />
                                </div>
                                <CardTitle className="text-xl text-blue-500">Cotizaciones Recientes</CardTitle>
                                <Badge variant="info" className="ml-auto">
                                    {activityData.cotizaciones?.length || 0}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-blue-500/10 bg-blue-500/5">
                                            <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Título</th>
                                            <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Taller</th>
                                            <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Ofertas</th>
                                            <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Fecha</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {activityData.cotizaciones?.length > 0 ? (
                                            activityData.cotizaciones.map((cot: any) => (
                                                <tr key={cot.id} className="border-b border-blue-500/10 last:border-0 hover:bg-blue-500/5 transition-colors">
                                                    <td className="p-4">
                                                        <span className="font-medium text-foreground">{cot.titulo}</span>
                                                    </td>
                                                    <td className="p-4 text-sm text-muted-foreground">
                                                        {cot.taller?.nombre || '-'}
                                                    </td>
                                                    <td className="p-4">
                                                        <Badge variant="info" className="gap-1">
                                                            <Package className="h-3 w-3" />
                                                            {cot._count?.ofertas || 0}
                                                        </Badge>
                                                    </td>
                                                    <td className="p-4 text-sm text-muted-foreground">
                                                        {format(new Date(cot.createdAt), 'dd/MM/yyyy HH:mm', { locale: es })}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={4} className="p-8 text-center text-muted-foreground">
                                                    Sin cotizaciones recientes
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Ofertas */}
                    <Card className="border-green-500/20 bg-green-500/5">
                        <CardHeader className="border-b border-green-500/10">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-green-500/20">
                                    <ShoppingCart className="h-5 w-5 text-green-500" />
                                </div>
                                <CardTitle className="text-xl text-green-500">Ofertas Recientes</CardTitle>
                                <Badge variant="success" className="ml-auto">
                                    {activityData.ofertas?.length || 0}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-green-500/10 bg-green-500/5">
                                            <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Cotización</th>
                                            <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Tienda</th>
                                            <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Fecha</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {activityData.ofertas?.length > 0 ? (
                                            activityData.ofertas.map((oferta: any) => (
                                                <tr key={oferta.id} className="border-b border-green-500/10 last:border-0 hover:bg-green-500/5 transition-colors">
                                                    <td className="p-4 text-sm text-muted-foreground">
                                                        {oferta.cotizacion?.titulo || '-'}
                                                    </td>
                                                    <td className="p-4">
                                                        <span className="font-medium text-foreground">{oferta.tienda?.nombre || '-'}</span>
                                                    </td>
                                                    <td className="p-4 text-sm text-muted-foreground">
                                                        {format(new Date(oferta.createdAt), 'dd/MM/yyyy HH:mm', { locale: es })}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={3} className="p-8 text-center text-muted-foreground">
                                                    Sin ofertas recientes
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Pedidos */}
                    <Card className="border-purple-500/20 bg-purple-500/5">
                        <CardHeader className="border-b border-purple-500/10">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-purple-500/20">
                                    <Truck className="h-5 w-5 text-purple-500" />
                                </div>
                                <CardTitle className="text-xl text-purple-500">Pedidos Recientes</CardTitle>
                                <Badge className="ml-auto bg-purple-500/20 text-purple-600 hover:bg-purple-500/30">
                                    {activityData.pedidos?.length || 0}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-purple-500/10 bg-purple-500/5">
                                            <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Taller</th>
                                            <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Tienda</th>
                                            <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Estado</th>
                                            <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Fecha</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {activityData.pedidos?.length > 0 ? (
                                            activityData.pedidos.map((pedido: any) => {
                                                const statusConfig = getStatusBadge(pedido.status)
                                                return (
                                                    <tr key={pedido.id} className="border-b border-purple-500/10 last:border-0 hover:bg-purple-500/5 transition-colors">
                                                        <td className="p-4 text-sm text-muted-foreground">
                                                            {pedido.taller?.nombre || '-'}
                                                        </td>
                                                        <td className="p-4">
                                                            <span className="font-medium text-foreground">{pedido.tienda?.nombre || '-'}</span>
                                                        </td>
                                                        <td className="p-4">
                                                            <Badge variant={statusConfig.variant}>
                                                                {statusConfig.label}
                                                            </Badge>
                                                        </td>
                                                        <td className="p-4 text-sm text-muted-foreground">
                                                            {format(new Date(pedido.createdAt), 'dd/MM/yyyy HH:mm', { locale: es })}
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        ) : (
                                            <tr>
                                                <td colSpan={4} className="p-8 text-center text-muted-foreground">
                                                    Sin pedidos recientes
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    )
}
