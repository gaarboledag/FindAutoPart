'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useAuthStore } from '@/store/authStore'
import '../login/auth.css'

export default function RegisterPage() {
    const router = useRouter()
    const { register, isLoading, error, setError } = useAuthStore()

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        role: 'TALLER',
    })

    const [formErrors, setFormErrors] = useState<Record<string, string>>({})

    const validateForm = () => {
        const errors: Record<string, string> = {}

        if (formData.password.length < 8) {
            errors.password = 'La contraseña debe tener al menos 8 caracteres'
        }

        if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = 'Las contraseñas no coinciden'
        }

        setFormErrors(errors)
        return Object.keys(errors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        if (!validateForm()) return

        try {
            await register(formData.email, formData.password, formData.role)

            // Redirect based on role
            if (formData.role === 'TALLER') {
                router.push('/taller/setup')
            } else if (formData.role === 'TIENDA') {
                router.push('/tienda/setup')
            }
        } catch (err) {
            console.error('Registration failed:', err)
        }
    }

    return (
        <div className="auth-container">
            <div className="auth-box">
                <div className="auth-header">
                    <h1>Crear Cuenta</h1>
                    <p>Regístrate en FindPartAutopartes</p>
                </div>

                {error && (
                    <div className="alert alert-error">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="role" className="form-label">
                            Tipo de Cuenta
                        </label>
                        <select
                            id="role"
                            className="form-select"
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            required
                        >
                            <option value="TALLER">Taller Automotriz</option>
                            <option value="TIENDA">Tienda de Autopartes</option>
                        </select>
                        <p className="text-sm text-secondary" style={{ marginTop: 'var(--space-2)' }}>
                            {formData.role === 'TALLER'
                                ? 'Solicita cotizaciones y compara precios'
                                : 'Recibe solicitudes y ofrece tus repuestos'}
                        </p>
                    </div>

                    <div className="form-group">
                        <label htmlFor="email" className="form-label">
                            Correo Electrónico
                        </label>
                        <input
                            id="email"
                            type="email"
                            className="form-input"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                            placeholder="tu@email.com"
                            autoComplete="email"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password" className="form-label">
                            Contraseña
                        </label>
                        <input
                            id="password"
                            type="password"
                            className="form-input"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                            placeholder="••••••••"
                            autoComplete="new-password"
                        />
                        {formErrors.password && (
                            <p className="form-error">{formErrors.password}</p>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword" className="form-label">
                            Confirmar Contraseña
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            className="form-input"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            required
                            placeholder="••••••••"
                            autoComplete="new-password"
                        />
                        {formErrors.confirmPassword && (
                            <p className="form-error">{formErrors.confirmPassword}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-full"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <span className="spinner"></span>
                                Creando cuenta...
                            </>
                        ) : (
                            'Crear Cuenta'
                        )}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        ¿Ya tienes cuenta?{' '}
                        <Link href="/auth/login" className="link-primary">
                            Inicia sesión aquí
                        </Link>
                    </p>
                    <Link href="/" className="link-secondary">
                        Volver al inicio
                    </Link>
                </div>

                <div className="flex flex-col items-center justify-center mt-8 opacity-70 hover:opacity-100 transition-opacity">
                    <p className="text-xs text-secondary/60 mb-2 font-medium">Software desarrollado por</p>
                    <div className="relative w-24 h-12">
                        <Image
                            src="/LOGO_IACOL.png"
                            alt="IACol Dev"
                            fill
                            className="object-contain"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
