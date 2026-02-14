'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/store/authStore'
import { tiendasAPI, cotizacionesAPI, pedidosAPI } from '@/lib/api'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Settings, Package, ShoppingBag, MapPin, Tag, ArrowRight } from "lucide-react"

export default function TiendaDashboard() {
    const router = useRouter()
    const { user } = useAuthStore()
    const [tienda, setTienda] = useState<any>(null)
    const [stats, setStats] = useState({
        cotizacionesDisponibles: 0,
        pedidos: 0,
    })
    const [loading, setLoading] = useState(true)
    const [deliveredOrders, setDeliveredOrders] = useState<any[]>([])

    useEffect(() => {
        loadDashboard()
    }, [])

    const loadDashboard = async () => {
        try {
            const [tiendaData, cotizaciones, activePedidos, deliveredPedidos] = await Promise.all([
                tiendasAPI.getMe(),
                cotizacionesAPI.getAvailable(),
                pedidosAPI.getAll(),
                pedidosAPI.getAll('ENTREGADO'),
            ])

            setTienda(tiendaData)
            setDeliveredOrders(deliveredPedidos)

            const activeCount = activePedidos.filter((p: any) => p.status !== 'ENTREGADO' && p.status !== 'CANCELADO').length

            setStats({
                cotizacionesDisponibles: cotizaciones.length,
                pedidos: activeCount,
            })
        } catch (error: any) {
            if (error.response?.status === 404) {
                router.push('/tienda/setup')
            }
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#F97316] border-t-transparent"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-[#F8FAFC]">Dashboard</h1>
                    {tienda && <p className="text-[#94A3B8] mt-1 text-sm md:text-base">Bienvenido, {tienda.nombre}</p>}
                </div>
                <Link href="/tienda/configuracion">
                    <Button variant="outline" className="gap-2 w-full sm:w-auto">
                        <Settings className="h-4 w-4" />
                        Configuración
                    </Button>
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                <Card className="border-l-[3px] border-l-[#F97316]">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-[#94A3B8]">Cotizaciones Disponibles</CardTitle>
                        <Tag className="h-5 w-5 text-[#F97316]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-[#F97316]">{stats.cotizacionesDisponibles}</div>
                        <p className="text-xs text-[#64748B] mt-1">Solicitudes en tu área</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-[#94A3B8]">Pedidos Activos</CardTitle>
                        <ShoppingBag className="h-5 w-5 text-[#22C55E]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-[#22C55E]">{stats.pedidos}</div>
                        <p className="text-xs text-[#64748B] mt-1">Entregas pendientes</p>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <div>
                <h2 className="text-lg font-semibold text-[#F8FAFC] mb-4">Acciones Rápidas</h2>
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
                    <Link href="/tienda/cotizaciones">
                        <Card className="hover:border-[#F97316]/50 cursor-pointer h-full group transition-all duration-200">
                            <CardHeader>
                                <CardTitle className="text-base flex items-center justify-between">
                                    Ver Cotizaciones
                                    <ArrowRight className="h-4 w-4 text-[#64748B] group-hover:text-[#F97316] transition-colors" />
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-[#94A3B8]">Revisa solicitudes nuevas y envía ofertas.</p>
                            </CardContent>
                        </Card>
                    </Link>
                    <Link href="/tienda/pedidos">
                        <Card className="hover:border-[#F97316]/50 cursor-pointer h-full group transition-all duration-200">
                            <CardHeader>
                                <CardTitle className="text-base flex items-center justify-between">
                                    Gestionar Pedidos
                                    <ArrowRight className="h-4 w-4 text-[#64748B] group-hover:text-[#F97316] transition-colors" />
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-[#94A3B8]">Actualiza el estado de tus envíos.</p>
                            </CardContent>
                        </Card>
                    </Link>
                    <Link href="/tienda/configuracion">
                        <Card className="hover:border-[#F97316]/50 cursor-pointer h-full group transition-all duration-200">
                            <CardHeader>
                                <CardTitle className="text-base flex items-center justify-between">
                                    Mi Perfil
                                    <ArrowRight className="h-4 w-4 text-[#64748B] group-hover:text-[#F97316] transition-colors" />
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-[#94A3B8]">Administra tu cobertura y categorías.</p>
                            </CardContent>
                        </Card>
                    </Link>
                </div>
            </div>

            {/* Coverage & Categories */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                {tienda && tienda.cobertura && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <MapPin className="h-4 w-4 text-[#F97316]" />
                                Cobertura Geográfica
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {tienda.cobertura.map((region: string) => (
                                    <Badge key={region} variant="info">
                                        {region}
                                    </Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {tienda && tienda.categorias && tienda.categorias.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <Tag className="h-4 w-4 text-[#F97316]" />
                                Categorías
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {tienda.categorias.map((categoria: string) => (
                                    <Badge key={categoria} variant="success">
                                        {categoria}
                                    </Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Delivered Orders */}
            <div className="space-y-4">
                <h2 className="text-lg font-semibold text-[#F8FAFC]">Pedidos Entregados</h2>
                <Card>
                    <CardContent className="p-0">
                        {deliveredOrders.length === 0 ? (
                            <div className="p-8 text-center text-[#94A3B8] text-sm">
                                No hay pedidos entregados aún.
                            </div>
                        ) : (
                            <div className="relative w-full overflow-auto">
                                <table className="w-full caption-bottom text-sm">
                                    <thead>
                                        <tr className="border-b border-slate-700/50">
                                            <th className="h-12 px-4 text-left align-middle font-medium text-[#64748B] text-xs uppercase tracking-wider">ID</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium text-[#64748B] text-xs uppercase tracking-wider">Fecha</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium text-[#64748B] text-xs uppercase tracking-wider hidden sm:table-cell">Taller</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium text-[#64748B] text-xs uppercase tracking-wider">Total</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium text-[#64748B] text-xs uppercase tracking-wider">Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {deliveredOrders.map((pedido: any) => (
                                            <tr key={pedido.id} className="border-b border-slate-700/30 hover:bg-[#334155]/30 transition-colors">
                                                <td className="p-4 align-middle font-mono text-xs text-[#94A3B8]">{pedido.id.slice(0, 8)}</td>
                                                <td className="p-4 align-middle text-[#F8FAFC] text-sm">
                                                    {new Date(pedido.fechaEntregado || pedido.updatedAt).toLocaleDateString()}
                                                </td>
                                                <td className="p-4 align-middle text-[#F8FAFC] text-sm hidden sm:table-cell">{pedido.taller?.nombre}</td>
                                                <td className="p-4 align-middle font-semibold text-[#22C55E]">
                                                    ${pedido.total.toLocaleString()}
                                                </td>
                                                <td className="p-4 align-middle">
                                                    <Badge variant="success">ENTREGADO</Badge>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
