'use client'

import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import { SidebarContent } from "@/components/Sidebar"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface MobileSidebarProps {
    role: "TALLER" | "TIENDA" | "ADMIN"
}

export function MobileSidebar({ role }: MobileSidebarProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) {
        return null
    }

    return (
        <div className="md:hidden flex items-center justify-between p-3 border-b border-slate-700/50 bg-[#1E293B]">
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center justify-center h-12 w-12 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#334155] transition-colors"
            >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Abrir menú</span>
            </button>

            <Link href={role === "ADMIN" ? "/admin" : role === "TALLER" ? "/taller" : "/tienda"}>
                <div className="relative w-28 h-7">
                    <Image
                        src="/logo_blanco.png"
                        alt="FindPart Logo"
                        fill
                        className="object-contain object-right"
                        priority
                    />
                </div>
            </Link>

            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm animate-in fade-in-0"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Drawer */}
            <div
                className={cn(
                    "fixed top-0 bottom-0 left-0 z-50 w-[85%] max-w-sm bg-[#1E293B] border-r border-slate-700/50 shadow-2xl shadow-black/50 transition-transform duration-300 ease-in-out transform",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="absolute right-3 top-3 z-50">
                    <button
                        onClick={() => setIsOpen(false)}
                        className="flex items-center justify-center h-12 w-12 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#334155] transition-colors"
                    >
                        <X className="h-5 w-5" />
                        <span className="sr-only">Cerrar</span>
                    </button>
                </div>

                <div className="h-full pt-2">
                    <SidebarContent role={role} onNavigate={() => setIsOpen(false)} />
                </div>
            </div>
        </div>
    )
}
