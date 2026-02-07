'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/store/authStore'
import { tiendasAPI, cotizacionesAPI, pedidosAPI } from '@/lib/api'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Settings, Package, ShoppingBag, MapPin, Tag } from "lucide-react"

export default function TiendaDashboard() {
    const router = useRouter()
    const { user } = useAuthStore()
    const [tienda, setTienda] = useState<any>(null)
    const [stats, setStats] = useState({
        cotizacionesDisponibles: 0,
        pedidos: 0,
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadDashboard()
    }, [])

    const loadDashboard = async () => {
        try {
            const [tiendaData, cotizaciones, pedidos] = await Promise.all([
                tiendasAPI.getMe(),
                cotizacionesAPI.getAvailable(),
                pedidosAPI.getAll(),
            ])

            setTienda(tiendaData)
            setStats({
                cotizacionesDisponibles: cotizaciones.length,
                pedidos: pedidos.length,
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
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-heading text-primary-light">Dashboard</h1>
                    {tienda && <p className="text-muted-foreground mt-1">Bienvenido, {tienda.nombre}</p>}
                </div>
                <Link href="/tienda/configuracion">
                    <Button variant="outline" className="gap-2">
                        <Settings className="h-4 w-4" />
                        Configuración
                    </Button>
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Cotizaciones Disponibles</CardTitle>
                        <Tag className="h-4 w-4 text-secondary/80" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-secondary">{stats.cotizacionesDisponibles}</div>
                        <p className="text-xs text-muted-foreground">Solicitudes en tu área</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pedidos Activos</CardTitle>
                        <ShoppingBag className="h-4 w-4 text-accent/80" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-accent">{stats.pedidos}</div>
                        <p className="text-xs text-muted-foreground">Entregas pendientes</p>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <h2 className="text-xl font-semibold font-heading tracking-tight">Acciones Rápidas</h2>
            <div className="grid gap-4 md:grid-cols-3">
                <Link href="/tienda/cotizaciones">
                    <Card className="hover:border-primary/50 cursor-pointer h-full">
                        <CardHeader>
                            <CardTitle className="text-lg">Ver Cotizaciones</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">Revisa solicitudes nuevas y envía ofertas.</p>
                        </CardContent>
                    </Card>
                </Link>
                <Link href="/tienda/pedidos">
                    <Card className="hover:border-secondary/50 cursor-pointer h-full">
                        <CardHeader>
                            <CardTitle className="text-lg">Gestionar Pedidos</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">Actualiza el estado de tus envíos.</p>
                        </CardContent>
                    </Card>
                </Link>
                <Link href="/tienda/configuracion">
                    <Card className="hover:border-accent/50 cursor-pointer h-full">
                        <CardHeader>
                            <CardTitle className="text-lg">Mi Perfil</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">Administra tu cobertura y categorías.</p>
                        </CardContent>
                    </Card>
                </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                {/* Coverage Info */}
                {tienda && tienda.cobertura && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <MapPin className="h-4 w-4 text-primary-light" />
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

                {/* Categories */}
                {tienda && tienda.categorias && tienda.categorias.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Tag className="h-4 w-4 text-primary-light" />
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
        </div>
    )
}
