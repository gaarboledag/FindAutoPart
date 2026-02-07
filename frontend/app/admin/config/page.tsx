'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { adminAPI } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import {
    ArrowLeft, FileText, Package, ShoppingCart,
    Trash2, Loader2
} from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export default function AdminConfigPage() {
    const router = useRouter()
    const [activeTab, setActiveTab] = useState('cotizaciones')
    const [loading, setLoading] = useState(true)

    // Data states
    const [cotizaciones, setCotizaciones] = useState<any[]>([])
    const [ofertas, setOfertas] = useState<any[]>([])
    const [pedidos, setPedidos] = useState<any[]>([])

    // UI states
    const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; type: string; id: string; name: string }>({
        open: false,
        type: '',
        id: '',
        name: '',
    })
    const [actionLoading, setActionLoading] = useState<string | null>(null)

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        setLoading(true)
        try {
            const [cotizData, ofertasData, pedidosData] = await Promise.all([
                adminAPI.getAllCotizaciones({ limit: 100 }),
                adminAPI.getAllOfertas({ limit: 100 }),
                adminAPI.getAllPedidos({ limit: 100 }),
            ])
            setCotizaciones(cotizData.data || [])
            setOfertas(ofertasData.data || [])
            setPedidos(pedidosData.data || [])
        } catch (error) {
            console.error('Error loading data:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleStatusChange = async (type: string, id: string, newStatus: string) => {
        setActionLoading(id)
        try {
            if (type === 'cotizacion') {
                await adminAPI.updateCotizacionStatus(id, newStatus)
            } else if (type === 'oferta') {
                await adminAPI.updateOfertaStatus(id, newStatus)
            } else if (type === 'pedido') {
                await adminAPI.updatePedidoStatus(id, newStatus)
            }
            await loadData()
        } catch (error) {
            console.error('Error updating status:', error)
        } finally {
            setActionLoading(null)
        }
    }

    const handleDelete = async () => {
        const { type, id } = deleteDialog
        setActionLoading(id)
        try {
            if (type === 'cotizacion') {
                await adminAPI.deleteCotizacion(id)
            } else if (type === 'oferta') {
                await adminAPI.deleteOferta(id)
            } else if (type === 'pedido') {
                await adminAPI.deletePedido(id)
            }
            setDeleteDialog({ open: false, type: '', id: '', name: '' })
            await loadData()
        } catch (error) {
            console.error('Error deleting:', error)
        } finally {
            setActionLoading(null)
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
                    <h1 className="text-3xl font-bold font-heading text-primary-light">
                        Configuración y Gestión
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Administra cotizaciones, ofertas y pedidos de la plataforma
                    </p>
                </div>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="cotizaciones" className="gap-2">
                        <FileText className="h-4 w-4" />
                        Cotizaciones ({cotizaciones.length})
                    </TabsTrigger>
                    <TabsTrigger value="ofertas" className="gap-2">
                        <Package className="h-4 w-4" />
                        Ofertas ({ofertas.length})
                    </TabsTrigger>
                    <TabsTrigger value="pedidos" className="gap-2">
                        <ShoppingCart className="h-4 w-4" />
                        Pedidos ({pedidos.length})
                    </TabsTrigger>
                </TabsList>

                {/* Cotizaciones Tab */}
                <TabsContent value="cotizaciones" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl">Cotizaciones</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left p-4 text-sm font-medium text-muted-foreground">ID</th>
                                            <th className="text-left p-4 text-sm font-medium text-muted-foreground">Taller</th>
                                            <th className="text-left p-4 text-sm font-medium text-muted-foreground">Items</th>
                                            <th className="text-left p-4 text-sm font-medium text-muted-foreground">Ofertas</th>
                                            <th className="text-left p-4 text-sm font-medium text-muted-foreground">Estado</th>
                                            <th className="text-left p-4 text-sm font-medium text-muted-foreground">Fecha</th>
                                            <th className="text-left p-4 text-sm font-medium text-muted-foreground">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cotizaciones.map((cotiz) => (
                                            <tr key={cotiz.id} className="border-b last:border-0 hover:bg-muted/50">
                                                <td className="p-4 text-sm font-mono">{cotiz.id.slice(0, 8)}</td>
                                                <td className="p-4">{cotiz.taller?.user?.name || 'N/A'}</td>
                                                <td className="p-4">{cotiz.items?.length || 0}</td>
                                                <td className="p-4">{cotiz.ofertas?.length || 0}</td>
                                                <td className="p-4">
                                                    <Select
                                                        value={cotiz.status}
                                                        onValueChange={(val) => handleStatusChange('cotizacion', cotiz.id, val)}
                                                        disabled={actionLoading === cotiz.id}
                                                    >
                                                        <SelectTrigger className="w-32">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="ABIERTA">ABIERTA</SelectItem>
                                                            <SelectItem value="CERRADA">CERRADA</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </td>
                                                <td className="p-4 text-sm">
                                                    {format(new Date(cotiz.createdAt), 'dd/MM/yyyy', { locale: es })}
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex gap-2">
                                                        <Button
                                                            size="sm"
                                                            variant="destructive"
                                                            onClick={() => setDeleteDialog({
                                                                open: true,
                                                                type: 'cotizacion',
                                                                id: cotiz.id,
                                                                name: `Cotización de ${cotiz.taller?.user?.name}`,
                                                            })}
                                                            disabled={actionLoading === cotiz.id}
                                                        >
                                                            <Trash2 className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {cotizaciones.length === 0 && (
                                    <div className="text-center py-8 text-muted-foreground">
                                        No hay cotizaciones registradas
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Ofertas Tab */}
                <TabsContent value="ofertas" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl">Ofertas</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left p-4 text-sm font-medium text-muted-foreground">ID</th>
                                            <th className="text-left p-4 text-sm font-medium text-muted-foreground">Tienda</th>
                                            <th className="text-left p-4 text-sm font-medium text-muted-foreground">Total</th>
                                            <th className="text-left p-4 text-sm font-medium text-muted-foreground">Estado</th>
                                            <th className="text-left p-4 text-sm font-medium text-muted-foreground">Fecha</th>
                                            <th className="text-left p-4 text-sm font-medium text-muted-foreground">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {ofertas.map((oferta) => (
                                            <tr key={oferta.id} className="border-b last:border-0 hover:bg-muted/50">
                                                <td className="p-4 text-sm font-mono">{oferta.id.slice(0, 8)}</td>
                                                <td className="p-4">{oferta.tienda?.user?.name || 'N/A'}</td>
                                                <td className="p-4">${oferta.total?.toLocaleString() ?? 'N/A'}</td>
                                                <td className="p-4">
                                                    <Select
                                                        value={oferta.status}
                                                        onValueChange={(val) => handleStatusChange('oferta', oferta.id, val)}
                                                        disabled={actionLoading === oferta.id}
                                                    >
                                                        <SelectTrigger className="w-32">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="PENDING">PENDING</SelectItem>
                                                            <SelectItem value="SELECTED">SELECTED</SelectItem>
                                                            <SelectItem value="REJECTED">REJECTED</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </td>
                                                <td className="p-4 text-sm">
                                                    {format(new Date(oferta.createdAt), 'dd/MM/yyyy', { locale: es })}
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex gap-2">
                                                        <Button
                                                            size="sm"
                                                            variant="destructive"
                                                            onClick={() => setDeleteDialog({
                                                                open: true,
                                                                type: 'oferta',
                                                                id: oferta.id,
                                                                name: `Oferta de ${oferta.tienda?.user?.name}`,
                                                            })}
                                                            disabled={actionLoading === oferta.id}
                                                        >
                                                            <Trash2 className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {ofertas.length === 0 && (
                                    <div className="text-center py-8 text-muted-foreground">
                                        No hay ofertas registradas
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Pedidos Tab */}
                <TabsContent value="pedidos" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl">Pedidos</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left p-4 text-sm font-medium text-muted-foreground">ID</th>
                                            <th className="text-left p-4 text-sm font-medium text-muted-foreground">Taller</th>
                                            <th className="text-left p-4 text-sm font-medium text-muted-foreground">Tienda</th>
                                            <th className="text-left p-4 text-sm font-medium text-muted-foreground">Total</th>
                                            <th className="text-left p-4 text-sm font-medium text-muted-foreground">Estado</th>
                                            <th className="text-left p-4 text-sm font-medium text-muted-foreground">Fecha</th>
                                            <th className="text-left p-4 text-sm font-medium text-muted-foreground">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pedidos.map((pedido) => (
                                            <tr key={pedido.id} className="border-b last:border-0 hover:bg-muted/50">
                                                <td className="p-4 text-sm font-mono">{pedido.id.slice(0, 8)}</td>
                                                <td className="p-4">{pedido.taller?.user?.name || 'N/A'}</td>
                                                <td className="p-4">{pedido.tienda?.user?.name || 'N/A'}</td>
                                                <td className="p-4">${pedido.total?.toLocaleString() || 0}</td>
                                                <td className="p-4">
                                                    <Select
                                                        value={pedido.status}
                                                        onValueChange={(val) => handleStatusChange('pedido', pedido.id, val)}
                                                        disabled={actionLoading === pedido.id}
                                                    >
                                                        <SelectTrigger className="w-36">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="PENDIENTE">PENDIENTE</SelectItem>
                                                            <SelectItem value="CONFIRMADO">CONFIRMADO</SelectItem>
                                                            <SelectItem value="ENTREGADO">ENTREGADO</SelectItem>
                                                            <SelectItem value="CANCELADO">CANCELADO</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </td>
                                                <td className="p-4 text-sm">
                                                    {format(new Date(pedido.createdAt), 'dd/MM/yyyy', { locale: es })}
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex gap-2">
                                                        <Button
                                                            size="sm"
                                                            variant="destructive"
                                                            onClick={() => setDeleteDialog({
                                                                open: true,
                                                                type: 'pedido',
                                                                id: pedido.id,
                                                                name: `Pedido #${pedido.id.slice(0, 8)}`,
                                                            })}
                                                            disabled={actionLoading === pedido.id}
                                                        >
                                                            <Trash2 className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {pedidos.length === 0 && (
                                    <div className="text-center py-8 text-muted-foreground">
                                        No hay pedidos registrados
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirmar Eliminación</DialogTitle>
                        <DialogDescription>
                            ¿Estás seguro de que deseas eliminar <strong>{deleteDialog.name}</strong>?
                            Esta acción no se puede deshacer.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDeleteDialog({ open: false, type: '', id: '', name: '' })}
                            disabled={actionLoading !== null}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={actionLoading !== null}
                        >
                            {actionLoading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    Eliminando...
                                </>
                            ) : (
                                <>
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Eliminar
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
