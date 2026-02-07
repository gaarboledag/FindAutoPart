'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { cotizacionesAPI } from '@/lib/api'
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
                <h1 className="text-3xl font-bold font-heading text-primary-light">Cotizaciones Disponibles</h1>
                <p className="text-muted-foreground mt-1">
                    {cotizaciones.length} cotización{cotizaciones.length !== 1 ? 'es' : ''} en tu área de cobertura
                </p>
            </div>

            {cotizaciones.length === 0 ? (
                <Card>
                    <CardContent className="py-12">
                        <div className="text-center space-y-4">
                            <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
                            <div>
                                <p className="text-lg font-medium">No hay cotizaciones disponibles</p>
                                <p className="text-sm text-muted-foreground">
                                    No hay solicitudes de talleres en tu área de cobertura en este momento.
                                    Revisa tus áreas de cobertura en la configuración.
                                </p>
                            </div>
                            <Link href="/tienda/configuracion">
                                <Button variant="outline">
                                    Configurar Cobertura
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {cotizaciones.map((cotizacion) => (
                        <Card key={cotizacion.id} className="hover:border-primary/50 transition-colors">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="space-y-1 flex-1">
                                        <CardTitle className="text-xl flex items-center gap-3">
                                            {cotizacion.titulo}
                                            <Badge variant="default" className="gap-1">
                                                ABIERTA
                                            </Badge>
                                            {cotizacion.categoria && (
                                                <Badge variant="outline" className="gap-1">
                                                    {cotizacion.categoria}
                                                </Badge>
                                            )}
                                        </CardTitle>
                                        <p className="text-sm text-muted-foreground">
                                            {cotizacion.marca} {cotizacion.modelo} ({cotizacion.anio})
                                        </p>
                                    </div>
                                    <Link href={`/tienda/cotizaciones/${cotizacion.id}`}>
                                        <Button variant="glow" size="sm" className="gap-2">
                                            <Send className="h-4 w-4" />
                                            Enviar Oferta
                                        </Button>
                                    </Link>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4 md:grid-cols-3 mb-3">
                                    <div>
                                        <p className="text-xs text-muted-foreground mb-1">Taller</p>
                                        <p className="font-medium text-sm">{cotizacion.taller.nombre}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground mb-1">Ubicación</p>
                                        <p className="text-sm">{cotizacion.taller.ciudad}, {cotizacion.taller.region}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground mb-1">Publicado</p>
                                        <p className="text-sm">
                                            {format(new Date(cotizacion.createdAt), "d 'de' MMMM", { locale: es })}
                                        </p>
                                    </div>
                                </div>

                                {/* Items Preview */}
                                <div className="border-t pt-3">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium text-muted-foreground">
                                            <Package className="h-4 w-4 inline mr-1" />
                                            {cotizacion.items?.length || 0} repuesto{(cotizacion.items?.length || 0) !== 1 ? 's' : ''} solicitado{(cotizacion.items?.length || 0) !== 1 ? 's' : ''}
                                        </p>
                                        <Link href={`/tienda/cotizaciones/${cotizacion.id}`}>
                                            <Button variant="ghost" size="sm" className="gap-2">
                                                <Eye className="h-4 w-4" />
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
