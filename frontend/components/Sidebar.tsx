"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
// import { Button } from "@/components/ui/button" // Uncomment when moving logout button here if needed
import {
    LayoutDashboard,
    FileText,
    ShoppingBag,
    Settings,
    Users,
    Activity,
    LogOut,
    Package
} from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from "react"
import { cotizacionesAPI } from "@/lib/api"
import { useAuthStore } from "@/store/authStore"

interface SidebarProps {
    role: "TALLER" | "TIENDA" | "ADMIN"
}

export function SidebarContent({ role, onNavigate }: SidebarProps & { onNavigate?: () => void }) {
    const pathname = usePathname()
    const [unreadCount, setUnreadCount] = useState(0)
    const { user } = useAuthStore()

    // Fetch unread count for TIENDA
    useEffect(() => {
        if (role === 'TIENDA' && user) {
            const fetchUnread = async () => {
                try {
                    const data = await cotizacionesAPI.getUnreadCount()
                    setUnreadCount(data.count)
                } catch (error) {
                    console.error('Error fetching unread count:', error)
                }
            }

            fetchUnread()

            // Poll every 30 seconds
            const interval = setInterval(fetchUnread, 30000)
            return () => clearInterval(interval)
        }
    }, [role, user, pathname]) // Re-fetch on navigation too

    const links = {
        TALLER: [
            { href: "/taller", label: "Dashboard", icon: LayoutDashboard },
            { href: "/taller/cotizaciones", label: "Cotizaciones", icon: FileText },
            { href: "/taller/pedidos", label: "Pedidos", icon: ShoppingBag },
            { href: "/taller/configuracion", label: "Configuración", icon: Settings },
        ],
        TIENDA: [
            { href: "/tienda", label: "Dashboard", icon: LayoutDashboard },
            { href: "/tienda/cotizaciones", label: "Cotizaciones", icon: FileText, badge: unreadCount }, // Add badge here
            { href: "/tienda/ofertas", label: "Mis Ofertas", icon: Package },
            { href: "/tienda/pedidos", label: "Pedidos", icon: ShoppingBag },
            { href: "/tienda/configuracion", label: "Configuración", icon: Settings },
        ],
        ADMIN: [
            { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
            { href: "/admin/users", label: "Usuarios", icon: Users },
            { href: "/admin/activity", label: "Actividad", icon: Activity },
            { href: "/admin/config", label: "Configuración", icon: Settings },
        ],
    }

    const currentLinks = links[role] || []

    return (
        <div className="flex flex-col h-full w-full bg-card">
            <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                    <Link href={role === "ADMIN" ? "/admin" : role === "TALLER" ? "/taller" : "/tienda"} onClick={onNavigate}>
                        <div className="relative w-40 h-10">
                            <Image
                                src="/logo_blanco.png"
                                alt="FindPart Logo"
                                fill
                                className="object-contain object-left"
                                priority
                            />
                        </div>
                    </Link>
                </div>
                <p className="text-xs text-muted-foreground">
                    {role === "TALLER" ? "Taller Automotriz" : role === "TIENDA" ? "Tienda de Repuestos" : "Administrador"}
                </p>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                {currentLinks.map((link) => {
                    const Icon = link.icon
                    const isActive = pathname === link.href || pathname.startsWith(link.href + "/")

                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={onNavigate}
                            className={cn(
                                "flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200",
                                isActive
                                    ? "bg-primary/10 text-primary-light shadow-[0_0_10px_rgba(31,95,191,0.2)]"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <Icon className={cn("h-4 w-4", isActive ? "text-primary-light" : "text-muted-foreground")} />
                                {link.label}
                            </div>
                            {/* Display badge if present and > 0 */}
                            {(link as any).badge > 0 && (
                                <span className="flex h-2 w-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)] animate-pulse" />
                            )}
                        </Link>
                    )
                })}
            </nav>

            <div className="p-4 border-t border-border/50">
                <button
                    className="flex w-full items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-destructive transition-colors rounded-md hover:bg-destructive/10"
                    onClick={() => {
                        // Handle logout
                        window.location.href = '/auth/login'
                    }}
                >
                    <LogOut className="h-4 w-4" />
                    Cerrar Sesión
                </button>
            </div>
        </div>
    )
}

export function Sidebar({ role }: SidebarProps) {
    return (
        <div className="hidden md:flex flex-col h-full w-64 border-r border-border/50 sticky top-0">
            <SidebarContent role={role} />
        </div>
    )
}
