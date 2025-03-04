import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
    return (
        <footer className="bg-(--verde-azulado-80) p-4 md:p-8 lg:p-10 text-white flex flex-col items-center justify-center">
            <div className="w-5/6">
                <div className="flex flex-col md:flex-row items-center justify-between w-full pt-2">
                    <div className="mb-4 md:mb-0">
                        <Link href="/" className="flex flex-row gap-4 items-center">
                            <Image src="/logo.jpg" alt="Logo de Delibite" width={100} height={100} className="h-15 w-15 rounded-full transition transform active:scale-95 hover:scale-105"/>
                            <p className="text-4xl text-white transition transform active:scale-95 hover:scale-105"
                               style={{fontFamily: 'Limelight, sans-serif'}}>delibite</p>
                        </Link>
                    </div>
                    <div className="flex items-center justify-center">
                        <div className="flex flex-row max-2xl space-y-2 space-x-5">
                            <Link href="/packs" className="hover:text-(--primary-dark) active:text-(--oxley-700) transition transform active:scale-95 hover:scale-105">
                                Packs
                            </Link>
                            <Link href="/suscripcion" className="hover:text-(--primary-dark) active:text-(--oxley-700) transition transform active:scale-95 hover:scale-105">
                                Suscripciones
                            </Link>
                            <Link href="/catalogo/productos" className="hover:text-(--primary-dark) active:text-(--oxley-700) transition transform active:scale-95 hover:scale-105">
                                Catálogo
                            </Link>
                            <Link href="/perfil" className="hover:text-(--primary-dark) active:text-(--oxley-700) transition transform active:scale-95 hover:scale-105">
                                Perfil
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="w-2/5 max-lg:w-1/2 max-md:w-full mt-4 pb-2">
                    <p className="text-justify max-md:text-center">
                        Delibite te lleva comida fresca y de calidad hasta tu puerta, con múltiples formas de pago y un servicio rápido y seguro. 🍽️🚀
                    </p>
                </div>
                <hr className="my-4 border-t-2 border-gray-300 pb-2"/>
                <div className="flex flex-row max-md:justify-center max-md:flex-col max-md:gap-4 justify-between w-full">
                    <div className="flex space-x-0.5 mb-2 max-md:mb-0 max-md:justify-center max-md:mt-4">
                        <p>&copy;</p>
                        <p>2025 Delibite S.L. Todos los derechos reservados</p>
                    </div>
                    <div className="flex flex-row max-md:justify-center space-x-4 max-md:space-x-2">
                        <a href="mailto:contacto.delibite@gmail.com" className="hover:text-(--primary-dark) transition transform active:scale-95 hover:scale-105">contacto.delibite@gmail.com</a>
                    </div>

                </div>
                <div className="flex flex-row max-md:justify-center max-md:flex-col max-md:gap-6 items-center justify-between w-full mt-4">
                    <div className="flex flex-row max-md:justify-center space-x-4 max-md:space-x-2 text-sm items-center">
                        <Link href="/terminos-y-condiciones" className="hover:text-(--primary-dark) transition transform active:scale-95 hover:scale-105">
                            Términos y Condiciones
                        </Link>
                        <Link href="/politica-de-privacidad" className="hover:text-(--primary-dark) transition transform active:scale-95 hover:scale-105">
                            Política de Privacidad
                        </Link>
                        <Link href="/aviso-legal" className="hover:text-(--primary-dark) transition transform active:scale-95 hover:scale-105">
                            Aviso Legal
                        </Link>
                    </div>
                    <div className="flex space-x-2 max-md:justify-center max-md:space-x-6 items-center">
                        <div className="flex flex-row gap-4 mx-4">
                            <p>PayPal</p>
                            <p>Visa</p>
                        </div>
                        <p className="border-l border-white pl-4">+34 600 123 456</p>
                    </div>
                </div>
            </div>
        </footer>

    )
}