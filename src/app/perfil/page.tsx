"use client";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import axiosClient from "../../lib/axiosClient";
import {
    Apple,
    ArrowRight,
    Banana, Brain,
    CreditCard,
    Croissant,
    MapPinHouse,
    PiggyBank,
    SquareUserRound,
    Wheat
} from "lucide-react";
import React, {useEffect, useState } from "react";
import axios from "axios";
import {Notificaciones} from "@/interfaces/Notificaciones";
import NotificacionComponent from "@/components/Notificacion-Component";
import Footer from "@/components/Footer";
import Link from "next/link";
import ProtectedRouteCliente from "@/components/ProtectedRouteCliente";


export default function Perfil() {
    const [hasSubscription, setHasSubscription] = useState(false);
    const [notificacion, setNotificacion] = useState<Notificaciones>();

    useEffect(() => {
        const fetchSubscription = async () => {
            try {
                const respuesta = await axiosClient.get('/suscripcion/validar');
                if (respuesta) {
                    setHasSubscription(true);
                }
            } catch (error) {
                if (axios.isAxiosError(error) && error.response) {
                    setNotificacion({
                        titulo: error.response.data.titulo,
                        mensaje: error.response.data.mensaje,
                        code: error.response.data.code,
                        tipo: error.response.data.tipo
                    });
                }
            }
        };

        fetchSubscription().catch(error => {
            console.error('Error fetching subscription:', error);
        });
    }, []);

    return (
        <ProtectedRouteCliente>
                <div className="min-h-screen">
                    <Navbar></Navbar>
                    <div className="flex flex-col  justify-center items-center mt-6">
                        <div className="flex p-6 rounded-xl w-3/4 items-center">
                            <div className="flex-1 p-6">
                                <h2 className="text-2xl font-bold">Come genial toda la semana</h2>
                                <ul className="mt-4 text-gray-700 space-y-3">
                                    <li className="flex items-center space-x-2"><Apple className="text-red-400"/> <p>39
                                        platazos diferentes cada semana.</p></li>
                                    <li className="flex items-center space-x-2"><Banana className="text-red-400"/>
                                        <p>Todo
                                            ingredientes naturales, sin aditivos.</p></li>
                                    <li className="flex items-center space-x-2"><Croissant className="text-red-400"/>
                                        <p>Comida recién hecha con entrega en frío.</p></li>
                                </ul>
                                <p className="mt-4 text-(--oxley-900)">Pausa o cancela cuando quieras</p>
                                <div className="mt-4 flex gap-4">
                                    <Link
                                        href={"/suscripcion"}
                                        className="bg-(--verde-azulado) text-white px-4 py-2 rounded-lg transition hover:bg-(--oxley-500) active:bg-(--oxley-700) hover:scale-105 active:scale-95">
                                        Empiezo hoy
                                    </Link>
                                    <Link
                                        href={"/catalogo/productos"}
                                        className="border px-4 py-2 rounded-lg text-(--oxley-500) hover:bg-(--verde-azulado) active:bg-(--oxley-500) hover:text-white transition transform active:scale-95 hover:scale-105">
                                        Ver catálogo
                                    </Link>
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
                    <div className="flex justify-center items-center bg-(--gris-muy-claro)">
                        <div className="flex flex-col w-3/4 py-4 mt-4">
                            <h2 className="text-start text-2xl font-semibold">Mi perfil</h2>
                            <div className="flex justify-center">
                                <div className="flex flex-col w-4/5">
                                    <div className="mt-4 space-y-6">
                                        <h3 className="text-xl font-thin">Personaliza tu experiencia</h3>
                                        <Link href={"/perfil/personalizar"}>
                                            <div
                                                className="flex items-center justify-between bg-white px-6 py-4 rounded-xl my-4 transition hover:bg-gray-100 hover:scale-105 active:scale-95    ">
                                                <div className="flex items-center space-x-4">
                                                    <Wheat className="text-(--oxley-500)"/>
                                                    <p>Edita tus alergias y gustos</p>
                                                </div>
                                                <ArrowRight/>
                                            </div>
                                        </Link>
                                    </div>
                                    <div className="mt-8 space-y-4">
                                        <h3 className="text-xl font-thin">Métodos de pago</h3>
                                        <Link href={"/perfil/tarjeta"}>
                                            <div
                                                className="flex items-center justify-between bg-white px-6 py-4 my-4 rounded-xl transition hover:bg-gray-100 hover:scale-105 active:scale-95">
                                                <div className="flex items-center space-x-4">
                                                    <CreditCard className="text-(--oxley-500)"/>
                                                    <p>Añade tu tarjeta</p>
                                                </div>
                                                <ArrowRight/>
                                            </div>
                                        </Link>
                                        <Link href={"/perfil/monedero"}>
                                            <div
                                                className="flex items-center justify-between bg-white my-4 px-6 py-4 rounded-xl transition hover:bg-gray-100 hover:scale-105 active:scale-95">
                                                <div className="flex items-center space-x-4">
                                                    <PiggyBank className="text-(--oxley-500)"/>
                                                    <p>Añade dinero a tu monedero</p>
                                                </div>
                                                <ArrowRight/>
                                            </div>
                                        </Link>
                                        <Link href={"/perfil/facturacion"}>
                                            <div
                                                className="flex items-center justify-between my-4 bg-white px-6 py-4 rounded-xl transition hover:bg-gray-100 hover:scale-105 active:scale-95">
                                                <div className="flex items-center space-x-4">
                                                    <MapPinHouse className="text-(--oxley-500)"/>
                                                    <p>Dirección de facturación</p>
                                                </div>
                                                <ArrowRight/>
                                            </div>
                                        </Link>

                                    </div>
                                    <div className="mt-8 space-y-4">
                                        <h3 className="text-xl font-thin">Suscripción</h3>
                                        <Link href={"/perfil/datosPersonales"}>
                                            <div
                                                className="flex items-center justify-between my-4 bg-white px-6 py-4 rounded-xl transition hover:bg-gray-100 hover:scale-105 active:scale-95">
                                                <div className="flex items-center space-x-4">
                                                    <SquareUserRound className="text-(--oxley-500)"/>
                                                    <p>Datos personales</p>
                                                </div>
                                                <ArrowRight/>
                                            </div>
                                        </Link>
                                        {hasSubscription ? (
                                            <Link href={"/perfil/suscripcion"}>
                                                <div className="flex items-center justify-between my-4 bg-white px-6 mb-8 py-4 rounded-xl transition hover:bg-gray-100 hover:scale-105 active:scale-95">
                                                    <div className="flex items-center space-x-4">
                                                        <Brain className="text-(--oxley-500)"/>
                                                        <p>Modifica tu suscripción</p>
                                                    </div>
                                                    <ArrowRight/>
                                                </div>
                                            </Link>
                                        ) : (
                                            <div className="flex items-center justify-between my-4 bg-gray-400 opacity-50 px-6 mb-8 py-4 rounded-xl cursor-not-allowed">
                                                <div className="flex items-center space-x-4">
                                                    <Brain className="text-(--oxley-500)"/>
                                                    <p>Modifica tu suscripción</p>
                                                </div>
                                                <ArrowRight/>
                                            </div>
                                        )}
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                    {notificacion && (
                        <NotificacionComponent
                            Notificaciones={notificacion}
                            onClose={() => setNotificacion(undefined)}
                        />
                    )}
                    <Footer></Footer>
                </div>
        </ProtectedRouteCliente>
    );
}