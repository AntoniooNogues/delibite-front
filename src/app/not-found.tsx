'use client';

import React from "react";
import {useRouter} from "next/navigation";
import Navbar from "@/components/Navbar";

export default function Custom404() {
    const router = useRouter();
    const errorCode = 404,
        title = "Pagina no encontrada",
        message = "La página que estabas buscando no existe.",
        textoBoton = "Ir a la pagina principal";

    return (
        <>
            <div className={`fixed top-0 w-full z-50`}>
                <Navbar />
            </div>
            <div className={`min-h-screen flex flex-col items-center justify-center bg-[#EFEFEF]`}>
                <h1 className="text-[200px] textoPersonalizado text-center">{errorCode}</h1>
                <div className="flex flex-col items-center justify-center">
                    <h1 className="text-6xl font-bold text-(--oxley-500) text-center">{title}</h1>
                    <p className="text-2xl text-(--verde-azulado) mt-4 text-center">{message}</p>
                    <button
                        onClick={() => router.push("/")}
                        className="mt-6 px-4 py-2 bg-(--primary-dark) text-white rounded-lg hover:scale-105 active:scale-95 shadow-2xl"
                    >
                        {textoBoton}
                    </button>
                </div>
            </div>
        </>
    );
}