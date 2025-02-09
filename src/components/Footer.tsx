import React from "react";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-(--verde-azulado-80) p-4 md:p-8 lg:p-10 text-white flex flex-col items-center justify-center">
            <div className="w-full md:w-3/4">
                <div className="flex flex-col md:flex-row items-center justify-between w-full pt-2">
                    <div className="mb-4 md:mb-0">
                        <Link href="/">
                            <p className="text-4xl text-white transition transform active:scale-95 hover:scale-105"
                               style={{fontFamily: 'Limelight, sans-serif'}}>delibite</p>
                        </Link>
                    </div>
                    <div className="flex items-center justify-center">
                        <ul className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-5">
                            <Link href="/packs" className="hover:text-(--primary-dark) active:text-(--oxley-700)
                                                            transition transform active:scale-95 hover:scale-105">
                                <li>Packs</li>
                            </Link>
                            <Link href="/suscripciones" className="hover:text-(--primary-dark) active:text-(--oxley-700)
                                                            transition transform active:scale-95 hover:scale-105">
                                <li>Suscripciones</li>
                            </Link>
                            <Link href="/catalogo/productos" className="hover:text-(--primary-dark) active:text-(--oxley-700)
                                                            transition transform active:scale-95 hover:scale-105">
                                <li>Catalogo</li>
                            </Link>
                            <Link href="/perfil" className="hover:text-(--primary-dark) active:text-(--oxley-700)
                                                            transition transform active:scale-95 hover:scale-105">
                                <li>Perfil</li>
                            </Link>
                        </ul>
                    </div>
                </div>
                <div className="w-full md:w-1/3 mt-4 pb-2">
                    <p className="text-justify">
                        Delibite te lleva comida fresca y de calidad hasta tu puerta,
                        con múltiples formas de pago y un servicio rápido y seguro. 🍽️🚀
                    </p>
                </div>
                <hr className="my-4 border-t-2 border-gray-300 pb-2"/>
                <div className="flex flex-col md:flex-row justify-between">
                    <div className="flex space-x-0.5 mb-2 md:mb-0"><p>&copy;</p><p>2025 Delibite S.L. All rights reserved</p></div>
                    <div className="flex space-x-2">
                        <p>PayPal</p>
                        <p>Visa</p>
                    </div>
                </div>
            </div>
        </footer>
    )
}