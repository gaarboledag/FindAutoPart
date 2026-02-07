'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/store/authStore'
import './auth.css'

export default function LoginPage() {
    const router = useRouter()
    const { login, isLoading, error, setError } = useAuthStore()

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        try {
            await login(formData.email, formData.password)

            // Get user from store to redirect based on role
            const { user } = useAuthStore.getState()

            if (user?.role === 'TALLER') {
                router.push('/taller')
            } else if (user?.role === 'TIENDA') {
                router.push('/tienda')
            } else if (user?.role === 'ADMIN') {
                router.push('/admin')
            }
        } catch (err) {
            // Error is already set in store
            console.error('Login failed:', err)
        }
    }

    return (
        <div className="auth-container">
            <div className="auth-box">
                <div className="auth-header">
                    <h1>Iniciar Sesión</h1>
                    <p>Ingresa a tu cuenta de FindPartAutopartes</p>
                </div>

                {error && (
                    <div className={`alert ${error.includes('desactivada') ? 'alert-warning' : 'alert-error'}`}>
                        {error.includes('desactivada') ? (
                            <div>
                                <strong>⚠️ Cuenta Desactivada</strong>
                                <p style={{ marginTop: 'var(--space-2)', marginBottom: 0 }}>
                                    {error}
                                </p>
                                <p style={{ marginTop: 'var(--space-2)', marginBottom: 0, fontSize: 'var(--font-size-sm)' }}>
                                    Contacta al administrador en: <strong>admin@findpart.com</strong>
                                </p>
                            </div>
                        ) : (
                            error
                        )}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="auth-form">
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
                            autoComplete="current-password"
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-full"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <span className="spinner"></span>
                                Iniciando sesión...
                            </>
                        ) : (
                            'Iniciar Sesión'
                        )}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        ¿No tienes cuenta?{' '}
                        <Link href="/auth/register" className="link-primary">
                            Regístrate aquí
                        </Link>
                    </p>
                    <Link href="/" className="link-secondary">
                        Volver al inicio
                    </Link>
                </div>
            </div>
        </div>
    )
}
