import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FileText, Lock, Shield, Eye } from 'lucide-react'

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-[#0B0F19] text-foreground selection:bg-primary/30 selection:text-primary-light">
            <Navbar />

            <main className="container mx-auto px-4 pt-32 pb-20">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <Badge variant="outline" className="mb-4 text-primary-light border-primary/20">Legal</Badge>
                        <h1 className="text-4xl md:text-5xl font-bold font-heading mb-6">Política de Privacidad y Tratamiento de Datos</h1>
                        <p className="text-xl text-muted-foreground">
                            Cumplimiento normativo Ley 1581 de 2012 (Habeas Data) y Decreto 1377 de 2013.
                        </p>
                    </div>

                    <div className="grid gap-8">
                        <Card className="bg-white/5 border-white/10">
                            <CardHeader>
                                <div className="flex items-center gap-3 mb-2">
                                    <Shield className="h-6 w-6 text-primary" />
                                    <CardTitle className="text-2xl">1. Responsable del Tratamiento</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4 text-muted-foreground">
                                <p>
                                    <strong>FindPart S.A.S.</strong> (en adelante "FindPart"), sociedad comercial identificada con NIT [NUMERO-NIT], domiciliada en Ibagué, Colombia, es la responsable del tratamiento de los datos personales recolectados a través de su plataforma web y aplicación móvil.
                                </p>
                                <p>
                                    Correo electrónico de contacto para temas de privacidad: <strong>iacoldevgama@gmail.com</strong>
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/5 border-white/10" id="habeas-data">
                            <CardHeader>
                                <div className="flex items-center gap-3 mb-2">
                                    <Lock className="h-6 w-6 text-primary" />
                                    <CardTitle className="text-2xl">2. Derechos del Titular (Habeas Data)</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4 text-muted-foreground">
                                <p>
                                    De conformidad con la Ley 1581 de 2012, usted como titular de los datos tiene los siguientes derechos:
                                </p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li><strong>Acceder</strong>: Conocer gratuitamente los datos personales que hayan sido objeto de tratamiento.</li>
                                    <li><strong>Actualizar y Rectificar</strong>: Solicitar la corrección de datos parciales, inexactos, incompletos o fraccionados.</li>
                                    <li><strong>Cancelar</strong>: Solicitar la supresión de los datos cuando no se respeten los principios, derechos y garantías constitucionales y legales.</li>
                                    <li><strong>Revocar</strong>: Dejar sin efecto la autorización otorgada para el tratamiento de sus datos.</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/5 border-white/10">
                            <CardHeader>
                                <div className="flex items-center gap-3 mb-2">
                                    <Eye className="h-6 w-6 text-primary" />
                                    <CardTitle className="text-2xl">3. Finalidad del Tratamiento</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4 text-muted-foreground">
                                <p>
                                    FindPart recolecta y trata sus datos personales para las siguientes finalidades:
                                </p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Gestionar el registro y creación de cuentas de usuario (Talleres y Tiendas).</li>
                                    <li>Facilitar la intermediación y comunicación para la cotización y compraventa de repuestos automotrices.</li>
                                    <li>Enviar notificaciones transaccionales (nuevas cotizaciones, ofertas recibidas, confirmaciones de pedido).</li>
                                    <li>Realizar análisis estadísticos y de mercado para mejorar la plataforma.</li>
                                    <li>Cumplir con obligaciones legales y regulatorias en Colombia.</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/5 border-white/10">
                            <CardHeader>
                                <div className="flex items-center gap-3 mb-2">
                                    <FileText className="h-6 w-6 text-primary" />
                                    <CardTitle className="text-2xl">4. Seguridad de la Información</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4 text-muted-foreground">
                                <p>
                                    FindPart implementa protocolos de seguridad de alto nivel, incluyendo encriptación de datos en tránsito (SSL/TLS) y en reposo, para proteger su información contra acceso no autorizado, adulteración, pérdida o consulta fraudulenta.
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
