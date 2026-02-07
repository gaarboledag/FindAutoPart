'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { talleresAPI } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import { DEPARTAMENTOS_COLOMBIA, CIUDADES_PRINCIPALES } from '@/lib/constants'
import '../../auth/login/auth.css'

export default function TallerSetupPage() {
    const router = useRouter()
    const { user } = useAuthStore()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [formData, setFormData] = useState({
        nombre: '',
        rut: '',
        telefono: '',
        direccion: '',
        ciudad: '',
        region: '',
    })

    const ciudadesDisponibles = formData.region ? (CIUDADES_PRINCIPALES[formData.region as keyof typeof CIUDADES_PRINCIPALES] || []) : []

    useEffect(() => {
        // Verificar si el usuario ya tiene perfil completo
        if (!user) {
            router.push('/auth/login')
            return
        }

        if (user.role !== 'TALLER') {
            router.push('/auth/login')
            return
        }

        // Verificar si ya tiene perfil
        talleresAPI.getMe()
            .then(() => {
                router.push('/taller')
            })
            .catch(() => {
                // No tiene perfil, continuar con setup
            })
    }, [user, router])

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setLoading(true)

        try {
            // Validar RUT básico
            if (formData.rut.length < 8) {
                throw new Error('RUT inválido')
            }

            await talleresAPI.create(formData)

            // Redirigir al dashboard
            router.push('/taller')
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'Error al crear perfil')
            setLoading(false)
        }
    }

    if (!user || user.role !== 'TALLER') {
        return null
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1>Completa tu Perfil de Taller</h1>
                    <p>Información necesaria para comenzar a solicitar cotizaciones</p>
                </div>

                {error && (
                    <div className="alert alert-error">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="nombre" className="form-label">
                            Nombre del Taller *
                        </label>
                        <input
                            id="nombre"
                            name="nombre"
                            type="text"
                            className="form-input"
                            value={formData.nombre}
                            onChange={(e) => handleChange('nombre', e.target.value)}
                            required
                            autoComplete="off"
                            placeholder="Taller Mecánico Los Andes"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="rut" className="form-label">
                            NIT *
                        </label>
                        <input
                            id="rut"
                            name="rut"
                            type="text"
                            className="form-input"
                            value={formData.rut}
                            onChange={(e) => handleChange('rut', e.target.value)}
                            required
                            autoComplete="off"
                            placeholder="900123456-7"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="telefono" className="form-label">
                            Teléfono *
                        </label>
                        <input
                            id="telefono"
                            name="telefono"
                            type="tel"
                            className="form-input"
                            value={formData.telefono}
                            onChange={(e) => handleChange('telefono', e.target.value)}
                            required
                            autoComplete="off"
                            placeholder="+57 3001234567"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="direccion" className="form-label">
                            Dirección *
                        </label>
                        <input
                            id="direccion"
                            name="direccion"
                            type="text"
                            className="form-input"
                            value={formData.direccion}
                            onChange={(e) => handleChange('direccion', e.target.value)}
                            required
                            autoComplete="off"
                            placeholder="Calle 100 #15-45"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="region" className="form-label">
                            Departamento *
                        </label>
                        <select
                            id="region"
                            name="region"
                            className="form-select"
                            value={formData.region}
                            onChange={(e) => {
                                handleChange('region', e.target.value)
                                handleChange('ciudad', '') // Reset city when department changes
                            }}
                            required
                        >
                            <option value="">Seleccione un departamento</option>
                            {DEPARTAMENTOS_COLOMBIA.map(dep => (
                                <option key={dep} value={dep}>{dep}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="ciudad" className="form-label">
                            Ciudad *
                        </label>
                        <select
                            id="ciudad"
                            name="ciudad"
                            className="form-select"
                            value={formData.ciudad}
                            onChange={(e) => handleChange('ciudad', e.target.value)}
                            required
                            disabled={!formData.region}
                        >
                            <option value="">Seleccione una ciudad</option>
                            {ciudadesDisponibles.map(city => (
                                <option key={city} value={city}>{city}</option>
                            ))}
                        </select>
                        {!formData.region && (
                            <small className="text-secondary">Seleccione primero un departamento</small>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%' }}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="spinner"></span>
                                Creando perfil...
                            </>
                        ) : (
                            'Completar Registro'
                        )}
                    </button>
                </form>
            </div>
        </div>
    )
}
