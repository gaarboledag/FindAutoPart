'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { pedidosAPI } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Package, Clock, CheckCircle, XCircle, Truck, Eye } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

type Pedido = {
    id: string
    status: 'PENDIENTE' | 'CONFIRMADO' | 'ENTREGADO' | 'CANCELADO'
    total: number
    direccionEntrega: string
    fechaEstimada?: string
    createdAt: string
    cotizacion: {
        titulo: string
        marca: string
        modelo: string
    }
    tienda: {
        nombre: string
        telefono: string
    }
}

export default function PedidosPage() {
    const router = useRouter()
    const [pedidos, setPedidos] = useState<Pedido[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadPedidos()
    }, [])

    const loadPedidos = async () => {
        try {
            const data = await pedidosAPI.getAll()
            setPedidos(data)
        } catch (error) {
            console.error('Error loading orders:', error)
        } finally {
            setLoading(false)
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDIENTE': return 'warning'
            case 'CONFIRMADO': return 'info'
            case 'ENTREGADO': return 'success'
            case 'CANCELADO': return 'destructive'
            default: return 'default'
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'PENDIENTE': return <Clock className="h-3 w-3" />
            case 'CONFIRMADO': return <CheckCircle className="h-3 w-3" />
            case 'ENTREGADO': return <Package className="h-3 w-3" />
            case 'CANCELADO': return <XCircle className="h-3 w-3" />
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold font-heading text-primary-light">Mis Pedidos</h1>
                <p className="text-muted-foreground mt-1">
                    {pedidos.length} pedido{pedidos.length !== 1 ? 's' : ''}
                </p>
            </div>

            {pedidos.length === 0 ? (
                <Card>
                    <CardContent className="py-12">
                        <div className="text-center space-y-4">
                            <Package className="h-12 w-12 mx-auto text-muted-foreground" />
                            <div>
                                <p className="text-lg font-medium">No tienes pedidos</p>
                                <p className="text-sm text-muted-foreground">
                                    Crea una cotización y selecciona una oferta para realizar tu primer pedido
                                </p>
                            </div>
                            <Link href="/taller/cotizaciones">
                                <Button className="gap-2">
                                    <Package className="h-4 w-4" />
                                    Ver Cotizaciones
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {pedidos.map((pedido) => (
                        <Card key={pedido.id} className="hover:border-primary/50 transition-colors">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="space-y-1">
                                        <CardTitle className="text-xl flex items-center gap-3">
                                            {pedido.cotizacion.titulo}
                                            <Badge variant={getStatusColor(pedido.status)} className="gap-1">
                                                {getStatusIcon(pedido.status)}
                                                {pedido.status}
                                            </Badge>
                                        </CardTitle>
                                        <p className="text-sm text-muted-foreground">
                                            {pedido.cotizacion.marca} {pedido.cotizacion.modelo}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-green-600">
                                            ${pedido.total.toLocaleString('es-CO')}
                                        </p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4 md:grid-cols-3 mb-4">
                                    <div>
                                        <p className="text-xs text-muted-foreground mb-1">Tienda</p>
                                        <p className="font-medium text-sm">{pedido.tienda.nombre}</p>
                                        <p className="text-xs text-muted-foreground">{pedido.tienda.telefono}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground mb-1">Dirección de Entrega</p>
                                        <p className="text-sm">{pedido.direccionEntrega}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground mb-1">Fecha Pedido</p>
                                        <p className="text-sm">
                                            {format(new Date(pedido.createdAt), "d 'de' MMMM, yyyy", { locale: es })}
                                        </p>
                                        {pedido.fechaEstimada && (
                                            <>
                                                <p className="text-xs text-muted-foreground mt-2 mb-1">Entrega Estimada</p>
                                                <p className="text-sm flex items-center gap-1">
                                                    <Truck className="h-3 w-3" />
                                                    {format(new Date(pedido.fechaEstimada), "d 'de' MMM", { locale: es })}
                                                </p>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Status Progress */}
                                <div className="border-t pt-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <div className="relative">
                                                <div className="absolute inset-0 flex items-center">
                                                    <div className="w-full border-t-2 border-border"></div>
                                                </div>
                                                <div className="relative flex justify-between">
                                                    <div className={`flex flex-col items-center ${['PENDIENTE', 'CONFIRMADO', 'ENTREGADO'].includes(pedido.status)
                                                            ? 'text-primary'
                                                            : 'text-muted-foreground'
                                                        }`}>
                                                        <div className={`rounded-full p-2 ${['PENDIENTE', 'CONFIRMADO', 'ENTREGADO'].includes(pedido.status)
                                                                ? 'bg-primary'
                                                                : 'bg-muted'
                                                            }`}>
                                                            <Clock className="h-3 w-3 text-white" />
                                                        </div>
                                                        <p className="text-xs mt-1">Pendiente</p>
                                                    </div>
                                                    <div className={`flex flex-col items-center ${['CONFIRMADO', 'ENTREGADO'].includes(pedido.status)
                                                            ? 'text-primary'
                                                            : 'text-muted-foreground'
                                                        }`}>
                                                        <div className={`rounded-full p-2 ${['CONFIRMADO', 'ENTREGADO'].includes(pedido.status)
                                                                ? 'bg-primary'
                                                                : 'bg-muted'
                                                            }`}>
                                                            <CheckCircle className="h-3 w-3 text-white" />
                                                        </div>
                                                        <p className="text-xs mt-1">Confirmado</p>
                                                    </div>
                                                    <div className={`flex flex-col items-center ${pedido.status === 'ENTREGADO'
                                                            ? 'text-green-600'
                                                            : 'text-muted-foreground'
                                                        }`}>
                                                        <div className={`rounded-full p-2 ${pedido.status === 'ENTREGADO'
                                                                ? 'bg-green-600'
                                                                : 'bg-muted'
                                                            }`}>
                                                            <Package className="h-3 w-3 text-white" />
                                                        </div>
                                                        <p className="text-xs mt-1">Entregado</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
