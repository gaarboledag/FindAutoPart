import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
    return (
        <footer className="border-t border-white/10 bg-[#050F1D] text-sm">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    {/* Brand */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <span className="text-xl font-bold font-heading text-primary-light">FindPart</span>
                        </div>
                        <p className="text-muted-foreground">
                            La plataforma líder en abastecimiento automotriz digital en el Tolima. Conectamos talleres y proveedores en segundos.
                        </p>
                        <div className="flex gap-4 text-muted-foreground">
                            <Link href="#" className="hover:text-primary-light transition-colors"><Facebook className="h-5 w-5" /></Link>
                            <Link href="#" className="hover:text-primary-light transition-colors"><Instagram className="h-5 w-5" /></Link>
                            <Link href="#" className="hover:text-primary-light transition-colors"><Twitter className="h-5 w-5" /></Link>
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h3 className="font-bold text-white mb-4">Plataforma</h3>
                        <ul className="space-y-2 text-muted-foreground">
                            <li><Link href="/auth/login" className="hover:text-primary-light transition-colors">Iniciar Sesión</Link></li>
                            <li><Link href="/auth/register" className="hover:text-primary-light transition-colors">Registrarse</Link></li>
                            <li><Link href="/#features" className="hover:text-primary-light transition-colors">Características</Link></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="font-bold text-white mb-4">Legal</h3>
                        <ul className="space-y-2 text-muted-foreground">
                            <li><Link href="/terminos" className="hover:text-primary-light transition-colors">Términos y Condiciones</Link></li>
                            <li><Link href="/privacidad" className="hover:text-primary-light transition-colors">Política de Privacidad</Link></li>
                            <li><Link href="/privacidad#habeas-data" className="hover:text-primary-light transition-colors">Habeas Data</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="font-bold text-white mb-4">Contacto</h3>
                        <ul className="space-y-2 text-muted-foreground">
                            <li className="flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                <span>iacoldevgama@gmail.com</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Phone className="h-4 w-4" />
                                <span>+57 322 9528027</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                <span>Ibagué, Colombia</span>
                            </li>
                            <li className="pt-2">
                                <Link href="/soporte" className="text-primary-light hover:underline">
                                    Ir al Centro de Ayuda
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-muted-foreground">
                    <p>© 2026 FindPart S.A.S. Todos los derechos reservados.</p>
                    <div className="flex items-center gap-2">
                        <span className="text-xs">Desarrollado por</span>
                        <Image
                            src="/LOGO_IACOL.png"
                            alt="IACol Dev Logo"
                            width={100}
                            height={35}
                            className="h-8 w-auto object-contain"
                        />
                    </div>
                </div>
            </div>
        </footer>
    )
}
