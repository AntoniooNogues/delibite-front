'use client';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NotificacionComponent from "@/components/Notificacion-Component";
import Carrito from "@/components/Carrito";
import React, {useEffect, useState} from "react";
import {Notificaciones} from "@/interfaces/Notificaciones";
import axiosClient from "@/lib/axiosClient";
import axios from "axios";
import type { Packs } from "@/interfaces/Packs";
import LoadingComponent from "@/components/Loading-Component";
import {useRouter} from "next/navigation";
import CantidadControl from "@/components/BotonAddPlato-Component";
import Cookies from "js-cookie";
import {useTokenExpirado} from "@/hooks/useTokenExpirado";
import Image from "next/image";

export default function Packs() {
    const [notificacion, setNotificacion] = useState<Notificaciones>();
    const [loading, setLoading] = useState(true);
    const [packs, setPacks] = useState<Packs[]>([]);
    const [cantidad, setCantidad] = useState<{ [key: number]: number }>({});
    const notificacionToken = useTokenExpirado();

    const handleCantidadChange = (id: number, nombre: string, precio: number, value: number) => {
        setCantidad(prev => {
            const newCantidad = { ...prev, [id]: value };
            if (newCantidad[id] <= 0) {
                delete newCantidad[id];
            }

            // Retrieve existing cookie data
            const carrito = Cookies.get("carrito");
            const carritoObj = carrito ? JSON.parse(carrito) : {};

            // Update the carrito object
            if (value > 0) {
                carritoObj[id] = { nombre, precio, cantidad: value };
            } else {
                delete carritoObj[id];
            }

            // Save updated carrito object to cookies
            Cookies.set("carrito", JSON.stringify(carritoObj), { expires: 7 });

            // Dispatch custom event to notify other components
            const event = new CustomEvent("actualizacionCarrito", { detail: carritoObj });
            window.dispatchEvent(event);

            return newCantidad;
        });
    };


    const router = useRouter();

    const quitarAcentos = (str: string) => {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    };

    const redireccionarDetallesPlato = (nombre: string, id: number) => {
        nombre = quitarAcentos(nombre).replace(/\s+/g, '-').toLowerCase();
        router.push(`/catalogo/${nombre}`);
        localStorage.setItem('platoId', id.toString());
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axiosClient.get<Packs[]>(`/packs/cargar`);
            setPacks(response.data);
            console.log(response.data);
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                setNotificacion({ titulo: error.response.data.titulo, mensaje: error.response.data.mensaje, code: error.response.data.code, tipo: error.response.data.tipo });
            }
            setNotificacion({ titulo: 'Error', mensaje: 'Error al cargar los packs', code: 500, tipo: 'error' });

        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="bg-gray-50">
            <Navbar />
            <header className="mt-10 text-center py-16 bg-gradient-to-t from-(--oxley-700) to-(--verde-azulado-80) text-white">
                <h1 className="text-5xl font-bold">Packs</h1>
                <p className="mt-4 text-xl">Explora nuestros paquetes exclusivos y encuentra el que mejor se adapte a tus necesidades.</p>
            </header>

            {loading ? (
                <section className="min-h-screen flex justify-center items-center">
                    <LoadingComponent />
                </section>
            ) : (
                <section className="max-w-screen-xl mx-auto px-4 py-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {packs.map((pack) => (
                            <div key={pack.id} className="bg-white rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
                                <div className="relative">
                                    {pack.Plato.length > 3 ? (
                                        <div className="grid grid-cols-3 gap-1">
                                            {pack.Plato.slice(0, 3).map((plato, index) => (
                                                <Image
                                                    key={index}
                                                    src={plato.url}
                                                    alt={plato.nombre}
                                                    width={256}
                                                    height={256}
                                                    className="w-full h-64 object-cover rounded-t-lg"
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 gap-1">
                                            {pack.Plato.slice(0, 2).map((plato, index) => (
                                                <Image
                                                    key={index}
                                                    src={plato.url}
                                                    alt={plato.nombre}
                                                    width={256}
                                                    height={256}
                                                    className="w-full h-64 object-cover rounded-t-lg"
                                                />
                                            ))}
                                        </div>
                                    )}
                                    <div className="absolute top-4 left-4 bg-(--oxley-800) bg-opacity-50 px-4 py-2 rounded-full">
                                        <span className="text-white text-lg font-semibold">{pack.precio}€</span>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="flex flex-row justify-between items-center">
                                        <h3 className="text-3xl font-semibold text-gray-800">{pack.nombre}</h3>
                                        <CantidadControl
                                            itemId={pack.id}
                                            cantidadInicial={cantidad[pack.id] || 0}
                                            handleCantidadChange={(value) => handleCantidadChange(pack.id, pack.nombre, pack.precio, value)}
                                            width={35}
                                            height={35}
                                        />
                                    </div>
                                    <p className="text-lg text-gray-600 mt-2">{pack.descripcion}</p>
                                    <p className="mt-2 text-gray-700 font-bold">Platos incluidos en el pack: </p>
                                    <ul className="mt-2 text-gray-700 space-y-2">
                                        {pack.Plato.map((plato) => (
                                            <li key={plato.plato_id} onClick={() => redireccionarDetallesPlato(plato.nombre, plato.plato_id)} className="cursor-pointer hover:text-(--verde-azulado) hover:scale-105">
                                                {plato.nombre}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            <Footer />
            {notificacion && (
                <NotificacionComponent
                    Notificaciones={notificacion}
                    onClose={() => setNotificacion(undefined)}
                />
            )}
            {notificacionToken && (
                <NotificacionComponent
                    Notificaciones={notificacionToken}
                    onClose={() => setNotificacion(undefined)}
                />
            )}
            <Carrito />
        </main>
    );
}


