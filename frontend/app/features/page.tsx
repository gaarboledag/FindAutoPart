import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { CheckCircle, Shield, Truck, Zap } from 'lucide-react'

export default function FeaturesPage() {
    const features = [
        {
            icon: <Zap className="h-6 w-6 text-yellow-500" />,
            title: "Cotizaciones Rápidas",
            description: "Recibe ofertas de múltiples proveedores en minutos, no en días."
        },
        {
            icon: <Shield className="h-6 w-6 text-primary" />,
            title: "Proveedores Verificados",
            description: "Trabajamos solo con tiendas y talleres de confianza y verificados."
        },
        {
            icon: <Truck className="h-6 w-6 text-blue-500" />,
            title: "Logística Integrada",
            description: "Seguimiento en tiempo real de tus pedidos desde la tienda hasta tu taller."
        },
        {
            icon: <CheckCircle className="h-6 w-6 text-green-500" />,
            title: "Garantía Asegurada",
            description: "Gestión de garantías y devoluciones simplificada a través de la plataforma."
        }
    ]

    return (
        <div className="container py-12 md:py-24 space-y-12">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-bold font-heading">
                    Todo lo que necesitas para tu <span className="text-primary-light">Taller</span>
                </h1>
                <p className="text-xl text-muted-foreground">
                    FindPart centraliza la búsqueda de repuestos, gestión de pedidos y logística en una sola plataforma.
                </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((feature, i) => (
                    <div key={i} className="bg-card p-6 rounded-xl border hover:border-primary/50 transition-colors">
                        <div className="mb-4 bg-muted w-12 h-12 rounded-lg flex items-center justify-center">
                            {feature.icon}
                        </div>
                        <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                        <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                ))}
            </div>

            <div className="text-center pt-12">
                <Link href="/auth/register">
                    <Button size="lg" className="text-lg px-8">
                        Comienza Gratis
                    </Button>
                </Link>
            </div>
        </div>
    )
}
