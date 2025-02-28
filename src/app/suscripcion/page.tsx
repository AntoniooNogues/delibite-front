"use client";
import Navbar from "@/components/Navbar";
import {ArrowUp10, Pen, Soup, UserRoundPen} from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { isNotificaciones, Notificaciones } from "@/interfaces/Notificaciones";
import axiosClient from "@/lib/axiosClient";
import { Catalogo } from "@/interfaces/Catalogo";
import Loading from "@/components/Loading";
import CantidadControl from "@/components/BotonAddPlato";
import {useRouter} from "next/navigation";
import Cookies from "js-cookie";
import NotificacionComponent from "@/components/Notificacion";
import Footer from "@/components/Footer";
import {CarritoItem} from "@/interfaces/CarritoItem";

export default function Suscripcion() {
    const [catalogo, setCatalogo] = useState<Catalogo[]>([]);
    const [loading, setLoading] = useState(true);
    const [notificacion, setNotificacion] = useState<Notificaciones>();
    const [cantidad, setCantidad] = useState<{ [key: number]: number }>({});
    const [totalPlatos, setTotalPlatos] = useState(0);



    useEffect(() => {
        fetchData();
        loadCantidadFromCookies();
        calculateTotalPlatos();
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

    const loadCantidadFromCookies = () => {
        const carrito = Cookies.get("carrito");
        const carritoObj = carrito ? JSON.parse(carrito) : {};
        const newCantidad = Object.keys(carritoObj).reduce((acc, id) => {
            acc[parseInt(id)] = carritoObj[id].cantidad;
            return acc;
        }, {} as { [key: number]: number });
        setCantidad(newCantidad);
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

    const calculateTotalPlatos = () => {
        const carrito = Cookies.get("carrito");
        const carritoObj = carrito ? JSON.parse(carrito) : {};

        const total = Object.values(carritoObj)
            .filter((item: unknown): item is CarritoItem => (item as CarritoItem).tipo === 'suscripcion')
            .map((item: CarritoItem) => item.cantidad)
            .reduce((acc: number, cantidad: number) => acc + cantidad, 0);

        setTotalPlatos(total);
    };

    const handleCantidadChange = (id: number, nombre: string, precio: number, value: number, img: string, tipo: 'plato' | 'suscripcion') => {
        setCantidad(prev => {
            const newCantidad = { ...prev, [id]: value };
            if (newCantidad[id] <= 0) {
                delete newCantidad[id];
            }

            const carrito = Cookies.get("carrito");
            const carritoObj = carrito ? JSON.parse(carrito) : {};

            if (value > 0) {
                carritoObj[id] = { nombre, precio, cantidad: value, img, tipo };
            } else {
                delete carritoObj[id];
            }

            Cookies.set("carrito", JSON.stringify(carritoObj), { expires: 7 });

            const event = new CustomEvent("actualizacionCarrito", { detail: carritoObj });
            setTimeout(() => {
                window.dispatchEvent(event)
            }, 5);

            const total = Object.values(carritoObj)
                .filter((item: unknown): item is CarritoItem => (item as CarritoItem).tipo === 'suscripcion')
                .map((item: CarritoItem) => item.cantidad)
                .reduce((acc: number, cantidad: number) => acc + cantidad, 0);
            setTotalPlatos(total);

            return newCantidad;
        });
    };

    const handleFinalizarCompra = () => {
        router.push('/detallesCarrito');
    };

    if (loading) {
        return <div>
            <Loading></Loading>
        </div>
    }

    return (
        <div>
            <Navbar></Navbar>
            <div className="flex flex-col lg:flex-row items-center justify-center mt-8 w-4/5 mx-auto">
                <div className="w-full lg:w-1/2 flex justify-center">
                    <Image src={"/pasta.jpg"} alt={"Pancakes"} width={700} height={400} className="rounded-2xl"></Image>
                </div>
                <div className="w-full lg:w-1/2 flex flex-col items-center justify-center space-y-4 mt-4 lg:mt-0">
                    <h2 className="text-3xl lg:text-5xl font-semibold text-(--primary-dark)">Tú decides qué
                        disfrutar</h2>
                    <h3 className="text-xl lg:text-2xl text-(--verde-azulado) text-center">Elige los platos que más te
                        gusten para tu primer día de suscripción y disfruta de una experiencia culinaria única</h3>
                    <div className="text-lg lg:text-xl space-y-1">
                        <div className="flex gap-2 items-center">
                            <UserRoundPen className="text-red-400"/>
                            <p>Cada semana recibirás un menú único pensado para ti</p>
                        </div>
                        <div className="flex gap-2 items-center">
                            <Pen className="text-red-400"/>
                            <p>Siempre podrás ajustarlo a tu gusto</p>
                        </div>
                        <div className="flex gap-2 items-center">
                            <ArrowUp10 className="text-red-400"/>
                            <p>Tú decides cuántos platos recibir cada semana</p>
                        </div>
                    </div>
                    <div className="text-center text-lg mt-4">
                        <p>Sin ataduras</p>
                        <p className="text-green-700">Pausa o cancela cuando quieras</p>
                    </div>
                </div>
            </div>
            <div className="ms-8 mt-12">
                <h2 className="text-2xl flex space-x-2 items-center"><Soup className="text-red-400"/> <p>Elige tus
                    platos:</p></h2>
            </div>
            <main
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 items-stretch justify-center mx-6 sm:mx-2 my-4 gap-6">
                {catalogo.map((item) => (
                    <div key={item.plato_id}
                         className="relative border border-gray-300 rounded-2xl shadow-md bg-white overflow-hidden min-h-[360px] flex flex-col h-full">
                        <div className="relative">
                            {item.url ? (
                                <Image src={item.url} alt={item.nombre} width={1080} height={400}
                                       className="w-full h-50 object-cover"
                                       onClick={() => redireccionarDetallesPlato(item.nombre, item.plato_id)}
                                       quality={75}/>
                            ) : (
                                <Image src={"/no_foto.avif"} alt={item.nombre} width={1080} height={400}
                                       className="w-full h-50 object-cover"
                                       onClick={() => redireccionarDetallesPlato(item.nombre, item.plato_id)}
                                       quality={75}/>
                            )}
                            <span
                                className="absolute top-2 right-4 p-1 rounded-full bg-white border-(--verde-azulado) border-2">
                                <Image src={`/modoEmpleo/${item.modo_empleo}.svg`} width={18} height={18}
                                       alt={item.modo_empleo} title={item.modo_empleo}
                                       className="w-8 h-8 objet-contain "/>
                            </span>
                        </div>
                        <div className="p-4 flex flex-col flex-grow">
                            <p className="flex items-center text-xl font-semibold text-gray-700 max-w-full truncate">
                                {item.nombre}
                            </p>
                            {item.alergenos?.length > 0 && (
                                <div className="flex gap-4 my-4">
                                    {item.alergenos.map((x) => (
                                        <Image key={x.alergeno_id} src={`/alergenos/${x.alergeno_id}.svg`}
                                               alt={x.nombre} width={24} height={24} className="w-7 h-7"/>
                                    ))}
                                </div>
                            )}
                            <div className="mt-auto flex flex-row justify-between items-center ">
                                <p className="text-left text-gray-700 text-[22px] font-medium ">{item.precio}€</p>
                                <CantidadControl
                                    itemId={item.plato_id}
                                    cantidadInicial={cantidad[item.plato_id] || 0}
                                    handleCantidadChange={(id, value) => handleCantidadChange(item.plato_id, item.nombre, item.precio, value, item.url, 'suscripcion')}
                                    width={35}
                                    height={35}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </main>
            <div className="fixed bottom-0 left-0 right-0 bg-(--verde-azulado) p-4 text-center flex items-center justify-center space-x-4">
                <p className="text-lg font-semibold">Total de platos seleccionados: {totalPlatos}</p>
                <button
                    onClick={handleFinalizarCompra}
                    className="p-2 bg-white rounded-2xl hover:bg-(--oxley-500) active:bg-(--oxley-700) transition transform active:scale-95 hover:scale-105">
                    Finalizar compra
                </button>
            </div>
            <Footer></Footer>
            {notificacion && (
                <NotificacionComponent
                    Notificaciones={notificacion}
                    onClose={() => setNotificacion(undefined)}
                />
            )}
        </div>
    );
}