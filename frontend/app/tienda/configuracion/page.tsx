'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import ProtectedRoute from '@/components/ProtectedRoute'
import Navbar from '@/components/Navbar'
import { tiendasAPI } from '@/lib/api'
import { CATEGORIAS_REPUESTOS } from '@/lib/constants'
import { getDepartamentos, getCiudades, type Departamento } from '@/lib/colombia-locations'




export default function TiendaConfiguracionPage() {
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
        cobertura: [] as string[], // This will store departamentos
        categorias: [] as string[],
    })
    const [availableCities, setAvailableCities] = useState<readonly string[]>([])

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
            const data = await tiendasAPI.getMe()
            setFormData({
                nombre: data.nombre || '',
                rut: data.rut || '',
                telefono: data.telefono || '',
                direccion: data.direccion || '',
                ciudad: data.ciudad || '',
                region: data.region || '',
                cobertura: data.cobertura || [],
                categorias: data.categorias || [],
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
            await tiendasAPI.updateMe(formData)
            alert('Perfil actualizado exitosamente')
        } catch (error: any) {
            alert(error.response?.data?.message || 'Error al actualizar perfil')
        } finally {
            setSaving(false)
        }
    }

    const toggleArrayItem = (field: 'cobertura' | 'categorias', value: string) => {
        setFormData(prev => {
            const current = prev[field]
            const updated = current.includes(value)
                ? current.filter(item => item !== value)
                : [...current, value]
            return { ...prev, [field]: updated }
        })
    }

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner" style={{ width: '40px', height: '40px' }}></div>
            </div>
        )
    }

    return (
        <ProtectedRoute allowedRoles={['TIENDA']}>
            <div className="dashboard-layout">
                <Navbar role="TIENDA" />

                <main className="dashboard-main">
                    <div className="container">
                        <div className="dashboard-header">
                            <div>
                                <h1>Configuración de la Tienda</h1>
                                <p className="text-secondary">Gestiona tu perfil, cobertura y categorías</p>
                            </div>
                        </div>

                        <div className="detail-page" style={{ maxWidth: '800px', margin: '0 auto' }}>
                            <form onSubmit={handleSubmit}>
                                {/* Basic Info */}
                                <div className="detail-section">
                                    <h3>Información General</h3>
                                    <div className="form-grid">
                                        <div className="form-group">
                                            <label className="form-label">Nombre de la Tienda</label>
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
                                    <h3>Dirección</h3>
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
                                            <label className="form-label">Departamento Principal</label>
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

                                {/* Categories */}
                                <div className="detail-section">
                                    <h3>Categorías de Repuestos</h3>
                                    <p className="text-secondary text-sm" style={{ marginBottom: '1rem' }}>
                                        Selecciona las categorías de productos que vendes. Recibirás cotizaciones basadas en esto.
                                    </p>
                                    <div className="checkbox-grid">
                                        {CATEGORIAS_REPUESTOS.map(cat => (
                                            <label key={cat} className="checkbox-card">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.categorias.includes(cat)}
                                                    onChange={() => toggleArrayItem('categorias', cat)}
                                                />
                                                <span>{cat}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Coverage */}
                                <div className="detail-section">
                                    <h3>Cobertura de Envíos</h3>
                                    <p className="text-secondary text-sm" style={{ marginBottom: '1rem' }}>
                                        Selecciona los departamentos donde realizas despachos.
                                    </p>
                                    <div className="checkbox-grid">
                                        {getDepartamentos().map(dept => (
                                            <label key={dept} className="checkbox-card">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.cobertura.includes(dept)}
                                                    onChange={() => toggleArrayItem('cobertura', dept)}
                                                />
                                                <span>{dept}</span>
                                            </label>
                                        ))}
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
                .checkbox-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
                    gap: 1rem;
                }
                .checkbox-card {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 10px;
                    border: 1px solid var(--color-border);
                    border-radius: var(--radius-md);
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .checkbox-card:hover {
                    background: var(--color-bg-secondary);
                    border-color: var(--color-primary);
                }
                .checkbox-card input {
                    width: 18px;
                    height: 18px;
                }
            `}</style>
        </ProtectedRoute>
    )
}
