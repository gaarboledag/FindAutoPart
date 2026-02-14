'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/store/authStore'
import { talleresAPI, cotizacionesAPI, pedidosAPI } from '@/lib/api'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, ShoppingBag, Clock, Info, Plus, ArrowRight } from "lucide-react"

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
                    {taller && <p className="text-[#94A3B8] mt-1 text-sm md:text-base">Bienvenido, {taller.nombre}</p>}
                </div>
                <Link href="/taller/cotizaciones/nueva">
                    <Button variant="cta" className="gap-2 w-full sm:w-auto">
                        <Plus className="h-4 w-4" />
                        Nueva Cotización
                    </Button>
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-[#94A3B8]">Cotizaciones Totales</CardTitle>
                        <FileText className="h-5 w-5 text-[#64748B]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-[#F8FAFC]">{stats.cotizaciones}</div>
                        <p className="text-xs text-[#64748B] mt-1">Histórico de solicitudes</p>
                    </CardContent>
                </Card>
                <Card className="border-l-[3px] border-l-[#F97316]">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-[#94A3B8]">En Curso</CardTitle>
                        <Clock className="h-5 w-5 text-[#F97316]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-[#F97316]">{stats.abiertas}</div>
                        <p className="text-xs text-[#64748B] mt-1">Esperando ofertas</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-[#94A3B8]">Pedidos</CardTitle>
                        <ShoppingBag className="h-5 w-5 text-[#22C55E]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-[#22C55E]">{stats.pedidos}</div>
                        <p className="text-xs text-[#64748B] mt-1">Compras realizadas</p>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <div>
                <h2 className="text-lg font-semibold text-[#F8FAFC] mb-4">Acciones Rápidas</h2>
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
                    <Link href="/taller/cotizaciones/nueva">
                        <Card className="hover:border-[#F97316]/50 cursor-pointer h-full group transition-all duration-200">
                            <CardHeader>
                                <CardTitle className="text-base flex items-center justify-between">
                                    Crear Cotización
                                    <ArrowRight className="h-4 w-4 text-[#64748B] group-hover:text-[#F97316] transition-colors" />
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-[#94A3B8]">Solicita repuestos a múltiples tiendas en segundos.</p>
                            </CardContent>
                        </Card>
                    </Link>
                    <Link href="/taller/cotizaciones">
                        <Card className="hover:border-[#F97316]/50 cursor-pointer h-full group transition-all duration-200">
                            <CardHeader>
                                <CardTitle className="text-base flex items-center justify-between">
                                    Ver Cotizaciones
                                    <ArrowRight className="h-4 w-4 text-[#64748B] group-hover:text-[#F97316] transition-colors" />
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-[#94A3B8]">Revisa el estado de tus solicitudes y compara ofertas.</p>
                            </CardContent>
                        </Card>
                    </Link>
                    <Link href="/taller/pedidos">
                        <Card className="hover:border-[#F97316]/50 cursor-pointer h-full group transition-all duration-200">
                            <CardHeader>
                                <CardTitle className="text-base flex items-center justify-between">
                                    Mis Pedidos
                                    <ArrowRight className="h-4 w-4 text-[#64748B] group-hover:text-[#F97316] transition-colors" />
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-[#94A3B8]">Rastrea tus compras y gestiona la recepción.</p>
                            </CardContent>
                        </Card>
                    </Link>
                </div>
            </div>

            {/* Recent Activity */}
            <Card className="border-l-[3px] border-l-blue-500/50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                        <Info className="h-5 w-5 text-blue-400" />
                        Actividad Reciente
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-start gap-4 p-4 rounded-lg bg-[#0F172A]/50 border border-slate-700/30">
                        <Badge variant="info">INFO</Badge>
                        <div>
                            <p className="font-medium text-[#F8FAFC] text-sm">Bienvenido al nuevo FindPartAutopartes</p>
                            <p className="text-xs text-[#94A3B8] mt-1">
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
