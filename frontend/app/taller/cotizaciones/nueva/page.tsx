'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { cotizacionesAPI } from '@/lib/api'
import { CATEGORIAS_REPUESTOS } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, ArrowRight, Plus, Trash2, CheckCircle, Upload, Image as ImageIcon, Loader2 } from 'lucide-react'

type CotizacionItem = {
    id: string
    nombre: string
    descripcion?: string
    marca?: string
    cantidad: number
    imagenUrl?: string
}

export default function NuevaCotizacionPage() {
    const router = useRouter()
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState<Record<string, boolean>>({})

    // Step 1: Vehicle Data
    const [vehicleData, setVehicleData] = useState({
        titulo: '',
        descripcion: '',
        categoria: 'Frenos', // Default category
        marca: '',
        modelo: '',
        anio: new Date().getFullYear(),
        patente: ''
    })

    // Step 2: Items
    const [items, setItems] = useState<CotizacionItem[]>([
        { id: Date.now().toString(), nombre: '', descripcion: '', marca: '', cantidad: 1 }
    ])

    const addItem = () => {
        setItems([
            ...items,
            { id: Date.now().toString(), nombre: '', descripcion: '', marca: '', cantidad: 1 }
        ])
    }

    const removeItem = (id: string) => {
        if (items.length > 1) {
            setItems(items.filter(item => item.id !== id))
        }
    }

    const updateItem = (id: string, field: keyof CotizacionItem, value: any) => {
        setItems(items.map(item =>
            item.id === id ? { ...item, [field]: value } : item
        ))
    }

    const handleImageUpload = async (id: string, file: File) => {
        if (!file) return

        try {
            setUploading(prev => ({ ...prev, [id]: true }))

            // 1. Get Presigned URL
            const { uploadUrl, publicUrl } = await cotizacionesAPI.getUploadUrl(file.name, file.type)

            // 2. Upload to R2
            await fetch(uploadUrl, {
                method: 'PUT',
                body: file,
                headers: { 'Content-Type': file.type }
            })

            // 3. Save Public URL
            updateItem(id, 'imagenUrl', publicUrl)
        } catch (error) {
            console.error('Upload error:', error)
            alert('Error al subir la imagen')
        } finally {
            setUploading(prev => ({ ...prev, [id]: false }))
        }
    }

    const handleSubmit = async () => {
        try {
            setLoading(true)

            // Validate
            if (!vehicleData.titulo || !vehicleData.marca || !vehicleData.modelo) {
                alert('Por favor completa los campos obligatorios del vehículo')
                return
            }

            const hasValidItems = items.some(item => item.nombre.trim())
            if (!hasValidItems) {
                alert('Agrega al menos un repuesto')
                return
            }

            // Prepare data
            const cotizacionData = {
                ...vehicleData,
                items: items.filter(item => item.nombre.trim()).map(item => ({
                    nombre: item.nombre,
                    descripcion: item.descripcion || '',
                    marca: item.marca || '',
                    cantidad: item.cantidad,
                    imagenUrl: item.imagenUrl || undefined
                }))
            }

            await cotizacionesAPI.create(cotizacionData)

            alert('¡Cotización creada exitosamente!')
            router.push('/taller/cotizaciones')
        } catch (error: any) {
            console.error('Error creating quotation:', error)
            alert(error.response?.data?.message || 'Error al crear cotización')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    onClick={() => router.back()}
                    className="gap-2"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Volver
                </Button>
                <div>
                    <h1 className="text-3xl font-bold font-sans text-[#F8FAFC]">Nueva Cotización</h1>
                    <p className="text-muted-foreground mt-1">Paso {step} de 3</p>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-border/20 rounded-full h-2">
                <div
                    className="bg-[#F97316] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(step / 3) * 100}%` }}
                />
            </div>

            {/* Step 1: Vehicle Data */}
            {step === 1 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Datos del Vehículo</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="titulo">Título de la Cotización *</Label>
                                <Input
                                    id="titulo"
                                    placeholder="Ej: Repuestos Toyota Corolla 2015"
                                    value={vehicleData.titulo}
                                    onChange={(e) => setVehicleData({ ...vehicleData, titulo: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="patente">Patente (Opcional)</Label>
                                <Input
                                    id="patente"
                                    placeholder="ABC123"
                                    value={vehicleData.patente}
                                    onChange={(e) => setVehicleData({ ...vehicleData, patente: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="space-y-2">
                                <Label htmlFor="marca">Marca *</Label>
                                <Input
                                    id="marca"
                                    placeholder="Toyota"
                                    value={vehicleData.marca}
                                    onChange={(e) => setVehicleData({ ...vehicleData, marca: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="modelo">Modelo *</Label>
                                <Input
                                    id="modelo"
                                    placeholder="Corolla"
                                    value={vehicleData.modelo}
                                    onChange={(e) => setVehicleData({ ...vehicleData, modelo: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="anio">Año *</Label>
                                <Input
                                    id="anio"
                                    type="number"
                                    min="1900"
                                    max={new Date().getFullYear() + 1}
                                    value={vehicleData.anio}
                                    onChange={(e) => setVehicleData({ ...vehicleData, anio: parseInt(e.target.value) })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="descripcion">Descripción (Opcional)</Label>
                            <textarea
                                id="descripcion"
                                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Información adicional sobre el trabajo o los repuestos necesarios..."
                                value={vehicleData.descripcion}
                                onChange={(e) => setVehicleData({ ...vehicleData, descripcion: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="categoria">Categoría *</Label>
                            <Select
                                value={vehicleData.categoria}
                                onValueChange={(value) => setVehicleData({ ...vehicleData, categoria: value })}
                            >
                                <SelectTrigger id="categoria">
                                    <SelectValue placeholder="Selecciona una categoría" />
                                </SelectTrigger>
                                <SelectContent>
                                    {CATEGORIAS_REPUESTOS.map((cat) => (
                                        <SelectItem key={cat} value={cat}>
                                            {cat}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <p className="text-xs text-muted-foreground">
                                Selecciona la categoría principal de los repuestos que necesitas
                            </p>
                        </div>

                        <div className="flex justify-end">
                            <Button
                                onClick={() => setStep(2)}
                                className="gap-2"
                                disabled={!vehicleData.titulo || !vehicleData.marca || !vehicleData.modelo}
                            >
                                Siguiente
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Step 2: Items */}
            {step === 2 && (
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Repuestos Solicitados</CardTitle>
                            <Button
                                variant="outline"
                                onClick={addItem}
                                className="gap-2"
                            >
                                <Plus className="h-4 w-4" />
                                Agregar Repuesto
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {items.map((item, index) => (
                            <div key={item.id} className="p-4 border rounded-lg space-y-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-medium">Repuesto #{index + 1}</h4>
                                    {items.length > 1 && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeItem(item.id)}
                                            className="text-destructive hover:text-destructive"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>

                                <div className="grid gap-3 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label>Nombre del Repuesto *</Label>
                                        <Input
                                            placeholder="Ej: Pastillas de freno delanteras"
                                            value={item.nombre}
                                            onChange={(e) => updateItem(item.id, 'nombre', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Marca (Opcional)</Label>
                                        <Input
                                            placeholder="Ej: Brembo, Bosch"
                                            value={item.marca}
                                            onChange={(e) => updateItem(item.id, 'marca', e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-3 md:grid-cols-3">
                                    <div className="space-y-2 md:col-span-2">
                                        <Label>Descripción (Opcional)</Label>
                                        <Input
                                            placeholder="Detalles adicionales..."
                                            value={item.descripcion}
                                            onChange={(e) => updateItem(item.id, 'descripcion', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Cantidad *</Label>
                                        <Input
                                            type="number"
                                            min="1"
                                            value={item.cantidad}
                                            onChange={(e) => updateItem(item.id, 'cantidad', parseInt(e.target.value) || 1)}
                                        />
                                    </div>
                                </div>

                                {/* Image Upload */}
                                <div className="space-y-2">
                                    <Label>Imagen de Referencia</Label>
                                    <div className="flex items-center gap-4">
                                        {item.imagenUrl ? (
                                            <div className="relative h-20 w-20 rounded-md overflow-hidden border bg-[#0F172A]/50 group">
                                                <img
                                                    src={item.imagenUrl}
                                                    alt="Preview"
                                                    className="h-full w-full object-cover"
                                                />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <Button
                                                        variant="destructive"
                                                        size="icon"
                                                        className="h-6 w-6"
                                                        onClick={() => updateItem(item.id, 'imagenUrl', undefined)}
                                                    >
                                                        <Trash2 className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className={`
                                                flex-1 border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center gap-2
                                                hover:bg-[#0F172A]/50 transition-colors cursor-pointer
                                                ${uploading[item.id] ? 'opacity-50 pointer-events-none' : ''}
                                            `}>
                                                <div className="relative w-full text-center">
                                                    <Input
                                                        type="file"
                                                        accept="image/*"
                                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0]
                                                            if (file) handleImageUpload(item.id, file)
                                                        }}
                                                        disabled={uploading[item.id]}
                                                    />
                                                    <div className="flex flex-col items-center">
                                                        {uploading[item.id] ? (
                                                            <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                                        ) : (
                                                            <ImageIcon className="h-6 w-6 text-muted-foreground" />
                                                        )}
                                                        <span className="text-xs text-muted-foreground mt-1">
                                                            {uploading[item.id] ? 'Subiendo...' : 'Click para subir imagen'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className="flex justify-between pt-4">
                            <Button
                                variant="outline"
                                onClick={() => setStep(1)}
                                className="gap-2"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Anterior
                            </Button>
                            <Button
                                onClick={() => setStep(3)}
                                className="gap-2"
                                disabled={!items.some(item => item.nombre.trim())}
                            >
                                Siguiente
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Step 3: Confirmation */}
            {step === 3 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Confirmar Cotización</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Vehicle Summary */}
                        <div>
                            <h3 className="font-semibold mb-3">Datos del Vehículo</h3>
                            <div className="grid gap-2 text-sm">
                                <p><span className="text-muted-foreground">Título:</span> {vehicleData.titulo}</p>
                                <p><span className="text-muted-foreground">Categoría:</span> {vehicleData.categoria}</p>
                                <p><span className="text-muted-foreground">Vehículo:</span> {vehicleData.marca} {vehicleData.modelo} ({vehicleData.anio})</p>
                                {vehicleData.patente && <p><span className="text-muted-foreground">Patente:</span> {vehicleData.patente}</p>}
                                {vehicleData.descripcion && <p><span className="text-muted-foreground">Descripción:</span> {vehicleData.descripcion}</p>}
                            </div>
                        </div>

                        {/* Items Summary */}
                        <div>
                            <h3 className="font-semibold mb-3">Repuestos Solicitados ({items.filter(i => i.nombre.trim()).length})</h3>
                            <div className="space-y-2">
                                {items.filter(item => item.nombre.trim()).map((item, index) => (
                                    <div key={item.id} className="p-3 bg-[#0F172A]/50 border rounded-lg text-sm flex gap-3">
                                        {item.imagenUrl && (
                                            <div className="h-16 w-16 flex-shrink-0 bg-white rounded border overflow-hidden">
                                                <img src={item.imagenUrl} alt={item.nombre} className="h-full w-full object-contain" />
                                            </div>
                                        )}
                                        <div>
                                            <p className="font-medium">{index + 1}. {item.nombre}</p>
                                            {item.marca && <p className="text-muted-foreground">Marca: {item.marca}</p>}
                                            {item.descripcion && <p className="text-muted-foreground">{item.descripcion}</p>}
                                            <p className="text-muted-foreground">Cantidad: {item.cantidad}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-between pt-4">
                            <Button
                                variant="outline"
                                onClick={() => setStep(2)}
                                className="gap-2"
                                disabled={loading}
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Anterior
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="gap-2"
                                variant="glow"
                            >
                                {loading ? (
                                    <>Creando...</>
                                ) : (
                                    <>
                                        <CheckCircle className="h-4 w-4" />
                                        Crear Cotización
                                    </>
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
