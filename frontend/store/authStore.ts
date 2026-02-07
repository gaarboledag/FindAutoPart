'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authAPI } from '@/lib/api'

interface User {
    id: string
    email: string
    role: 'TALLER' | 'TIENDA' | 'ADMIN'
    isActive: boolean
}

interface AuthState {
    user: User | null
    accessToken: string | null
    refreshToken: string | null
    isAuthenticated: boolean
    isLoading: boolean
    error: string | null

    login: (email: string, password: string) => Promise<void>
    register: (email: string, password: string, role: string) => Promise<void>
    logout: () => void
    fetchUser: () => Promise<void>
    setError: (error: string | null) => void
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,

            login: async (email: string, password: string) => {
                set({ isLoading: true, error: null })
                try {
                    const data = await authAPI.login(email, password)

                    // Store tokens
                    localStorage.setItem('access_token', data.accessToken)
                    localStorage.setItem('refresh_token', data.refreshToken)

                    set({
                        user: data.user,
                        accessToken: data.accessToken,
                        refreshToken: data.refreshToken,
                        isAuthenticated: true,
                        isLoading: false,
                        error: null,
                    })
                } catch (error: any) {
                    const message = error.response?.data?.message || 'Error al iniciar sesión'
                    set({ error: message, isLoading: false })
                    throw error
                }
            },

            register: async (email: string, password: string, role: string) => {
                set({ isLoading: true, error: null })
                try {
                    const data = await authAPI.register(email, password, role)

                    // Store tokens
                    localStorage.setItem('access_token', data.accessToken)
                    localStorage.setItem('refresh_token', data.refreshToken)

                    set({
                        user: data.user,
                        accessToken: data.accessToken,
                        refreshToken: data.refreshToken,
                        isAuthenticated: true,
                        isLoading: false,
                        error: null,
                    })
                } catch (error: any) {
                    const message = error.response?.data?.message || 'Error al registrarse'
                    set({ error: message, isLoading: false })
                    throw error
                }
            },

            logout: () => {
                localStorage.removeItem('access_token')
                localStorage.removeItem('refresh_token')
                localStorage.removeItem('user')

                set({
                    user: null,
                    accessToken: null,
                    refreshToken: null,
                    isAuthenticated: false,
                    error: null,
                })
            },

            fetchUser: async () => {
                set({ isLoading: true })
                try {
                    const data = await authAPI.me()
                    set({ user: data, isAuthenticated: true, isLoading: false })
                } catch (error) {
                    // If fetch fails, logout
                    get().logout()
                    set({ isLoading: false })
                }
            },

            setError: (error: string | null) => {
                set({ error })
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                accessToken: state.accessToken,
                refreshToken: state.refreshToken,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
)
