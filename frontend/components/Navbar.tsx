"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { Menu, X } from "lucide-react"
import { useState } from "react"

interface NavbarProps {
    role?: "TALLER" | "TIENDA" | "ADMIN"
}

export default function Navbar({ role }: NavbarProps) {
    const pathname = usePathname()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    if (role === 'TALLER' || role === 'TIENDA') {
        return null
    }

    const navLinks = [
        { href: "/features", label: "Características" },
        { href: "/pricing", label: "Precios" },
        { href: "/about", label: "Nosotros" },
    ]

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-slate-700/50 bg-[#0F172A]/90 backdrop-blur-xl">
            <div className="container flex h-16 items-center justify-between px-4">
                <Link href={role === 'ADMIN' ? '/admin' : '/'} className="flex items-center gap-2">
                    <div className="relative w-28 md:w-32 h-7 md:h-8">
                        <Image
                            src="/logo_blanco.png"
                            alt="FindPart Logo"
                            fill
                            className="object-contain object-left"
                            priority
                        />
                    </div>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "text-sm font-medium transition-colors hover:text-[#F97316]",
                                pathname === link.href ? "text-[#F97316]" : "text-[#94A3B8]"
                            )}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                <div className="flex items-center gap-3">
                    <Link href="/auth/login" className="hidden md:block">
                        <Button variant="ghost" size="sm" className="text-sm text-[#94A3B8] hover:text-[#F8FAFC]">
                            Ingresar
                        </Button>
                    </Link>
                    <Link href="/auth/register">
                        <Button variant="cta" size="sm" className="text-sm">
                            Registrarse
                        </Button>
                    </Link>

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden flex items-center justify-center h-12 w-12 text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
                    >
                        {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-slate-700/50 bg-[#1E293B] animate-in slide-in-from-top-2 duration-200">
                    <div className="container px-4 py-4 space-y-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className={cn(
                                    "block py-3 px-4 rounded-lg text-base font-medium transition-colors min-h-[48px] flex items-center",
                                    pathname === link.href
                                        ? "text-[#F97316] bg-orange-500/10"
                                        : "text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#334155]"
                                )}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <Link
                            href="/auth/login"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block py-3 px-4 rounded-lg text-base font-medium text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#334155] transition-colors min-h-[48px] flex items-center"
                        >
                            Ingresar
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    )
}
