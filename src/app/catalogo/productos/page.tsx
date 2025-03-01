'use client';
import React, {useState, useEffect, useMemo, useRef, useCallback} from 'react';
import Image from "next/image";
import { motion } from "framer-motion";
import type { Catalogo } from '@/interfaces/Catalogo';
import { useRouter } from 'next/navigation';
import Loading from "@/components/Loading";
import CantidadControl from '@/components/BotonAddPlato';
import Navbar from "@/components/Navbar";
import { ChevronDownIcon, FlagIcon, XMarkIcon } from "@heroicons/react/20/solid";
import InputLabel from "@/components/LabelInput";
import {Box, Slider} from "@mui/material";
import { ArchiveBoxXMarkIcon } from "@heroicons/react/20/solid";
import { debounce } from 'lodash';
import axiosClient from "@/lib/axiosClient";
import NotificacionComponent from "@/components/Notificacion";
import {isNotificaciones, Notificaciones} from '@/interfaces/Notificaciones';
import Carrito from "@/components/Carrito";
import Cookies from "js-cookie";
import Footer from "@/components/Footer";
import { useTokenExpirado } from "@/hooks/useTokenExpirado";

const CategoriaLista = ({ titulo, items, subheader }: { titulo: string; items: Catalogo[]; subheader: string }) => {
    const [cantidad, setCantidad] = useState<{ [key: number]: number }>({});

    useEffect(() => {
        loadCantidadFromCookies();
    }, []);

    const loadCantidadFromCookies = () => {
        const carrito = Cookies.get("carrito");
        const carritoObj = carrito ? JSON.parse(carrito) : {};
        const newCantidad = Object.keys(carritoObj).reduce((acc, id) => {
            if (carritoObj[id].tipo === 'plato') {
                acc[parseInt(id)] = carritoObj[id].cantidad;
            }
            return acc;
        }, {} as { [key: number]: number });
        setCantidad(newCantidad);
    };

    const handleCantidadChange = (id: number, nombre: string, precio: number, value: number, img: string, tipo: 'plato' | 'suscripcion') => {
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
                carritoObj[id] = { nombre, precio, cantidad: value, img, tipo };
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

            <main className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 items-stretch justify-center mx-6 sm:mx-2 my-4 gap-6" >
                {items.map((item) => (
                    <div key={item.plato_id} className="relative border border-gray-300 rounded-2xl shadow-md bg-white overflow-hidden min-h-[360px] flex flex-col h-full">
                        <div className="relative">
                            {item.url ? (
                                <Image src={item.url} alt={item.nombre} width={1080} height={400} className="w-full h-50 object-cover" onClick={() => redireccionarDetallesPlato(item.nombre, item.plato_id)} quality={75} />
                            ) : (
                                <Image src={"/no_foto.avif"} alt={item.nombre} width={1080} height={400} className="w-full h-50 object-cover" onClick={() => redireccionarDetallesPlato(item.nombre, item.plato_id)} quality={75} />
                            )}
                            <span className="absolute top-2 right-4 p-1 rounded-full bg-white border-(--verde-azulado) border-2">
                                <Image src={`/modoEmpleo/${item.modo_empleo}.svg`} width={18} height={18} alt={item.modo_empleo} title={item.modo_empleo} className="w-8 h-8 objet-contain " />
                            </span>
                        </div>
                        <div className="p-4 flex flex-col flex-grow">
                            <p className="flex items-center text-xl font-semibold text-gray-700 max-w-full truncate">
                                {item.nombre}
                            </p>
                            {item.alergenos?.length > 0 && (
                                <div className="flex gap-4 my-4">
                                    {item.alergenos.map((x) => (
                                        <Image key={x.alergeno_id} src={`/alergenos/${x.alergeno_id}.svg`} alt={x.nombre} width={24} height={24} className="w-7 h-7" />
                                    ))}
                                </div>
                            )}
                            <div className="mt-auto flex flex-row justify-between items-center ">
                                <p className="text-left text-gray-700 text-[22px] font-medium ">{item.precio}€</p>
                                <CantidadControl
                                    cantidadInicial={cantidad[item.plato_id] || 0}
                                    handleCantidadChange={(value) => handleCantidadChange(item.plato_id, item.nombre, item.precio, value, item.url, 'plato')}
                                    width={35}
                                    height={35}
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
            <p className="text-2xl text-left text-(--primary-dark) pb-4 max-md:text-center">Filtra por tipo de plato, ingredientes o preferencias y encuentra tu comida ideal.</p>
            <div id="filtros" className="flex flex-row items-center gap-5 lg:gap-8 max-md:flex-col">
               <div className="w-fit flex flex-row gap-4">
                   <button className="my-2 p-3 bg-white text-(--primary-dark) font-bold rounded-xl  drop-shadow-xl hover:scale-105 active:scale-95 transition-all duration-300" onClick={resetFilters}>
                       <ArchiveBoxXMarkIcon className="h-6 w-6 text-(--verde-azulado)" />
                   </button>
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
               </div>

                <div className="w-full md:w-1/2 flex flex-col items-start max-md:items-center">
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
    const [catalogo, setCatalogo] = useState<Catalogo[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
    const [priceRange, setPriceRange] = useState<number[]>([0, 100]);
    const [notificacion, setNotificacion] = useState<Notificaciones>();
    const notificacionToken = useTokenExpirado();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axiosClient.get<Catalogo[]>(`/catalogo/cargar`);
            setCatalogo(response.data);
        } catch (error) {
            if (isNotificaciones(error)) {
                setNotificacion(error);
            }
        } finally {
            setLoading(false);
        }
    };


    const filterByGoalAndPrice = useCallback((item: Catalogo) => {
        const isPriceInRange = item.precio >= priceRange[0] && item.precio <= priceRange[1];
        const isGoalMatched = selectedGoal ? (
            selectedGoal === "Balanceada" ? item.calorias >= 400 && item.calorias <= 650 :
                selectedGoal === "Reducir grasa" ? item.calorias >= 300 && item.calorias <= 500 :
                    selectedGoal === "Aumentar músculo" ? item.calorias >= 500 && item.calorias <= 800 :
                        true
        ) : true;

        return isPriceInRange && isGoalMatched;
    }, [priceRange, selectedGoal]);


    const principales = useMemo((): Catalogo[] => {
        return Object.values(catalogo).filter((item: Catalogo) => item.tipo === "PRINCIPAL" && filterByGoalAndPrice(item));
    }, [catalogo, filterByGoalAndPrice]);

    const postres = useMemo((): Catalogo[] => {
        return Object.values(catalogo).filter((item: Catalogo) => item.tipo === "POSTRE" && filterByGoalAndPrice(item));
    }, [catalogo, filterByGoalAndPrice]);

    const precios = useMemo(() => catalogo.map(item => item.precio), [catalogo]);
    const precioMaximo = useMemo(() => (Math.ceil(Math.max(...precios))), [precios]);
    const precioMinimo = useMemo(() => (Math.floor(Math.min(...precios))), [precios]);



    return (
        <main>
            <Navbar />
            <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.4 }}  className="my-10 text-center py-16 bg-gradient-to-t from-(--oxley-700) to-(--verde-azulado-80) text-white">
                <h1 className="text-5xl font-bold">Menú Semanal</h1>
                <h3 className="text-2xl text-center py-4 my-2 ">Selecciona los platos de tu primer menú.</h3>
                <p className="text-xl text-center">Los platos cambian de manera semanal y están disponibles solo hasta el sábado a las 17:30 h.</p>
            </motion.div>
            <div className="p-4">
                {loading ? <Loading /> : (
                    <>
                        <Filtros setSelectedGoal={setSelectedGoal} priceMax={precioMaximo} priceMin={precioMinimo} setPriceRange={setPriceRange} />
                        <div>
                            <CategoriaLista titulo="Principales" items={principales} subheader={"Disfruta de nuestros platos saludables, equilibrados y deliciosos, diseñados para nutrirte y hacerte sentir bien cada semana."} />
                            <CategoriaLista titulo="Postres" items={postres} subheader={"Endulza tu semana con nuestros postres saludables, sin culpas y llenos de sabor, perfectos para darte un gusto balanceado."} />
                        </div>
                    </>
                )}
            </div>
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