'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { cotizacionesAPI } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, FileText, Clock, CheckCircle2, XCircle, Eye } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

type Cotizacion = {
    id: string
    titulo: string
    categoria?: string
    marca: string
    modelo: string
    anio: number
    status: 'ABIERTA' | 'CERRADA' | 'CANCELADA'
    createdAt: string
    items: any[]
    ofertas?: any[]
}

export default function CotizacionesPage() {
    const router = useRouter()
    const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<'ALL' | 'ABIERTA' | 'CERRADA' | 'CANCELADA'>('ALL')

    useEffect(() => {
        loadCotizaciones()
    }, [])

    const loadCotizaciones = async () => {
        try {
            const data = await cotizacionesAPI.getAll()
            setCotizaciones(data)
        } catch (error) {
            console.error('Error loading quotations:', error)
        } finally {
            setLoading(false)
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ABIERTA': return 'default'
            case 'CERRADA': return 'success'
            case 'CANCELADA': return 'destructive'
            default: return 'default'
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'ABIERTA': return <Clock className="h-3 w-3" />
            case 'CERRADA': return <CheckCircle2 className="h-3 w-3" />
            case 'CANCELADA': return <XCircle className="h-3 w-3" />
        }
    }

    const filteredCotizaciones = filter === 'ALL'
        ? cotizaciones
        : cotizaciones.filter(c => c.status === filter)

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F97316]"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-sans text-[#F8FAFC]">Mis Cotizaciones</h1>
                    <p className="text-muted-foreground mt-1">
                        {filteredCotizaciones.length} cotización{filteredCotizaciones.length !== 1 ? 'es' : ''}
                    </p>
                </div>
                <Link href="/taller/cotizaciones/nueva">
                    <Button variant="glow" className="gap-2">
                        <Plus className="h-4 w-4" />
                        Nueva Cotización
                    </Button>
                </Link>
            </div>

            {/* Filters */}
            <div className="flex gap-2">
                <Button
                    variant={filter === 'ALL' ? 'default' : 'outline'}
                    onClick={() => setFilter('ALL')}
                    size="sm"
                >
                    Todas ({cotizaciones.length})
                </Button>
                <Button
                    variant={filter === 'ABIERTA' ? 'default' : 'outline'}
                    onClick={() => setFilter('ABIERTA')}
                    size="sm"
                >
                    Abiertas ({cotizaciones.filter(c => c.status === 'ABIERTA').length})
                </Button>
                <Button
                    variant={filter === 'CERRADA' ? 'default' : 'outline'}
                    onClick={() => setFilter('CERRADA')}
                    size="sm"
                >
                    Cerradas ({cotizaciones.filter(c => c.status === 'CERRADA').length})
                </Button>
                <Button
                    variant={filter === 'CANCELADA' ? 'default' : 'outline'}
                    onClick={() => setFilter('CANCELADA')}
                    size="sm"
                >
                    Canceladas ({cotizaciones.filter(c => c.status === 'CANCELADA').length})
                </Button>
            </div>

            {/* Cotizaciones List */}
            {filteredCotizaciones.length === 0 ? (
                <Card>
                    <CardContent className="py-12">
                        <div className="text-center space-y-4">
                            <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
                            <div>
                                <p className="text-lg font-medium">No hay cotizaciones</p>
                                <p className="text-sm text-muted-foreground">
                                    {filter === 'ALL'
                                        ? 'Crea tu primera cotización para comenzar'
                                        : `No tienes cotizaciones en estado ${filter.toLowerCase()}`
                                    }
                                </p>
                            </div>
                            {filter === 'ALL' && (
                                <Link href="/taller/cotizaciones/nueva">
                                    <Button className="gap-2">
                                        <Plus className="h-4 w-4" />
                                        Crear Cotización
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {filteredCotizaciones.map((cotizacion) => (
                        <Card key={cotizacion.id} className="hover:border-[#F97316]/50 transition-colors">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="space-y-1">
                                        <CardTitle className="text-xl flex items-center gap-3">
                                            {cotizacion.titulo}
                                            <Badge variant={getStatusColor(cotizacion.status)} className="gap-1">
                                                {getStatusIcon(cotizacion.status)}
                                                {cotizacion.status}
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
                                    <Link href={`/taller/cotizaciones/${cotizacion.id}`}>
                                        <Button variant="outline" size="sm" className="gap-2">
                                            <Eye className="h-4 w-4" />
                                            Ver Detalles
                                        </Button>
                                    </Link>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <FileText className="h-4 w-4" />
                                        {cotizacion.items?.length || 0} repuesto{(cotizacion.items?.length || 0) !== 1 ? 's' : ''}
                                    </div>
                                    {cotizacion.ofertas && cotizacion.ofertas.length > 0 && (
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                                            {cotizacion.ofertas.length} oferta{cotizacion.ofertas.length !== 1 ? 's' : ''} recibida{cotizacion.ofertas.length !== 1 ? 's' : ''}
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4" />
                                        {format(new Date(cotizacion.createdAt), "d 'de' MMMM, yyyy", { locale: es })}
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
