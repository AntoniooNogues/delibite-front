"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, X } from "lucide-react";

export default function Carrito() {
    const [isOpen, setIsOpen] = useState(false);

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
                initial={{x: "100%"}}
                animate={{x: isOpen ? 0 : "100%"}}
                transition={{type: "spring", stiffness: 300, damping: 30}}
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
                <p className="text-gray-600">Aquí aparecerán los productos seleccionados.</p>
            </motion.div>
        </div>
    );
}