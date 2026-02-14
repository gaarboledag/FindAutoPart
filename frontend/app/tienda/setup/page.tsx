'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { tiendasAPI } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import { DEPARTAMENTOS_COLOMBIA, CIUDADES_PRINCIPALES, CATEGORIAS_REPUESTOS } from '@/lib/constants'
import { ChevronRight, ChevronLeft, Check, Store, Tag } from 'lucide-react'
import '../../auth/login/auth.css'

export default function TiendaSetupPage() {
    const router = useRouter()
    const { user } = useAuthStore()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [step, setStep] = useState(1)

    const [formData, setFormData] = useState({
        nombre: '',
        rut: '',
        telefono: '',
        direccion: '',
        ciudad: '',
        region: '',
        cobertura: [] as string[],
        categorias: [] as string[],
    })

    const ciudadesDisponibles = formData.region ? (CIUDADES_PRINCIPALES[formData.region as keyof typeof CIUDADES_PRINCIPALES] || []) : []

    const handleCoberturaChange = (region: string) => {
        if (formData.cobertura.includes(region)) {
            setFormData({
                ...formData,
                cobertura: formData.cobertura.filter(r => r !== region),
            })
        } else {
            setFormData({
                ...formData,
                cobertura: [...formData.cobertura, region],
            })
        }
    }

    const handleCategoriaChange = (categoria: string) => {
        if (formData.categorias.includes(categoria)) {
            setFormData({
                ...formData,
                categorias: formData.categorias.filter(c => c !== categoria),
            })
        } else {
            setFormData({
                ...formData,
                categorias: [...formData.categorias, categoria],
            })
        }
    }

    const nextStep = () => {
        setError(null)
        if (step === 1) {
            // Validate step 1
            if (!formData.nombre || !formData.rut || !formData.telefono || !formData.direccion || !formData.ciudad || !formData.region) {
                setError('Por favor completa todos los campos obligatorios')
                return
            }
            if (formData.rut.length < 8) {
                setError('El NIT debe tener al menos 8 caracteres')
                return
            }
            if (formData.cobertura.length === 0) {
                setError('Debes seleccionar al menos un departamento de cobertura')
                return
            }
            setStep(2)
        }
    }

    const prevStep = () => {
        setError(null)
        setStep(step - 1)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setLoading(true)

        try {
            if (formData.categorias.length === 0) {
                throw new Error('Debes seleccionar al menos una categoría de repuestos')
            }

            await tiendasAPI.create(formData)

            // Redirigir al dashboard
            router.push('/tienda')
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'Error al crear perfil')
            setLoading(false)
        }
    }

    if (!user || user.role !== 'TIENDA') {
        router.push('/auth/login')
        return null
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className={`auth-card w-full max-w-2xl transition-all duration-300 ${step === 2 ? 'max-w-4xl' : ''}`}>
                <div className="auth-header mb-8 text-center">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-light to-secondary mb-2">
                        {step === 1 ? 'Completa tu Perfil' : 'Selecciona tus Categorías'}
                    </h1>
                    <p className="text-muted-foreground">
                        {step === 1 ? 'Información básica de tu negocio' : '¿Qué tipos de repuestos ofreces?'}
                    </p>

                    {/* Progress Steps */}
                    <div className="flex justify-center mt-6 gap-4">
                        <div className={`flex items-center gap-2 ${step >= 1 ? 'text-secondary' : 'text-muted-foreground'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 1 ? 'border-secondary bg-secondary/10' : 'border-muted-foreground'}`}>1</div>
                            <span className="text-sm font-medium">Información</span>
                        </div>
                        <div className={`h-0.5 w-12 bg-border self-center ${step > 1 ? 'bg-secondary' : ''}`} />
                        <div className={`flex items-center gap-2 ${step >= 2 ? 'text-secondary' : 'text-muted-foreground'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 2 ? 'border-secondary bg-secondary/10' : 'border-muted-foreground'}`}>2</div>
                            <span className="text-sm font-medium">Categorías</span>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-md mb-6 flex items-center gap-2">
                        <span className="text-sm">{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {step === 1 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="nombre" className="text-sm font-medium text-foreground">
                                        Nombre de la Tienda *
                                    </label>
                                    <div className="relative">
                                        <Store className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <input
                                            id="nombre"
                                            type="text"
                                            className="w-full pl-9 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            value={formData.nombre}
                                            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                            required
                                            placeholder="Ej: Repuestos El Rápido"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="rut" className="text-sm font-medium text-foreground">
                                        NIT *
                                    </label>
                                    <input
                                        id="rut"
                                        type="text"
                                        className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                        value={formData.rut}
                                        onChange={(e) => setFormData({ ...formData, rut: e.target.value })}
                                        required
                                        placeholder="Ej: 900.123.456-7"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="telefono" className="text-sm font-medium text-foreground">
                                        Teléfono *
                                    </label>
                                    <input
                                        id="telefono"
                                        type="tel"
                                        className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                        value={formData.telefono}
                                        onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                                        required
                                        placeholder="+57 300 123 4567"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="direccion" className="text-sm font-medium text-foreground">
                                        Dirección *
                                    </label>
                                    <input
                                        id="direccion"
                                        type="text"
                                        className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                        value={formData.direccion}
                                        onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                                        required
                                        placeholder="Calle 100 #15-45"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="region" className="text-sm font-medium text-foreground">
                                        Departamento Base *
                                    </label>
                                    <select
                                        id="region"
                                        className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                        value={formData.region}
                                        onChange={(e) => {
                                            setFormData({ ...formData, region: e.target.value, ciudad: '' })
                                        }}
                                        required
                                    >
                                        <option value="">Selecciona un departamento</option>
                                        {DEPARTAMENTOS_COLOMBIA.map(r => (
                                            <option key={r} value={r}>{r}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="ciudad" className="text-sm font-medium text-foreground">
                                        Ciudad Base *
                                    </label>
                                    <select
                                        id="ciudad"
                                        className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
                                        value={formData.ciudad}
                                        onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })}
                                        required
                                        disabled={!formData.region}
                                    >
                                        <option value="">Selecciona una ciudad</option>
                                        {ciudadesDisponibles.map(city => (
                                            <option key={city} value={city}>{city}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">
                                    Zona de Cobertura * (Donde realizas entregas)
                                </label>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-[200px] overflow-y-auto p-3 border rounded-md bg-card/50">
                                    {DEPARTAMENTOS_COLOMBIA.map(departamento => (
                                        <label key={departamento} className="flex items-center gap-2 p-1.5 rounded hover:bg-muted/50 cursor-pointer transition-colors">
                                            <input
                                                type="checkbox"
                                                className="h-4 w-4 rounded border-primary text-primary focus:ring-primary"
                                                checked={formData.cobertura.includes(departamento)}
                                                onChange={() => handleCoberturaChange(departamento)}
                                            />
                                            <span className="text-sm">{departamento}</span>
                                        </label>
                                    ))}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {formData.cobertura.length} departamento(s) seleccionado(s)
                                </p>
                            </div>

                            <div className="flex justify-end pt-4">
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-8 py-2 rounded-md font-medium transition-colors"
                                >
                                    Siguiente
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {CATEGORIAS_REPUESTOS.map((categoria) => {
                                    const isSelected = formData.categorias.includes(categoria)
                                    return (
                                        <div
                                            key={categoria}
                                            onClick={() => handleCategoriaChange(categoria)}
                                            className={`
                                                cursor-pointer rounded-lg border-2 p-4 transition-all duration-200 relative group
                                                ${isSelected
                                                    ? 'border-secondary bg-secondary/10 shadow-[0_0_10px_rgba(0,194,255,0.2)]'
                                                    : 'border-border bg-card hover:border-[#F97316]/50 hover:bg-muted/50'}
                                            `}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Tag className={`h-4 w-4 ${isSelected ? 'text-secondary' : 'text-muted-foreground'}`} />
                                                    <span className={`font-medium ${isSelected ? 'text-foreground' : 'text-muted-foreground'}`}>
                                                        {categoria}
                                                    </span>
                                                </div>
                                                {isSelected && (
                                                    <div className="h-5 w-5 bg-secondary rounded-full flex items-center justify-center animate-in zoom-in duration-200">
                                                        <Check className="h-3 w-3 text-secondary-foreground" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            <div className="flex items-center justify-between pt-6 border-t border-border/50">
                                <button
                                    type="button"
                                    onClick={prevStep}
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                    Atrás
                                </button>

                                <button
                                    type="submit"
                                    className="flex items-center gap-2 bg-gradient-to-r from-secondary to-blue-500 text-white hover:opacity-90 h-11 px-8 rounded-md font-medium transition-all shadow-lg shadow-secondary/20"
                                    disabled={loading || formData.categorias.length === 0}
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner"></span>
                                            Guardando...
                                        </>
                                    ) : (
                                        <>
                                            Completar Registro
                                            <Check className="h-4 w-4" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </div>
    )
}
