'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ofertasAPI } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FileText, Clock, CheckCircle, XCircle, Eye, TrendingUp } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

type Oferta = {
    id: string
    diasEntrega: number
    comentarios?: string
    createdAt: string
    seleccionada: boolean
    cotizacion: {
        id: string
        titulo: string
        marca: string
        modelo: string
        status: string
        taller: {
            nombre: string
        }
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

export default function MisOfertasPage() {
    const router = useRouter()
    const [ofertas, setOfertas] = useState<Oferta[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'SELECTED'>('ALL')

    useEffect(() => {
        loadOfertas()
    }, [])

    const loadOfertas = async () => {
        try {
            const data = await ofertasAPI.getAll()
            setOfertas(data)
        } catch (error) {
            console.error('Error loading offers:', error)
        } finally {
            setLoading(false)
        }
    }

    const getOfertaStatus = (oferta: Oferta) => {
        if (oferta.seleccionada) return 'SELECTED'
        if (oferta.cotizacion.status === 'CERRADA') return 'REJECTED'
        return 'PENDING'
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'SELECTED':
                return <Badge variant="success" className="gap-1"><CheckCircle className="h-3 w-3" />Seleccionada</Badge>
            case 'REJECTED':
                return <Badge variant="destructive" className="gap-1"><XCircle className="h-3 w-3" />No Seleccionada</Badge>
            case 'PENDING':
                return <Badge variant="warning" className="gap-1"><Clock className="h-3 w-3" />Pendiente</Badge>
        }
    }

    const filteredOfertas = filter === 'ALL'
        ? ofertas
        : ofertas.filter(o => {
            const status = getOfertaStatus(o)
            return filter === 'PENDING' ? status === 'PENDING' : status === 'SELECTED'
        })

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
                    <h1 className="text-3xl font-bold font-sans text-[#F8FAFC]">Mis Ofertas</h1>
                    <p className="text-muted-foreground mt-1">
                        {filteredOfertas.length} oferta{filteredOfertas.length !== 1 ? 's' : ''}
                    </p>
                </div>
                <Link href="/tienda/cotizaciones">
                    <Button variant="glow" className="gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Ver Cotizaciones
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
                    Todas ({ofertas.length})
                </Button>
                <Button
                    variant={filter === 'PENDING' ? 'default' : 'outline'}
                    onClick={() => setFilter('PENDING')}
                    size="sm"
                >
                    Pendientes ({ofertas.filter(o => getOfertaStatus(o) === 'PENDING').length})
                </Button>
                <Button
                    variant={filter === 'SELECTED' ? 'default' : 'outline'}
                    onClick={() => setFilter('SELECTED')}
                    size="sm"
                >
                    Seleccionadas ({ofertas.filter(o => o.seleccionada).length})
                </Button>
            </div>

            {/* Ofertas List */}
            {filteredOfertas.length === 0 ? (
                <Card>
                    <CardContent className="py-12">
                        <div className="text-center space-y-4">
                            <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
                            <div>
                                <p className="text-lg font-medium">No hay ofertas</p>
                                <p className="text-sm text-muted-foreground">
                                    {filter === 'ALL'
                                        ? 'Revisa las cotizaciones disponibles y envía tu primera oferta'
                                        : `No tienes ofertas ${filter === 'PENDING' ? 'pendientes' : 'seleccionadas'}`
                                    }
                                </p>
                            </div>
                            {filter === 'ALL' && (
                                <Link href="/tienda/cotizaciones">
                                    <Button className="gap-2">
                                        <TrendingUp className="h-4 w-4" />
                                        Ver Cotizaciones
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {filteredOfertas.map((oferta) => {
                        const itemsDisponibles = oferta.items.filter(i => i.disponible).length
                        const cobertura = Math.round((itemsDisponibles / oferta.items.length) * 100)

                        return (
                            <Card key={oferta.id} className={oferta.seleccionada ? 'border-green-500' : ''}>
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-1 flex-1">
                                            <CardTitle className="text-xl flex items-center gap-3">
                                                {oferta.cotizacion.titulo}
                                                {getStatusBadge(getOfertaStatus(oferta))}
                                            </CardTitle>
                                            <p className="text-sm text-muted-foreground">
                                                {oferta.cotizacion.marca} {oferta.cotizacion.modelo}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-[#22C55E]">
                                                ${calculateTotal(oferta).toLocaleString('es-CO')}
                                            </p>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid gap-4 md:grid-cols-4 mb-4">
                                        <div>
                                            <p className="text-xs text-muted-foreground mb-1">Taller</p>
                                            <p className="font-medium text-sm">{oferta.cotizacion.taller.nombre}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground mb-1">Días Entrega</p>
                                            <p className="text-sm">{oferta.diasEntrega} día{oferta.diasEntrega !== 1 ? 's' : ''}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground mb-1">Cobertura</p>
                                            <p className="text-sm font-medium">{cobertura}% ({itemsDisponibles}/{oferta.items.length})</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground mb-1">Enviado</p>
                                            <p className="text-sm">
                                                {format(new Date(oferta.createdAt), "d 'de' MMM", { locale: es })}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Items Detail */}
                                    <div className="border-t pt-3">
                                        <p className="text-sm font-medium mb-2">Items de la Oferta:</p>
                                        <div className="space-y-1">
                                            {oferta.items.map((item, idx) => (
                                                <div key={idx} className="flex justify-between text-sm p-2 bg-[#0F172A]/50 rounded">
                                                    <div className="flex items-center gap-2">
                                                        <span>{item.nombre}</span>
                                                        {!item.disponible && (
                                                            <Badge variant="warning" className="text-xs">No disponible</Badge>
                                                        )}
                                                    </div>
                                                    <span className="font-medium">
                                                        {item.disponible
                                                            ? `$${item.precioUnitario.toLocaleString('es-CO')} x ${item.cantidad}`
                                                            : 'N/A'
                                                        }
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {oferta.comentarios && (
                                        <div className="border-t pt-3 mt-3">
                                            <p className="text-xs text-muted-foreground mb-1">Comentarios:</p>
                                            <p className="text-sm">{oferta.comentarios}</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
