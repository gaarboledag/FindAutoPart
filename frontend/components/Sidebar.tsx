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

interface SidebarProps {
    role: "TALLER" | "TIENDA" | "ADMIN"
}

export function Sidebar({ role }: SidebarProps) {
    const pathname = usePathname()

    const links = {
        TALLER: [
            { href: "/taller", label: "Dashboard", icon: LayoutDashboard },
            { href: "/taller/cotizaciones", label: "Cotizaciones", icon: FileText },
            { href: "/taller/pedidos", label: "Pedidos", icon: ShoppingBag },
            { href: "/taller/configuracion", label: "Configuración", icon: Settings },
        ],
        TIENDA: [
            { href: "/tienda", label: "Dashboard", icon: LayoutDashboard },
            { href: "/tienda/cotizaciones", label: "Cotizaciones", icon: FileText },
            { href: "/tienda/ofertas", label: "Mis Ofertas", icon: Package },
            { href: "/tienda/pedidos", label: "Pedidos", icon: ShoppingBag },
            { href: "/tienda/configuracion", label: "Configuración", icon: Settings },
        ],
        ADMIN: [
            { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
            { href: "/admin/users", label: "Usuarios", icon: Users },
            { href: "/admin/activity", label: "Actividad", icon: Activity },
        ],
    }

    const currentLinks = links[role] || []

    return (
        <div className="flex flex-col h-full w-64 bg-card border-r border-border/50">
            <div className="p-6">
                <h1 className="text-2xl font-bold font-heading text-primary-light tracking-tight">
                    FindPart
                </h1>
                <p className="text-xs text-muted-foreground mt-1">
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
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200",
                                isActive
                                    ? "bg-primary/10 text-primary-light shadow-[0_0_10px_rgba(31,95,191,0.2)]"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                            )}
                        >
                            <Icon className={cn("h-4 w-4", isActive ? "text-primary-light" : "text-muted-foreground")} />
                            {link.label}
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
