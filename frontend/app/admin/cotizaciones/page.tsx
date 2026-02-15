'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { adminAPI } from '@/lib/api'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft, FileText, Search, MessageSquare, ExternalLink, Calendar, Car } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { AdminChatList } from '@/components/admin/AdminChatList'
import { ChatWindow } from '@/components/chat/ChatWindow'
import { useAuthStore } from '@/store/authStore'

export default function AdminCotizacionesPage() {
    const { user } = useAuthStore()
    const [cotizaciones, setCotizaciones] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('ALL')

    // Chat States
    const [selectedCotizacionId, setSelectedCotizacionId] = useState<string | null>(null)
    const [isChatListOpen, setIsChatListOpen] = useState(false)
    const [selectedChatId, setSelectedChatId] = useState<string | null>(null)
    const [selectedChatTitle, setSelectedChatTitle] = useState('')
    const [isChatWindowOpen, setIsChatWindowOpen] = useState(false)

    useEffect(() => {
        loadCotizaciones()
    }, [])

    const loadCotizaciones = async () => {
        try {
            const data = await adminAPI.getAllCotizaciones()
            setCotizaciones(data.data || data) // Handle pagination response structure if needed
        } catch (error) {
            console.error('Error loading cotizaciones:', error)
        } finally {
            setLoading(false)
        }
    }

    const filteredCotizaciones = cotizaciones.filter(c => {
        const matchesSearch =
            c.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.modelo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.marca?.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter

        return matchesSearch && matchesStatus
    })

    const handleOpenChatList = (cotizacionId: string) => {
        setSelectedCotizacionId(cotizacionId)
        setIsChatListOpen(true)
    }

    const handleSelectChat = (chatId: string, title: string) => {
        setSelectedChatId(chatId)
        setSelectedChatTitle(title)
        setIsChatListOpen(false) // Close list
        setIsChatWindowOpen(true) // Open window
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'ABIERTA': return <Badge className="bg-green-500 hover:bg-green-600">Abierta</Badge>
            case 'CERRADA': return <Badge className="bg-blue-500 hover:bg-blue-600">Cerrada</Badge>
            case 'CANCELADA': return <Badge variant="destructive">Cancelada</Badge>
            default: return <Badge variant="secondary">{status}</Badge>
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F97316]"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <Link href="/admin" className="w-fit">
                    <Button variant="ghost" className="gap-2 -ml-2 text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="h-4 w-4" />
                        Volver al Panel
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold font-sans text-[#F8FAFC]">
                        Gestión de Cotizaciones
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Supervisa todas las solicitudes de repuestos
                    </p>
                </div>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                        <Button
                            variant={statusFilter === 'ALL' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setStatusFilter('ALL')}
                        >
                            Todas
                        </Button>
                        <Button
                            variant={statusFilter === 'ABIERTA' ? 'default' : 'outline'}
                            size="sm"
                            className={statusFilter === 'ABIERTA' ? 'bg-green-600 hover:bg-green-700' : ''}
                            onClick={() => setStatusFilter('ABIERTA')}
                        >
                            Abiertas
                        </Button>
                        <Button
                            variant={statusFilter === 'CERRADA' ? 'default' : 'outline'}
                            size="sm"
                            className={statusFilter === 'CERRADA' ? 'bg-blue-600 hover:bg-blue-700' : ''}
                            onClick={() => setStatusFilter('CERRADA')}
                        >
                            Cerradas
                        </Button>
                        <Button
                            variant={statusFilter === 'CANCELADA' ? 'default' : 'outline'}
                            size="sm"
                            className={statusFilter === 'CANCELADA' ? 'bg-red-600 hover:bg-red-700' : ''}
                            onClick={() => setStatusFilter('CANCELADA')}
                        >
                            Canceladas
                        </Button>
                    </div>
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar por ID, Marca, Modelo..."
                            className="pl-8"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Table */}
            <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b bg-muted/50">
                                <th className="text-left p-4 text-sm font-semibold text-muted-foreground">ID / Fecha</th>
                                <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Solicitud</th>
                                <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Vehículo</th>
                                <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Taller</th>
                                <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Estado</th>
                                <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCotizaciones.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center p-8 text-muted-foreground">
                                        No se encontraron cotizaciones
                                    </td>
                                </tr>
                            ) : (
                                filteredCotizaciones.map((c) => (
                                    <tr key={c.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                                        <td className="p-4">
                                            <div className="font-mono text-xs text-muted-foreground mb-1">{c.id.substring(0, 8)}...</div>
                                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                <Calendar className="h-3 w-3" />
                                                {format(new Date(c.createdAt), 'dd MMM yyyy', { locale: es })}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="font-medium text-foreground">{c.titulo}</div>
                                            {c.categoria && <Badge variant="outline" className="text-[10px] mt-1">{c.categoria}</Badge>}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <Car className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-sm">{c.marca} {c.modelo} ({c.anio})</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm text-foreground">
                                            {c.taller?.nombre || 'Taller desconocido'}
                                        </td>
                                        <td className="p-4">
                                            {getStatusBadge(c.status)}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex gap-2">
                                                {/* <Button variant="ghost" size="icon" title="Ver Detalles">
                                                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                                                </Button> */}
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    className="gap-2"
                                                    onClick={() => handleOpenChatList(c.id)}
                                                >
                                                    <MessageSquare className="h-3 w-3" />
                                                    Chats
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Components */}
            <AdminChatList
                isOpen={isChatListOpen}
                onClose={() => setIsChatListOpen(false)}
                cotizacionId={selectedCotizacionId}
                onSelectChat={handleSelectChat}
            />

            {selectedChatId && (
                <ChatWindow
                    isOpen={isChatWindowOpen}
                    onClose={() => setIsChatWindowOpen(false)}
                    cotizacionId={selectedCotizacionId || ''} // Not used for fetching but required by prop types
                    currentUserId={user?.id || ''} // Admin ID
                    chatId={selectedChatId}
                    title={selectedChatTitle}
                    tiendaId="" // Not needed
                />
            )}
        </div>
    )
}
