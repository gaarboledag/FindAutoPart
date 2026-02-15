'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { cotizacionesAPI } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { Plus, FileText, Clock, CheckCircle2, XCircle, Eye, ShoppingBag, Trash2, MessageSquare } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { toast } from 'sonner'

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
    _count?: {
        ofertas: number
    }
    unreadCount?: number
}

export default function CotizacionesPage() {
    const router = useRouter()
    const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<'ALL' | 'ABIERTA' | 'CERRADA' | 'CANCELADA'>('ALL')

    // Cancellation state
    const [confirmOpen, setConfirmOpen] = useState(false)
    const [cancelId, setCancelId] = useState<string | null>(null)
    const [cancelling, setCancelling] = useState(false)

    useEffect(() => {
        loadCotizaciones()
    }, [])

    const loadCotizaciones = async () => {
        try {
            const data = await cotizacionesAPI.getAll()
            setCotizaciones(data)
        } catch (error) {
            console.error('Error loading quotations:', error)
            toast.error('Error al cargar cotizaciones')
        } finally {
            setLoading(false)
        }
    }

    const handleCancelClick = (id: string, e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setCancelId(id)
        setConfirmOpen(true)
    }

    const handleConfirmCancel = async () => {
        if (!cancelId) return

        setCancelling(true)
        try {
            await cotizacionesAPI.cancel(cancelId)
            toast.success('Cotización cancelada exitosamente')

            // Update UI optimistically
            setCotizaciones(prev => prev.map(c =>
                c.id === cancelId ? { ...c, status: 'CANCELADA' } : c
            ))
            setConfirmOpen(false)
            setCancelId(null)
        } catch (error) {
            console.error('Error cancelling quotation:', error)
            toast.error('Error al cancelar la cotización')
        } finally {
            setCancelling(false)
        }
    }

    const getOfertasCount = (cotizacion: Cotizacion): number => {
        if (cotizacion._count?.ofertas !== undefined) return cotizacion._count.ofertas
        if (cotizacion.ofertas) return cotizacion.ofertas.length
        return 0
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

    const getStatusLabel = (status: string): string => {
        switch (status) {
            case 'ABIERTA': return 'Abierta'
            case 'CERRADA': return 'Cerrada'
            case 'CANCELADA': return 'Cancelada'
            default: return status
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
        <div className="space-y-4 md:space-y-6 animate-in fade-in duration-500">
            {/* Header — stacks vertically on mobile */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold font-sans text-[#F8FAFC]">
                        Mis Cotizaciones
                    </h1>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                        {filteredCotizaciones.length} cotización{filteredCotizaciones.length !== 1 ? 'es' : ''}
                    </p>
                </div>
                <Link href="/taller/cotizaciones/nueva" className="self-start sm:self-auto">
                    <Button variant="glow" size="sm" className="gap-2 text-xs sm:text-sm">
                        <Plus className="h-4 w-4" />
                        Nueva Cotización
                    </Button>
                </Link>
            </div>

            {/* Filters — horizontal scroll on mobile */}
            <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
                <Button
                    variant={filter === 'ALL' ? 'default' : 'outline'}
                    onClick={() => setFilter('ALL')}
                    size="sm"
                    className="shrink-0 text-xs h-8 px-3"
                >
                    Todas ({cotizaciones.length})
                </Button>
                <Button
                    variant={filter === 'ABIERTA' ? 'default' : 'outline'}
                    onClick={() => setFilter('ABIERTA')}
                    size="sm"
                    className="shrink-0 text-xs h-8 px-3"
                >
                    Abiertas ({cotizaciones.filter(c => c.status === 'ABIERTA').length})
                </Button>
                <Button
                    variant={filter === 'CERRADA' ? 'default' : 'outline'}
                    onClick={() => setFilter('CERRADA')}
                    size="sm"
                    className="shrink-0 text-xs h-8 px-3"
                >
                    Cerradas ({cotizaciones.filter(c => c.status === 'CERRADA').length})
                </Button>
                <Button
                    variant={filter === 'CANCELADA' ? 'default' : 'outline'}
                    onClick={() => setFilter('CANCELADA')}
                    size="sm"
                    className="shrink-0 text-xs h-8 px-3"
                >
                    Canceladas ({cotizaciones.filter(c => c.status === 'CANCELADA').length})
                </Button>
            </div>

            {/* Cotizaciones List */}
            {filteredCotizaciones.length === 0 ? (
                <Card>
                    <CardContent className="py-12">
                        <div className="text-center space-y-4">
                            <FileText className="h-10 w-10 mx-auto text-muted-foreground" />
                            <div>
                                <p className="text-base font-medium">No hay cotizaciones</p>
                                <p className="text-xs sm:text-sm text-muted-foreground">
                                    {filter === 'ALL'
                                        ? 'Crea tu primera cotización para comenzar'
                                        : `No tienes cotizaciones en estado ${filter.toLowerCase()}`
                                    }
                                </p>
                            </div>
                            {filter === 'ALL' && (
                                <Link href="/taller/cotizaciones/nueva">
                                    <Button size="sm" className="gap-2">
                                        <Plus className="h-4 w-4" />
                                        Crear Cotización
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-3 md:gap-4">
                    {filteredCotizaciones.map((cotizacion) => {
                        const ofertasCount = getOfertasCount(cotizacion)
                        const canCancel = cotizacion.status === 'ABIERTA'

                        return (
                            <Card key={cotizacion.id} className="hover:border-[#F97316]/50 transition-colors relative group">
                                <CardHeader className="p-3 sm:p-4 md:p-5">
                                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                        <div className="space-y-1.5 min-w-0 flex-1 pr-8 sm:pr-0">
                                            {/* Title */}
                                            <CardTitle className="text-sm sm:text-base md:text-lg leading-tight truncate pr-8 sm:pr-4">
                                                {cotizacion.titulo}
                                            </CardTitle>

                                            {/* Vehicle info */}
                                            <p className="text-xs sm:text-sm text-muted-foreground">
                                                {cotizacion.marca} {cotizacion.modelo} ({cotizacion.anio})
                                            </p>

                                            {/* Badges row */}
                                            <div className="flex flex-wrap items-center gap-1.5">
                                                <Badge variant={getStatusColor(cotizacion.status)} className="gap-1 text-[10px] sm:text-xs">
                                                    {getStatusIcon(cotizacion.status)}
                                                    {getStatusLabel(cotizacion.status)}
                                                </Badge>
                                                {cotizacion.categoria && (
                                                    <Badge variant="outline" className="text-[10px] sm:text-xs">
                                                        {cotizacion.categoria}
                                                    </Badge>
                                                )}
                                                {ofertasCount > 0 && (
                                                    <Badge variant="success" className="gap-1 text-[10px] sm:text-xs">
                                                        <ShoppingBag className="h-3 w-3" />
                                                        {ofertasCount} oferta{ofertasCount !== 1 ? 's' : ''}
                                                    </Badge>
                                                )}
                                                {(cotizacion.unreadCount || 0) > 0 && (
                                                    <Badge className="gap-1 text-[10px] sm:text-xs bg-red-500 hover:bg-red-600 border-red-200 text-white animate-pulse">
                                                        <MessageSquare className="h-3 w-3" />
                                                        {cotizacion.unreadCount} mensajes
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>

                                        {/* Action buttons */}
                                        <div className="absolute top-3 right-3 sm:static sm:flex sm:items-center sm:gap-2">
                                            {/* Cancel Button - Subtle Trash Icon */}
                                            {canCancel && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 -mt-1 sm:mt-0"
                                                    onClick={(e) => handleCancelClick(cotizacion.id, e)}
                                                    title="Cancelar cotización"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            )}

                                            <Link href={`/taller/cotizaciones/${cotizacion.id}`} className="hidden sm:inline-flex">
                                                <Button variant="outline" size="sm" className="gap-1.5 text-xs h-8">
                                                    <Eye className="h-3.5 w-3.5" />
                                                    Ver Detalles
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>

                                    {/* Mobile Only: Ver Detalles Button (replaces hidden sm:inline-flex one for layout) */}
                                    <div className="mt-3 sm:hidden w-full flex justify-end">
                                        <Link href={`/taller/cotizaciones/${cotizacion.id}`} className="w-full">
                                            <Button variant="outline" size="sm" className="w-full gap-1.5 text-xs h-8">
                                                <Eye className="h-3.5 w-3.5" />
                                                Ver Detalles
                                            </Button>
                                        </Link>
                                    </div>

                                </CardHeader>
                                <CardContent className="px-3 sm:px-4 md:px-5 pb-3 sm:pb-4 md:pb-5 pt-0">
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                                        <div className="flex items-center gap-1.5">
                                            <FileText className="h-3.5 w-3.5" />
                                            {cotizacion.items?.length || 0} repuesto{(cotizacion.items?.length || 0) !== 1 ? 's' : ''}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="h-3.5 w-3.5" />
                                            {format(new Date(cotizacion.createdAt), "d 'de' MMM, yyyy", { locale: es })}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            )}

            <ConfirmDialog
                open={confirmOpen}
                onOpenChange={setConfirmOpen}
                title="¿Cancelar cotización?"
                description="Esta acción cambiará el estado de la cotización a cancelada. Las tiendas ya no podrán enviar ofertas."
                confirmText="Sí, cancelar"
                cancelText="No, mantener"
                variant="destructive"
                onConfirm={handleConfirmCancel}
                isLoading={cancelling}
            />
        </div>
    )
}
