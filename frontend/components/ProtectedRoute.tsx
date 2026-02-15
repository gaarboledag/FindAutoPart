'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'

interface ProtectedRouteProps {
    children: React.ReactNode
    allowedRoles: string[]
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
    const router = useRouter()
    const { user, isAuthenticated, _hasHydrated, fetchUser, logout } = useAuthStore()
    const [isValidating, setIsValidating] = useState(true)

    useEffect(() => {
        // Wait for Zustand to finish hydrating from localStorage
        if (!_hasHydrated) return

        if (!isAuthenticated) {
            setIsValidating(false)
            router.push('/auth/login')
            return
        }

        // Validate token against the backend
        fetchUser()
            .then(() => {
                setIsValidating(false)
            })
            .catch(() => {
                logout()
                setIsValidating(false)
                router.push('/auth/login')
            })
    }, [_hasHydrated]) // eslint-disable-line react-hooks/exhaustive-deps

    // Show spinner while hydrating or validating
    if (!_hasHydrated || isValidating) {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
            }}>
                <div className="spinner" style={{ width: '40px', height: '40px' }}></div>
            </div>
        )
    }

    if (!isAuthenticated || (user && !allowedRoles.includes(user.role))) {
        // Redirect to their correct dashboard if role mismatch
        if (user && !allowedRoles.includes(user.role)) {
            if (user.role === 'TALLER') {
                router.push('/taller')
            } else if (user.role === 'TIENDA') {
                router.push('/tienda')
            } else if (user.role === 'ADMIN') {
                router.push('/admin')
            }
        }
        return null
    }

    return <>{children}</>
}
