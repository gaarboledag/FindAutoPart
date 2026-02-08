'use client'

import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
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
        <div className="md:hidden flex items-center justify-between p-4 border-b bg-card">
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(true)}
                className="text-muted-foreground hover:text-foreground"
            >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Abrir menú</span>
            </Button>

            <Link href={role === "ADMIN" ? "/admin" : role === "TALLER" ? "/taller" : "/tienda"}>
                <div className="relative w-32 h-8">
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
                    className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm animate-in fade-in-0"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Drawer */}
            <div
                className={cn(
                    "fixed top-0 bottom-0 left-0 z-50 w-[80%] max-w-sm bg-card border-r border-border shadow-2xl transition-transform duration-300 ease-in-out transform",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="absolute right-4 top-4 z-50">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsOpen(false)}
                        className="text-muted-foreground hover:text-foreground rounded-full"
                    >
                        <X className="h-5 w-5" />
                        <span className="sr-only">Cerrar</span>
                    </Button>
                </div>

                <div className="h-full pt-2">
                    <SidebarContent role={role} onNavigate={() => setIsOpen(false)} />
                </div>
            </div>
        </div>
    )
}
