'use client';

import React, {useState, useEffect, useMemo, useRef} from 'react';
import { getCatalogo } from '@/lib/catalogo';
import Image from "next/image";
import { motion } from "framer-motion";
import type { Catalogo } from './types';

const Hero = ({ scrollToCategory }: { scrollToCategory: () => void }) => {
    return (
        <div className="flex flex-col lg:flex-row items-center justify-between px-10 md:px-16 lg:px-24 py-12">
            <div className="max-w-lg text-center lg:text-left">
                <h1 className="text-5xl font-bold text-[var(--primary-dark)] leading-tight">
                    Sabores Saludables, Vida Equilibrada
                </h1>
                <p className="text-lg lg:text-xl text-[var(--verde-azulado)] mt-4 lg:text-justify">
                    Ingredientes frescos, recetas balanceadas y todo el sabor que necesitas para disfrutar sin culpa. ¡Elige bienestar en cada bocado!
                </p>
                <button className="my-6 px-6 py-3 bg-[var(--verde-azulado)] text-white rounded-full hover:scale-105 transition-all duration-300" onClick={scrollToCategory}>
                    Ver Menú
                </button>
            </div>
            <div className="flex justify-center items-center mt-6 md:mt-0">
                <Image src={"/catalogo/papas_arrugas.webp"} alt="Hero" width={600} height={600} className="rounded-2xl " />
            </div>
        </div>
    );
}


const PasosServicio = () => {
    const pasos = [
        {
            titulo: "Elige los platos que quieras",
            descripcion: "Cada semana dispondrás de 40 platos y 5 postres a tu elección.",
            icono: "/iconos/menu.webp"
        },
        {
            titulo: "Nuestros chefs cocinan por ti",
            descripcion: "Comida de alta calidad con ingredientes naturales.",
            icono: "/iconos/chef.webp"
        },
        {
            titulo: "Disfruta de tu comida y gana tiempo",
            descripcion: "Recibirás tus tápers cada lunes o viernes, según tu preferencia.",
            icono: "/iconos/time.webp"
        },
        {
            titulo: "Cada sábado cambiamos la carta",
            descripcion: "Dependiendo de tus preferencias, te sugeriremos platos.",
            icono: "/iconos/calendar.webp"
        }
    ];

    return (
        <div className="max-w-8xl mx-auto my-12 p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pasos.map((paso, index) => (
                <motion.div
                    key={index}
                    className="bg-[var(--blanco-puro)] p-6 rounded-2xl shadow-lg border border-[var(--gris-muy-claro)] text-center flex flex-col items-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 }}
                >

                    <div className="w-20 h-20 flex justify-center items-center rounded-full mb-4 hover:scale-115 transition duration-300 ease-in-out">
                        <Image src={paso.icono} alt={paso.titulo} width={80} height={80} />
                    </div>


                    <h3 className="text-lg font-semibold text-[var(--primary-dark)]">{paso.titulo}</h3>
                    <p className="text-[var(--gris-medio)] mt-2">{paso.descripcion}</p>
                </motion.div>
            ))}
        </div>
    );
};

const CategoriaLista = ({ titulo, items }: { titulo: string; items: Catalogo[] }) => {
    const [cantidad, setCantidad] = useState<{ [key: number]: number }>({});

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
        <>
            <header className="my-8">
                <p className="text-2xl font-bold text-[var(--verde-azulado)]">{titulo}<span className="text-(--primary-dark) border-1 py-1 px-4 border-(--primary-dark) rounded-full mx-2 ">{items.length}</span>: </p>
            </header>
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 items-stretch justify-center mx-6 sm:mx-2 my-4 gap-6">
                {items.map((item) => (
                    <li key={item.plato_id} className="relative border border-gray-300 rounded-2xl shadow-md bg-white overflow-hidden min-h-[360px] flex flex-col h-full">
                        <div className="relative">
                            <Image src="/1.jpg" alt={item.nombre} width={1080} height={400} className="w-full h-50 object-cover" />
                            <span className="absolute top-2 right-4 bg-white p-1 rounded-full">
                                <Image src={`/modoEmpleo/${item.modo_empleo}.svg`} width={18} height={18} alt={item.modo_empleo} title={item.modo_empleo} className="w-5 h-5" />
                            </span>
                        </div>
                        <div className="p-4 flex flex-col flex-grow">
                            <p className="flex items-center text-xl font-semibold text-gray-900 max-w-full truncate">
                                {item.nombre}
                                {item.alergenos?.length > 0 && (
                                    <span className="mx-4 flex gap-4 my-2">
                                    {item.alergenos.map((x) => (
                                        <Image key={x.alergeno_id} src={`/alergenos/${x.alergeno_id}.svg`} width={24} height={24} alt={x.nombre} title={x.nombre} className="w-6 h-6" />
                                    ))}
                                </span>
                                )}
                            </p>
                            <div className="mt-auto flex flex-col justify-between ">
                                <p className="text-left text-[#9c8302] text-[22px] font-medium py-2">{item.precio}€</p>
                                {cantidad[item.plato_id] ? (
                                    <div className="flex items-center justify-between mt-4 patron rounded-full">
                                        <button
                                            className="text-white font-bold rounded-full px-4 py-2 cursor-pointer border-2 border-(--verde-azulado) bg-(--verde-azulado) hover:scale-105 transition duration-300 ease-in-out"
                                            onClick={() => handleCantidadChange(item.plato_id, (cantidad[item.plato_id] || 1) - 1)}
                                        >
                                            -
                                        </button>
                                        <span className="mx-4 font-extrabold rounded-full px-4 py-2 bg-white">{cantidad[item.plato_id]}</span>
                                        <button
                                            className="text-white font-bold rounded-full px-4 py-2 cursor-pointer border-2 border-(--verde-azulado) bg-(--verde-azulado) hover:scale-105 transition duration-300 ease-in-out"
                                            onClick={() => handleCantidadChange(item.plato_id, (cantidad[item.plato_id] || 1) + 1)}
                                        >
                                            +
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        className="text-white w-full font-bold rounded-full px-6 py-2 cursor-pointer border-2 border-(--verde-azulado) bg-(--verde-azulado) hover:scale-105 transition duration-300 ease-in-out mt-4"
                                        onClick={() => handleCantidadChange(item.plato_id, 1)}
                                    >
                                        Añadir
                                    </button>
                                )}
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </>
    );
};




export default function Catalogo() {
    const [data, setData] = useState<Catalogo[]>([]);
    const [loading, setLoading] = useState(true);
    const categoryRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const catalogoData = await getCatalogo();
                setData(catalogoData);
            } catch (error) {
                console.error("Error al obtener el catálogo:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData().then();
    }, []);

    const principales = useMemo(() => data.filter(item => item.tipo === "PRINCIPAL"), [data]);
    const postres = useMemo(() => data.filter(item => item.tipo === "POSTRE"), [data]);


    const scrollToCategory = () => {
        categoryRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-t-(--verde-azulado) border-(--primary-dark) rounded-full animate-spin"></div>
            </div>
        );
    }



    return (
        <div className="container mx-auto max-w-full p-6">
            <Hero scrollToCategory={scrollToCategory} />
            <PasosServicio />
            <div className={"my-8"} ref={categoryRef}>
                <h1 className="text-4xl text-center py-4 my-2">Selecciona los platos de tu primer menú.</h1>
                <p className="text-xl text-center">Los platos cambian de manera semanal y están disponibles solo hasta el sábado a las 17:30 h.</p>
            </div>
            <div>
                <CategoriaLista titulo="Principales" items={principales} />
                <CategoriaLista titulo="Postres" items={postres} />
            </div>
        </div>
    );
}
