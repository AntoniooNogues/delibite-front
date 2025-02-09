'use client';
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { getCatalogo } from '@/lib/catalogo';
import Image from "next/image";
import { motion } from "framer-motion";
import type { Catalogo } from './types';
import { useRouter } from 'next/navigation';
import LoadingComponent from "@/components/Loading-Component";
import CantidadControl from '@/components/BotonAddPlato-Component';
import Navbar from "@/components/Navbar";
import { ChevronDownIcon, FlagIcon, XMarkIcon } from "@heroicons/react/20/solid";
import InputLabel from "@/components/LabelInput-Component";
import {Box, Slider} from "@mui/material";
import { ArchiveBoxXMarkIcon } from "@heroicons/react/20/solid";
import { debounce } from 'lodash';
import Carrito from "@/components/Carrito";
import Cookies from "js-cookie";


const Hero = ({ scrollToCategory }: { scrollToCategory: () => void }) => {
    return (
        <motion.div className="flex flex-col lg:flex-row items-center justify-between lg:p-10 gap-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.4 }}>
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
            <div className="flex justify-center items-center mt-6 lg:mt-0 w-full lg:w-1/2">
                <Image src={"/catalogo/papas_arrugas.webp"} alt="Hero" width={600} height={600} title="Plato 12: papas arrugas con mojo" className="rounded-2xl" priority layout="responsive" placeholder="blur" blurDataURL="/catalogo/papas_arrugas_blur.webp" quality={75} />
            </div>
        </motion.div>
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

const CategoriaLista = ({ titulo, items, subheader }: { titulo: string; items: Catalogo[]; subheader: string }) => {
    const [cantidad, setCantidad] = useState<{ [key: number]: number }>({});

    const handleCantidadChange = (id: number, nombre: string, precio:number, value: number) => {
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
            <header className="my-8 flex flex-col gap-4 ">
                <div className="flex flex-row gap-0 items-center">
                    <p className="text-2xl text-(--primary-dark)">{titulo}</p>
                    <p className="text-2xl text-(--oxley-700) border-2 p-2 border-(--primary-dark) rounded-full mx-2 w-10 h-10 flex items-center justify-center">{items.length}</p>
                    <p>: </p>
                </div>
                <div>
                    <p className="text-wrap text-justify text-gray-700">{subheader}</p>
                </div>
            </header>

            <main className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 items-stretch justify-center mx-6 sm:mx-2 my-4 gap-6" >
                {items.map((item) => (
                    <div key={item.plato_id} className="relative border border-gray-300 rounded-2xl shadow-md bg-white overflow-hidden min-h-[360px] flex flex-col h-full">
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
                                    handleCantidadChange={(id, value) => handleCantidadChange(item.plato_id, item.nombre, item.precio, value)}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </main>
        </>
    );
};


const Filtros = ({ setSelectedGoal, priceMax, priceMin, setPriceRange }: {
    setSelectedGoal: React.Dispatch<React.SetStateAction<string | null>>,
    priceMax?: number,
    priceMin?: number,
    setPriceRange: React.Dispatch<React.SetStateAction<number[]>>
}) => {
    const minPrice = priceMin ?? 0;
    const maxPrice = priceMax ?? 100;

    const [priceRange, setLocalPriceRange] = useState<number[]>([minPrice, maxPrice]);

    const handlePriceChange = (_event: Event, newValue: number | number[]) => {
        if (!Array.isArray(newValue)) return;
        if (newValue[0] === newValue[1]) {
            return;
        }
        setLocalPriceRange(newValue);
        setPriceRange(newValue);
        debouncedSetPriceRange(newValue);
    };

    const debouncedSetPriceRange = useMemo(() => debounce(setPriceRange, 2000), [setPriceRange]);


    useEffect(() => {
        setLocalPriceRange([minPrice, maxPrice]);
    }, [minPrice, maxPrice]);

    const [showInputs, setShowInputs] = useState(false);
    const [inputWidth, setInputWidth] = useState(0);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [selectedGoal, setSelectedGoalState] = useState<string | null>(null);

    const handleButtonClick = () => {
        setShowInputs(!showInputs);
    };

    const handleGoalChange = (goal: string) => {
        setSelectedGoal(goal);
        setSelectedGoalState(goal);
        setShowInputs(false);
    };

    const clearGoal = () => {
        setSelectedGoal(null);
        setSelectedGoalState(null);
    };

    useEffect(() => {
        if (buttonRef.current) {
            setInputWidth(buttonRef.current.offsetWidth);
        }
    }, [showInputs]);

    /*Eliminar filtros*/
    const resetFilters = () => {
        const minPrice = priceMin ?? 0;
        const maxPrice = priceMax ?? 100;
        setSelectedGoal(null);
        setPriceRange([minPrice, maxPrice]);
        setLocalPriceRange([minPrice, maxPrice]);
    };

    return (
        <main className="flex flex-col gap-2">
            <p className="text-2xl text-(--primary-dark) pb-4">Filtra por tipo de plato, ingredientes o preferencias y encuentra tu comida ideal.</p>
            <div id="filtros" className="flex flex-row items-center lg:gap-8">
               <div className={"w-fit"}>
                   <button className="my-2 p-3 bg-white text-(--primary-dark) font-bold rounded-xl w-fit flex flex-row gap-4 drop-shadow-xl hover:scale-105 active:scale-95 transition-all duration-300" onClick={resetFilters}>
                       <ArchiveBoxXMarkIcon className="h-6 w-6 text-(--verde-azulado)" />
                   </button>
               </div>
                <div className="w-fit">
                    <button ref={buttonRef} className="my-2 px-2 py-3 bg-white text-(--primary-dark) font-bold rounded-xl  w-fit flex flex-row gap-4 drop-shadow-xl" onClick={handleButtonClick}>
                        <span className="relative h-6 w-6 flex items-center justify-center">
                          <FlagIcon className="h-6 w-6 text-(--verde-azulado)"/>
                        </span>
                        {selectedGoal ? selectedGoal : "Objetivo nutricional"}
                        {selectedGoal ? (<span>
                        <XMarkIcon className="h-6 w-6 text-(--oxley-900)" onClick={clearGoal}/></span>) : (<span>
                            <ChevronDownIcon
                                className={`h-6 w-6 text-(--oxley-900) ${showInputs ? 'rotate-180 transition-300' : ''}`}/></span>)}
                    </button>
                    {showInputs && !selectedGoal && (
                        <motion.div className="z-10 absolute px-2 py-3 bg-white text-gray-700 rounded-xl flex flex-col gap-4 drop-shadow-xl" style={{width: inputWidth}} initial={{opacity: 0, y: -20}} animate={{opacity: 1, y: 0}} exit={{opacity: 0, y: -20}} transition={{duration: 0.3}}>
                            <InputLabel label={ "Alimentación balanceada"} name={ "radioGroup"} type={ "radio"} onChange={()=> handleGoalChange("Balanceada")}/>
                            <InputLabel label={ "Reducir grasa"} name={ "radioGroup"} type={ "radio"} onChange={()=> handleGoalChange("Reducir grasa")}/>
                            <InputLabel label={ "Aumentar músculo"} name={ "radioGroup"} type={ "radio"} onChange={()=> handleGoalChange("Aumentar músculo")}/>
                        </motion.div>)}
                </div>
                <div className="w-full md:w-1/2 flex flex-col items-start">
                    <label htmlFor="price-slider" className="text-gray-900 text-sm font-bold pb-1">
                        Rango de Precios (€):
                    </label>
                    <Box sx={{ width: 250 }}>
                        <Slider id="price-slider" aria-label={`Rango de precio: ${priceRange[0]}€ - ${priceRange[1]}€`} value={priceRange}
                                onChange={handlePriceChange} valueLabelDisplay="auto" getAriaValueText={(value)=> `${value}€`} disableSwap min={priceMin} max={priceMax} sx={{ color: "var(--verde-azulado)", "& .MuiSlider-thumb":
                                { backgroundColor: "var(--primary-dark)", }, "& .MuiSlider-rail": { backgroundColor: "var(--gris-oscuro)",
                            }, "& .MuiSlider-track": { backgroundColor: "var(--verde-azulado)", }, "& .MuiSlider-valueLabel":
                                { backgroundColor: "var(--verde-azulado)", color: "white", }, }} />
                        <div className="flex justify-between text-sm text-black font-bold mt-1">
                            <span>{priceMin === Infinity ? 0 : priceMin}€</span>
                            <span>{priceMax === -Infinity ? 0 : priceMax}€</span>
                        </div>
                    </Box>
                </div>
            </div>
        </main>
    );
};


export default function Catalogo() {
    const [data, setData] = useState<Catalogo[]>([]);
    const [loading, setLoading] = useState(true);
    const categoryRef = useRef<HTMLDivElement>(null);
    const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
    const [priceRange, setPriceRange] = useState<number[]>([0, 100]);

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

    const filterByGoalAndPrice = (item: Catalogo) => {
        const isPriceInRange = item.precio >= priceRange[0] && item.precio <= priceRange[1];
        const isGoalMatched = selectedGoal ? (
            selectedGoal === "Balanceada" ? item.calorias >= 400 && item.calorias <= 650 :
                selectedGoal === "Reducir grasa" ? item.calorias >= 300 && item.calorias <= 500 :
                    selectedGoal === "Aumentar músculo" ? item.calorias >= 500 && item.calorias <= 800 :
                        true
        ) : true;

        return isPriceInRange && isGoalMatched;
    };

    const principales = useMemo(() => data.filter(item => item.tipo === "PRINCIPAL" && filterByGoalAndPrice(item)), [data, selectedGoal, priceRange]);
    const postres = useMemo(() => data.filter(item => item.tipo === "POSTRE" && filterByGoalAndPrice(item)), [data, selectedGoal, priceRange]);

    const scrollToCategory = () => {
        categoryRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const precios = useMemo(() => data.map(item => item.precio), [data]);
    const precioMaximo = useMemo(() => (Math.ceil(Math.max(...precios))), [precios]);
    const precioMinimo = useMemo(() => (Math.ceil(Math.min(...precios))), [precios]);

    return (
        <main>
            <Navbar />
            <div>
                <div className="container mx-auto max-w-full p-6">
                    <Hero scrollToCategory={scrollToCategory} />
                    <PasosServicio />
                    <div className={"my-8"} ref={categoryRef}>
                        <h1 className="text-4xl text-center py-4 my-2 text-gray-700">Selecciona los platos de tu primer menú.</h1>
                        <p className="text-xl text-center text-gray-600">Los platos cambian de manera semanal y están disponibles solo hasta el sábado a las 17:30 h.</p>
                    </div>
                </div>
            </div>

            <div className="bg-[#E6E6E6] max-md:p-4 md:p-8 lg:p-16">
                {loading ? <LoadingComponent /> : (
                    <>
                        <Filtros setSelectedGoal={setSelectedGoal} priceMax={precioMaximo} priceMin={precioMinimo} setPriceRange={setPriceRange} />
                        <div>
                            <CategoriaLista titulo="Principales" items={principales} subheader={"Disfruta de nuestros platos saludables, equilibrados y deliciosos, diseñados para nutrirte y hacerte sentir bien cada semana."} />
                            <CategoriaLista titulo="Postres" items={postres} subheader={"Endulza tu semana con nuestros postres saludables, sin culpas y llenos de sabor, perfectos para darte un gusto balanceado."} />
                        </div>
                    </>
                )}
            </div>
            <Carrito></Carrito>
        </main>
    );
}