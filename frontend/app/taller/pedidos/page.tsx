'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { pedidosAPI } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Package, Clock, CheckCircle, XCircle, Truck, Trash2, MessageCircle, AlertCircle } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { useAuthStore } from '@/store/authStore'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { ChatWindow } from '@/components/chat/ChatWindow'
import { toast } from 'sonner'
import { useSocket } from '@/contexts/SocketContext'

type Pedido = {
    id: string
    cotizacionId: string
    tiendaId: string
    status: 'PENDIENTE' | 'CONFIRMADO' | 'ENTREGADO' | 'CANCELADO'
    total: number
    direccionEntrega: string
    fechaEstimada?: string
    createdAt: string
    cotizacion: {
        id: string
        titulo: string
        marca: string
        modelo: string
    }
    tienda: {
        id: string
        nombre: string
        telefono: string
    }
    oferta: {
        items: any[]
    }
}

export default function PedidosPage() {
    const router = useRouter()
    const { user } = useAuthStore()
    const [pedidos, setPedidos] = useState<Pedido[]>([])
    const [loading, setLoading] = useState(true)

    // Chat state
    const [isChatOpen, setIsChatOpen] = useState(false)
    const [selectedChat, setSelectedChat] = useState<{
        cotizacionId: string
        tiendaId: string
        title: string
    } | null>(null)

    // Cancellation state
    const [confirmOpen, setConfirmOpen] = useState(false)
    const [cancelId, setCancelId] = useState<string | null>(null)
    const [cancelling, setCancelling] = useState(false)

    const { socket } = useSocket()

    useEffect(() => {
        if (!socket) return;

        const handlePedidoUpdate = (updatedPedido: any) => {
            setPedidos(prev =>
                prev.map(p => p.id === updatedPedido.id ? { ...p, status: updatedPedido.status } : p)
            );
        }

        socket.on('pedidoUpdate', handlePedidoUpdate);

        return () => {
            socket.off('pedidoUpdate', handlePedidoUpdate);
        }
    }, [socket]);

    useEffect(() => {
        loadPedidos()
    }, [])

    const loadPedidos = async () => {
        try {
            const data = await pedidosAPI.getAll()
            setPedidos(data)
        } catch (error) {
            console.error('Error loading orders:', error)
            toast.error('Error al cargar pedidos')
        } finally {
            setLoading(false)
        }
    }

    const handleChatClick = (pedido: Pedido, e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setSelectedChat({
            cotizacionId: pedido.cotizacionId || pedido.cotizacion.id,
            tiendaId: pedido.tiendaId || pedido.tienda.id,
            title: `Chat con ${pedido.tienda.nombre} - ${pedido.cotizacion.titulo}`
        })
        setIsChatOpen(true)
    }

    const handleCancelClick = (id: string, e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setCancelId(id)
        setConfirmOpen(true)
    }

    const handleConfirmCancel = async () => {
        if (!cancelId) return

        try {
            setCancelling(true)
            await pedidosAPI.cancel(cancelId)
            toast.success('Pedido cancelado exitosamente')
            loadPedidos() // Reload list
        } catch (error: any) {
            console.error('Error cancelling order:', error)
            toast.error(error.response?.data?.message || 'Error al cancelar pedido')
        } finally {
            setCancelling(false)
            setConfirmOpen(false)
            setCancelId(null)
        }
    }

    const handleUpdateStatus = async (pedidoId: string, newStatus: string, e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        if (!confirm('¿Confirmas que has recibido el pedido satisfactoriamente?')) return

        try {
            const toastId = toast.loading('Actualizando estado...')
            await pedidosAPI.updateStatus(pedidoId, newStatus)
            toast.dismiss(toastId)
            toast.success('Pedido marcado como recibido')
            await loadPedidos()
        } catch (error: any) {
            console.error('Error updating order:', error)
            toast.error(error.response?.data?.message || 'Error al actualizar pedido')
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'CONFIRMADO': return 'success'
            case 'ENTREGADO': return 'default'
            case 'CANCELADO': return 'destructive'
            default: return 'warning'
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'CONFIRMADO': return <CheckCircle className="h-3 w-3" />
            case 'ENTREGADO': return <Package className="h-3 w-3" />
            case 'CANCELADO': return <XCircle className="h-3 w-3" />
            default: return <Clock className="h-3 w-3" />
        }
    }

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'CONFIRMADO': return 'Confirmado'
            case 'ENTREGADO': return 'Entregado'
            case 'CANCELADO': return 'Cancelado'
            default: return 'Pendiente'
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F97316]"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-sans text-[#F8FAFC]">Mis Pedidos</h1>
                    <p className="text-muted-foreground mt-1">Gestiona tus compras y envíos</p>
                </div>
                <Link href="/taller/cotizaciones">
                    <Button variant="outline" className="gap-2">
                        <Package className="h-4 w-4" />
                        Nueva Cotización
                    </Button>
                </Link>
            </div>

            {pedidos.length === 0 ? (
                <Card>
                    <CardContent className="py-12">
                        <div className="text-center space-y-4">
                            <Package className="h-12 w-12 mx-auto text-muted-foreground" />
                            <div>
                                <p className="text-lg font-medium">No tienes pedidos</p>
                                <p className="text-sm text-muted-foreground">
                                    Cuando aceptes una oferta, aparecerá aquí.
                                </p>
                            </div>
                            <Link href="/taller/cotizaciones">
                                <Button className="mt-4">Ir a Cotizaciones</Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {pedidos.map((pedido) => {
                        const canCancel = pedido.status === 'PENDIENTE'

                        return (
                            <Card key={pedido.id} className="overflow-hidden hover:border-primary/50 transition-colors">
                                <CardHeader className="p-4 sm:p-6 bg-muted/20">
                                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between relative">
                                        <div className="space-y-1.5 min-w-0 flex-1">
                                            <div className="flex items-center gap-2">
                                                <CardTitle className="text-base sm:text-lg leading-tight truncate">
                                                    {pedido.cotizacion.titulo}
                                                </CardTitle>
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                {pedido.cotizacion.marca} {pedido.cotizacion.modelo}
                                            </p>
                                            <div className="flex flex-wrap items-center gap-2 mt-1">
                                                <Badge variant={getStatusColor(pedido.status)} className="gap-1">
                                                    {getStatusIcon(pedido.status)}
                                                    {getStatusLabel(pedido.status)}
                                                </Badge>
                                                <span className="text-xs text-muted-foreground">
                                                    {format(new Date(pedido.createdAt), "d 'de' MMM, yyyy", { locale: es })}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Price and Action Buttons container */}
                                        <div className="flex flex-col sm:items-end gap-1 sm:gap-2">
                                            {/* Mobile: Absolute positioning for actions */}
                                            <div className="absolute top-3 right-3 sm:static order-first flex gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-muted-foreground hover:text-blue-500 hover:bg-blue-50"
                                                    onClick={(e) => handleChatClick(pedido, e)}
                                                    title="Ver Chat"
                                                >
                                                    <MessageCircle className="h-4 w-4" />
                                                </Button>

                                                {pedido.status === 'CONFIRMADO' && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-muted-foreground hover:text-green-600 hover:bg-green-50"
                                                        onClick={(e) => handleUpdateStatus(pedido.id, 'ENTREGADO', e)}
                                                        title="Marcar como Recibido"
                                                    >
                                                        <CheckCircle className="h-4 w-4" />
                                                    </Button>
                                                )}

                                                {canCancel && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                                        onClick={(e) => handleCancelClick(pedido.id, e)}
                                                        title="Cancelar pedido"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>

                                            {/* Price */}
                                            <div className="text-left sm:text-right shrink-0 mt-6 sm:mt-0">
                                                <p className="text-lg sm:text-xl md:text-2xl font-bold text-[#22C55E]">
                                                    ${pedido.total.toLocaleString('es-CO')}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-4 sm:p-6 grid gap-4 md:grid-cols-2">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-muted-foreground">Tienda</p>
                                        <p className="font-medium">{pedido.tienda.nombre}</p>
                                        <p className="text-sm text-muted-foreground">{pedido.tienda.telefono}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-muted-foreground">Entrega</p>
                                        <div className="flex items-start gap-2">
                                            <Truck className="h-4 w-4 text-muted-foreground mt-0.5" />
                                            <div>
                                                <p className="text-sm">{pedido.direccionEntrega}</p>
                                                {pedido.fechaEstimada && (
                                                    <p className="text-xs text-muted-foreground">
                                                        Estimada: {format(new Date(pedido.fechaEstimada), "d 'de' MMM", { locale: es })}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Items List */}
                                    <div className="md:col-span-2 border-t pt-4 mt-2">
                                        <p className="text-sm font-medium mb-3">Repuestos Solicitados:</p>
                                        <div className="space-y-2">
                                            {pedido.oferta?.items.filter(i => i.disponible).map((item: any, idx: number) => (
                                                <div key={idx} className="flex justify-between items-center text-sm p-2 bg-[#0F172A]/50 rounded-lg">
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                                                        <span className="font-medium">{item.nombre}</span>
                                                        {item.marca && <span className="text-xs text-muted-foreground">({item.marca})</span>}
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <span className="text-muted-foreground text-xs">x{item.cantidad}</span>
                                                        <span className="font-medium text-[#22C55E]">
                                                            ${item.precioUnitario.toLocaleString('es-CO')}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
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
                title="¿Cancelar pedido?"
                description="Esta acción cancelará el pedido. Si ya pagaste, el proceso de reembolso comenzará."
                confirmText="Sí, cancelar pedido"
                cancelText="No, mantener"
                variant="destructive"
                onConfirm={handleConfirmCancel}
                isLoading={cancelling}
            />

            {selectedChat && (
                <ChatWindow
                    isOpen={isChatOpen}
                    onClose={() => setIsChatOpen(false)}
                    cotizacionId={selectedChat.cotizacionId}
                    tiendaId={selectedChat.tiendaId}
                    currentUserId={user?.id || ''}
                    title={selectedChat.title}
                />
            )}
        </div>
    )
}
