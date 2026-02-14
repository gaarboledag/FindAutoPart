'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Settings, Shield, Server, Database } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'

export default function AdminConfigPage() {
    const { user } = useAuthStore()

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
                        Configuración del Sistema
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Información y ajustes de la plataforma
                    </p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Profile Info */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="h-5 w-5 text-primary" />
                            Perfil de Administrador
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-muted-foreground">Email</p>
                                <p className="font-medium">{user?.email}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Rol</p>
                                <p className="font-medium">{user?.role}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">ID</p>
                                <p className="font-mono text-xs">{user?.id}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* System Info (Static for now) */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Server className="h-5 w-5 text-blue-500" />
                            Estado del Sistema
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-sm font-medium">API Backend</span>
                            </div>
                            <span className="text-xs text-green-500 font-medium">Online</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <Database className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm font-medium">Base de Datos</span>
                            </div>
                            <span className="text-xs text-green-500 font-medium">Conectado</span>
                        </div>
                        <div className="text-xs text-muted-foreground text-center pt-2">
                            Versión del Sistema: v1.0.0
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
