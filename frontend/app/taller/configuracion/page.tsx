'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import ProtectedRoute from '@/components/ProtectedRoute'
import Navbar from '@/components/Navbar'
import { talleresAPI } from '@/lib/api'
import { getDepartamentos, getCiudades, type Departamento } from '@/lib/colombia-locations'

export default function TallerConfiguracionPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [formData, setFormData] = useState({
        nombre: '',
        rut: '',
        telefono: '',
        direccion: '',
        ciudad: '',
        region: '', // This will store the departamento
    })
    const [availableCities, setAvailableCities] = useState<string[]>([])

    useEffect(() => {
        loadProfile()
    }, [])

    // Update available cities when department changes
    useEffect(() => {
        if (formData.region) {
            const cities = getCiudades(formData.region as Departamento)
            setAvailableCities(cities)
            // If current city is not in new department, reset it
            if (formData.ciudad && !cities.includes(formData.ciudad)) {
                setFormData(prev => ({ ...prev, ciudad: '' }))
            }
        } else {
            setAvailableCities([])
            setFormData(prev => ({ ...prev, ciudad: '' }))
        }
    }, [formData.region])

    const loadProfile = async () => {
        try {
            const data = await talleresAPI.getMe()
            setFormData({
                nombre: data.nombre || '',
                rut: data.rut || '',
                telefono: data.telefono || '',
                direccion: data.direccion || '',
                ciudad: data.ciudad || '',
                region: data.region || '',
            })
        } catch (error) {
            console.error('Error loading profile:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        try {
            await talleresAPI.updateMe(formData)
            alert('Perfil actualizado exitosamente')
        } catch (error: any) {
            alert(error.response?.data?.message || 'Error al actualizar perfil')
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner" style={{ width: '40px', height: '40px' }}></div>
            </div>
        )
    }

    return (
        <ProtectedRoute allowedRoles={['TALLER']}>
            <div className="dashboard-layout">
                <Navbar role="TALLER" />

                <main className="dashboard-main">
                    <div className="container">
                        <div className="dashboard-header">
                            <div>
                                <h1>Configuración del Taller</h1>
                                <p className="text-secondary">Gestiona tu perfil y datos de contacto</p>
                            </div>
                        </div>

                        <div className="detail-page" style={{ maxWidth: '800px', margin: '0 auto' }}>
                            <form onSubmit={handleSubmit}>
                                {/* Basic Info */}
                                <div className="detail-section">
                                    <h3>Información General</h3>
                                    <div className="form-grid">
                                        <div className="form-group">
                                            <label className="form-label">Nombre del Taller</label>
                                            <input
                                                type="text"
                                                className="form-input"
                                                value={formData.nombre}
                                                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">RUT</label>
                                            <input
                                                type="text"
                                                className="form-input"
                                                value={formData.rut}
                                                onChange={(e) => setFormData({ ...formData, rut: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Teléfono</label>
                                            <input
                                                type="tel"
                                                className="form-input"
                                                value={formData.telefono}
                                                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Address */}
                                <div className="detail-section">
                                    <h3>Dirección del Taller</h3>
                                    <div className="form-grid">
                                        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                            <label className="form-label">Calle y Número</label>
                                            <input
                                                type="text"
                                                className="form-input"
                                                value={formData.direccion}
                                                onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Departamento</label>
                                            <select
                                                className="form-select"
                                                value={formData.region}
                                                onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                                                required
                                            >
                                                <option value="">Seleccionar departamento...</option>
                                                {getDepartamentos().map(dept => (
                                                    <option key={dept} value={dept}>{dept}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Ciudad</label>
                                            <select
                                                className="form-select"
                                                value={formData.ciudad}
                                                onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })}
                                                required
                                                disabled={!formData.region}
                                            >
                                                <option value="">
                                                    {formData.region ? 'Seleccionar ciudad...' : 'Primero seleccione departamento'}
                                                </option>
                                                {availableCities.map(city => (
                                                    <option key={city} value={city}>{city}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="form-actions" style={{ marginTop: '2rem' }}>
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={saving}
                                        style={{ width: '100%', padding: '1rem' }}
                                    >
                                        {saving ? 'Guardando...' : 'Guardar Cambios'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </main>
            </div>
            <style jsx>{`
                .form-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 1rem;
                }
            `}</style>
        </ProtectedRoute>
    )
}
