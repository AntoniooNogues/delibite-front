'use client';

import React, {useState, useEffect, useMemo, useRef} from 'react';
import { getCatalogo } from '@/lib/catalogo';
import Image from "next/image";
import { motion } from "framer-motion";
import type { Catalogo } from './types';
import { useRouter } from 'next/navigation';
import LoadingComponent from "@/components/Loading-Component";
import CantidadControl from '@/components/BotonAddPlato-Component';
import Navbar from "@/components/Navbar";

const Hero = ({ scrollToCategory }: { scrollToCategory: () => void }) => {
    return (
        <div className="flex flex-col lg:flex-row items-center justify-between lg:p-10 gap-6">
            <div className="text-center lg:text-left lg:w-1/2 w-full px-4 lg:px-8">
                <h1 className="text-4xl lg:text-5xl font-bold text-[var(--primary-dark)] leading-tight">
                    Sabor y bienestar en cada bocado.
                </h1>
                <p className="text-lg lg:text-xl text-[var(--verde-azulado)] mt-4">
                    Ingredientes frescos, recetas balanceadas y todo el sabor que necesitas para disfrutar sin culpa. ¡Disfruta lo mejor para tu bienestar en cada bocado!
                </p>
                <button className="my-6 px-6 py-3 bg-[var(--verde-azulado)] text-white rounded-full hover:scale-105 transition-all duration-300" onClick={scrollToCategory}>
                    Ver Menú
                </button>
            </div>
            <motion.div className="flex justify-center items-center mt-6 lg:mt-0 w-full lg:w-1/2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.4 }}>
                <Image src={"/catalogo/papas_arrugas.webp"} alt="Hero" width={600} height={600} title="Plato 12: papas arrugas con mojo" className="rounded-2xl" priority layout="responsive" placeholder="blur" blurDataURL="/catalogo/papas_arrugas_blur.webp" quality={75} />
            </motion.div>
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
                    <p className="text-gray-800 mt-2">{paso.descripcion}</p>
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

    const router = useRouter();

    const quitarAcentos = (str: string) => {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    };

    const redireccionarDetallesPlato = (nombre: string, id: number) => {
        nombre = quitarAcentos(nombre).replace(/\s+/g, '-').toLowerCase();
        router.push(`/catalogo/${nombre}`);
        localStorage.setItem('platoId', id.toString());
    };

    return (
        <>
            <header className="my-8 flex flex-row gap-0 items-center">
                <p className="text-2xl text-(--primary-dark)">{titulo}</p>
                <p className="text-2xl text-(--oxley-700) border-2 p-2 border-(--primary-dark) rounded-full mx-2 w-10 h-10 flex items-center justify-center">{items.length}</p>
                <p>: </p>
            </header>
            <main className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 items-stretch justify-center mx-6 sm:mx-2 my-4 gap-6" >
                {items.map((item, index) => (
                    <motion.div key={item.plato_id} className="relative border border-gray-300 rounded-2xl shadow-md bg-white overflow-hidden min-h-[360px] flex flex-col h-full" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.1 }} transition={{ delay: index * 0.5 }}>
                        <div className="relative">
                            <Image src="/1.jpg" alt={item.nombre} width={1080} height={400} className="w-full h-50 object-cover" onClick={() => redireccionarDetallesPlato(item.nombre, item.plato_id)} quality={75} />
                            <span className="absolute top-2 right-4 bg-white p-1 rounded-full">
                                <Image src={`/modoEmpleo/${item.modo_empleo}.svg`} width={18} height={18} alt={item.modo_empleo} title={item.modo_empleo} className="w-5 h-5" />
                            </span>
                        </div>
                        <div className="p-4 flex flex-col flex-grow">
                            <p className="flex items-center text-xl font-semibold text-gray-700 max-w-full truncate">
                                {item.nombre}
                                {item.alergenos?.length > 0 && (
                                    <span className="mx-4 flex gap-4 my-2">
                                    {item.alergenos.map((x) => (
                                        <Image key={x.alergeno_id} src={`/alergenos/${x.alergeno_id}.svg`} width={24} height={24} alt={x.nombre} title={x.nombre} className="w-6 h-6" />
                                    ))}
                                </span>
                                )}
                            </p>
                            <div className="mt-auto flex flex-row justify-between items-center ">
                                <p className="text-left text-gray-700 text-[22px] font-medium ">{item.precio}€</p>
                                <CantidadControl
                                    itemId={item.plato_id}
                                    cantidad={cantidad[item.plato_id] || 0}
                                    handleCantidadChange={handleCantidadChange}
                                />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </main>
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
        return <LoadingComponent></LoadingComponent>;
    }

    return (
        <main>
            <Navbar />
            <div className="container mx-auto max-w-full p-6">
                <Hero scrollToCategory={scrollToCategory} />
                <PasosServicio />
                <div className={"my-8"} ref={categoryRef}>
                    <h1 className="text-4xl text-center py-4 my-2 text-gray-700">Selecciona los platos de tu primer menú.</h1>
                    <p className="text-xl text-center text-gray-600">Los platos cambian de manera semanal y están disponibles solo hasta el sábado a las 17:30 h.</p>
                </div>
                <div>
                    <CategoriaLista titulo="Principales" items={principales} />
                    <CategoriaLista titulo="Postres" items={postres} />
                </div>
            </div>
        </main>
    );
}
