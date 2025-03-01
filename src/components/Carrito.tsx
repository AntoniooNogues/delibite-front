"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { motion } from "framer-motion";
import { ShoppingCart, X, Trash } from "lucide-react";
import Cookies from "js-cookie";
import CantidadControl from "./BotonAddPlato";
import { CarritoItem } from "@/interfaces/CarritoItem";

export default function Carrito() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [carrito, setCarrito] = useState<{ [key: number]: CarritoItem }>({});
    const [cantidad1, setCantidad] = useState<{ [key: number]: number }>({});

    useEffect(() => {
        const updateCarrito = () => {
            const carritoGuardado = Cookies.get("carrito");
            if (carritoGuardado) {
                setCarrito(JSON.parse(carritoGuardado));
            }
        };

        updateCarrito();

        const intervalId = setInterval(updateCarrito, 1000);

        return () => {
            clearInterval(intervalId);
        };
    }, []);

    const handleCantidadChange = (id: number, nombre: string, precio: number, value: number, img: string) => {
        setCantidad(prev => {
            const newCantidad = { ...prev, [id]: value };
            if (newCantidad[id] <= 0) {
                delete newCantidad[id];
            }

            const carrito = Cookies.get("carrito");
            const carritoObj = carrito ? JSON.parse(carrito) : {};

            if (value > 0) {
                carritoObj[id] = { nombre, precio, cantidad: value, img };
            } else {
                delete carritoObj[id];
            }

            Cookies.set("carrito", JSON.stringify(carritoObj), { expires: 7 });

            const event = new CustomEvent("actualizacionCarrito", { detail: carritoObj });
            setTimeout(() => {
                window.dispatchEvent(event)
            }, 5);

            return newCantidad;
        });
    };

    const emptyCarrito = () => {
        setCarrito({});
        Cookies.remove("carrito");
    };

    const totalCarrito = Object.values(carrito).reduce((total, { precio, cantidad }) => total + (precio * cantidad), 0);
    const totalProductos = Object.values(carrito).reduce((total, { cantidad }) => total + cantidad, 0);
    const handleFinalizarCompra = () => {
        router.push('/detallesCarrito');
    };

    return (
        <div className="fixed bottom-4 right-4 z-50">
            {/* Botón flotante */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-(--oxley-500) text-white p-4 rounded-full shadow-lg hover:bg-(--primary-dark)
                active:bg-(--oxley-700) transition transform active:scale-95 hover:scale-105 focus:outline-none">
                <ShoppingCart size={24} />
                {totalProductos > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-md w-5 h-5 flex items-center justify-center">
                        {totalProductos}
                    </span>
                )}
            </button>

            {/* Sidebar del carrito */}
            <motion.div
                initial={{ x: "100%" }}
                animate={{ x: isOpen ? 0 : "100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed top-0 right-0 w-86 h-full bg-(--oxley-50) shadow-lg p-4 flex flex-col z-50"
            >
                <button
                    onClick={() => setIsOpen(false)}
                    className="self-end text-gray-500 hover:text-gray-700"
                >
                    <X size={30} className="text-(--oxley-500) hover:text-(--primary-dark)
                    active:text-(--oxley-700) transition transform active:scale-95 hover:scale-105" />
                </button>
                <h2 className="text-xl font-semibold">Tu Carrito</h2>

                {/* Mostrar productos */}
                <div className="mt-4 space-y-2">
                    {Object.keys(carrito).length > 0 ? (
                        Object.entries(carrito).map(([id, { nombre, precio, cantidad }]) => (
                            <div key={id} className="flex flex-col justify-between p-2 border-b">
                                <div>
                                    <p>{nombre}</p>
                                    <p>{cantidad}x {precio}€ = {(cantidad * precio).toFixed(2)}€</p>
                                </div>
                                <CantidadControl
                                    cantidadInicial={cantidad1[Number(id)] || 0}
                                    handleCantidadChange={(value) => handleCantidadChange(Number(id), nombre, precio, value,'')}
                                    width={30}
                                    height={30}
                                />
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-600">No hay productos en el carrito.</p>
                    )}
                </div>
                <div className="mt-4 border-t pt-4 flex justify-between items-center">
                    <p className="text-xl font-semibold">Total: {totalCarrito.toFixed(2)}€</p>
                    <button
                        onClick={emptyCarrito}
                        className="bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-700
                        active:bg-red-900 transition transform active:scale-95 hover:scale-105 focus:outline-none">
                        <Trash size={24} />
                    </button>
                </div>
                <div className="flex w-full justify-center items-center mt-4">
                    <button
                        onClick={handleFinalizarCompra}
                        className="p-2 bg-(--verde-azulado) rounded-2xl hover:bg-(--oxley-500) active:bg-(--oxley-700) transition transform active:scale-95 hover:scale-105">
                        Finalizar compra
                    </button>
                </div>
            </motion.div>
        </div>
    );
}