'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { adminAPI } from '@/lib/api'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Users, Loader2, ShieldAlert, CheckCircle2, XCircle, Eye, Trash2, Key } from 'lucide-react'
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
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F97316]"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <Link href="/admin" className="w-fit">
                    <Button variant="ghost" className="gap-2 -ml-2 text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="h-4 w-4" />
                        Volver al Panel
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold font-sans text-[#F8FAFC]">
                        Gestión de Usuarios
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Administra todos los usuarios de la plataforma
                    </p>
                </div>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-wrap gap-2">
                        <Button
                            onClick={() => setFilter('all')}
                            variant={filter === 'all' ? 'default' : 'outline'}
                            size="sm"
                        >
                            Todos <Badge variant="secondary" className="ml-2">{users.length}</Badge>
                        </Button>
                        <Button
                            onClick={() => setFilter('active')}
                            variant={filter === 'active' ? 'default' : 'outline'}
                            size="sm"
                            className={filter === 'active' ? 'bg-green-600 hover:bg-green-700' : ''}
                        >
                            Activos <Badge variant="secondary" className="ml-2">{users.filter(u => u.isActive).length}</Badge>
                        </Button>
                        <Button
                            onClick={() => setFilter('inactive')}
                            variant={filter === 'inactive' ? 'default' : 'outline'}
                            size="sm"
                            className={filter === 'inactive' ? 'bg-red-600 hover:bg-red-700' : ''}
                        >
                            Inactivos <Badge variant="secondary" className="ml-2">{users.filter(u => !u.isActive).length}</Badge>
                        </Button>

                        <div className="h-8 w-px bg-border mx-1"></div>

                        <Button
                            onClick={() => setFilter('TALLER')}
                            variant={filter === 'TALLER' ? 'default' : 'outline'}
                            size="sm"
                            className={filter === 'TALLER' ? 'bg-blue-600 hover:bg-blue-700' : ''}
                        >
                            Talleres <Badge variant="secondary" className="ml-2">{users.filter(u => u.role === 'TALLER').length}</Badge>
                        </Button>
                        <Button
                            onClick={() => setFilter('TIENDA')}
                            variant={filter === 'TIENDA' ? 'default' : 'outline'}
                            size="sm"
                            className={filter === 'TIENDA' ? 'bg-green-600 hover:bg-green-700' : ''}
                        >
                            Tiendas <Badge variant="secondary" className="ml-2">{users.filter(u => u.role === 'TIENDA').length}</Badge>
                        </Button>
                        <Button
                            onClick={() => setFilter('ADMIN')}
                            variant={filter === 'ADMIN' ? 'default' : 'outline'}
                            size="sm"
                            className={filter === 'ADMIN' ? 'bg-red-600 hover:bg-red-700' : ''}
                        >
                            Admins <Badge variant="secondary" className="ml-2">{users.filter(u => u.role === 'ADMIN').length}</Badge>
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Users Table */}
            {filteredUsers.length === 0 ? (
                <Card>
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
                <Card className="overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b bg-muted/50">
                                    <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Email</th>
                                    <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Rol</th>
                                    <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Perfil</th>
                                    <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Registro</th>
                                    <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Estado</th>
                                    <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user) => {
                                    const roleConfig = getRoleBadge(user.role)
                                    return (
                                        <tr
                                            key={user.id}
                                            className="border-b last:border-0 hover:bg-muted/50 transition-colors"
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
                                                        onClick={() => {
                                                            setToggling(user.id)
                                                            const password = prompt('Ingresa la nueva contraseña para este usuario:')
                                                            if (password) {
                                                                adminAPI.updateUserPassword(user.id, password)
                                                                    .then(() => alert('Contraseña actualizada correctamente'))
                                                                    .catch((err) => alert('Error al actualizar contraseña: ' + (err.response?.data?.message || err.message)))
                                                                    .finally(() => setToggling(null))
                                                            } else {
                                                                setToggling(null)
                                                            }
                                                        }}
                                                        variant="outline"
                                                        size="sm"
                                                        className="gap-2"
                                                        title="Cambiar Contraseña"
                                                    >
                                                        <Key className="h-3 w-3" />
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
                                                    <Button
                                                        onClick={async () => {
                                                            if (confirm('¿Estás seguro de eliminar este usuario? ESTA ACCIÓN NO SE PUEDE DESHACER. Se borrarán todos los datos asociados.')) {
                                                                setToggling(user.id)
                                                                try {
                                                                    await adminAPI.deleteUser(user.id)
                                                                    await loadUsers()
                                                                } catch (error: any) {
                                                                    alert(error.response?.data?.message || 'Error al eliminar usuario')
                                                                } finally {
                                                                    setToggling(null)
                                                                }
                                                            }
                                                        }}
                                                        variant="destructive"
                                                        size="sm"
                                                        disabled={toggling === user.id || user.role === 'ADMIN'}
                                                        className="gap-2"
                                                    >
                                                        {toggling === user.id ? (
                                                            <Loader2 className="h-3 w-3 animate-spin" />
                                                        ) : (
                                                            <Trash2 className="h-3 w-3" />
                                                        )}
                                                        Eliminar
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
        </div>
    )
}
