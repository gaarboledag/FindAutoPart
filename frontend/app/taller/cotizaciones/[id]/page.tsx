'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { cotizacionesAPI, ofertasAPI, pedidosAPI, chatsAPI } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Clock, Package, TrendingUp, CheckCircle, AlertCircle, MessageSquare } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { ChatWindow } from '@/components/chat/ChatWindow'
import { useAuthStore } from '@/store/authStore'

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

    // Chat state
    const [isChatOpen, setIsChatOpen] = useState(false)
    const [selectedTiendaId, setSelectedTiendaId] = useState<string | undefined>(undefined)
    const [selectedTiendaName, setSelectedTiendaName] = useState('')
    const [currentUserId, setCurrentUserId] = useState('')
    const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({}) // tiendaId -> count
    const [activeChats, setActiveChats] = useState<any[]>([]) // All chats

    const { user } = useAuthStore()

    useEffect(() => {
        if (user?.id) {
            setCurrentUserId(user.id)
        }

        if (id) {
            loadData()
        }
    }, [id, user])

    // Reload chat status when chat is closed to update counts
    useEffect(() => {
        if (!isChatOpen && id) {
            loadChatStatus()
        }
    }, [isChatOpen, id])

    const loadData = async () => {
        try {
            const [cotizData, ofertasData] = await Promise.all([
                cotizacionesAPI.getOne(id),
                ofertasAPI.getByCotizacion(id)
            ])
            setCotizacion(cotizData)
            setOfertas(ofertasData)
            loadChatStatus()
        } catch (error) {
            console.error('Error loading data:', error)
        } finally {
            setLoading(false)
        }
    }

    const loadChatStatus = async () => {
        try {
            const chats = await chatsAPI.getChatsByCotizacion(id);
            setActiveChats(chats); // Store all chats

            const counts: Record<string, number> = {};
            chats.forEach((chat: any) => {
                if (chat.tiendaId) {
                    counts[chat.tiendaId] = chat.unreadCount || 0;
                }
            });
            setUnreadCounts(counts);
        } catch (error) {
            console.error('Error loading chat status:', error);
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

    const openChat = async (tiendaId: string, tiendaName: string) => {
        setSelectedTiendaId(tiendaId)
        setSelectedTiendaName(tiendaName)
        setIsChatOpen(true)

        // Optimistically clear unread count
        setUnreadCounts(prev => ({ ...prev, [tiendaId]: 0 }));
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

    // Filter chats that don't have a corresponding offer
    const chatsWithoutOffer = activeChats.filter(chat =>
        !ofertas.some(oferta => oferta.tienda.id === chat.tiendaId)
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Chat Window */}
            {isChatOpen && (
                <ChatWindow
                    isOpen={isChatOpen}
                    onClose={() => setIsChatOpen(false)}
                    cotizacionId={cotizacion.id}
                    tiendaId={selectedTiendaId}
                    currentUserId={currentUserId}
                    title={`Chat con ${selectedTiendaName}`}
                />
            )}

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
                        <h1 className="text-3xl font-bold font-sans text-[#F8FAFC]">{cotizacion.titulo}</h1>
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
                            <div key={item.id} className="p-4 bg-[#0F172A]/50 border rounded-lg text-sm">
                                <div className="flex flex-col md:flex-row gap-4 items-start">
                                    {item.imagenUrl && (
                                        <div
                                            className="h-32 w-full md:w-24 md:h-24 flex-shrink-0 bg-white rounded border overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                                            onClick={() => window.open(item.imagenUrl, '_blank')}
                                        >
                                            <img
                                                src={item.imagenUrl}
                                                alt={item.nombre}
                                                className="h-full w-full object-contain"
                                            />
                                        </div>
                                    )}
                                    <div className="flex-1 space-y-1">
                                        <p className="font-medium text-base">{index + 1}. {item.nombre}</p>
                                        {item.marca && <p className="text-sm text-muted-foreground"><span className="font-semibold">Marca:</span> {item.marca}</p>}
                                        {item.descripcion && <p className="text-sm text-muted-foreground">{item.descripcion}</p>}
                                        <p className="text-sm text-muted-foreground"><span className="font-semibold">Cantidad:</span> {item.cantidad}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            {/* Chats Section - NEW */}
            {chatsWithoutOffer.length > 0 && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-700">
                    <h2 className="text-2xl font-bold font-sans mb-4">Mensajes de Tiendas (Sin Oferta)</h2>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {chatsWithoutOffer.map((chat) => {
                            const unreadMessages = chat.unreadCount || 0;
                            return (
                                <Card key={chat.id} className="border-blue-500/30">
                                    <CardContent className="p-4 flex items-center justify-between">
                                        <div>
                                            <p className="font-semibold">{chat.tienda.nombre}</p>
                                            <p className="text-sm text-muted-foreground">Consultando sobre la cotización</p>
                                        </div>
                                        <Button

                                            size="sm"
                                            onClick={() => openChat(chat.tiendaId, chat.tienda.nombre)}
                                            className="relative gap-2"
                                        >
                                            <MessageSquare className="h-4 w-4" />
                                            Responder
                                            {unreadMessages > 0 && (
                                                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                                </span>
                                            )}
                                        </Button>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                </div>
            )}


            {/* Ofertas Section */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold font-sans">Ofertas Recibidas</h2>
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
                            const unreadMessages = unreadCounts[oferta.tienda.id] || 0;

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
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => openChat(oferta.tienda.id, oferta.tienda.nombre)}
                                                    title="Chatear con la tienda"
                                                    className="relative gap-2 border-blue-500/30 hover:bg-blue-500/10 hover:text-blue-400"
                                                >
                                                    <MessageSquare className="h-4 w-4 text-blue-400" />
                                                    Chatear
                                                    {unreadMessages > 0 && (
                                                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                                        </span>
                                                    )}
                                                </Button>
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
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid gap-4 md:grid-cols-4 mb-4">
                                            <div>
                                                <p className="text-xs text-muted-foreground">Total</p>
                                                <p className="text-2xl font-bold text-[#22C55E]">
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
                                                <div key={idx} className="flex justify-between items-center text-sm p-2 bg-[#0F172A]/50 rounded">
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
