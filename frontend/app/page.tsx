'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
    ArrowRight,
    ShieldCheck,
    Zap,
    Globe,
    Cpu,
    BarChart3,
    Search,
    Wrench,
    Store,
    CheckCircle2,
    Users,
    Clock,
    TrendingUp
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Home() {
    const [selectedRole, setSelectedRole] = useState<'TALLER' | 'TIENDA' | null>(null)

    return (
        <div className="min-h-screen bg-[#0B0F19] text-foreground selection:bg-primary/30 selection:text-primary-light overflow-x-hidden">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-24 pb-12 lg:pt-48 lg:pb-32 overflow-hidden">
                {/* Background Essentials */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background z-0"></div>
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10 z-0 mask-image:linear-gradient(to_bottom,black,transparent)"></div>

                <div className="container relative z-10 mx-auto px-4 text-center">
                    <Badge variant="tech" className="mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <span className="relative flex h-2 w-2 mr-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
                        </span>
                        Comunicamos Talleres y Tiendas de Repuestos
                    </Badge>

                    <h1 className="text-4xl md:text-7xl font-bold font-heading tracking-tight mb-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                        Cotizaciones de Repuestos <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-light via-secondary to-primary-light animate-gradient bg-300%">
                            en Segundos
                        </span>
                    </h1>

                    <p className="text-lg md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                        Conectamos talleres y proveedores en milisegundos. <br className="hidden md:block" />
                        Líderes en abastecimiento automotriz digital.
                    </p>

                    {/* Role Selector */}
                    <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 mb-12 md:mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 max-w-4xl mx-auto">
                        <button
                            onClick={() => setSelectedRole('TALLER')}
                            className={`group relative w-full md:w-1/2 p-6 md:p-8 rounded-2xl border-2 transition-all duration-300 ${selectedRole === 'TALLER'
                                ? 'bg-blue-500/20 border-blue-400 shadow-[0_0_30px_rgba(96,165,250,0.4)]'
                                : 'bg-white/5 border-white/10 hover:border-blue-400/50 hover:bg-white/10'
                                }`}
                        >
                            <div className="flex flex-col items-center gap-3 md:gap-4">
                                <div className={`p-3 md:p-4 rounded-full ${selectedRole === 'TALLER' ? 'bg-blue-500 text-white' : 'bg-white/10 text-muted-foreground group-hover:text-blue-400 group-hover:bg-blue-500/20'}`}>
                                    <Wrench className="h-8 w-8 md:h-10 md:w-10" />
                                </div>
                                <h3 className="text-xl md:text-2xl font-bold font-heading">Soy Taller Mecánico</h3>
                                <p className="text-xs md:text-sm text-muted-foreground">Busco repuestos rápidos</p>
                            </div>
                            {selectedRole === 'TALLER' && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-xs px-3 py-1 rounded-full font-bold">
                                    SELECCIONADO
                                </div>
                            )}
                        </button>

                        <button
                            onClick={() => setSelectedRole('TIENDA')}
                            className={`group relative w-full md:w-1/2 p-6 md:p-8 rounded-2xl border-2 transition-all duration-300 ${selectedRole === 'TIENDA'
                                ? 'bg-orange-500/20 border-orange-500 shadow-[0_0_30px_rgba(249,115,22,0.3)]'
                                : 'bg-white/5 border-white/10 hover:border-orange-500/50 hover:bg-white/10'
                                }`}
                        >
                            <div className="flex flex-col items-center gap-3 md:gap-4">
                                <div className={`p-3 md:p-4 rounded-full ${selectedRole === 'TIENDA' ? 'bg-orange-500 text-white' : 'bg-white/10 text-muted-foreground group-hover:text-orange-500 group-hover:bg-orange-500/20'}`}>
                                    <Store className="h-8 w-8 md:h-10 md:w-10" />
                                </div>
                                <h3 className="text-xl md:text-2xl font-bold font-heading">Soy Proveedor</h3>
                                <p className="text-xs md:text-sm text-muted-foreground">Vendo repuestos</p>
                            </div>
                            {selectedRole === 'TIENDA' && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-xs px-3 py-1 rounded-full font-bold">
                                    SELECCIONADO
                                </div>
                            )}
                        </button>
                    </div>

                    {/* Dynamic Content Area */}
                    <AnimatePresence mode="wait">
                        {selectedRole ? (
                            <motion.div
                                key={selectedRole}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                className="max-w-5xl mx-auto"
                            >
                                <div className={`border rounded-3xl p-6 md:p-12 ${selectedRole === 'TALLER'
                                    ? 'bg-blue-500/5 border-blue-400/30'
                                    : 'bg-orange-500/5 border-orange-500/20'
                                    }`}>
                                    {selectedRole === 'TALLER' ? (
                                        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                                            <div className="text-left space-y-4 md:space-y-6">
                                                <h2 className="text-2xl md:text-4xl font-bold font-heading text-white">
                                                    Optimiza tu Taller
                                                </h2>
                                                <ul className="space-y-3 md:space-y-4">
                                                    {[
                                                        "Ahorra tiempo cotizando en segundos.",
                                                        "Ahorra costos comparando precios instantáneamente.",
                                                        "Una sola cotización para contactar a todas las tiendas.",
                                                        "Contacta proveedores dentro y fuera de tu ciudad.",
                                                        "Moderniza tu administración y control de compras.",
                                                    ].map((benefit, i) => (
                                                        <li key={i} className="flex items-start gap-3 text-base md:text-lg text-muted-foreground">
                                                            <CheckCircle2 className="h-5 w-5 md:h-6 md:w-6 text-blue-400 shrink-0" />
                                                            {benefit}
                                                        </li>
                                                    ))}
                                                </ul>
                                                <div className="pt-2 md:pt-4 p-3 md:p-4 bg-white/5 rounded-xl border border-white/10">
                                                    <div className="flex items-center gap-3 text-blue-300 font-medium text-sm md:text-base">
                                                        <Users className="h-4 w-4 md:h-5 md:w-5" />
                                                        "Los 30 talleres más grandes de Ibagué ya usan FindPart."
                                                    </div>
                                                </div>
                                                <div className="pt-2 md:pt-4">
                                                    <Link href="/auth/register?role=TALLER">
                                                        <Button size="lg" className="w-full text-base md:text-lg h-12 md:h-14 bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/25">
                                                            Cotizar Gratis Ahora <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </div>
                                            <div className="relative h-[300px] md:h-[400px] rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-black/40">
                                                {/* Mockup UI for Taller */}
                                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-transparent"></div>
                                                <div className="p-4 md:p-6 space-y-4">
                                                    <div className="h-8 w-2/3 bg-white/10 rounded animate-pulse"></div>
                                                    <div className="space-y-2">
                                                        <div className="h-20 w-full bg-white/5 rounded border border-white/5 p-3 flex gap-4 items-center">
                                                            <div className="h-10 w-10 md:h-12 md:w-12 bg-green-500/20 rounded-full flex items-center justify-center text-green-500 font-bold">$</div>
                                                            <div className="flex-1 space-y-2">
                                                                <div className="h-3 w-1/2 bg-white/10 rounded"></div>
                                                                <div className="h-3 w-3/4 bg-white/10 rounded"></div>
                                                            </div>
                                                        </div>
                                                        <div className="h-20 w-full bg-white/5 rounded border border-white/5 p-3 flex gap-4 items-center opacity-75">
                                                            <div className="h-10 w-10 md:h-12 md:w-12 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-500 font-bold">%</div>
                                                            <div className="flex-1 space-y-2">
                                                                <div className="h-3 w-1/2 bg-white/10 rounded"></div>
                                                                <div className="h-3 w-3/4 bg-white/10 rounded"></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                                            <div className="text-left space-y-4 md:space-y-6">
                                                <h2 className="text-2xl md:text-4xl font-bold font-heading text-white">
                                                    Potencia tus Ventas
                                                </h2>
                                                <ul className="space-y-3 md:space-y-4">
                                                    {[
                                                        "Accede a cotizaciones de los principales talleres.",
                                                        "Conoce nuevos clientes y aumenta tu alcance.",
                                                        "Brinda cotizaciones en segundos digitalmente.",
                                                        "Únete a la red digital de autopartes más grande de Colombia.",
                                                    ].map((benefit, i) => (
                                                        <li key={i} className="flex items-start gap-3 text-base md:text-lg text-muted-foreground">
                                                            <CheckCircle2 className="h-5 w-5 md:h-6 md:w-6 text-orange-500 shrink-0" />
                                                            {benefit}
                                                        </li>
                                                    ))}
                                                </ul>
                                                <div className="pt-2 md:pt-4 space-y-2 md:space-y-3">
                                                    <div className="p-3 md:p-4 bg-white/5 rounded-xl border border-white/10">
                                                        <div className="flex items-center gap-3 text-orange-400 font-medium text-sm md:text-base">
                                                            <TrendingUp className="h-4 w-4 md:h-5 md:w-5" />
                                                            "Las tiendas más grandes de Ibagué ya están vendiendo."
                                                        </div>
                                                    </div>
                                                    <div className="p-3 md:p-4 bg-white/5 rounded-xl border border-white/10">
                                                        <div className="flex items-center gap-3 text-primary-light font-medium text-sm md:text-base">
                                                            <Users className="h-4 w-4 md:h-5 md:w-5" />
                                                            "Los 30 talleres más grandes ya cotizan aquí."
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="pt-2 md:pt-4">
                                                    <Link href="/auth/register?role=TIENDA">
                                                        <Button size="lg" className="w-full text-base md:text-lg h-12 md:h-14 bg-orange-600 hover:bg-orange-700 shadow-lg shadow-orange-500/25">
                                                            <span className="flex flex-col items-center leading-none py-1">
                                                                <span>Cotizar Ahora</span>
                                                                <span className="text-[10px] md:text-xs opacity-90 font-normal mt-1">Tenemos 6 cotizaciones disponibles en tu área</span>
                                                            </span>
                                                            <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </div>
                                            <div className="relative h-[300px] md:h-[400px] rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-black/40">
                                                {/* Mockup UI for Tienda */}
                                                <div className="absolute inset-0 bg-gradient-to-bl from-orange-500/20 to-transparent"></div>
                                                <div className="p-4 md:p-6 space-y-4">
                                                    <div className="flex justify-between items-center bg-white/5 p-3 rounded border border-white/10">
                                                        <div className="h-4 w-24 bg-red-400 rounded animate-pulse"></div>
                                                        <div className="h-6 w-16 bg-red-500/20 rounded text-red-400 text-xs flex items-center justify-center">NUEVA</div>
                                                    </div>
                                                    <div className="flex justify-between items-center bg-white/5 p-3 rounded border border-white/10 opacity-75">
                                                        <div className="h-4 w-32 bg-white/10 rounded"></div>
                                                        <div className="h-6 w-16 bg-white/10 rounded"></div>
                                                    </div>
                                                    <div className="flex justify-between items-center bg-white/5 p-3 rounded border border-white/10 opacity-50">
                                                        <div className="h-4 w-28 bg-white/10 rounded"></div>
                                                        <div className="h-6 w-16 bg-white/10 rounded"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-10"
                            >
                                <p className="text-muted-foreground animate-bounce text-sm md:text-base">
                                    👆 Selecciona tu perfil para ver cómo podemos ayudarte
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </section>

            {/* Features / Architecture Grid (Unified) */}
            <section id="features" className="py-16 md:py-24 relative bg-[#050F1D]/50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12 md:mb-16">
                        <h2 className="text-2xl md:text-5xl font-bold font-heading mb-4">Arquitectura de Rendimiento</h2>
                        <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
                            Tecnología diseñada para eliminar la fricción en el negocio automotriz.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:border-secondary/50 transition-colors">
                            <CardHeader>
                                <Zap className="h-10 w-10 text-secondary mb-2" />
                                <CardTitle className="text-lg md:text-xl">Velocidad Extrema</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground text-sm md:text-base">
                                    Algoritmos que distribuyen solicitudes y reciben ofertas en tiempo real.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:border-primary-light/50 transition-colors">
                            <CardHeader>
                                <Globe className="h-10 w-10 text-primary-light mb-2" />
                                <CardTitle className="text-lg md:text-xl">Red Verificada</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground text-sm md:text-base">
                                    Comunidad exclusiva de talleres y proveedores validados legal y comercialmente.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:border-accent/50 transition-colors">
                            <CardHeader>
                                <ShieldCheck className="h-10 w-10 text-accent mb-2" />
                                <CardTitle className="text-lg md:text-xl">Datos Seguros</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground text-sm md:text-base">
                                    Infraestructura en la nube con encriptación de grado empresarial.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Closing Modernization CTA */}
            <section className="py-16 md:py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent z-0"></div>
                <div className="container relative z-10 mx-auto px-4 text-center">
                    <div className="max-w-3xl mx-auto space-y-8">
                        <h2 className="text-2xl md:text-5xl font-bold font-heading text-white">
                            La tecnología ya llegó a la distribución de autopartes.
                        </h2>
                        <p className="text-xl md:text-2xl text-primary-light font-medium">
                            No te quedes atrás.
                        </p>
                        <p className="text-base md:text-lg text-muted-foreground">
                            Únete hoy a la plataforma que está definiendo el futuro del sector en Colombia.
                        </p>
                        <div className="pt-8">
                            <Link href="/auth/register">
                                <Button size="lg" variant="glow" className="h-14 md:h-16 px-8 md:px-12 text-lg md:text-xl shadow-2xl shadow-primary/20">
                                    Comenzar Transformación Digital
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer Component */}
            <Footer />
        </div>
    )
}
