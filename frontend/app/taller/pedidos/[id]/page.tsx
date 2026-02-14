'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { pedidosAPI } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Package, MapPin, FileText, Clock, XCircle, CheckCircle2 } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

const statusMap: Record<string, { variant: any; label: string }> = {
    PENDIENTE: { variant: 'warning', label: 'Pendiente' },
    CONFIRMADO: { variant: 'info', label: 'Confirmado' },
    ENVIADO: { variant: 'info', label: 'Enviado' },
    ENTREGADO: { variant: 'success', label: 'Entregado' },
    CANCELADO: { variant: 'destructive', label: 'Cancelado' },
}

export default function PedidoDetailPage({ params }: { params: { id: string } }) {
    const router = useRouter()
    const [pedido, setPedido] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState(false)

    useEffect(() => {
        loadPedido()
    }, [params.id])

    const loadPedido = async () => {
        try {
            const data = await pedidosAPI.getOne(params.id)
            setPedido(data)
        } catch (error) {
            console.error('Error loading pedido:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleCancel = async () => {
        if (!confirm('¿Estás seguro de que deseas cancelar este pedido?')) return
        setUpdating(true)
        try {
            await pedidosAPI.cancel(params.id)
            await loadPedido()
        } catch (error: any) {
            alert(error.response?.data?.message || 'Error al cancelar pedido')
        } finally {
            setUpdating(false)
        }
    }

    const handleStatusChange = async (newStatus: string) => {
        if (!confirm('¿Confirmar recepción del pedido?')) return
        setUpdating(true)
        try {
            await pedidosAPI.updateStatus(params.id, newStatus)
            await loadPedido()
        } catch (error: any) {
            alert(error.response?.data?.message || 'Error al actualizar estado')
        } finally {
            setUpdating(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#F97316] border-t-transparent"></div>
            </div>
        )
    }

    if (!pedido) {
        return (
            <div className="text-center py-12">
                <p className="text-[#94A3B8]">Pedido no encontrado</p>
                <Link href="/taller/pedidos">
                    <Button className="mt-4">Volver a Pedidos</Button>
                </Link>
            </div>
        )
    }

    const status = statusMap[pedido.status] || { variant: 'secondary', label: pedido.status }
    const total = pedido.oferta?.items?.reduce((sum: number, item: any) => sum + (item.precioUnitario * item.cantidad), 0) || 0

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/taller/pedidos">
                        <Button variant="ghost" className="gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Volver
                        </Button>
                    </Link>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl md:text-3xl font-bold text-[#F8FAFC]">
                                Pedido #{pedido.id.slice(0, 8).toUpperCase()}
                            </h1>
                            <Badge variant={status.variant}>{status.label}</Badge>
                        </div>
                        <p className="text-[#94A3B8] text-sm mt-1">
                            {pedido.oferta?.cotizacion?.titulo || 'Cotización eliminada'}
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    {pedido.status === 'PENDIENTE' && (
                        <Button variant="destructive" onClick={handleCancel} disabled={updating} className="gap-2">
                            <XCircle className="h-4 w-4" />
                            Cancelar
                        </Button>
                    )}
                    {pedido.status === 'CONFIRMADO' && (
                        <Button variant="cta" onClick={() => handleStatusChange('ENTREGADO')} disabled={updating} className="gap-2">
                            <CheckCircle2 className="h-4 w-4" />
                            Confirmar Recepción
                        </Button>
                    )}
                </div>
            </div>

            {/* Info Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-[#94A3B8]">Tienda</CardTitle>
                        <Package className="h-5 w-5 text-[#64748B]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-lg font-semibold text-[#F8FAFC]">{pedido.oferta?.tienda?.nombre || 'N/A'}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-[#94A3B8]">Total</CardTitle>
                        <FileText className="h-5 w-5 text-[#22C55E]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-[#22C55E]">${total.toLocaleString('es-CO')}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-[#94A3B8]">Fecha</CardTitle>
                        <Clock className="h-5 w-5 text-[#64748B]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm font-medium text-[#F8FAFC]">
                            {format(new Date(pedido.createdAt), "d 'de' MMMM, yyyy", { locale: es })}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Delivery Address */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                        <MapPin className="h-4 w-4 text-[#F97316]" />
                        Entrega
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                    <p className="text-[#F8FAFC]">{pedido.direccionEntrega}</p>
                    {pedido.notas && <p className="text-[#94A3B8]">Notas: {pedido.notas}</p>}
                </CardContent>
            </Card>

            {/* Items Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Items del Pedido</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="relative w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm">
                            <thead>
                                <tr className="border-b border-slate-700/50">
                                    <th className="h-12 px-4 text-left align-middle font-medium text-[#64748B] text-xs uppercase tracking-wider">Item</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-[#64748B] text-xs uppercase tracking-wider hidden sm:table-cell">Marca</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-[#64748B] text-xs uppercase tracking-wider">Cant.</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-[#64748B] text-xs uppercase tracking-wider">P.Unit</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-[#64748B] text-xs uppercase tracking-wider">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pedido.oferta?.items?.map((item: any) => (
                                    <tr key={item.id} className="border-b border-slate-700/30 hover:bg-[#334155]/30 transition-colors">
                                        <td className="p-4 align-middle text-[#F8FAFC]">{item.nombre}</td>
                                        <td className="p-4 align-middle text-[#94A3B8] hidden sm:table-cell">{item.marca || '-'}</td>
                                        <td className="p-4 align-middle text-[#F8FAFC]">{item.cantidad}</td>
                                        <td className="p-4 align-middle text-[#94A3B8]">${item.precioUnitario.toLocaleString('es-CO')}</td>
                                        <td className="p-4 align-middle font-semibold text-[#22C55E]">${(item.precioUnitario * item.cantidad).toLocaleString('es-CO')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
