'use client'

import { useState } from 'react'
import Link from 'next/link'
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
    Wrench,
    Store,
    CheckCircle2,
    Users,
    TrendingUp
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Home() {
    const [selectedRole, setSelectedRole] = useState<'TALLER' | 'TIENDA' | null>(null)

    return (
        <div className="min-h-screen bg-[#0F172A] text-[#F8FAFC] selection:bg-orange-500/30 selection:text-white overflow-x-hidden">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-24 pb-12 lg:pt-44 lg:pb-28 overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1E293B] via-[#0F172A] to-[#0F172A] z-0"></div>
                <div className="absolute inset-0 z-0 opacity-[0.04]"
                    style={{
                        backgroundImage: `linear-gradient(rgba(148,163,184,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.3) 1px, transparent 1px)`,
                        backgroundSize: '40px 40px',
                        maskImage: 'linear-gradient(to bottom, black 0%, transparent 70%)',
                        WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 70%)',
                    }}
                ></div>

                <div className="container relative z-10 mx-auto px-4 text-center">
                    <Badge variant="tech" className="mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <span className="relative flex h-2 w-2 mr-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F97316] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F97316]"></span>
                        </span>
                        Comunicamos Talleres y Tiendas de Repuestos
                    </Badge>

                    <h1 className="text-3xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100 text-[#F8FAFC]">
                        Cotizaciones de Repuestos <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F97316] via-[#FB923C] to-[#F97316]">
                            en Segundos
                        </span>
                    </h1>

                    <p className="text-base md:text-xl lg:text-2xl text-[#94A3B8] max-w-3xl mx-auto mb-10 md:mb-14 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                        Conectamos talleres y proveedores en milisegundos. <br className="hidden md:block" />
                        Líderes en abastecimiento automotriz digital.
                    </p>

                    {/* Role Selector */}
                    <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 mb-10 md:mb-14 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 max-w-4xl mx-auto">
                        <button
                            onClick={() => setSelectedRole('TALLER')}
                            className={`group relative w-full md:w-1/2 p-5 md:p-8 rounded-lg border-2 transition-all duration-300 min-h-[120px] ${selectedRole === 'TALLER'
                                ? 'bg-[#F97316]/10 border-[#F97316] shadow-[0_0_25px_rgba(249,115,22,0.3)]'
                                : 'bg-[#1E293B]/50 border-slate-700/50 hover:border-[#F97316]/40 hover:bg-[#1E293B]'
                                }`}
                        >
                            <div className="flex flex-col items-center gap-3 md:gap-4">
                                <div className={`p-3 md:p-4 rounded-lg ${selectedRole === 'TALLER' ? 'bg-[#F97316] text-white' : 'bg-[#334155] text-[#94A3B8] group-hover:text-[#F97316] group-hover:bg-[#F97316]/10'}`}>
                                    <Wrench className="h-7 w-7 md:h-9 md:w-9" />
                                </div>
                                <h3 className="text-lg md:text-2xl font-bold text-[#F8FAFC]">Soy Taller Mecánico</h3>
                                <p className="text-xs md:text-sm text-[#94A3B8]">Busco repuestos rápidos</p>
                            </div>
                            {selectedRole === 'TALLER' && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#F97316] text-white text-xs px-3 py-1 rounded-md font-bold shadow-lg">
                                    SELECCIONADO
                                </div>
                            )}
                        </button>

                        <button
                            onClick={() => setSelectedRole('TIENDA')}
                            className={`group relative w-full md:w-1/2 p-5 md:p-8 rounded-lg border-2 transition-all duration-300 min-h-[120px] ${selectedRole === 'TIENDA'
                                ? 'bg-[#F97316]/10 border-[#F97316] shadow-[0_0_25px_rgba(249,115,22,0.3)]'
                                : 'bg-[#1E293B]/50 border-slate-700/50 hover:border-[#F97316]/40 hover:bg-[#1E293B]'
                                }`}
                        >
                            <div className="flex flex-col items-center gap-3 md:gap-4">
                                <div className={`p-3 md:p-4 rounded-lg ${selectedRole === 'TIENDA' ? 'bg-[#F97316] text-white' : 'bg-[#334155] text-[#94A3B8] group-hover:text-[#F97316] group-hover:bg-[#F97316]/10'}`}>
                                    <Store className="h-7 w-7 md:h-9 md:w-9" />
                                </div>
                                <h3 className="text-lg md:text-2xl font-bold text-[#F8FAFC]">Soy Proveedor</h3>
                                <p className="text-xs md:text-sm text-[#94A3B8]">Vendo repuestos</p>
                            </div>
                            {selectedRole === 'TIENDA' && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#F97316] text-white text-xs px-3 py-1 rounded-md font-bold shadow-lg">
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
                                <div className="border border-slate-700/50 rounded-lg p-5 md:p-10 bg-[#1E293B]/50">
                                    {selectedRole === 'TALLER' ? (
                                        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                                            <div className="text-left space-y-4 md:space-y-6">
                                                <h2 className="text-2xl md:text-4xl font-bold text-[#F8FAFC]">
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
                                                        <li key={i} className="flex items-start gap-3 text-sm md:text-base text-[#94A3B8]">
                                                            <CheckCircle2 className="h-5 w-5 text-[#F97316] shrink-0 mt-0.5" />
                                                            {benefit}
                                                        </li>
                                                    ))}
                                                </ul>
                                                <div className="p-3 md:p-4 bg-[#0F172A]/60 rounded-lg border border-slate-700/50">
                                                    <div className="flex items-center gap-3 text-[#F97316] font-medium text-sm md:text-base">
                                                        <Users className="h-4 w-4 md:h-5 md:w-5" />
                                                        "Los 30 talleres más grandes de Ibagué ya usan FindPart."
                                                    </div>
                                                </div>
                                                <div className="pt-2">
                                                    <Link href="/auth/register?role=TALLER">
                                                        <Button variant="cta" size="lg" className="w-full text-base md:text-lg h-14">
                                                            Cotizar Gratis Ahora <ArrowRight className="ml-2 h-5 w-5" />
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </div>
                                            <div className="relative h-[280px] md:h-[380px] rounded-lg overflow-hidden border border-slate-700/50 shadow-2xl bg-[#0F172A]/80">
                                                <div className="absolute inset-0 bg-gradient-to-br from-[#F97316]/10 to-transparent"></div>
                                                <div className="p-4 md:p-6 space-y-4">
                                                    <div className="h-8 w-2/3 bg-slate-700/50 rounded-lg animate-pulse"></div>
                                                    <div className="space-y-2">
                                                        <div className="h-20 w-full bg-[#1E293B] rounded-lg border border-slate-700/30 p-3 flex gap-4 items-center">
                                                            <div className="h-10 w-10 md:h-12 md:w-12 bg-green-500/15 rounded-lg flex items-center justify-center text-green-400 font-bold">$</div>
                                                            <div className="flex-1 space-y-2">
                                                                <div className="h-3 w-1/2 bg-slate-700/50 rounded"></div>
                                                                <div className="h-3 w-3/4 bg-slate-700/50 rounded"></div>
                                                            </div>
                                                        </div>
                                                        <div className="h-20 w-full bg-[#1E293B] rounded-lg border border-slate-700/30 p-3 flex gap-4 items-center opacity-60">
                                                            <div className="h-10 w-10 md:h-12 md:w-12 bg-[#F97316]/15 rounded-lg flex items-center justify-center text-[#F97316] font-bold">%</div>
                                                            <div className="flex-1 space-y-2">
                                                                <div className="h-3 w-1/2 bg-slate-700/50 rounded"></div>
                                                                <div className="h-3 w-3/4 bg-slate-700/50 rounded"></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                                            <div className="text-left space-y-4 md:space-y-6">
                                                <h2 className="text-2xl md:text-4xl font-bold text-[#F8FAFC]">
                                                    Potencia tus Ventas
                                                </h2>
                                                <ul className="space-y-3 md:space-y-4">
                                                    {[
                                                        "Accede a cotizaciones de los principales talleres.",
                                                        "Conoce nuevos clientes y aumenta tu alcance.",
                                                        "Brinda cotizaciones en segundos digitalmente.",
                                                        "Únete a la red digital de autopartes más grande de Colombia.",
                                                    ].map((benefit, i) => (
                                                        <li key={i} className="flex items-start gap-3 text-sm md:text-base text-[#94A3B8]">
                                                            <CheckCircle2 className="h-5 w-5 text-[#F97316] shrink-0 mt-0.5" />
                                                            {benefit}
                                                        </li>
                                                    ))}
                                                </ul>
                                                <div className="space-y-2">
                                                    <div className="p-3 md:p-4 bg-[#0F172A]/60 rounded-lg border border-slate-700/50">
                                                        <div className="flex items-center gap-3 text-[#F97316] font-medium text-sm md:text-base">
                                                            <TrendingUp className="h-4 w-4 md:h-5 md:w-5" />
                                                            "Las tiendas más grandes de Ibagué ya están vendiendo."
                                                        </div>
                                                    </div>
                                                    <div className="p-3 md:p-4 bg-[#0F172A]/60 rounded-lg border border-slate-700/50">
                                                        <div className="flex items-center gap-3 text-[#F8FAFC] font-medium text-sm md:text-base">
                                                            <Users className="h-4 w-4 md:h-5 md:w-5 text-[#94A3B8]" />
                                                            "Los 30 talleres más grandes ya cotizan aquí."
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="pt-2">
                                                    <Link href="/auth/register?role=TIENDA">
                                                        <Button variant="cta" size="lg" className="w-full text-base md:text-lg h-14">
                                                            <span className="flex flex-col items-center leading-none py-1">
                                                                <span>Vender Ahora</span>
                                                                <span className="text-[10px] md:text-xs opacity-90 font-normal mt-1">Tenemos 6 cotizaciones disponibles en tu área</span>
                                                            </span>
                                                            <ArrowRight className="ml-2 h-5 w-5" />
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </div>
                                            <div className="relative h-[280px] md:h-[380px] rounded-lg overflow-hidden border border-slate-700/50 shadow-2xl bg-[#0F172A]/80">
                                                <div className="absolute inset-0 bg-gradient-to-bl from-[#F97316]/10 to-transparent"></div>
                                                <div className="p-4 md:p-6 space-y-4">
                                                    <div className="flex justify-between items-center bg-[#1E293B] p-3 rounded-lg border border-slate-700/30">
                                                        <div className="h-4 w-24 bg-red-400 rounded animate-pulse"></div>
                                                        <div className="h-6 w-16 bg-red-500/15 rounded-md text-red-400 text-xs flex items-center justify-center font-semibold">NUEVA</div>
                                                    </div>
                                                    <div className="flex justify-between items-center bg-[#1E293B] p-3 rounded-lg border border-slate-700/30 opacity-60">
                                                        <div className="h-4 w-32 bg-slate-700/50 rounded"></div>
                                                        <div className="h-6 w-16 bg-slate-700/50 rounded-md"></div>
                                                    </div>
                                                    <div className="flex justify-between items-center bg-[#1E293B] p-3 rounded-lg border border-slate-700/30 opacity-40">
                                                        <div className="h-4 w-28 bg-slate-700/50 rounded"></div>
                                                        <div className="h-6 w-16 bg-slate-700/50 rounded-md"></div>
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
                                className="text-center py-8"
                            >
                                <p className="text-[#94A3B8] animate-bounce text-sm md:text-base">
                                    👆 Selecciona tu perfil para ver cómo podemos ayudarte
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </section>

            {/* Features / Architecture Grid */}
            <section id="features" className="py-14 md:py-24 relative bg-[#020617]/50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-10 md:mb-16">
                        <h2 className="text-2xl md:text-5xl font-bold mb-4 text-[#F8FAFC]">Arquitectura de Rendimiento</h2>
                        <p className="text-[#94A3B8] text-sm md:text-lg max-w-2xl mx-auto">
                            Tecnología diseñada para eliminar la fricción en el negocio automotriz.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        <Card className="hover:border-[#F97316]/30 transition-all duration-300">
                            <CardHeader>
                                <Zap className="h-10 w-10 text-[#F97316] mb-2" />
                                <CardTitle className="text-lg md:text-xl">Velocidad Extrema</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-[#94A3B8] text-sm md:text-base">
                                    Algoritmos que distribuyen solicitudes y reciben ofertas en tiempo real.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="hover:border-[#F97316]/30 transition-all duration-300">
                            <CardHeader>
                                <Globe className="h-10 w-10 text-[#F97316] mb-2" />
                                <CardTitle className="text-lg md:text-xl">Red Verificada</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-[#94A3B8] text-sm md:text-base">
                                    Comunidad exclusiva de talleres y proveedores validados legal y comercialmente.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="hover:border-[#F97316]/30 transition-all duration-300">
                            <CardHeader>
                                <ShieldCheck className="h-10 w-10 text-[#22C55E] mb-2" />
                                <CardTitle className="text-lg md:text-xl">Datos Seguros</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-[#94A3B8] text-sm md:text-base">
                                    Infraestructura en la nube con encriptación de grado empresarial.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Closing CTA */}
            <section className="py-14 md:py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-[#F97316]/5 to-transparent z-0"></div>
                <div className="container relative z-10 mx-auto px-4 text-center">
                    <div className="max-w-3xl mx-auto space-y-6 md:space-y-8">
                        <h2 className="text-2xl md:text-5xl font-bold text-[#F8FAFC]">
                            La tecnología ya llegó a la distribución de autopartes.
                        </h2>
                        <p className="text-xl md:text-2xl text-[#F97316] font-semibold">
                            No te quedes atrás.
                        </p>
                        <p className="text-sm md:text-lg text-[#94A3B8]">
                            Únete hoy a la plataforma que está definiendo el futuro del sector en Colombia.
                        </p>
                        <div className="pt-6 md:pt-8">
                            <Link href="/auth/register">
                                <Button variant="glow" size="lg" className="h-14 md:h-16 px-8 md:px-12 text-lg md:text-xl">
                                    Comenzar Transformación Digital
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}
