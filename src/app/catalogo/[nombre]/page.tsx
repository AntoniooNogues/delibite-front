'use client';

import React, { useEffect, useState } from 'react';
import LoadingComponent from '@/components/Loading-Component';
import Image from 'next/image';
import CantidadControl from "@/components/BotonAddPlato-Component";
import { Plato } from "@/interfaces/plato";
import { ArrowLeftCircleIcon } from '@heroicons/react/20/solid';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import Navbar from "@/components/Navbar";
import NotificacionComponent from "@/components/Notificacion-Component";
import { Notificaciones } from '@/interfaces/Notificaciones';
import axiosClient from "@/lib/axiosClient";
import axios from "axios";
import Footer from "@/components/Footer";

const PlatoDetalle = ({ plato }: { plato: Plato }) => {
    const [cantidad, setCantidad] = useState<{ [key: number]: number }>({});
    const [isOpen, setIsOpen] = useState(false);

    const router = useRouter();
    const handleCantidadChange = (id: number, value: number) => {
        setCantidad(prev => {
            const newCantidad = { ...prev, [id]: value };
            if (newCantidad[id] <= 0) {
                delete newCantidad[id];
            }
            return newCantidad;
        });
    };

    return (
        <div className="w-full max-w-7xl mx-auto my-6 bg-white rounded-[80px] shadow-md mt-10 p-0">
            <header className="flex flex-col md:flex-row text-(--gris-oscuro) mb-10">
                <div className="w-1/2 relative">
                    <Image src={plato.url} alt="Sopa criolla limeña" className="border border-transparent rounded-tl-[80px] w-full h-full object-cover" width={1080} height={400} />
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

                <div className="w-1/2 pt-4 px-6 flex flex-col justify-between mt-4">
                    <h1 className="text-3xl font-bold flex flex-row gap-4">
                        {plato.nombre}
                        {plato.alergenos?.length > 0 && (
                            <span className="flex gap-4 my-2">
                                {plato.alergenos.map((x) => (
                                    <Image key={x.alergeno_id} src={`/alergenos/${x.alergeno_id}.svg`} width={24} height={24} alt={x.nombre} title={x.nombre} className="w-6 h-6" />
                                ))}
                            </span>
                        )}
                    </h1>
                    <p className="text-wrap text-justify text-lg">{plato.descripcion}</p>
                    <div className="flex flex-row gap-4 justify-between items-center">
                        <p className="font-semibold text-xl">{plato.precio}€</p>
                        <CantidadControl
                            itemId={plato.plato_id}
                            cantidadInicial={cantidad[plato.plato_id] || 0}
                            handleCantidadChange={handleCantidadChange}
                            width={40}
                            height={40}
                        />
                    </div>
                </div>
            </header>

            <main className="flex flex-row my-8 gap-2">
                <div className="w-1/2 text-(--gris-oscuro) lg:px-10">
                    <h2 className="text-xl font-semibold pt-2">El plato contiene: </h2>
                    <div className="pt-4 text-wrap text-justify text-base/8">
                        <p>{plato.ingredientes}</p>
                        <p>
                            Puede contener trazas de los siguientes alergenos:
                            {plato.alergenos.map((x, index) => (
                                <span key={x.alergeno_id} className="text-(--negro-puro)">
                                    {plato.alergenos.length === 1 ? ` ${x.nombre}.` : index === plato.alergenos.length - 1 ? `y ${x.nombre}.` : ` ${x.nombre}, `}
                                </span>
                            ))}
                        </p>
                    </div>
                </div>

                <div className="w-1/2 lg:px-10 flex flex-col items-center">
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
            <div className="w-full my-8 py-8 flex items-center">
                <div className="w-full mx-20 border border-gray-300 overflow-hidden rounded-[30px]">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="w-full flex justify-between items-center p-4 bg-(--oxley-200) hover:bg-(--oxley-300) active:bg-(--verde-azulado) transition "
                    >
                        <span className="text-lg font-semibold text-gray-800"><span className="text-lg font-semibold text-gray-800">Modo de empleo {plato.modo_empleo == 'FRIO' && '❄️'} {plato.modo_empleo == 'CALIENTE' && '🔥'}</span></span>
                        <ChevronDownIcon className={`w-5 h-5 transition-transform ${isOpen ? "rotate-180 transition duration-1000" : "rotate-0 transition duration-1000"}`} />
                    </button>

                    {plato.modo_empleo == 'FRIO' && (
                        <div className={`overflow-hidden transition-[max-height] duration-300 ${isOpen ? "max-h-60" : "max-h-0"}`}>
                            <div className="p-4 text-gray-700 whitespace-pre-line ">
                                <ul className="list-disc px-4">
                                    <li>Mantener refrigerado entre 2º y 4ºC.</li>
                                    <li>Consumir antes de la fecha de caducidad indicada en el envase.</li>
                                    <li>Una vez abierto, consumir en las próximas 24 horas.</li>
                                    <li>No congelar el producto si no está indicado en el envase.</li>
                                </ul>
                            </div>
                        </div>
                    )}
                    {plato.modo_empleo == 'CALIENTE' && (
                        <div className={`overflow-hidden transition-[max-height] duration-300 ${isOpen ? "max-h-60" : "max-h-0"}`}>
                            <div className="p-4 text-gray-700 whitespace-pre-line">
                                <ul>
                                    <li>Mantener refrigerado entre 2º y 4ºC.</li>
                                    <li>Consumir antes de la fecha de caducidad indicada en el envase.</li>
                                    <li>Una vez abierto, consumir en las próximas 24 horas.</li>
                                    <li>Para calentar, sigue las instrucciones de cada táper.</li>
                                    <li>Abre una esquina del envase y caliéntalo en el microondas el tiempo indicado. ¡Listo para disfrutar!</li>
                                </ul>
                            </div>
                        </div>
                    )}

                </div>
            </div>
            <footer className="mx-auto">


            </footer>
        </div>
    );
};

export default function PlatoDetalleComponent() {
    const [plato, setPlato] = useState<Plato | null>(null);
    const [notificacion, setNotificacion] = useState<Notificaciones>();

    useEffect(() => {
        const fetchPlato = async () => {
            try {
                let id = localStorage.getItem('platoId');
                const response = await axiosClient.get(`/plato/${id}/`);
                let data = response.data;

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

    return (
        <main>
            <Navbar />
            {!plato ?
                <div className="flex justify-center items-center h-screen">
                    <LoadingComponent />
                </div> :
                <div>
                    <PlatoDetalle plato={plato} />
                    <Footer />
                </div>

            }
            {notificacion && (
                <NotificacionComponent
                    Notificaciones={notificacion}
                    onClose={() => setNotificacion(undefined)}
                />
            )}

        </main>
    );
}