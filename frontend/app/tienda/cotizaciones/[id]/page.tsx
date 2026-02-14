'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { cotizacionesAPI, ofertasAPI } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Send, Package, AlertCircle, CheckCircle, Zap, Calendar, MessageSquare } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { ChatWindow } from '@/components/chat/ChatWindow'
import { useAuthStore } from '@/store/authStore'

type OfferItem = {
    nombre: string
    precioUnitario: number
    cantidad: number
    disponible: boolean
}

export default function EnviarOfertaPage() {
    const router = useRouter()
    const params = useParams()
    const id = params.id as string

    const [cotizacion, setCotizacion] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)

    // Offer data
    const [deliveryMode, setDeliveryMode] = useState<'immediate' | 'custom'>('custom')
    const [diasEntrega, setDiasEntrega] = useState(3)
    const [comentarios, setComentarios] = useState('')
    const [items, setItems] = useState<OfferItem[]>([])

    // Chat state
    const [isChatOpen, setIsChatOpen] = useState(false)
    const [currentUserId, setCurrentUserId] = useState('')

    // Auth
    const { user } = useAuthStore()

    useEffect(() => {
        if (user?.id) {
            setCurrentUserId(user.id)
        }

        if (id) {
            loadCotizacion()
        }
    }, [id, user])

    const loadCotizacion = async () => {
        try {
            const data = await cotizacionesAPI.getOne(id)
            setCotizacion(data)

            // Mark as viewed
            try {
                await cotizacionesAPI.markAsViewed(id)
            } catch (error) {
                console.error('Error marking as viewed:', error)
            }

            // Initialize offer items from quotation items
            const initialItems: OfferItem[] = data.items.map((item: any) => ({
                nombre: item.nombre,
                precioUnitario: 0,
                cantidad: item.cantidad,
                disponible: true
            }))
            setItems(initialItems)
        } catch (error) {
            console.error('Error loading quotation:', error)
        } finally {
            setLoading(false)
        }
    }

    const updateItem = (index: number, field: keyof OfferItem, value: any) => {
        const newItems = [...items]
        newItems[index] = { ...newItems[index], [field]: value }
        setItems(newItems)
    }

    const calculateTotal = () => {
        return items.reduce((sum, item) => {
            if (item.disponible && item.precioUnitario > 0) {
                return sum + (item.precioUnitario * item.cantidad)
            }
            return sum
        }, 0)
    }

    const handleDeliveryModeChange = (mode: 'immediate' | 'custom') => {
        setDeliveryMode(mode)
        if (mode === 'immediate') {
            setDiasEntrega(0)
        } else {
            setDiasEntrega(1)
        }
    }

    const handleSubmit = async () => {
        try {
            setSubmitting(true)

            // Validate at least one item is available with price
            const hasValidItems = items.some(item => item.disponible && item.precioUnitario > 0)
            if (!hasValidItems) {
                alert('Debes agregar precio a al menos un repuesto disponible')
                return
            }

            if (deliveryMode === 'custom' && diasEntrega < 1) {
                alert('Los días de entrega deben ser al menos 1 para envíos programados')
                return
            }

            // Prepare offer data
            const offerData = {
                diasEntrega: deliveryMode === 'immediate' ? 0 : diasEntrega,
                comentarios: comentarios || '',
                items: items.map(item => ({
                    nombre: item.nombre,
                    cantidad: item.cantidad,
                    precioUnitario: item.precioUnitario,
                    disponible: item.disponible
                }))
            }

            await ofertasAPI.create(id, offerData)

            alert('¡Oferta enviada exitosamente!')
            router.push('/tienda/ofertas')
        } catch (error: any) {
            console.error('Error submitting offer:', error)
            alert(error.response?.data?.message || 'Error al enviar oferta')
        } finally {
            setSubmitting(false)
        }
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
                <Link href="/tienda/cotizaciones">
                    <Button className="mt-4">Volver a Cotizaciones</Button>
                </Link>
            </div>
        )
    }

    const total = calculateTotal()
    const itemsDisponibles = items.filter(i => i.disponible).length

    return (
        <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-500">
            {/* Chat Window */}
            {isChatOpen && (
                <ChatWindow
                    isOpen={isChatOpen}
                    onClose={() => setIsChatOpen(false)}
                    cotizacionId={cotizacion.id}
                    currentUserId={currentUserId}
                    title={`Chat con ${cotizacion.taller?.nombre || 'El Taller'}`}
                />
            )}

            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/tienda/cotizaciones">
                    <Button variant="ghost" className="gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Volver
                    </Button>
                </Link>
                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold font-sans text-[#F8FAFC]">Enviar Oferta</h1>
                            <p className="text-muted-foreground mt-1">{cotizacion.titulo}</p>
                        </div>
                        <Button
                            variant="outline"
                            onClick={() => setIsChatOpen(true)}
                            className="gap-2"
                        >
                            <MessageSquare className="h-4 w-4 text-blue-400" />
                            Chat con Taller
                        </Button>
                    </div>
                </div>
            </div>

            {/* Quotation Info */}
            <Card className="border-primary/20">
                <CardHeader>
                    <CardTitle>Información de la Solicitud</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-3">
                    <div>
                        <p className="text-xs text-muted-foreground mb-1">Taller</p>
                        <p className="font-medium">{cotizacion.taller?.nombre}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground mb-1">Vehículo</p>
                        <p className="font-medium">{cotizacion.marca} {cotizacion.modelo} ({cotizacion.anio})</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground mb-1">Publicado</p>
                        <p className="font-medium">
                            {format(new Date(cotizacion.createdAt), "d 'de' MMM, yyyy", { locale: es })}
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Offer Form */}
            <Card>
                <CardHeader>
                    <CardTitle>Detalles de tu Oferta</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Items */}
                    <div className="space-y-4">
                        <h3 className="font-semibold">Repuestos y Precios</h3>
                        {items.map((item, index) => (
                            <div key={index} className="p-4 border rounded-lg space-y-3">
                                <div className="flex items-start justify-between gap-4">
                                    {cotizacion.items[index]?.imagenUrl && (
                                        <div
                                            className="h-20 w-20 flex-shrink-0 bg-white rounded border overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                                            onClick={() => window.open(cotizacion.items[index].imagenUrl, '_blank')}
                                            title="Ver imagen completa"
                                        >
                                            <img
                                                src={cotizacion.items[index].imagenUrl}
                                                alt={item.nombre}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <p className="font-medium">{item.nombre}</p>
                                        <p className="text-sm text-muted-foreground">Cantidad: {item.cantidad}</p>
                                        {cotizacion.items[index]?.descripcion && (
                                            <p className="text-sm text-muted-foreground mt-1">{cotizacion.items[index].descripcion}</p>
                                        )}
                                        {cotizacion.items[index]?.marca && (
                                            <p className="text-sm text-muted-foreground">Marca pref: {cotizacion.items[index].marca}</p>
                                        )}
                                    </div>
                                    <label className="flex items-center gap-2 cursor-pointer pt-1">
                                        <input
                                            type="checkbox"
                                            checked={item.disponible}
                                            onChange={(e) => updateItem(index, 'disponible', e.target.checked)}
                                            className="w-4 h-4"
                                        />
                                        <span className="text-sm font-medium">Disponible</span>
                                    </label>
                                </div>

                                {item.disponible && (
                                    <div className="grid gap-3 md:grid-cols-3 pl-0 md:pl-24">
                                        <div className="space-y-2 md:col-span-2">
                                            <Label>Precio Unitario (COP) *</Label>
                                            <Input
                                                type="number"
                                                min="0"
                                                step="100"
                                                placeholder="Ej: 45000"
                                                value={item.precioUnitario || ''}
                                                onChange={(e) => updateItem(index, 'precioUnitario', parseFloat(e.target.value) || 0)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Subtotal</Label>
                                            <div className="h-10 flex items-center px-3 bg-[#0F172A]/50 border rounded text-sm font-medium">
                                                ${(item.precioUnitario * item.cantidad).toLocaleString('es-CO')}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Delivery Options */}
                    <div className="space-y-4">
                        <Label>Tiempo de Entrega</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Option 1: Immediate */}
                            <div
                                onClick={() => handleDeliveryModeChange('immediate')}
                                className={`
                                    cursor-pointer border rounded-lg p-4 flex items-center gap-4 transition-all
                                    ${deliveryMode === 'immediate'
                                        ? 'border-primary bg-primary/5 ring-1 ring-primary'
                                        : 'border-border hover:border-[#F97316]/50'}
                                `}
                            >
                                <div className={`p-2 rounded-full ${deliveryMode === 'immediate' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                    <Zap className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="font-medium">Entrega Inmediata</p>
                                    <p className="text-xs text-muted-foreground">Disponible para recoger/enviar ya</p>
                                </div>
                            </div>

                            {/* Option 2: Custom Days */}
                            <div
                                onClick={() => handleDeliveryModeChange('custom')}
                                className={`
                                    cursor-pointer border rounded-lg p-4 flex items-center gap-4 transition-all
                                    ${deliveryMode === 'custom'
                                        ? 'border-primary bg-primary/5 ring-1 ring-primary'
                                        : 'border-border hover:border-[#F97316]/50'}
                                `}
                            >
                                <div className={`p-2 rounded-full ${deliveryMode === 'custom' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                    <Calendar className="h-5 w-5" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium">Programar Entrega</p>
                                    <p className="text-xs text-muted-foreground">Define los días hábiles</p>
                                </div>
                            </div>
                        </div>

                        {/* Days Input (Only visible if custom) */}
                        {deliveryMode === 'custom' && (
                            <div className="mt-2 animate-in slide-in-from-top-2 fade-in duration-200">
                                <Label htmlFor="diasEntrega">Días Hábiles</Label>
                                <Input
                                    id="diasEntrega"
                                    type="number"
                                    min="1"
                                    className="max-w-[150px] mt-1"
                                    value={diasEntrega}
                                    onChange={(e) => setDiasEntrega(parseInt(e.target.value) || 0)}
                                />
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label>Total de la Oferta</Label>
                        <div className="h-12 flex items-center px-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                            <p className="text-2xl font-bold text-[#22C55E]">
                                ${(total).toLocaleString('es-CO')}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="comentarios">Comentarios Adicionales (Opcional)</Label>
                        <textarea
                            id="comentarios"
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Información adicional sobre disponibilidad, marcas, o condiciones especiales..."
                            value={comentarios}
                            onChange={(e) => setComentarios(e.target.value)}
                        />
                    </div>

                    {/* Summary */}
                    <div className="border-t pt-6">
                        <div className="grid gap-4 md:grid-cols-3 text-sm">
                            <div className="flex items-center gap-2">
                                <Package className="h-4 w-4 text-muted-foreground" />
                                <span><strong>{itemsDisponibles}</strong> de <strong>{items.length}</strong> items disponibles</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span>Cobertura: <strong>{Math.round((itemsDisponibles / items.length) * 100)}%</strong></span>
                            </div>
                            <div className="flex items-center gap-2">
                                {(deliveryMode === 'immediate' || diasEntrega === 0) ? (
                                    <>
                                        <Zap className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                        <span className="font-medium text-yellow-600">¡Entrega Inmediata!</span>
                                    </>
                                ) : (
                                    <>
                                        <AlertCircle className="h-4 w-4 text-blue-500" />
                                        <span>Entrega en <strong>{diasEntrega}</strong> día{diasEntrega !== 1 ? 's' : ''}</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-4">
                        <Link href="/tienda/cotizaciones">
                            <Button variant="outline" disabled={submitting}>
                                Cancelar
                            </Button>
                        </Link>
                        <Button
                            onClick={handleSubmit}
                            disabled={submitting || total === 0}
                            variant="glow"
                            className="gap-2"
                        >
                            {submitting ? (
                                <>Enviando...</>
                            ) : (
                                <>
                                    <Send className="h-4 w-4" />
                                    Enviar Oferta
                                </>
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Info Banner */}
            <Card className="border-blue-500/50 bg-blue-500/5">
                <CardContent className="py-4">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                        <div className="text-sm">
                            <p className="font-medium">Importante</p>
                            <ul className="list-disc list-inside text-muted-foreground mt-1 space-y-1">
                                <li>Solo puedes enviar una oferta por cotización</li>
                                <li>El taller comparará todas las ofertas recibidas</li>
                                <li>Si tu oferta es seleccionada, se creará un pedido automáticamente</li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
