"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
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
import { useSocket } from "@/contexts/SocketContext"

interface SidebarProps {
    role: "TALLER" | "TIENDA" | "ADMIN"
}

export function SidebarContent({ role, onNavigate }: SidebarProps & { onNavigate?: () => void }) {
    const pathname = usePathname()
    // const [unreadCount, setUnreadCount] = useState(0) // Removed local state
    const { user } = useAuthStore()
    const { totalUnread } = useSocket() // Use global socket state

    // Removed polling effect, handling in SocketContext

    const links = {
        TALLER: [
            { href: "/taller", label: "Dashboard", icon: LayoutDashboard },
            { href: "/taller/cotizaciones", label: "Cotizaciones", icon: FileText, badge: role === 'TALLER' ? (totalUnread > 0 ? totalUnread : undefined) : undefined }, // Experimental for Taller
            { href: "/taller/pedidos", label: "Pedidos", icon: ShoppingBag },
            { href: "/taller/configuracion", label: "Configuración", icon: Settings },
        ],
        TIENDA: [
            { href: "/tienda", label: "Dashboard", icon: LayoutDashboard },
            { href: "/tienda/cotizaciones", label: "Cotizaciones", icon: FileText, badge: totalUnread },
            { href: "/tienda/ofertas", label: "Mis Ofertas", icon: Package },
            { href: "/tienda/pedidos", label: "Pedidos", icon: ShoppingBag },
            { href: "/tienda/configuracion", label: "Configuración", icon: Settings },
        ],
        ADMIN: [
            { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
            { href: "/admin/cotizaciones", label: "Cotizaciones", icon: FileText },
            { href: "/admin/users", label: "Usuarios", icon: Users },
            { href: "/admin/activity", label: "Actividad", icon: Activity },
            { href: "/admin/config", label: "Configuración", icon: Settings },
        ],
    }

    const currentLinks = links[role] || []

    return (
        <div className="flex flex-col h-full w-full bg-[#1E293B]">
            <div className="p-5 flex flex-col items-center">
                <Link href={role === "ADMIN" ? "/admin" : role === "TALLER" ? "/taller" : "/tienda"} onClick={onNavigate} className="mb-2">
                    <div className="relative w-36 h-9">
                        <Image
                            src="/logo_blanco.png"
                            alt="FindPart Logo"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                </Link>
                <p className="text-xs text-[#64748B] font-medium uppercase tracking-wider text-center">
                    {role === "TALLER" ? "Taller Automotriz" : role === "TIENDA" ? "Tienda de Repuestos" : "Administrador"}
                </p>
            </div>

            <nav className="flex-1 px-3 space-y-1">
                {currentLinks.map((link) => {
                    const Icon = link.icon
                    const isActive = pathname === link.href || pathname.startsWith(link.href + "/")

                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={onNavigate}
                            className={cn(
                                "flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 min-h-[48px]",
                                isActive
                                    ? "bg-orange-500/10 text-[#F97316] border-l-[3px] border-l-[#F97316] shadow-[0_0_10px_rgba(249,115,22,0.1)]"
                                    : "text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#334155]/50"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <Icon className={cn("h-5 w-5", isActive ? "text-[#F97316]" : "text-[#64748B]")} />
                                {link.label}
                            </div>
                            {(link as any).badge > 0 && (
                                <span className="flex items-center justify-center h-5 w-5 rounded-full bg-[#F97316] text-white text-[10px] font-bold shadow-[0_0_8px_rgba(249,115,22,0.4)]">
                                    {(link as any).badge}
                                </span>
                            )}
                        </Link>
                    )
                })}
            </nav>

            <div className="p-3 border-t border-slate-700/50">
                <button
                    className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-[#94A3B8] hover:text-red-400 transition-colors rounded-lg hover:bg-red-500/10 min-h-[48px]"
                    onClick={() => {
                        window.location.href = '/auth/login'
                    }}
                >
                    <LogOut className="h-5 w-5" />
                    Cerrar Sesión
                </button>
            </div>
        </div>
    )
}

export function Sidebar({ role }: SidebarProps) {
    return (
        <div className="hidden md:flex flex-col h-full w-64 border-r border-slate-700/50 sticky top-0">
            <SidebarContent role={role} />
        </div>
    )
}
