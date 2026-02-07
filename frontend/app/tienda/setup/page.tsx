'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { tiendasAPI } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import { DEPARTAMENTOS_COLOMBIA, CIUDADES_PRINCIPALES } from '@/lib/constants'
import '../../auth/login/auth.css'

export default function TiendaSetupPage() {
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
        cobertura: [] as string[],
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setLoading(true)

        try {
            // Validar NIT básico
            if (formData.rut.length < 8) {
                throw new Error('NIT inválido')
            }

            if (formData.cobertura.length === 0) {
                throw new Error('Debes seleccionar al menos un departamento de cobertura')
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
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1>Completa tu Perfil de Tienda</h1>
                    <p>Información necesaria para comenzar a recibir cotizaciones</p>
                </div>

                {error && (
                    <div className="alert alert-error">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="nombre" className="form-label">
                            Nombre de la Tienda *
                        </label>
                        <input
                            id="nombre"
                            type="text"
                            className="form-input"
                            value={formData.nombre}
                            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                            required
                            placeholder="Repuestos El Rápido"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="rut" className="form-label">
                            NIT *
                        </label>
                        <input
                            id="rut"
                            type="text"
                            className="form-input"
                            value={formData.rut}
                            onChange={(e) => setFormData({ ...formData, rut: e.target.value })}
                            required
                            placeholder="900123456-7"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="telefono" className="form-label">
                            Teléfono *
                        </label>
                        <input
                            id="telefono"
                            type="tel"
                            className="form-input"
                            value={formData.telefono}
                            onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                            required
                            placeholder="+57 3001234567"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="direccion" className="form-label">
                            Dirección *
                        </label>
                        <input
                            id="direccion"
                            type="text"
                            className="form-input"
                            value={formData.direccion}
                            onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                            required
                            placeholder="Calle 100 #15-45"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="region" className="form-label">
                            Departamento de la Tienda *
                        </label>
                        <select
                            id="region"
                            className="form-select"
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

                    <div className="form-group">
                        <label htmlFor="ciudad" className="form-label">
                            Ciudad *
                        </label>
                        <select
                            id="ciudad"
                            className="form-select"
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
                        {!formData.region && (
                            <small className="text-secondary">Seleccione primero un departamento</small>
                        )}
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            Departamentos de Cobertura * (Selecciona todos los departamentos donde entregas)
                        </label>
                        <div style={{
                            maxHeight: '200px',
                            overflowY: 'auto',
                            border: '1px solid var(--color-border)',
                            borderRadius: 'var(--radius-md)',
                            padding: 'var(--space-3)'
                        }}>
                            {DEPARTAMENTOS_COLOMBIA.map(departamento => (
                                <label key={departamento} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 'var(--space-2)',
                                    padding: 'var(--space-2)',
                                    cursor: 'pointer'
                                }}>
                                    <input
                                        type="checkbox"
                                        checked={formData.cobertura.includes(departamento)}
                                        onChange={() => handleCoberturaChange(departamento)}
                                    />
                                    <span>{departamento}</span>
                                </label>
                            ))}
                        </div>
                        <p className="text-sm text-secondary" style={{ marginTop: '8px' }}>
                            {formData.cobertura.length} departamento(s) seleccionado(s)
                        </p>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-block"
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
