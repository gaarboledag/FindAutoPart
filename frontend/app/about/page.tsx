import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'

export default function AboutPage() {
    return (
        <div className="container py-12 md:py-24 space-y-24">
            {/* Hero Section */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                    <h1 className="text-4xl md:text-5xl font-bold font-sans">
                        Revolucionando el Mercado de <span className="text-[#F8FAFC]">Autopartes</span> en Colombia
                    </h1>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                        FindPart nació con una misión clara: conectar talleres mecánicos con proveedores de repuestos de manera eficiente, transparente y rápida. Entendemos que cada minuto que un vehículo pasa en el taller es tiempo perdido para el cliente y dinero perdido para el mecánico.
                    </p>
                    <Link href="/contact">
                        <Button variant="outline">Contáctanos</Button>
                    </Link>
                </div>
                <div className="relative aspect-video rounded-xl overflow-hidden border bg-muted">
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                        <span className="text-4xl font-bold opacity-20">FindPart Team</span>
                        {/* Replace with actual team image if available */}
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center border-y py-12">
                <div>
                    <div className="text-4xl font-bold text-[#F8FAFC] mb-2">+500</div>
                    <div className="text-muted-foreground">Talleres Registrados</div>
                </div>
                <div>
                    <div className="text-4xl font-bold text-[#F8FAFC] mb-2">+100</div>
                    <div className="text-muted-foreground">Tiendas Asociadas</div>
                </div>
                <div>
                    <div className="text-4xl font-bold text-[#F8FAFC] mb-2">+50k</div>
                    <div className="text-muted-foreground">Repuestos Disponibles</div>
                </div>
                <div>
                    <div className="text-4xl font-bold text-[#F8FAFC] mb-2">24h</div>
                    <div className="text-muted-foreground">Tiempo Promedio de Entrega</div>
                </div>
            </div>

            {/* Mission */}
            <div className="max-w-3xl mx-auto text-center space-y-6">
                <h2 className="text-3xl font-bold font-sans">Nuestra Misión</h2>
                <p className="text-lg text-muted-foreground">
                    Empoderar a los mecánicos y refaccionarias de Colombia con tecnología que simplifica sus operaciones, aumenta sus ventas y mejora la experiencia de los dueños de vehículos.
                </p>
            </div>
        </div>
    )
}
