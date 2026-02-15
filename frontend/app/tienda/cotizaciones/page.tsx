'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { cotizacionesAPI } from '@/lib/api'
import { useSocket } from '@/contexts/SocketContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FileText, Send, Eye, Package } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

type Cotizacion = {
    id: string
    titulo: string
    categoria?: string
    marca: string
    modelo: string
    anio: number
    createdAt: string
    items: any[]
    taller: {
        nombre: string
        ciudad: string
        region: string
    }
    isViewed?: boolean
}

export default function CotizacionesDisponiblesPage() {
    const router = useRouter()
    const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadCotizaciones()
    }, [])

    const loadCotizaciones = async () => {
        try {
            // Get quotations available for this store (filtered by coverage)
            const data = await cotizacionesAPI.getAvailable()
            setCotizaciones(data)
        } catch (error) {
            console.error('Error loading available quotations:', error)
        } finally {
            setLoading(false)
        }
    }

    const { socket } = useSocket()

    useEffect(() => {
        if (!socket) return

        const handleNewCotizacion = (newCotizacion: Cotizacion) => {
            // Optional: Check if it's already in the list to avoid duplicates
            setCotizaciones((prev) => {
                if (prev.find(c => c.id === newCotizacion.id)) return prev
                return [newCotizacion, ...prev]
            })
        }

        socket.on('newCotizacion', handleNewCotizacion)

        return () => {
            socket.off('newCotizacion', handleNewCotizacion)
        }
    }, [socket])

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F97316]"></div>
            </div>
        )
    }

    return (
        <div className="space-y-4 md:space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold font-sans text-[#F8FAFC]">
                    Cotizaciones Disponibles
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                    {cotizaciones.length} cotización{cotizaciones.length !== 1 ? 'es' : ''} en tu área de cobertura
                </p>
            </div>

            {cotizaciones.length === 0 ? (
                <Card>
                    <CardContent className="py-10">
                        <div className="text-center space-y-4">
                            <FileText className="h-10 w-10 mx-auto text-muted-foreground" />
                            <div>
                                <p className="text-base font-medium">No hay cotizaciones disponibles</p>
                                <p className="text-xs sm:text-sm text-muted-foreground">
                                    No hay solicitudes de talleres en tu área de cobertura en este momento.
                                    Revisa tus áreas de cobertura en la configuración.
                                </p>
                            </div>
                            <Link href="/tienda/configuracion">
                                <Button variant="outline" size="sm">
                                    Configurar Cobertura
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-3 md:gap-4">
                    {cotizaciones.map((cotizacion) => (
                        <Card key={cotizacion.id} className={`hover:border-[#F97316]/50 transition-colors ${!cotizacion.isViewed ? 'border-l-4 border-l-blue-500 bg-blue-50/10' : ''}`}>
                            <CardHeader className="p-3 sm:p-4 md:p-5">
                                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                    <div className="space-y-1.5 min-w-0 flex-1">
                                        {/* Title */}
                                        <CardTitle className="text-sm sm:text-base md:text-lg leading-tight truncate">
                                            {cotizacion.titulo}
                                        </CardTitle>

                                        {/* Vehicle info */}
                                        <p className="text-xs sm:text-sm text-muted-foreground">
                                            {cotizacion.marca} {cotizacion.modelo} ({cotizacion.anio})
                                        </p>

                                        {/* Badges row */}
                                        <div className="flex flex-wrap items-center gap-1.5">
                                            {!cotizacion.isViewed && (
                                                <Badge className="bg-blue-500 hover:bg-blue-600 animate-pulse text-[10px] sm:text-xs">
                                                    NUEVO
                                                </Badge>
                                            )}
                                            <Badge variant="default" className="gap-1 text-[10px] sm:text-xs">
                                                ABIERTA
                                            </Badge>
                                            {cotizacion.categoria && (
                                                <Badge variant="outline" className="text-[10px] sm:text-xs">
                                                    {cotizacion.categoria}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action button */}
                                    <Link href={`/tienda/cotizaciones/${cotizacion.id}`} className="shrink-0">
                                        <Button variant="glow" size="sm" className="gap-1.5 text-xs h-8 w-full sm:w-auto">
                                            <Send className="h-3.5 w-3.5" />
                                            Enviar Oferta
                                        </Button>
                                    </Link>
                                </div>
                            </CardHeader>
                            <CardContent className="px-3 sm:px-4 md:px-5 pb-3 sm:pb-4 md:pb-5 pt-0 space-y-3">
                                {/* Info Grid */}
                                <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
                                    <div>
                                        <p className="text-[10px] sm:text-xs text-muted-foreground mb-0.5">Taller</p>
                                        <p className="font-medium text-xs sm:text-sm">{cotizacion.taller.nombre}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] sm:text-xs text-muted-foreground mb-0.5">Ubicación</p>
                                        <p className="text-xs sm:text-sm">{cotizacion.taller.ciudad}, {cotizacion.taller.region}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] sm:text-xs text-muted-foreground mb-0.5">Publicado</p>
                                        <p className="text-xs sm:text-sm">
                                            {format(new Date(cotizacion.createdAt), "d 'de' MMMM", { locale: es })}
                                        </p>
                                    </div>
                                </div>

                                {/* Items Preview */}
                                <div className="border-t pt-3">
                                    <div className="flex items-center justify-between gap-2">
                                        <p className="text-xs sm:text-sm font-medium text-muted-foreground flex items-center gap-1">
                                            <Package className="h-3.5 w-3.5" />
                                            {cotizacion.items?.length || 0} repuesto{(cotizacion.items?.length || 0) !== 1 ? 's' : ''}
                                        </p>
                                        <Link href={`/tienda/cotizaciones/${cotizacion.id}`}>
                                            <Button variant="ghost" size="sm" className="gap-1.5 text-xs h-7 px-2">
                                                <Eye className="h-3.5 w-3.5" />
                                                Ver Detalles
                                            </Button>
                                        </Link>
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
