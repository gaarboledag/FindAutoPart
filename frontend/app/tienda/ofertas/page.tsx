'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ofertasAPI } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FileText, Clock, CheckCircle, XCircle, Eye, TrendingUp, MessageSquare } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { ChatWindow } from '@/components/chat/ChatWindow'
import { useAuthStore } from '@/store/authStore'

type Oferta = {
    id: string
    diasEntrega: number
    comentarios?: string
    createdAt: string
    seleccionada: boolean
    unreadCount?: number
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

    const { user } = useAuthStore()
    const [currentUserId, setCurrentUserId] = useState('')
    const [isChatOpen, setIsChatOpen] = useState(false)
    const [selectedChat, setSelectedChat] = useState<{ cotizacionId: string, title: string } | null>(null)

    useEffect(() => {
        if (user?.id) setCurrentUserId(user.id)
        loadOfertas()
    }, [user])

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
                return <Badge variant="success" className="gap-1 text-[10px] sm:text-xs"><CheckCircle className="h-3 w-3" />Seleccionada</Badge>
            case 'REJECTED':
                return <Badge variant="destructive" className="gap-1 text-[10px] sm:text-xs"><XCircle className="h-3 w-3" />No Seleccionada</Badge>
            case 'PENDING':
                return <Badge variant="warning" className="gap-1 text-[10px] sm:text-xs"><Clock className="h-3 w-3" />Pendiente</Badge>
        }
    }

    const handleChatClick = (oferta: Oferta) => {
        setSelectedChat({
            cotizacionId: oferta.cotizacion.id,
            title: `Chat sobre ${oferta.cotizacion.titulo}`
        })
        setIsChatOpen(true)
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
        <div className="space-y-4 md:space-y-6 animate-in fade-in duration-500">
            {/* Chat Window */}
            {selectedChat && (
                <ChatWindow
                    isOpen={isChatOpen}
                    onClose={() => setIsChatOpen(false)}
                    cotizacionId={selectedChat.cotizacionId}
                    currentUserId={currentUserId}
                    title={selectedChat.title}
                />
            )}

            {/* Header — stacks vertically on mobile */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold font-sans text-[#F8FAFC]">Mis Ofertas</h1>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                        {filteredOfertas.length} oferta{filteredOfertas.length !== 1 ? 's' : ''}
                    </p>
                </div>
                <Link href="/tienda/cotizaciones" className="self-start sm:self-auto">
                    <Button variant="glow" size="sm" className="gap-2 text-xs sm:text-sm">
                        <TrendingUp className="h-4 w-4" />
                        Ver Cotizaciones
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
                    Todas ({ofertas.length})
                </Button>
                <Button
                    variant={filter === 'PENDING' ? 'default' : 'outline'}
                    onClick={() => setFilter('PENDING')}
                    size="sm"
                    className="shrink-0 text-xs h-8 px-3"
                >
                    Pendientes ({ofertas.filter(o => getOfertaStatus(o) === 'PENDING').length})
                </Button>
                <Button
                    variant={filter === 'SELECTED' ? 'default' : 'outline'}
                    onClick={() => setFilter('SELECTED')}
                    size="sm"
                    className="shrink-0 text-xs h-8 px-3"
                >
                    Seleccionadas ({ofertas.filter(o => o.seleccionada).length})
                </Button>
            </div>

            {/* Ofertas List */}
            {filteredOfertas.length === 0 ? (
                <Card>
                    <CardContent className="py-10">
                        <div className="text-center space-y-4">
                            <FileText className="h-10 w-10 mx-auto text-muted-foreground" />
                            <div>
                                <p className="text-base font-medium">No hay ofertas</p>
                                <p className="text-xs sm:text-sm text-muted-foreground">
                                    {filter === 'ALL'
                                        ? 'Revisa las cotizaciones disponibles y envía tu primera oferta'
                                        : `No tienes ofertas ${filter === 'PENDING' ? 'pendientes' : 'seleccionadas'}`
                                    }
                                </p>
                            </div>
                            {filter === 'ALL' && (
                                <Link href="/tienda/cotizaciones">
                                    <Button size="sm" className="gap-2">
                                        <TrendingUp className="h-4 w-4" />
                                        Ver Cotizaciones
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-3 md:gap-4">
                    {filteredOfertas.map((oferta) => {
                        const itemsDisponibles = oferta.items.filter(i => i.disponible).length
                        const cobertura = Math.round((itemsDisponibles / oferta.items.length) * 100)

                        return (
                            <Card key={oferta.id} className={oferta.seleccionada ? 'border-green-500' : ''}>
                                <CardHeader className="p-3 sm:p-4 md:p-5">
                                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                        <div className="space-y-1.5 min-w-0 flex-1">
                                            {/* Title */}
                                            <div className="flex items-center gap-2">
                                                <CardTitle className="text-sm sm:text-base md:text-lg leading-tight truncate">
                                                    {oferta.cotizacion.titulo}
                                                </CardTitle>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6 text-muted-foreground hover:text-blue-500 hover:bg-blue-50/10"
                                                    onClick={(e) => {
                                                        e.preventDefault()
                                                        handleChatClick(oferta)
                                                    }}
                                                    title="Chatear con el taller"
                                                >
                                                    <MessageSquare className="h-4 w-4" />
                                                </Button>
                                            </div>

                                            {/* Vehicle info */}
                                            <p className="text-xs sm:text-sm text-muted-foreground">
                                                {oferta.cotizacion.marca} {oferta.cotizacion.modelo}
                                            </p>

                                            {/* Badge */}
                                            <div className="flex flex-wrap items-center gap-1.5">
                                                {getStatusBadge(getOfertaStatus(oferta))}
                                            </div>
                                        </div>

                                        {/* Price */}
                                        <div className="text-left sm:text-right shrink-0">
                                            <p className="text-lg sm:text-xl md:text-2xl font-bold text-[#22C55E]">
                                                ${calculateTotal(oferta).toLocaleString('es-CO')}
                                            </p>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="px-3 sm:px-4 md:px-5 pb-3 sm:pb-4 md:pb-5 pt-0 space-y-3">
                                    {/* Info Grid */}
                                    <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
                                        <div>
                                            <p className="text-[10px] sm:text-xs text-muted-foreground mb-0.5">Taller</p>
                                            <p className="font-medium text-xs sm:text-sm">{oferta.cotizacion.taller.nombre}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] sm:text-xs text-muted-foreground mb-0.5">Días Entrega</p>
                                            <p className="text-xs sm:text-sm">{oferta.diasEntrega} día{oferta.diasEntrega !== 1 ? 's' : ''}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] sm:text-xs text-muted-foreground mb-0.5">Cobertura</p>
                                            <p className="text-xs sm:text-sm font-medium">{cobertura}% ({itemsDisponibles}/{oferta.items.length})</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] sm:text-xs text-muted-foreground mb-0.5">Enviado</p>
                                            <p className="text-xs sm:text-sm">
                                                {format(new Date(oferta.createdAt), "d 'de' MMM", { locale: es })}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Items Detail */}
                                    <div className="border-t pt-3">
                                        <p className="text-xs sm:text-sm font-medium mb-2">Items de la Oferta:</p>
                                        <div className="space-y-1">
                                            {oferta.items.map((item, idx) => (
                                                <div key={idx} className="flex justify-between items-center text-xs sm:text-sm p-1.5 sm:p-2 bg-[#0F172A]/50 rounded gap-2">
                                                    <div className="flex items-center gap-1.5 min-w-0 flex-1">
                                                        <span className="truncate">{item.nombre}</span>
                                                        {!item.disponible && (
                                                            <Badge variant="warning" className="text-[10px] shrink-0">No disp.</Badge>
                                                        )}
                                                    </div>
                                                    <span className="font-medium shrink-0 text-xs">
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
                                        <div className="border-t pt-3">
                                            <p className="text-[10px] sm:text-xs text-muted-foreground mb-0.5">Comentarios:</p>
                                            <p className="text-xs sm:text-sm">{oferta.comentarios}</p>
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
