import React from "react";

export default function Footer(){

    return (
        <footer className="bg-(--verde-azulado-80) p-2 py-10 text-white flex items-center justify-center">
            <div className=" w-3/4">
                <div className="flex items-center justify-between w-full pt-2">
                    <div className="">
                        <span className="text-4xl text-white"
                              style={{fontFamily: 'Limelight, sans-serif'}}>delibite</span>
                    </div>
                    <div className="flex items-center justify-center ">
                        <ul className="flex space-x-5 ">
                            <a href="">
                                <li>Packs</li>
                            </a>
                            <a href="">
                                <li>Suscripciones</li>
                            </a>
                            <a href="">
                                <li>Catalogo</li>
                            </a>
                            <a href="">
                                <li>Perfil</li>
                            </a>
                        </ul>
                    </div>
                </div>
                <div className="w-1/3 mt-4 pb-2">
                    <p className="text-justify">
                        Delibite te lleva comida fresca y de calidad hasta tu puerta,
                        con múltiples formas de pago y un servicio rápido y seguro. 🍽️🚀
                    </p>
                </div>
                <hr className="my-4 border-t-2 border-gray-300 pb-2"/>
                <div className="flex justify-between">
                    <div className="flex space-x-0.5"><p>&copy;</p><p>2025 Delibite S.L. All rights reserved</p></div>
                    <div className="flex space-x-2">
                        <p>PayPal</p>
                        <p>Visa</p>
                    </div>
                </div>
            </div>
        </footer>
    )
}