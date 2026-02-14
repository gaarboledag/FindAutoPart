import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
    return (
        <footer className="border-t border-slate-700/50 bg-[#020617] text-sm">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    {/* Brand */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <span className="text-xl font-bold text-[#F97316]">FindPart</span>
                        </div>
                        <p className="text-[#94A3B8] leading-relaxed">
                            La plataforma líder en abastecimiento automotriz digital en el Tolima. Conectamos talleres y proveedores en segundos.
                        </p>
                        <div className="flex gap-4 text-[#64748B]">
                            <Link href="#" className="hover:text-[#F97316] transition-colors p-2 -ml-2">
                                <Facebook className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="hover:text-[#F97316] transition-colors p-2">
                                <Instagram className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="hover:text-[#F97316] transition-colors p-2">
                                <Twitter className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h3 className="font-semibold text-[#F8FAFC] mb-4 text-sm uppercase tracking-wider">Plataforma</h3>
                        <ul className="space-y-3 text-[#94A3B8]">
                            <li><Link href="/auth/login" className="hover:text-[#F97316] transition-colors">Iniciar Sesión</Link></li>
                            <li><Link href="/auth/register" className="hover:text-[#F97316] transition-colors">Registrarse</Link></li>
                            <li><Link href="/#features" className="hover:text-[#F97316] transition-colors">Características</Link></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="font-semibold text-[#F8FAFC] mb-4 text-sm uppercase tracking-wider">Legal</h3>
                        <ul className="space-y-3 text-[#94A3B8]">
                            <li><Link href="/terminos" className="hover:text-[#F97316] transition-colors">Términos y Condiciones</Link></li>
                            <li><Link href="/privacidad" className="hover:text-[#F97316] transition-colors">Política de Privacidad</Link></li>
                            <li><Link href="/privacidad#habeas-data" className="hover:text-[#F97316] transition-colors">Habeas Data</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="font-semibold text-[#F8FAFC] mb-4 text-sm uppercase tracking-wider">Contacto</h3>
                        <ul className="space-y-3 text-[#94A3B8]">
                            <li className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-[#64748B]" />
                                <span>iacoldevgama@gmail.com</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-[#64748B]" />
                                <span>+57 322 9528027</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-[#64748B]" />
                                <span>Ibagué, Colombia</span>
                            </li>
                            <li className="pt-1">
                                <Link href="/soporte" className="text-[#F97316] hover:underline font-medium">
                                    Ir al Centro de Ayuda
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-700/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[#64748B]">
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
