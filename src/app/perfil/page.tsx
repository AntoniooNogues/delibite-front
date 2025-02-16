"use client";
import ProtectedRouteCliente from "@/components/ProtectedRouteCliente";
import Navbar from "@/components/Navbar";
import Image from "next/image";

export default function Perfil() {
    return (
        <ProtectedRouteCliente>
            <div className="min-h-screen">
                <Navbar></Navbar>
                <div className="flex flex-col  justify-center items-center mt-4">
                    <div className="text-start w-3/4">
                        <h2 className="text-start">Mi perfil</h2>
                    </div>
                    <div className="flex p-6 rounded-xl w-3/4">
                        <div className="flex-1 p-6">
                            <h2 className="text-2xl font-bold">Come genial toda la semana</h2>
                            <ul className="mt-4 space-y-2 text-gray-700">
                                <li>✔️ 39 platazos diferentes cada semana.</li>
                                <li>✔️ Todo ingredientes naturales, sin aditivos.</li>
                                <li>✔️ Comida recién hecha con entrega en frío.</li>
                            </ul>
                            <p className="mt-4 text-green-600">Pausa o cancela cuando quieras</p>
                            <div className="mt-4 flex gap-4">
                                <button className="bg-green-600 text-white px-4 py-2 rounded-lg">
                                    Empiezo hoy
                                </button>
                                <button className="border px-4 py-2 rounded-lg">Ver carta</button>
                            </div>
                        </div>

                        {/* Imagen con borde recortado */}
                        <div className="w-1/2 relative">
                            <Image
                                src="/arrozt.jpg"
                                alt="Plato de comida"
                                width={800}
                                height={400}
                                className="object-cover w-full rounded-xl"
                            />
                        </div>
                    </div>
                </div>

            </div>
        </ProtectedRouteCliente>

    );
}