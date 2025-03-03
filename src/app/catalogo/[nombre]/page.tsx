'use client';

import React, { useEffect, useState } from 'react';
import Loading from '@/components/Loading';
import Image from 'next/image';
import CantidadControl from "@/components/BotonAddPlato";
import {DetallesValoraciones, Plato, Valoraciones} from "@/interfaces/plato";
import { ArrowLeftCircleIcon } from '@heroicons/react/20/solid';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import Navbar from "@/components/Navbar";
import NotificacionComponent from "@/components/Notificacion";
import { Notificaciones } from '@/interfaces/Notificaciones';
import axiosClient from "@/lib/axiosClient";
import axios from "axios";
import Footer from "@/components/Footer";
import { useTokenExpirado } from '@/hooks/useTokenExpirado';
import Cookies from "js-cookie";
import Rating from "@mui/material/Rating";

const PlatoDetalle = ({ plato, valoraciones, detallesValoraciones }: { plato: Plato, valoraciones: Valoraciones[], detallesValoraciones: DetallesValoraciones }) => {
    const [cantidad, setCantidad] = useState<{ [key: number]: number }>({});
    const [isOpen, setIsOpen] = useState(false);

    const router = useRouter();
    const handleCantidadChange = (id: number, nombre: string, precio: number, value: number, url: string) => {
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
                carritoObj[id] = { nombre, precio, cantidad: value, url };
            } else {
                delete carritoObj[id];
            }

            // Save updated carrito object to cookies
            Cookies.set("carrito", JSON.stringify(carritoObj), { expires: 7 });

            // Dispatch custom event to notify other components
            const event = new CustomEvent("actualizacionCarrito", { detail: carritoObj });
            setTimeout(() => {
                window.dispatchEvent(event);
            }, 5);

            return newCantidad;
        });
    };


    return (
        <div className="w-full max-w-7xl mx-auto my-6 bg-white rounded-t-[80px] rounded-b-[40px] shadow-md mt-10 p-0">
            <header className="flex flex-row max-md:flex-col text-(--gris-oscuro) mb-10 max-lg:mb-0">
                <div className="w-1/2 max-md:w-full relative contain-content object-contain">
                    <Image src={plato.url} alt="Sopa criolla limeña" className="border border-transparent rounded-tl-[80px] max-md:rounded-t-[80px] w-full" width={1080} height={400} />
                    <motion.button
                        className="absolute top-10 left-[50px] rounded-full hover:scale-105 transition-all duration-300 gap-2 w-fit"
                        initial={{ y: -100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        onClick={() => router.back()}
                    >
                        <ArrowLeftCircleIcon className="h-12 w-12 text-(--verde-azulado) bg-white p-0 rounded-full hover:scale-105 active:scale-95 transform" />
                    </motion.button>
                </div>

                <div className="w-1/2 pt-4 flex flex-col mt-4 max-md:w-full lg:px-5 lg:pr-10 max-lg:px-6">
                    <div>
                        <h1 className="text-3xl font-bold flex flex-row mb-4 gap-4 sm:gap-0">
                            {plato.nombre}
                            {plato.alergenos?.length > 0 && (
                                <span className="flex gap-4 my-2">
                                {plato.alergenos.map((x) => (
                                    <Image key={x.alergeno_id} src={`/alergenos/${x.alergeno_id}.svg`} width={24} height={24} alt={x.nombre} title={x.nombre} className="w-6 h-6" />
                                ))}
                            </span>
                            )}
                        </h1>
                    </div>
                    <div className="flex flex-col justify-between h-full gap-4 ">
                        <p className="text-wrap text-justify text-md leading-8">{plato.descripcion}</p>
                        <div className="flex flex-row gap-4 justify-between items-center ">
                            <p className="font-semibold text-xl">{plato.precio}€</p>
                            <CantidadControl
                                cantidadInicial={cantidad[plato.plato_id] || 0}
                                handleCantidadChange={(value) => handleCantidadChange(plato.plato_id, plato.nombre, plato.precio, value, plato.url)}
                                width={40}
                                height={40}
                            />
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex flex-row my-8 max-lg:my-4 gap-4 max-lg:flex-col max-lg:px-6 ">
                <div className="w-1/2 max-lg:w-full text-(--gris-oscuro) lg:px-10">
                    <h2 className="text-xl font-semibold pt-2">El plato contiene los siguientes ingredientes: </h2>
                    <div className="text-wrap text-justify text-base/8">
                        <ul className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 text-base text-gray-700">
                            {plato.ingredientes.split(',').map((ingrediente, index) => (
                                <li
                                    key={index}
                                    className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-(--oxley-100) transition-colors ease-in-out duration-300 min-h-[80px] flex-grow"
                                >
                                    <span className="w-2 h-2 bg-(--verde-azulado) rounded-full"></span>
                                    <span className="capitalize">{ingrediente.trim()}</span>
                                </li>
                            ))}
                        </ul>
                        {plato.alergenos?.length > 0 ? (
                            <p>
                                Puede contener trazas de los siguientes alergenos:
                                {plato.alergenos.map((x, index) => (
                                    <span key={x.alergeno_id} className="text-(--negro-puro)">
                                    {plato.alergenos.length === 1 ? ` ${x.nombre}.` : index === plato.alergenos.length - 1 ? `y ${x.nombre}.` : ` ${x.nombre}, `}
                                </span>
                                ))}
                            </p>
                        ) : (
                            <p>Este plato no contiene ningun alergeno</p>
                        )}
                    </div>
                </div>

                <div className="w-1/2 max-lg:w-full lg:px-10 flex flex-col items-center">
                    <table className="w-full border border-transparent text-(--gris-oscuro)">
                        <thead>
                        <tr>
                            <th className="text-xl font-semibold text-left ">Valor Nutricional</th>
                            <th className="p-2 text-(--gris-claro-calido) text-right ">Ración 465.00 g</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr className="border-b">
                            <td className="p-2">Calorias</td>
                            <td className="p-2 text-right text-black">{plato.calorias}</td>
                        </tr>
                        <tr className="border-b">
                            <td className="p-2">Azucares</td>
                            <td className="p-2 text-right text-black">{plato.azucares}</td>
                        </tr>
                        <tr className="border-b">
                            <td className="p-2">Carbohidratos</td>
                            <td className="p-2 text-right text-black">{plato.carbohidratos}</td>
                        </tr>
                        <tr className="border-b">
                            <td className="p-2">Fibra</td>
                            <td className="p-2 text-right text-black">{plato.fibra}</td>
                        </tr>
                        <tr className="border-b">
                            <td className="p-2">Sal</td>
                            <td className="p-2 text-right text-black">{plato.sal}</td>
                        </tr>
                        <tr className="border-b">
                            <td className="p-2">Grasas</td>
                            <td className="p-2 text-right text-black">{plato.grasas}</td>
                        </tr>
                        <tr className="border-b">
                            <td className="p-2">Grasas Saturadas</td>
                            <td className="p-2 text-right text-black">{plato.grasas_saturadas}</td>
                        </tr>
                        <tr className="border-b p-2">
                            <td className="p-2">Proteína</td>
                            <td className="p-2 text-right text-black">{plato.proteina}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </main>

            {/*Modo de empleo*/}
            <div className="w-full pb-16 py-8 flex items-center">
                <div className={`w-full lg:mx-10 mx-auto border border-gray-300 shadow-lg overflow-hidden rounded-2xl bg-white transition-all ${isOpen ? 'shadow-xl' : ''}`}>
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="w-full flex justify-between items-center p-6 bg-(--oxley-300) hover:bg-(--verde-azulado-80) active:bg-(--verde-azulado) transition rounded-t-2xl"
                    >
                        <span className="text-lg font-semibold text-gray-900 flex items-center">
                            Modo de empleo {plato.modo_empleo === 'FRIO' && '❄️'} {plato.modo_empleo === 'CALIENTE' && '🔥'}
                        </span>
                        <ChevronDownIcon className={`w-6 h-6 transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"}`} />
                    </button>

                    {isOpen && (
                        <div className="p-6 text-gray-700 bg-gray-50">
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Mantener refrigerado entre 2º y 4ºC.</li>
                                <li>Consumir antes de la fecha de caducidad indicada en el envase.</li>
                                <li>Una vez abierto, consumir en las próximas 24 horas.</li>
                                {plato.modo_empleo === 'CALIENTE' && (
                                    <>
                                        <li>Para calentar, sigue las instrucciones de cada táper.</li>
                                        <li>Abre una esquina del envase y caliéntalo en el microondas el tiempo indicado. ¡Listo para disfrutar!</li>
                                    </>
                                )}
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            {/* Valoraciones */}
            {valoraciones && valoraciones.length > 0 ? (
                <div className="w-full pb-16 py-8 flex items-center">
                    <div className="w-full lg:mx-10 mx-auto p-6  bg-white shadow-xl rounded-2xl flex flex-col space-y-6">
                        <div className="flex flex-col space-y-4">
                            <h2 className="text-2xl font-semibold text-gray-900">Reseñas y Valoraciones</h2>
                            <div className="flex items-center space-x-4">
                                <span className="text-5xl font-bold text-(--verde-azulado)">{detallesValoraciones.valoracion_media.toFixed(1)}</span>
                                <div className="flex">
                                    <Rating precision={0.1} value={detallesValoraciones.valoracion_media} readOnly />
                                </div>
                                <span className="text-lg text-gray-600">Basado en {detallesValoraciones.numero_valoraciones} reseñas</span>
                            </div>
                        </div>
                        <div className="flex flex-col space-y-6 overflow-y-auto max-h-[600px]">
                            {valoraciones.map((valoracion) => (
                                <div key={valoracion.codigo} className="p-5 bg-gray-50 rounded-xl shadow-md border border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <p className="font-semibold text-gray-800 text-lg">{valoracion.nombre} {valoracion.apellidos}</p>
                                            <span className="text-sm text-gray-500">Ref #{valoracion.codigo}</span>
                                        </div>
                                        <p className="text-gray-500 text-sm">{valoracion.fecha_pedido.replace(/-/g, ' ')}</p>
                                    </div>
                                    <div className="flex items-center mt-2">
                                        <Rating name={`rating-${valoracion.codigo}`} precision={1} value={valoracion.valoracion} readOnly />
                                    </div>
                                    <p className="text-gray-700 mt-3 text-base leading-relaxed">{valoracion.descripcion}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="w-full pb-16 py-8 flex items-center justify-center">
                    <p className="text-xl text-gray-500">No hay valoraciones disponibles.</p>
                </div>
            )}
        </div>
    );
};

export default function PlatoDetalleComponent() {
    const [plato, setPlato] = useState<Plato | null>(null);
    const [notificacion, setNotificacion] = useState<Notificaciones>();
    const notificacionToken = useTokenExpirado();
    const [valoraciones, setValoraciones] = useState<Valoraciones[]>([]);
    const [detallesValoraciones, setDetallesValoraciones] = useState<DetallesValoraciones>();

    useEffect(() => {
        const fetchPlato = async () => {
            try {
                const id = localStorage.getItem('platoId');
                const response = await axiosClient.get(`/plato/${id}/`);
                const data = response.data;

                setPlato(data);
            } catch (error) {
                if (axios.isAxiosError(error) && error.response) {
                    setNotificacion({ titulo: error.response.data.titulo, mensaje: error.response.data.mensaje, code: error.response.data.code, tipo: error.response.data.tipo });
                } else {
                    setNotificacion({ titulo: 'Error', mensaje: 'Error al crear el plato: Error desconocido', code: 500, tipo: 'error' });
                }
            }
        };

        fetchPlato();
    }, []);

    useEffect(() => {
        const fetchValoraciones = async () => {
            try {
                const id = localStorage.getItem('platoId');
                const response = await axiosClient.get(`/plato/valoraciones/${id}/`);
                const data = response.data;
                console.log(data);
                setDetallesValoraciones(data.detalles);
                setValoraciones(data.valoraciones);

            } catch (error) {
                if (axios.isAxiosError(error) && error.response) {
                    setNotificacion({ titulo: error.response.data.titulo, mensaje: error.response.data.mensaje, code: error.response.data.code, tipo: error.response.data.tipo });
                } else {
                    setNotificacion({ titulo: 'Error', mensaje: 'Error al crear el plato: Error desconocido', code: 500, tipo: 'error' });
                }
            }
        };

        fetchValoraciones();
    }, []);
    return (
        <main>
            <Navbar />
            {!plato ?
                <div className="flex justify-center items-center h-screen">
                    <Loading />
                </div> :
                <div>
                    <PlatoDetalle
                        plato={plato}
                        valoraciones={valoraciones}
                        detallesValoraciones={detallesValoraciones ?? { valoracion_media: 0, numero_valoraciones: 0 }}
                    />
                    <div className="mt-15">
                        <Footer />
                    </div>
                </div>

            }
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
        </main>
    );
}