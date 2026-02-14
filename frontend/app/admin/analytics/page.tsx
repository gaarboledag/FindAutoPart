'use client'

import { useEffect, useState } from 'react'
import { adminAPI } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Users, FileText, ShoppingCart, Package, DollarSign,
    TrendingUp, ArrowLeft
} from 'lucide-react'
import Link from 'next/link'
import {
    LineChart, Line, AreaChart, Area, BarChart, Bar,
    PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer
} from 'recharts'

interface AnalyticsData {
    summary: {
        users: any
        cotizaciones: any
        ofertas: any
        pedidos: any
        revenue: any
    }
    trends: {
        daily: any[]
    }
    distribution: any
    topPerformers: any
}

const COLORS = {
    primary: '#3b82f6',
    secondary: '#8b5cf6',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
}

export default function AnalyticsPage() {
    const [data, setData] = useState<AnalyticsData | null>(null)
    const [loading, setLoading] = useState(true)
    const [period, setPeriod] = useState('30')

    useEffect(() => {
        fetchAnalytics()
    }, [period])

    const fetchAnalytics = async () => {
        setLoading(true)
        try {
            const days = parseInt(period)
            const endDate = new Date()
            const startDate = new Date()
            startDate.setDate(startDate.getDate() - days)

            const response = await adminAPI.getPlatformAnalytics(
                startDate.toISOString(),
                endDate.toISOString()
            )
            setData(response)
        } catch (error) {
            console.error('Error fetching analytics:', error)
        } finally {
            setLoading(false)
        }
    }

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value)
    }

    if (loading || !data) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F97316]"></div>
            </div>
        )
    }

    const { summary, trends, distribution, topPerformers } = data

    // Prepare chart data
    const trendData = trends.daily.map(day => ({
        ...day,
        fecha: new Date(day.date).toLocaleDateString('es-CO', { month: 'short', day: 'numeric' })
    }))

    const userDistribution = [
        { name: 'Talleres', value: distribution.usersByRole.TALLER, color: COLORS.primary },
        { name: 'Tiendas', value: distribution.usersByRole.TIENDA, color: COLORS.success },
        { name: 'Admins', value: distribution.usersByRole.ADMIN, color: COLORS.danger },
    ]

    const pedidosDistribution = [
        { name: 'Entregados', value: distribution.pedidosByStatus.ENTREGADO, color: COLORS.success },
        { name: 'Confirmados', value: distribution.pedidosByStatus.CONFIRMADO, color: COLORS.primary },
        { name: 'Pendientes', value: distribution.pedidosByStatus.PENDIENTE, color: COLORS.warning },
        { name: 'Cancelados', value: distribution.pedidosByStatus.CANCELADO, color: COLORS.danger },
    ]

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col gap-4">
                <Link href="/admin" className="w-fit">
                    <Button variant="ghost" className="gap-2 -ml-2 text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="h-4 w-4" />
                        Volver al Panel
                    </Button>
                </Link>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-sans font-bold bg-gradient-to-r from-primary-light via-secondary to-accent bg-clip-text text-transparent">
                            Analytics Dashboard
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Métricas y tendencias de la plataforma
                        </p>
                    </div>

                    {/* Period Selector */}
                    <div className="flex gap-2">
                        {['7', '30', '90'].map((days) => (
                            <Button
                                key={days}
                                variant={period === days ? 'default' : 'outline'}
                                onClick={() => setPeriod(days)}
                                className={period === days ? 'bg-gradient-to-r from-primary to-primary-light' : ''}
                            >
                                {days === '7' ? '7 días' : days === '30' ? '30 días' : '90 días'}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Global KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <Card className="hover:border-[#F97316]/50 transition-all">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <Users className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="text-3xl font-bold text-foreground mb-1">
                            {summary.users.total}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Usuarios Totales
                        </p>
                        <p className="text-xs text-green-500 mt-2">
                            {summary.users.active} activos
                        </p>
                    </CardContent>
                </Card>

                <Card className="hover:border-blue-500/50 transition-all">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <FileText className="h-8 w-8 text-blue-400" />
                        </div>
                        <h3 className="text-3xl font-bold text-foreground mb-1">
                            {summary.cotizaciones.total}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Cotizaciones
                        </p>
                    </CardContent>
                </Card>

                <Card className="hover:border-green-500/50 transition-all">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <ShoppingCart className="h-8 w-8 text-green-400" />
                        </div>
                        <h3 className="text-3xl font-bold text-foreground mb-1">
                            {summary.ofertas.total}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Ofertas
                        </p>
                    </CardContent>
                </Card>

                <Card className="hover:border-purple-500/50 transition-all">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <Package className="h-8 w-8 text-purple-400" />
                        </div>
                        <h3 className="text-3xl font-bold text-foreground mb-1">
                            {summary.pedidos.total}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Pedidos
                        </p>
                    </CardContent>
                </Card>

                <Card className="hover:border-secondary/50 transition-all">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <DollarSign className="h-8 w-8 text-secondary" />
                        </div>
                        <h3 className="text-3xl font-bold text-foreground mb-1">
                            {formatCurrency(summary.revenue.total)}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Revenue Total
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Trends Chart */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-[#F8FAFC] flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Tendencias en el Período
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={350}>
                        <LineChart data={trendData}>
                            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
                            <XAxis
                                dataKey="fecha"
                                stroke="#888"
                                style={{ fontSize: '12px' }}
                            />
                            <YAxis stroke="#888" style={{ fontSize: '12px' }} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'hsl(var(--card))',
                                    border: '1px solid hsl(var(--border))',
                                    borderRadius: '8px',
                                }}
                                labelStyle={{ color: 'hsl(var(--foreground))' }}
                            />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="cotizaciones"
                                stroke={COLORS.primary}
                                strokeWidth={2}
                                name="Cotizaciones"
                            />
                            <Line
                                type="monotone"
                                dataKey="ofertas"
                                stroke={COLORS.success}
                                strokeWidth={2}
                                name="Ofertas"
                            />
                            <Line
                                type="monotone"
                                dataKey="pedidos"
                                stroke={COLORS.secondary}
                                strokeWidth={2}
                                name="Pedidos"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Revenue Chart */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-[#F8FAFC] flex items-center gap-2">
                        <DollarSign className="h-5 w-5" />
                        Revenue por Día
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={trendData}>
                            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
                            <XAxis
                                dataKey="fecha"
                                stroke="#888"
                                style={{ fontSize: '12px' }}
                            />
                            <YAxis stroke="#888" style={{ fontSize: '12px' }} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'hsl(var(--card))',
                                    border: '1px solid hsl(var(--border))',
                                    borderRadius: '8px',
                                }}
                                formatter={(value: number | undefined) => value ? formatCurrency(value) : '$0'}
                            />
                            <Area
                                type="monotone"
                                dataKey="revenue"
                                stroke={COLORS.secondary}
                                fill={COLORS.secondary}
                                fillOpacity={0.3}
                                name="Revenue (COP)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Distribution Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-[#F8FAFC] flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            Distribución de Usuarios
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    data={userDistribution}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, value }) => `${name}: ${value}`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {userDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'hsl(var(--card))',
                                        border: '1px solid hsl(var(--border))',
                                        borderRadius: '8px',
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-[#F8FAFC] flex items-center gap-2">
                            <Package className="h-5 w-5" />
                            Pedidos por Estado
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={pedidosDistribution}>
                                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
                                <XAxis
                                    dataKey="name"
                                    stroke="#888"
                                    style={{ fontSize: '12px' }}
                                />
                                <YAxis stroke="#888" style={{ fontSize: '12px' }} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'hsl(var(--card))',
                                        border: '1px solid hsl(var(--border))',
                                        borderRadius: '8px',
                                    }}
                                />
                                <Bar dataKey="value" name="Cantidad">
                                    {pedidosDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Top Performers */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-[#F8FAFC] flex items-center gap-2">
                            🏆 Top 5 Talleres
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {topPerformers.talleres.length > 0 ? (
                            <ul className="space-y-3">
                                {topPerformers.talleres.map((taller: any, idx: number) => (
                                    <li key={idx} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl font-bold text-primary">
                                                #{idx + 1}
                                            </span>
                                            <span className="text-foreground text-sm">ID: {taller.id.substring(0, 8)}</span>
                                        </div>
                                        <Badge variant="secondary" className="text-lg px-3 py-1">
                                            {formatCurrency(taller.total)}
                                        </Badge>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-muted-foreground text-sm">No hay datos disponibles</p>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-[#F8FAFC] flex items-center gap-2">
                            🏆 Top 5 Tiendas
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {topPerformers.tiendas.length > 0 ? (
                            <ul className="space-y-3">
                                {topPerformers.tiendas.map((tienda: any, idx: number) => (
                                    <li key={idx} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl font-bold text-success">
                                                #{idx + 1}
                                            </span>
                                            <span className="text-foreground text-sm">ID: {tienda.id.substring(0, 8)}</span>
                                        </div>
                                        <Badge variant="success" className="text-lg px-3 py-1">
                                            {formatCurrency(tienda.total)}
                                        </Badge>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-muted-foreground text-sm">No hay datos disponibles</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
