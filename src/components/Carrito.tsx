"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, X, Trash } from "lucide-react";
import Cookies from "js-cookie";
import CantidadControl from "./BotonAddPlato-Component";

export default function Carrito() {
    const [isOpen, setIsOpen] = useState(false);
    const [carrito, setCarrito] = useState<{ [key: number]: { nombre: string, precio: number, cantidad: number } }>({});

    useEffect(() => {
        const updateCarrito = () => {
            const carritoGuardado = Cookies.get("carrito");
            if (carritoGuardado) {
                setCarrito(JSON.parse(carritoGuardado));
            }
        };

        // Initial load
        updateCarrito();

        // Set up interval to check for changes in the cookies
        const intervalId = setInterval(updateCarrito, 1000);

        // Clean up interval on component unmount
        return () => clearInterval(intervalId);
    }, []);

    const handleCantidadChange = (id: number, value: number) => {
        setCarrito(prev => {
            const newCarrito = { ...prev };
            if (value > 0) {
                newCarrito[id].cantidad = value;
            } else {
                delete newCarrito[id];
            }

            // Save updated carrito object to cookies
            Cookies.set("carrito", JSON.stringify(newCarrito), { expires: 7 });

            return newCarrito;
        });
    };

    const emptyCarrito = () => {
        setCarrito({});
        Cookies.remove("carrito");
    };

    const totalCarrito = Object.values(carrito).reduce((total, { precio, cantidad }) => total + (precio * cantidad), 0);

    return (
        <div className="fixed bottom-4 right-4 z-50">
            {/* Botón flotante */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-(--oxley-500) text-white p-4 rounded-full shadow-lg hover:bg-(--primary-dark)
                active:bg-(--oxley-700) transition transform active:scale-95 hover:scale-105 focus:outline-none">
                <ShoppingCart size={24} />
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
                    active:text-(--oxley-700) transition transform active:scale-95 hover:scale-105"/>
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
                                    itemId={parseInt(id)}
                                    cantidad={cantidad}
                                    handleCantidadChange={(itemId, value) => handleCantidadChange(itemId, value)}
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
            </motion.div>
        </div>
    );
}