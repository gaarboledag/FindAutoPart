import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { MessageCircle, Mail, Phone, HelpCircle, Send } from 'lucide-react'

export default function SupportPage() {
    return (
        <div className="min-h-screen bg-[#0B0F19] text-foreground selection:bg-primary/30 selection:text-primary-light">
            <Navbar />

            <main className="container mx-auto px-4 pt-32 pb-20">
                <div className="text-center mb-12">
                    <Badge variant="outline" className="mb-4 text-secondary border-secondary/20">Centro de Ayuda</Badge>
                    <h1 className="text-4xl md:text-5xl font-bold font-heading mb-6">¿Cómo podemos ayudarte?</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Estamos aquí para resolver tus dudas y asegurar que tu operación no se detenga.
                    </p>
                </div>

                {/* Direct Contact Channels */}
                <div className="grid md:grid-cols-3 gap-6 mb-16 max-w-5xl mx-auto">
                    <Card className="bg-white/5 border-white/10 hover:border-green-500/50 transition-colors cursor-pointer group">
                        <CardHeader className="text-center">
                            <div className="mx-auto w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <MessageCircle className="h-6 w-6 text-green-500" />
                            </div>
                            <CardTitle>WhatsApp Soporte</CardTitle>
                            <CardDescription>Respuesta inmediata</CardDescription>
                        </CardHeader>
                        <CardContent className="text-center">
                            <p className="mb-4 text-sm text-muted-foreground">Lun-Vie: 8am - 6pm<br />Sab: 8am - 12pm</p>
                            <Button variant="outline" className="w-full border-green-600 text-green-500 hover:bg-green-600 hover:text-white">
                                Chatear Ahora
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/5 border-white/10 hover:border-blue-500/50 transition-colors cursor-pointer group">
                        <CardHeader className="text-center">
                            <div className="mx-auto w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Phone className="h-6 w-6 text-blue-500" />
                            </div>
                            <CardTitle>Línea Telefónica</CardTitle>
                            <CardDescription>Habla con un asesor</CardDescription>
                        </CardHeader>
                        <CardContent className="text-center">
                            <p className="mb-4 text-sm text-muted-foreground">+57 322 9528027<br />Línea Nacional</p>
                            <Button variant="outline" className="w-full border-blue-600 text-blue-500 hover:bg-blue-600 hover:text-white">
                                Llamar Ahora
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/5 border-white/10 hover:border-primary/50 transition-colors cursor-pointer group">
                        <CardHeader className="text-center">
                            <div className="mx-auto w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Mail className="h-6 w-6 text-primary" />
                            </div>
                            <CardTitle>Correo Electrónico</CardTitle>
                            <CardDescription>Casos complejos</CardDescription>
                        </CardHeader>
                        <CardContent className="text-center">
                            <p className="mb-4 text-sm text-muted-foreground">iacoldevgama@gmail.com<br />Respuesta en 24h</p>
                            <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-white">
                                Enviar Correo
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                    {/* FAQ Section */}
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <HelpCircle className="h-6 w-6 text-secondary" />
                            <h2 className="text-2xl font-bold font-heading">Preguntas Frecuentes</h2>
                        </div>

                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="item-1" className="border-white/10">
                                <AccordionTrigger className="text-lg">¿Tiene costo para los Talleres?</AccordionTrigger>
                                <AccordionContent className="text-muted-foreground">
                                    No. El uso de la plataforma para cotizar y comprar repuestos es totalmente gratuito para los Talleres Mecánicos registrados.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-2" className="border-white/10">
                                <AccordionTrigger className="text-lg">¿Cómo verifican a las tiendas?</AccordionTrigger>
                                <AccordionContent className="text-muted-foreground">
                                    Realizamos una validación estricta de Cámara de Comercio y RUT para asegurar que todos los proveedores sean empresas legalmente constituidas en Colombia.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-3" className="border-white/10">
                                <AccordionTrigger className="text-lg">¿Qué hago si un repuesto sale defectuoso?</AccordionTrigger>
                                <AccordionContent className="text-muted-foreground">
                                    Debes contactar directamente a la tienda que te vendió el repuesto a través del chat de la plataforma o sus datos de contacto. La garantía es responsabilidad directa del vendedor según la Ley 1480.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-4" className="border-white/10">
                                <AccordionTrigger className="text-lg">¿Cómo funcionan los pagos?</AccordionTrigger>
                                <AccordionContent className="text-muted-foreground">
                                    Actualmente la plataforma conecta la oferta y demanda. El pago se acuerda directamente entre Taller y Tienda (Efectivo, Transferencia, Nequi, Daviplata) al momento de la entrega o despacho.
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>

                    {/* Contact Form */}
                    <Card className="bg-white/5 border-white/10">
                        <CardHeader>
                            <CardTitle>Envíanos un mensaje</CardTitle>
                            <CardDescription>Te contactaremos a la brevedad posible.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label htmlFor="name" className="text-sm font-medium">Nombre</label>
                                        <Input id="name" placeholder="Tu nombre" className="bg-black/20 border-white/10" />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="email" className="text-sm font-medium">Correo</label>
                                        <Input id="email" type="email" placeholder="tu@empresa.com" className="bg-black/20 border-white/10" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="subject" className="text-sm font-medium">Asunto</label>
                                    <Input id="subject" placeholder="¿En qué podemos ayudarte?" className="bg-black/20 border-white/10" />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="message" className="text-sm font-medium">Mensaje</label>
                                    <Textarea id="message" placeholder="Describe tu problema o consulta..." className="min-h-[120px] bg-black/20 border-white/10" />
                                </div>
                                <Button className="w-full bg-primary hover:bg-primary/90">
                                    Enviar Mensaje <Send className="ml-2 h-4 w-4" />
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </main>
            <Footer />
        </div>
    )
}
