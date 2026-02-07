"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
// Removed './Navbar.css' import as we are moving to Tailwind
import Image from "next/image"

interface NavbarProps {
    role?: "TALLER" | "TIENDA" | "ADMIN" // Make role optional for public pages
}

export default function Navbar({ role }: NavbarProps) {
    const pathname = usePathname()
    const isPublic = !role

    if (role === 'TALLER' || role === 'TIENDA') {
        // Taller and Tienda use Sidebar layout
        return null
    }

    const navLinks = [
        { href: "/features", label: "Características" },
        { href: "/pricing", label: "Precios" },
        { href: "/about", label: "Nosotros" },
    ]

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-background/80 backdrop-blur-md">
            <div className="container flex h-16 items-center justify-between">
                <Link href={role === 'ADMIN' ? '/admin' : '/'} className="flex items-center gap-2">
                    <div className="relative w-32 h-8">
                        <Image
                            src="/logo_blanco.png"
                            alt="FindPart Logo"
                            fill
                            className="object-contain object-left"
                            priority
                        />
                    </div>
                </Link>

                <div className="hidden md:flex items-center gap-6">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "text-sm font-medium transition-colors hover:text-primary-light",
                                pathname === link.href ? "text-primary-light" : "text-muted-foreground"
                            )}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                <div className="flex items-center gap-4">
                    <Link href="/auth/login">
                        <Button variant="ghost" size="sm">Iniciar Sesión</Button>
                    </Link>
                    <Link href="/auth/register">
                        <Button variant="default" size="sm" className="shadow-[0_0_15px_rgba(11,31,59,0.5)]">
                            Registrarse
                        </Button>
                    </Link>
                </div>
            </div>
        </nav>
    )
}
