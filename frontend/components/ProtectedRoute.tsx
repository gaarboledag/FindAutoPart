'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'

interface ProtectedRouteProps {
    children: React.ReactNode
    allowedRoles: string[]
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
    const router = useRouter()
    const { user, isAuthenticated, isLoading } = useAuthStore()

    useEffect(() => {
        if (!isLoading) {
            if (!isAuthenticated) {
                router.push('/auth/login')
            } else if (user && !allowedRoles.includes(user.role)) {
                // Redirect to their correct dashboard
                if (user.role === 'TALLER') {
                    router.push('/taller')
                } else if (user.role === 'TIENDA') {
                    router.push('/tienda')
                } else if (user.role === 'ADMIN') {
                    router.push('/admin')
                }
            }
        }
    }, [isAuthenticated, isLoading, user, router, allowedRoles])

    if (isLoading) {
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
        return null
    }

    return <>{children}</>
}
