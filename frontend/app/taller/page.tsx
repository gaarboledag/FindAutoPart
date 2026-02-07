'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/store/authStore'
import { talleresAPI, cotizacionesAPI, pedidosAPI } from '@/lib/api'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, ShoppingBag, Clock, Info, Plus } from "lucide-react"

export default function TallerDashboard() {
    const router = useRouter()
    const { user } = useAuthStore()
    const [taller, setTaller] = useState<any>(null)
    const [stats, setStats] = useState({
        cotizaciones: 0,
        abiertas: 0,
        pedidos: 0,
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadDashboard()
    }, [])

    const loadDashboard = async () => {
        try {
            const [tallerData, cotizaciones, pedidos] = await Promise.all([
                talleresAPI.getMe(),
                cotizacionesAPI.getAll(),
                pedidosAPI.getAll(),
            ])

            setTaller(tallerData)
            setStats({
                cotizaciones: cotizaciones.length,
                abiertas: cotizaciones.filter((c: any) => c.status === 'ABIERTA').length,
                pedidos: pedidos.length,
            })
        } catch (error: any) {
            if (error.response?.status === 404) {
                router.push('/taller/setup')
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
                    {taller && <p className="text-muted-foreground mt-1">Bienvenido, {taller.nombre}</p>}
                </div>
                <Link href="/taller/cotizaciones/nueva">
                    <Button variant="glow" className="gap-2">
                        <Plus className="h-4 w-4" />
                        Nueva Cotización
                    </Button>
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Cotizaciones Totales</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-primary-light">{stats.cotizaciones}</div>
                        <p className="text-xs text-muted-foreground">Histórico de solicitudes</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">En Curso</CardTitle>
                        <Clock className="h-4 w-4 text-secondary/80" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-secondary">{stats.abiertas}</div>
                        <p className="text-xs text-muted-foreground">Esperando ofertas</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pedidos</CardTitle>
                        <ShoppingBag className="h-4 w-4 text-accent/80" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-accent">{stats.pedidos}</div>
                        <p className="text-xs text-muted-foreground">Compras realizadas</p>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <h2 className="text-xl font-semibold font-heading tracking-tight">Acciones Rápidas</h2>
            <div className="grid gap-4 md:grid-cols-3">
                <Link href="/taller/cotizaciones/nueva">
                    <Card className="hover:border-primary/50 cursor-pointer h-full">
                        <CardHeader>
                            <CardTitle className="text-lg">Crear Cotización</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">Solicita repuestos a múltiples tiendas en segundos.</p>
                        </CardContent>
                    </Card>
                </Link>
                <Link href="/taller/cotizaciones">
                    <Card className="hover:border-secondary/50 cursor-pointer h-full">
                        <CardHeader>
                            <CardTitle className="text-lg">Ver Cotizaciones</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">Revisa el estado de tus solicitudes y compara ofertas.</p>
                        </CardContent>
                    </Card>
                </Link>
                <Link href="/taller/pedidos">
                    <Card className="hover:border-accent/50 cursor-pointer h-full">
                        <CardHeader>
                            <CardTitle className="text-lg">Mis Pedidos</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">Rastrea tus compras y gestiona la recepción.</p>
                        </CardContent>
                    </Card>
                </Link>
            </div>

            {/* Recent Activity */}
            <Card className="border-primary/10 bg-primary/5">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Info className="h-5 w-5 text-primary-light" />
                        Actividad Reciente
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-start gap-4 p-4 rounded-lg bg-background/50 border border-border/50">
                        <Badge variant="info">INFO</Badge>
                        <div>
                            <p className="font-medium text-foreground">Bienvenido al nuevo FindPartAutopartes</p>
                            <p className="text-sm text-muted-foreground mt-1">
                                Hemos actualizado la plataforma para mejorar tu experiencia.
                                Crea tu primera cotización para probar el nuevo sistema.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
