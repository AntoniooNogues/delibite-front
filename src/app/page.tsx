'use client';

import Navbar from "@/components/Navbar";
import Image from "next/image";
import Slider from "@/components/Slider";
import Footer from "@/components/Footer";
import Carrito from "@/components/Carrito";
import React, { useEffect, useState } from "react";
import {useRouter} from "next/navigation";
import {motion} from "framer-motion";
import axiosClient from "@/lib/axiosClient";
import axios from "axios";
import { Plato } from "@/interfaces/home";
import NotificacionComponent from "@/components/Notificacion";
import {Notificaciones} from "@/interfaces/Notificaciones";
import { useTokenExpirado } from "@/hooks/useTokenExpirado";



const Hero = () => {
    const router = useRouter();
    return (
        <motion.div className="flex flex-col lg:flex-row items-center justify-between lg:p-10 " initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.4 }}>
            <div className="text-center lg:text-left lg:w-1/2 w-full px-4 lg:px-8">
                <h1 className="text-4xl lg:text-5xl font-bold text-[var(--primary-dark)] leading-tight">
                    Sabor y bienestar en cada bocado.
                </h1>
                <p className="text-lg lg:text-xl text-[var(--verde-azulado)] mt-4">
                    Ingredientes frescos, recetas balanceadas y todo el sabor que necesitas para disfrutar sin culpa. ¡Disfruta lo mejor para tu bienestar en cada bocado!
                </p>
                <button className="my-6 px-6 py-3 bg-[var(--verde-azulado)] text-white rounded-full hover:scale-105 active:scale-95 transition-all duration-300" onClick={() => router.push("/catalogo/productos")}>
                    Ver Menú
                </button>
            </div>
            <div className="flex justify-center items-center mt-6 lg:mt-0 w-1/2">
                <Image src={"/home/imagen-home.jpg"} alt="Hero" width={50} height={50} title="Imagen de un plato de delibite" className="w-full rounded-2xl" priority layout="responsive" placeholder="blur" blurDataURL="/home/imagen-home.png" quality={75} />
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


export default function Home() {
    const [showNavbar, setShowNavbar] = useState(true);
    const [platos, setPlatos] = useState<Plato[]>([]);
    const [notificacion, setNotificacion] = useState<Notificaciones>();
    const notificacionToken = useTokenExpirado();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axiosClient.get<Plato[]>(`/home/cargar`);
            setPlatos(response.data);
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                setNotificacion({ titulo: error.response.data.titulo, mensaje: error.response.data.mensaje, code: error.response.data.code, tipo: error.response.data.tipo });
            } else {
                setNotificacion({ titulo: 'Error', mensaje: 'Error al cargar los platos', code: 500, tipo: 'error' });
            }
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            const imageElement = document.getElementById("hero-image");
            if (imageElement) {
                const rect = imageElement.getBoundingClientRect();
                setShowNavbar(rect.bottom > 0);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const router = useRouter();
    return (

        <div className="flex flex-col ">
            {showNavbar && <Navbar />}

            <main className="flex-grow">

                <section className="container mx-auto max-w-full p-6">
                    <Hero />
                    <PasosServicio />
                </section>

                {/*Seccion introduccion*/}
                <section className="my-6">
                    <div className="flex flex-col items-center justify-center gap-6 px-4 text-center">
                        <h1 className="text-5xl font-bold">
                            Comer saludable nunca fue tan fácil.
                        </h1>
                        <p className="text-2xl">
                            Descubre platos deliciosos, nutritivos y listos para ti.
                            Elige lo mejor para tu cuerpo sin complicaciones.
                        </p>
                        <div id="hero-image" className="w-full max-w-4xl">
                            <Image
                                src="/home/hero.jpg"
                                alt="Hero"
                                width={800}
                                height={400}
                                className="rounded-2xl m-4 shadow-xl w-full object-cover"
                            />
                        </div>
                    </div>
                </section>


                {/* Sección de Slider */}
                <Slider />

                {/* Sección CTA */}
                <section className="bg-(--verde-azulado) text-white py-12 text-center">
                    <h2 className="text-4xl font-bold mb-4">¡Empieza hoy mismo!</h2>
                    <p className="text-lg mb-6">Haz tu pedido ahora y disfruta de la mejor comida saludable en minutos.</p>
                    <button className="bg-white text-(--oxley-900) px-6 py-3 rounded-full font-semibold hover:scale-105 active:scale-95 transition" onClick={() => router.push("/catalogo/productos")}>
                        Ver Menú
                    </button>
                </section>

                {/*Seccion de Platos*/}
                <section className="py-12 px-4">
                    <div className="max-w-7xl mx-auto">
                        <h2 className="text-3xl font-bold text-center mb-8">Explora nuestros platos</h2>
                        {platos.length > 0 ? (
                            <div className="relative flex justify-center items-center max-md:flex-col max-md:gap-10">
                                {/* Tarjeta Izquierda */}
                                <div className="max-md:static max-md:-translate-x-0 relative group rounded-lg overflow-hidden shadow-md w-[350px] h-[350px] cursor-pointer z-10 transform -translate-x-10">
                                    <Image
                                        src={platos[0].url}
                                        alt={`Comida saludable ${platos[0].nombre}`}
                                        width={350}
                                        height={350}
                                        className="transition-transform duration-300 group-hover:scale-105 w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent opacity-50"></div>
                                    <div className="absolute bottom-0 left-0 right-0 p-4">
                                        <h3 className="text-lg font-semibold text-white">{platos[0].nombre}</h3>
                                    </div>
                                </div>
                                {/* Tarjeta Centro */}
                                <div className="relative group rounded-lg overflow-hidden shadow-md w-[350px] h-[350px] cursor-pointer z-20 mx-[-80px]">
                                    <Image
                                        src={platos[1].url}
                                        alt={`Comida saludable ${platos[1].nombre}`}
                                        width={350}
                                        height={350}
                                        className="transition-transform duration-300 group-hover:scale-105 w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent opacity-50"></div>
                                    <div className="absolute bottom-0 left-0 right-0 p-4">
                                        <h3 className="text-lg font-semibold text-white">{platos[1].nombre}</h3>
                                    </div>
                                </div>
                                {/* Tarjeta Derecha */}
                                <div className="max-md:static max-md:-translate-x-0 relative group rounded-lg overflow-hidden shadow-md w-[350px] h-[350px] cursor-pointer z-30 transform translate-x-10">
                                    <Image
                                        src={platos[2].url}
                                        alt={`Comida saludable ${platos[2].nombre}`}
                                        width={350}
                                        height={350}
                                        className="transition-transform duration-300 group-hover:scale-105 w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent opacity-50"></div>
                                    <div className="absolute bottom-0 left-0 right-0 p-4">
                                        <h3 className="text-lg font-semibold text-white">{platos[2].nombre}</h3>
                                    </div>
                                </div>
                            </div>
                        ): (
                            <div className="flex justify-center items-center">
                                <p className="text-lg text-gray-600">No hay platos disponibles</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* Sección de Beneficios */}
                <section className="py-12 px-4 ">
                    <div className="max-w-5xl mx-auto text-center">
                        <h2 className="text-3xl font-bold mb-6">¿Por qué elegirnos frente a otras opciones?</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse border border-gray-300 text-lg">
                                <thead>
                                <tr className="bg-[var(--verde-azulado)] text-white">
                                    <th className="p-4">Característica</th>
                                    <th className="p-4">Nuestro Servicio</th>
                                    <th className="p-4">Cocinar en Casa</th>
                                    <th className="p-4">Delivery Tradicional</th>
                                </tr>
                                </thead>
                                <tbody>
                                {[
                                    { caracteristica: "Tiempo ahorrado", servicio: "✅ Alto", casa: "❌ Bajo", delivery: "✅ Medio" },
                                    { caracteristica: "Ingredientes naturales", servicio: "✅ 100%", casa: "✅ Depende", delivery: "❌ No siempre" },
                                    { caracteristica: "Precio accesible", servicio: "✅ Sí", casa: "✅ Variable", delivery: "❌ Normalmente más caro" },
                                    { caracteristica: "Platos equilibrados", servicio: "✅ Sí, revisado por nutricionistas", casa: "❌ Depende del conocimiento", delivery: "❌ No siempre saludable" },
                                    { caracteristica: "Sostenibilidad", servicio: "✅ Uso de empaques reciclables", casa: "✅ Depende", delivery: "❌ Genera más residuos" }
                                ].map((row, index) => (
                                    <tr key={index} className="border border-gray-300">
                                        <td className="p-4 font-semibold">{row.caracteristica}</td>
                                        <td className="p-4">{row.servicio}</td>
                                        <td className="p-4">{row.casa}</td>
                                        <td className="p-4">{row.delivery}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                {/* Sección de FQA */}
                <section className="py-12 px-4 m-4 max-w-5xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-6">Preguntas Frecuentes</h2>
                    {[
                        { summary: "¿Cómo hago un pedido?", p: "Puedes hacer un pedido en nuestra web o llamando al +34 612 345 678." },
                        { summary: "¿Cuánto tarda en llegar mi pedido?", p: "Los pedidos se entregan los martes y los usuarios con suscripciones activas podrán elegir entre el jueves o el martes." },
                        { summary: "¿Puedo personalizar mi pedido?", p: "Sí, puedes elegir los platos que prefieras." },
                        { summary: "¿Cómo caliento la comida?", p: "Puedes calentarlo en microondas en 2-3 minutos o en sartén." }
                    ].map((row, index) => (
                        <details className="mb-4 p-4 border rounded-lg cursor-pointer" key={index} onClick={(e) => {
                            document.querySelectorAll("details").forEach((el) => {
                                if (el !== e.currentTarget) {
                                    el.removeAttribute("open");
                                }
                            });
                        }}>
                            <summary className="font-semibold">{row.summary}</summary>
                            <p className="mt-2 text-gray-600">{row.p}</p>
                        </details>
                    ))}

                </section>

            </main>

            {/* Componente CarritoItem */}
            <Carrito />

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
        </div>
    );
}
