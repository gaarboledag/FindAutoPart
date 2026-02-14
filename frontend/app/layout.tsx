import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
    subsets: ['latin'],
    variable: '--font-jetbrains-mono',
    display: 'swap',
})

export const metadata: Metadata = {
    title: 'FindPart - Cotizaciones de Autopartes en Segundos',
    description: 'Plataforma B2B que conecta talleres automotrices con tiendas de autopartes. Cotiza, compara y compra repuestos al instante.',
    keywords: 'autopartes, repuestos, talleres, cotizaciones, B2B, marketplace, Colombia',
    icons: {
        icon: '/favicon.png',
        apple: '/favicon.png',
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="es" className={cn(inter.variable, jetbrainsMono.variable)}>
            <body className="font-sans antialiased bg-[#0F172A] text-[#F8FAFC] min-h-screen">
                {children}
            </body>
        </html>
    )
}
