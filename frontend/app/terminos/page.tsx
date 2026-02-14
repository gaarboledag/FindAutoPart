import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Scale, Users, AlertTriangle, Gavel } from 'lucide-react'

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-[#0F172A] text-foreground selection:bg-primary/30 selection:text-[#F8FAFC]">
            <Navbar />

            <main className="container mx-auto px-4 pt-32 pb-20">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <Badge variant="outline" className="mb-4 text-[#F8FAFC] border-primary/20">Legal</Badge>
                        <h1 className="text-4xl md:text-5xl font-bold font-sans mb-6">Términos y Condiciones de Uso</h1>
                        <p className="text-xl text-muted-foreground">
                            Reglamento de uso de la plataforma FindPart para Talleres y Proveedores.
                        </p>
                    </div>

                    <div className="grid gap-8">
                        <Card className="bg-white/5 border-white/10">
                            <CardHeader>
                                <div className="flex items-center gap-3 mb-2">
                                    <Scale className="h-6 w-6 text-primary" />
                                    <CardTitle className="text-2xl">1. Naturaleza del Servicio</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4 text-muted-foreground">
                                <p>
                                    <strong>FindPart</strong> es una plataforma tecnológica de intermediación (SaaS / Marketplace B2B) que conecta a Talleres Mecánicos ("Compradores") con Tiendas de Repuestos ("Proveedores").
                                </p>
                                <p className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-yellow-200/90">
                                    <strong>Importante:</strong> FindPart NO es propietario, vendedor, ni proveedor directo de los repuestos ofrecidos. Actuamos exclusivamente como facilitador tecnológico entre las partes.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/5 border-white/10">
                            <CardHeader>
                                <div className="flex items-center gap-3 mb-2">
                                    <Users className="h-6 w-6 text-primary" />
                                    <CardTitle className="text-2xl">2. Obligaciones de los Usuarios</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4 text-muted-foreground">
                                <h4 className="font-bold text-white">2.1. Talleres Mecánicos</h4>
                                <ul className="list-disc pl-6 space-y-2 mb-4">
                                    <li>Proporcionar información veraz y técnica precisa al solicitar cotizaciones.</li>
                                    <li>Respetar los acuerdos comerciales pactados con los proveedores contactados a través de la plataforma.</li>
                                </ul>

                                <h4 className="font-bold text-white">2.2. Proveedores de Repuestos</h4>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Garantizar la autenticidad, calidad y legalidad de los repuestos ofrecidos (Estatuto del Consumidor - Ley 1480 de 2011).</li>
                                    <li>Cumplir con los precios y tiempos de entrega ofertados en la plataforma.</li>
                                    <li>Emitir la facturación legal correspondiente por las ventas realizadas.</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/5 border-white/10">
                            <CardHeader>
                                <div className="flex items-center gap-3 mb-2">
                                    <AlertTriangle className="h-6 w-6 text-primary" />
                                    <CardTitle className="text-2xl">3. Limitación de Responsabilidad</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4 text-muted-foreground">
                                <p>
                                    FindPart no se hace responsable por:
                                </p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>La calidad, idoneidad o procedencia de los repuestos vendidos por los Proveedores.</li>
                                    <li>Incumplimientos en tiempos de entrega o garantías por parte de los Proveedores.</li>
                                    <li>Lucro cesante o daños indirectos derivados del uso de la plataforma.</li>
                                </ul>
                                <p>
                                    Cualquier reclamación sobre un producto debe tramitarse directamente entre el Taller y la Tienda, conforme a las normas de protección al consumidor vigentes en Colombia.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/5 border-white/10">
                            <CardHeader>
                                <div className="flex items-center gap-3 mb-2">
                                    <Gavel className="h-6 w-6 text-primary" />
                                    <CardTitle className="text-2xl">4. Legislación Aplicable</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4 text-muted-foreground">
                                <p>
                                    Estos términos se rigen e interpretan de acuerdo con las leyes de la República de Colombia. Cualquier controversia que surja en relación con este acuerdo será sometida a los jueces competentes de la ciudad de Ibagué o al Centro de Arbitraje y Conciliación de la Cámara de Comercio de Ibagué.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
