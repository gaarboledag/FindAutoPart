import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Check } from 'lucide-react'

export default function PricingPage() {
    const plans = [
        {
            name: "Talleres",
            price: "Gratis",
            description: "Para talleres mecánicos que buscan repuestos.",
            features: [
                "Cotizaciones ilimitadas",
                "Ácceso a red nacional de proveedores",
                "Gestión de pedidos",
                "Soporte básico"
            ],
            cta: "Registrar Taller",
            href: "/auth/register?role=TALLER"
        },
        {
            name: "Tiendas",
            price: "Comisión",
            description: "Para ventas de repuestos (Pago por venta exitosa).",
            features: [
                "Recepción de solicitudes ilimitadas",
                "Panel de ventas avanzado",
                "Gestión de inventario",
                "Soporte prioritario",
                "Sin costo mensual fijo"
            ],
            cta: "Registrar Tienda",
            href: "/auth/register?role=TIENDA",
            popular: true
        }
    ]

    return (
        <div className="container py-12 md:py-24 space-y-12">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-bold font-heading">
                    Planes Simples y <span className="text-primary-light">Transparentes</span>
                </h1>
                <p className="text-xl text-muted-foreground">
                    Sin costos ocultos. Crecemos solo cuando tú creces.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {plans.map((plan, i) => (
                    <div key={i} className={`relative bg-card p-8 rounded-2xl border ${plan.popular ? 'border-primary shadow-lg shadow-primary/10' : ''}`}>
                        {plan.popular && (
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground text-sm font-bold px-4 py-1 rounded-full">
                                Más Popular
                            </div>
                        )}
                        <div className="text-center mb-8">
                            <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                            <div className="text-4xl font-bold text-primary-light mb-2">{plan.price}</div>
                            <p className="text-muted-foreground">{plan.description}</p>
                        </div>
                        <ul className="space-y-4 mb-8">
                            {plan.features.map((feature, j) => (
                                <li key={j} className="flex items-center gap-3">
                                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>
                        <Link href={plan.href} className="block">
                            <Button className="w-full" variant={plan.popular ? 'default' : 'outline'} size="lg">
                                {plan.cta}
                            </Button>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    )
}
