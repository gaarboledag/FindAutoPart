import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, ShieldCheck, Zap, Globe, Cpu, BarChart3, Search } from 'lucide-react'

export default function Home() {
    return (
        <div className="min-h-screen bg-[#0B0F19] text-foreground selection:bg-primary/30 selection:text-primary-light overflow-x-hidden">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                {/* Background Essentials */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background z-0"></div>
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10 z-0 mask-image:linear-gradient(to_bottom,black,transparent)"></div>

                {/* Neural Network Abstract Visualization (CSS only for perf) */}
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-3xl animate-pulse z-0"></div>

                <div className="container relative z-10 mx-auto px-4 text-center">
                    <Badge variant="tech" className="mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <span className="relative flex h-2 w-2 mr-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
                        </span>
                        Sistema Operativo v2.0
                    </Badge>

                    <h1 className="text-5xl md:text-7xl font-bold font-heading tracking-tight mb-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                        El Sistema Nervioso del <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-light via-secondary to-primary-light animate-gradient bg-300%">
                            Abastecimiento Automotriz
                        </span>
                    </h1>

                    <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                        Conectamos talleres y proveedores en milisegundos.
                        Infraestructura digital para la máxima velocidad y precisión.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                        <Link href="/auth/register">
                            <Button size="lg" variant="glow" className="h-12 px-8 text-lg w-full sm:w-auto">
                                Comenzar Ahora <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                        <Link href="#features">
                            <Button size="lg" variant="outline" className="h-12 px-8 text-lg w-full sm:w-auto border-white/10 hover:bg-white/5">
                                Ver Arquitectura
                            </Button>
                        </Link>
                    </div>

                    {/* Dashboard Preview Abstract */}
                    <div className="mt-20 relative mx-auto max-w-5xl rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-2 shadow-2xl animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
                        <div className="rounded-lg bg-[#0B0F19]/80 border border-white/5 aspect-[16/9] overflow-hidden relative group">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <p className="text-muted-foreground/50 font-mono text-sm">[ Dashboard Interface Visualization ]</p>
                            </div>
                            {/* Abstract UI Elements */}
                            <div className="absolute top-0 left-0 w-64 h-full border-r border-white/5 bg-white/[0.02]"></div>
                            <div className="absolute top-4 right-4 flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500/20"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500/20"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500/20"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-24 relative bg-[#050F1D]/50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold font-heading mb-4">Arquitectura de Rendimiento</h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            Diseñado para eliminar la fricción en cada paso del proceso de compra y venta.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:border-secondary/50 transition-colors">
                            <CardHeader>
                                <Zap className="h-10 w-10 text-secondary mb-2" />
                                <CardTitle className="text-xl">Cotización Instantánea</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    Algoritmos de coincidencia que distribuyen tu solicitud a proveedores relevantes en milisegundos.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:border-primary-light/50 transition-colors">
                            <CardHeader>
                                <Globe className="h-10 w-10 text-primary-light mb-2" />
                                <CardTitle className="text-xl">Red Nacional</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    Accede a un inventario descentralizado de miles de tiendas verificadas en todo el país.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:border-accent/50 transition-colors">
                            <CardHeader>
                                <ShieldCheck className="h-10 w-10 text-accent mb-2" />
                                <CardTitle className="text-xl">Transacciones Seguras</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    Infraestructura de pagos y validación empresarial para operaciones B2B sin riesgos.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:border-secondary/50 transition-colors">
                            <CardHeader>
                                <Cpu className="h-10 w-10 text-secondary mb-2" />
                                <CardTitle className="text-xl">Inteligencia de Mercado</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    Analíticas en tiempo real sobre precios, tiempos de entrega y disponibilidad de stock.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:border-primary-light/50 transition-colors">
                            <CardHeader>
                                <Search className="h-10 w-10 text-primary-light mb-2" />
                                <CardTitle className="text-xl">Búsqueda Semántica</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    Motor de búsqueda avanzado optimizado para códigos de parte, VIN y especificaciones técnicas.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:border-accent/50 transition-colors">
                            <CardHeader>
                                <BarChart3 className="h-10 w-10 text-accent mb-2" />
                                <CardTitle className="text-xl">Gestión Centralizada</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    Control total de pedidos, facturación y logística desde un dashboard unificado.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/5 z-0"></div>
                <div className="container relative z-10 mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-5xl font-bold font-heading mb-6 text-white">
                        ¿Listo para modernizar tu operación?
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
                        Únete a la red que está definiendo el estándar del comercio automotriz digital.
                    </p>
                    <Link href="/auth/register">
                        <Button size="lg" variant="glow" className="h-14 px-10 text-xl">
                            Crear Cuenta Profesional
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Simple Footer */}
            <footer className="border-t border-white/10 py-12 bg-[#050F1D]">
                <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <span className="text-xl font-bold font-heading text-primary-light">FindPart</span>
                        <span className="text-sm text-muted-foreground">© 2026</span>
                    </div>
                    <div className="flex gap-8 text-sm text-muted-foreground">
                        <Link href="#" className="hover:text-primary-light transition-colors">Términos</Link>
                        <Link href="#" className="hover:text-primary-light transition-colors">Privacidad</Link>
                        <Link href="#" className="hover:text-primary-light transition-colors">Soporte</Link>
                    </div>
                </div>
            </footer>
        </div>
    )
}
