'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import ProtectedRoute from '@/components/ProtectedRoute'
import Navbar from '@/components/Navbar'
import { adminAPI } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Users, Loader2, ShieldAlert, CheckCircle2, XCircle, Eye } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export default function AdminUsersPage() {
    const [users, setUsers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<string>('all')
    const [toggling, setToggling] = useState<string | null>(null)

    useEffect(() => {
        loadUsers()
    }, [])

    const loadUsers = async () => {
        try {
            const data = await adminAPI.getAllUsers()
            setUsers(data)
        } catch (error) {
            console.error('Error loading users:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleToggleStatus = async (userId: string) => {
        if (!confirm('¿Estás seguro de cambiar el estado de este usuario?')) return

        setToggling(userId)
        try {
            await adminAPI.toggleUserStatus(userId)
            await loadUsers()
        } catch (error: any) {
            alert(error.response?.data?.message || 'Error al cambiar estado del usuario')
        } finally {
            setToggling(null)
        }
    }

    const filteredUsers = users.filter(user => {
        if (filter === 'all') return true
        if (filter === 'active') return user.isActive
        if (filter === 'inactive') return !user.isActive
        return user.role === filter
    })

    const getRoleBadge = (role: string) => {
        const roleConfig: Record<string, { variant: any; label: string }> = {
            ADMIN: { variant: 'destructive', label: 'Admin' },
            TALLER: { variant: 'info', label: 'Taller' },
            TIENDA: { variant: 'success', label: 'Tienda' },
        }
        return roleConfig[role] || { variant: 'default', label: role }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-[#0B0F19]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <ProtectedRoute allowedRoles={['ADMIN']}>
            <div className="min-h-screen bg-[#0B0F19]">
                <Navbar role="ADMIN" />

                <main className="container mx-auto px-4 py-8">
                    {/* Header */}
                    <div className="mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <Link href="/admin">
                            <Button variant="ghost" className="gap-2 mb-4 text-muted-foreground hover:text-primary-light">
                                <ArrowLeft className="h-4 w-4" />
                                Volver al Panel
                            </Button>
                        </Link>
                        <h1 className="text-4xl font-bold font-heading text-primary-light mb-2">
                            Gestión de Usuarios
                        </h1>
                        <p className="text-muted-foreground text-lg">
                            Administra todos los usuarios de la plataforma
                        </p>
                    </div>

                    {/* Filters */}
                    <Card className="mb-6 bg-white/5 backdrop-blur-sm border-white/10 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
                        <CardContent className="p-4">
                            <div className="flex flex-wrap gap-2">
                                <Button
                                    onClick={() => setFilter('all')}
                                    variant={filter === 'all' ? 'default' : 'outline'}
                                    size="sm"
                                    className={filter === 'all' ? 'bg-gradient-to-r from-primary to-primary-light' : ''}
                                >
                                    Todos <Badge variant="secondary" className="ml-2">{users.length}</Badge>
                                </Button>
                                <Button
                                    onClick={() => setFilter('active')}
                                    variant={filter === 'active' ? 'default' : 'outline'}
                                    size="sm"
                                    className={filter === 'active' ? 'bg-gradient-to-r from-green-600 to-green-500' : ''}
                                >
                                    Activos <Badge variant="secondary" className="ml-2">{users.filter(u => u.isActive).length}</Badge>
                                </Button>
                                <Button
                                    onClick={() => setFilter('inactive')}
                                    variant={filter === 'inactive' ? 'default' : 'outline'}
                                    size="sm"
                                    className={filter === 'inactive' ? 'bg-gradient-to-r from-red-600 to-red-500' : ''}
                                >
                                    Inactivos <Badge variant="secondary" className="ml-2">{users.filter(u => !u.isActive).length}</Badge>
                                </Button>

                                <div className="h-8 w-px bg-white/10 mx-1"></div>

                                <Button
                                    onClick={() => setFilter('TALLER')}
                                    variant={filter === 'TALLER' ? 'default' : 'outline'}
                                    size="sm"
                                    className={filter === 'TALLER' ? 'bg-gradient-to-r from-blue-600 to-blue-500' : ''}
                                >
                                    Talleres <Badge variant="secondary" className="ml-2">{users.filter(u => u.role === 'TALLER').length}</Badge>
                                </Button>
                                <Button
                                    onClick={() => setFilter('TIENDA')}
                                    variant={filter === 'TIENDA' ? 'default' : 'outline'}
                                    size="sm"
                                    className={filter === 'TIENDA' ? 'bg-gradient-to-r from-green-600 to-green-500' : ''}
                                >
                                    Tiendas <Badge variant="secondary" className="ml-2">{users.filter(u => u.role === 'TIENDA').length}</Badge>
                                </Button>
                                <Button
                                    onClick={() => setFilter('ADMIN')}
                                    variant={filter === 'ADMIN' ? 'default' : 'outline'}
                                    size="sm"
                                    className={filter === 'ADMIN' ? 'bg-gradient-to-r from-red-600 to-red-500' : ''}
                                >
                                    Admins <Badge variant="secondary" className="ml-2">{users.filter(u => u.role === 'ADMIN').length}</Badge>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Users Table */}
                    {filteredUsers.length === 0 ? (
                        <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                            <CardContent className="py-16">
                                <div className="text-center space-y-4">
                                    <Users className="h-16 w-16 mx-auto text-muted-foreground" />
                                    <div>
                                        <h3 className="text-xl font-semibold text-foreground">No hay usuarios</h3>
                                        <p className="text-muted-foreground mt-2">
                                            No se encontraron usuarios con los filtros seleccionados
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="bg-white/5 backdrop-blur-sm border-white/10 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-white/10 bg-white/5">
                                            <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Email</th>
                                            <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Rol</th>
                                            <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Perfil</th>
                                            <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Registro</th>
                                            <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Estado</th>
                                            <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredUsers.map((user, index) => {
                                            const roleConfig = getRoleBadge(user.role)
                                            return (
                                                <tr
                                                    key={user.id}
                                                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                                                    style={{ animationDelay: `${index * 50}ms` }}
                                                >
                                                    <td className="p-4">
                                                        <span className="font-medium text-foreground">{user.email}</span>
                                                    </td>
                                                    <td className="p-4">
                                                        <Badge variant={roleConfig.variant}>
                                                            {roleConfig.label}
                                                        </Badge>
                                                    </td>
                                                    <td className="p-4 text-sm text-muted-foreground">
                                                        {user.taller?.nombre || user.tienda?.nombre || '-'}
                                                    </td>
                                                    <td className="p-4 text-sm text-muted-foreground">
                                                        {format(new Date(user.createdAt), 'dd/MM/yyyy', { locale: es })}
                                                    </td>
                                                    <td className="p-4">
                                                        {user.isActive ? (
                                                            <Badge variant="success" className="gap-1">
                                                                <CheckCircle2 className="h-3 w-3" />
                                                                Activo
                                                            </Badge>
                                                        ) : (
                                                            <Badge variant="destructive" className="gap-1">
                                                                <XCircle className="h-3 w-3" />
                                                                Inactivo
                                                            </Badge>
                                                        )}
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="flex gap-2">
                                                            <Button
                                                                onClick={() => window.location.href = `/admin/users/${user.id}`}
                                                                variant="outline"
                                                                size="sm"
                                                                className="gap-2"
                                                            >
                                                                <Eye className="h-3 w-3" />
                                                                Ver Detalles
                                                            </Button>
                                                            <Button
                                                                onClick={() => handleToggleStatus(user.id)}
                                                                variant={user.isActive ? 'destructive' : 'default'}
                                                                size="sm"
                                                                disabled={toggling === user.id || user.role === 'ADMIN'}
                                                                className="gap-2"
                                                            >
                                                                {toggling === user.id ? (
                                                                    <>
                                                                        <Loader2 className="h-3 w-3 animate-spin" />
                                                                        Procesando...
                                                                    </>
                                                                ) : user.isActive ? (
                                                                    <>
                                                                        <XCircle className="h-3 w-3" />
                                                                        Desactivar
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <CheckCircle2 className="h-3 w-3" />
                                                                        Activar
                                                                    </>
                                                                )}
                                                            </Button>
                                                        </div>
                                                        {user.role === 'ADMIN' && (
                                                            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                                                                <ShieldAlert className="h-3 w-3" />
                                                                Protegido
                                                            </div>
                                                        )}
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    )}
                </main>
            </div>
        </ProtectedRoute>
    )
}
