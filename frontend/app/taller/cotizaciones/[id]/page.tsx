'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { cotizacionesAPI, ofertasAPI, pedidosAPI } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, FileText, Clock, Package, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

type Oferta = {
    id: string
    diasEntrega: number
    itemsCubiertos: number
    cobertura: number
    tienda: {
        id: string
        nombre: string
        ciudad: string
    }
    items: {
        nombre: string
        precioUnitario: number
        cantidad: number
        disponible: boolean
    }[]
}

// Helper function to calculate total from items
const calculateTotal = (oferta: Oferta): number => {
    return oferta.items
        .filter(item => item.disponible)
        .reduce((sum, item) => sum + (item.precioUnitario * item.cantidad), 0)
}

export default function CotizacionDetailPage() {
    const router = useRouter()
    const params = useParams()
    const id = params.id as string

    const [cotizacion, setCotizacion] = useState<any>(null)
    const [ofertas, setOfertas] = useState<Oferta[]>([])
    const [loading, setLoading] = useState(true)
    const [creatingPedido, setCreatingPedido] = useState(false)

    useEffect(() => {
        if (id) {
            loadData()
        }
    }, [id])

    const loadData = async () => {
        try {
            const [cotizData, ofertasData] = await Promise.all([
                cotizacionesAPI.getOne(id),
                ofertasAPI.getByCotizacion(id)
            ])
            setCotizacion(cotizData)
            setOfertas(ofertasData)
        } catch (error) {
            console.error('Error loading data:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSelectOffer = async (ofertaId: string, tienda: any) => {
        if (!confirm(`¿Confirmar pedido con ${tienda.nombre}?`)) return

        try {
            setCreatingPedido(true)
            await pedidosAPI.create({
                ofertaId: ofertaId,
                direccionEntrega: cotizacion.taller.direccion
            })
            alert('¡Pedido creado exitosamente!')
            router.push('/taller/pedidos')
        } catch (error: any) {
            console.error('Error creating order:', error)
            alert(error.response?.data?.message || 'Error al crear pedido')
        } finally {
            setCreatingPedido(false)
        }
    }

    const getBestOffer = () => {
        if (ofertas.length === 0) return null

        // Sort by: 1) Coverage, 2) Total price (lower), 3) Delivery days (faster)
        return [...ofertas].sort((a, b) => {
            if (b.cobertura !== a.cobertura) return b.cobertura - a.cobertura
            const totalA = calculateTotal(a)
            const totalB = calculateTotal(b)
            if (totalA !== totalB) return totalA - totalB
            return a.diasEntrega - b.diasEntrega
        })[0]
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        )
    }

    if (!cotizacion) {
        return (
            <div className="text-center py-12">
                <p>Cotización no encontrada</p>
                <Link href="/taller/cotizaciones">
                    <Button className="mt-4">Volver a Cotizaciones</Button>
                </Link>
            </div>
        )
    }

    const bestOffer = getBestOffer()

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/taller/cotizaciones">
                    <Button variant="ghost" className="gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Volver
                    </Button>
                </Link>
                <div className="flex-1">
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold font-heading text-primary-light">{cotizacion.titulo}</h1>
                        <Badge variant={cotizacion.status === 'ABIERTA' ? 'default' : 'secondary'}>
                            {cotizacion.status}
                        </Badge>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        {cotizacion.marca} {cotizacion.modelo} ({cotizacion.anio})
                    </p>
                </div>
            </div>

            {/* Vehicle & Items Info */}
            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Información del Vehículo</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Marca:</span>
                            <span className="font-medium">{cotizacion.marca}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Modelo:</span>
                            <span className="font-medium">{cotizacion.modelo}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Año:</span>
                            <span className="font-medium">{cotizacion.anio}</span>
                        </div>
                        {cotizacion.patente && (
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Patente:</span>
                                <span className="font-medium">{cotizacion.patente}</span>
                            </div>
                        )}
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Fecha Creación:</span>
                            <span className="font-medium">
                                {format(new Date(cotizacion.createdAt), "d 'de' MMM, yyyy", { locale: es })}
                            </span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Repuestos Solicitados ({cotizacion.items?.length || 0})</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {cotizacion.items?.map((item: any, index: number) => (
                            <div key={item.id} className="p-3 bg-accent/5 border rounded text-sm">
                                <p className="font-medium">{index + 1}. {item.nombre}</p>
                                {item.marca && <p className="text-xs text-muted-foreground">Marca: {item.marca}</p>}
                                {item.descripcion && <p className="text-xs text-muted-foreground">{item.descripcion}</p>}
                                <p className="text-xs text-muted-foreground">Cantidad: {item.cantidad}</p>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            {/* Ofertas Section */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold font-heading">Ofertas Recibidas</h2>
                    {ofertas.length > 0 && (
                        <Badge variant="info" className="gap-2">
                            <TrendingUp className="h-3 w-3" />
                            {ofertas.length} oferta{ofertas.length !== 1 ? 's' : ''}
                        </Badge>
                    )}
                </div>

                {ofertas.length === 0 ? (
                    <Card>
                        <CardContent className="py-12">
                            <div className="text-center space-y-4">
                                <Clock className="h-12 w-12 mx-auto text-muted-foreground" />
                                <div>
                                    <p className="text-lg font-medium">Esperando Ofertas</p>
                                    <p className="text-sm text-muted-foreground">
                                        Las tiendas están evaluando tu solicitud. Recibirás notificaciones cuando envíen ofertas.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4">
                        {ofertas.map((oferta) => {
                            const isBest = bestOffer && oferta.id === bestOffer.id
                            return (
                                <Card key={oferta.id} className={isBest ? 'border-green-500 border-2' : ''}>
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div className="space-y-1 flex-1">
                                                <div className="flex items-center gap-3">
                                                    <CardTitle className="text-xl">{oferta.tienda.nombre}</CardTitle>
                                                    {isBest && (
                                                        <Badge variant="success" className="gap-1">
                                                            <CheckCircle className="h-3 w-3" />
                                                            Mejor Oferta
                                                        </Badge>
                                                    )}
                                                </div>
                                                <p className="text-sm text-muted-foreground">{oferta.tienda.ciudad}</p>
                                            </div>
                                            {cotizacion.status === 'ABIERTA' && (
                                                <Button
                                                    onClick={() => handleSelectOffer(oferta.id, oferta.tienda)}
                                                    disabled={creatingPedido}
                                                    variant={isBest ? 'glow' : 'default'}
                                                    className="gap-2"
                                                >
                                                    <Package className="h-4 w-4" />
                                                    Seleccionar
                                                </Button>
                                            )}
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid gap-4 md:grid-cols-4 mb-4">
                                            <div>
                                                <p className="text-xs text-muted-foreground">Total</p>
                                                <p className="text-2xl font-bold text-green-600">
                                                    ${calculateTotal(oferta).toLocaleString('es-CO')}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground">Días Entrega</p>
                                                <p className="text-2xl font-bold">{oferta.diasEntrega}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground">Items Cubiertos</p>
                                                <p className="text-2xl font-bold">{oferta.itemsCubiertos}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground">Cobertura</p>
                                                <p className="text-2xl font-bold">{oferta.cobertura}%</p>
                                            </div>
                                        </div>

                                        {/* Items Detail */}
                                        <div className="space-y-2">
                                            <p className="text-sm font-medium">Detalle de Precios:</p>
                                            {oferta.items.map((item: any, idx: number) => (
                                                <div key={idx} className="flex justify-between items-center text-sm p-2 bg-accent/5 rounded">
                                                    <div className="flex items-center gap-2">
                                                        <span>{item.nombre}</span>
                                                        {!item.disponible && (
                                                            <Badge variant="warning" className="text-xs">
                                                                No disponible
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <span className="font-medium">
                                                        ${item.precioUnitario.toLocaleString('es-CO')} x {item.cantidad}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                )}
            </div>

            {/* Info Banner */}
            {cotizacion.status === 'ABIERTA' && ofertas.length > 0 && (
                <Card className="border-blue-500/50 bg-blue-500/5">
                    <CardContent className="py-4">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                            <div className="text-sm">
                                <p className="font-medium">Compara y Selecciona</p>
                                <p className="text-muted-foreground">
                                    La oferta marcada como "Mejor Oferta" tiene la mejor combinación de cobertura, precio y tiempo de entrega.
                                    Al seleccionar una oferta se creará automáticamente un pedido.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
