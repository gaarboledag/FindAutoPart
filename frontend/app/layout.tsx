import type { Metadata } from 'next'
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
    subsets: ['latin'],
    variable: '--font-space-grotesk',
    display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
    subsets: ['latin'],
    variable: '--font-jetbrains-mono',
    display: 'swap',
})

export const metadata: Metadata = {
    title: 'FindPartAutopartes - El Sistema Nervioso del Abastecimiento',
    description: 'Plataforma B2B que conecta talleres automotrices con tiendas de autopartes.',
    keywords: 'autopartes, repuestos, talleres, cotizaciones, B2B, sistema nervioso',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="es" className={cn(inter.variable, spaceGrotesk.variable, jetbrainsMono.variable)}>
            <body className="font-sans antialiased bg-background text-foreground min-h-screen">
                {children}
            </body>
        </html>
    )
}
