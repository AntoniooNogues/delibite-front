import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion, useAnimation } from "framer-motion";
import { StarIcon } from "@heroicons/react/20/solid";




const valoraciones = [
    { nombre: "Ana López", texto: "¡Increíble! Comida deliciosa y súper práctica.", avatar: "/valoraciones/icon-mujer.jpg",estrellas: 4 },
    { nombre: "Carlos Pérez", texto: "Me ahorra muchísimo tiempo y me alimento mejor.", avatar: "/valoraciones/icon-hombre.jpg", estrellas: 5 },
    { nombre: "Laura Gómez", texto: "Los platos son variados y siempre frescos. Me encanta.", avatar: "/valoraciones/icon-mujer2.jpg", estrellas: 3 },
    { nombre: "Javier Martínez", texto: "Ideal para mi dieta y súper cómodo.", avatar: "/valoraciones/icon-hombre2.jpg", estrellas: 5 },
    { nombre: "Elena Rodríguez", texto: "Sabores increíbles y sin complicaciones.", avatar: "/valoraciones/icon-mujer3.jpg", estrellas: 5 },
    { nombre: "David Fernández", texto: "Ahora como más saludable sin perder tiempo.", avatar: "/valoraciones/icon-hombre3.jpg", estrellas: 3 },
    { nombre: "Sofía Méndez", texto: "Me encanta la variedad y la calidad.", avatar: "/valoraciones/icon-mujer4.jpg", estrellas: 4 },
    { nombre: "Pablo Ramírez", texto: "Muy práctico, y el sabor es espectacular.", avatar: "/valoraciones/icon-hombre4.jpg", estrellas: 5 },
    { nombre: "María Torres", texto: "Perfecto para mi rutina. ¡Recomendado!", avatar: "/valoraciones/icon-mujer5.jpg", estrellas: 4 },
    { nombre: "Carla Castro", texto: "La mejor opción para comer sano sin esfuerzo.", avatar: "/valoraciones/icon-mujer6.jpg", estrellas: 4 }
];

const TestimonialSlider = () => {
    const carouselRef = useRef<HTMLDivElement>(null);
    const [containerWidth, setContainerWidth] = useState(0);
    const controls = useAnimation();

    const valoracionesDuplicadas = [...valoraciones, ...valoraciones];

    useEffect(() => {
        if (carouselRef.current) {
            const totalWidth = carouselRef.current.scrollWidth;
            setContainerWidth(totalWidth / 2);
        }
    }, []);

    useEffect(() => {
        if (containerWidth === 0) return;
        const duration = containerWidth / 50;

        controls.start({
            x: -containerWidth,
            transition: {
                duration: duration,
                ease: "linear",
                repeat: Infinity,
            },
        });
    }, [containerWidth, controls]);

    return (
        <section className=" py-12">
            <div className=" mx-auto text-center">
                <motion.h2
                    className="text-3xl font-bold mb-6"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    Lo que dicen nuestros clientes
                </motion.h2>
                <div className="overflow-hidden">
                    <motion.div
                        ref={carouselRef}
                        className="flex gap-6"
                        animate={controls}
                    >
                        {valoracionesDuplicadas.map((valoraciones, index) => (
                            <div
                                key={index}
                                className="min-w-[250px] bg-white p-6 rounded-lg shadow-md flex flex-col items-center"
                            >
                                <Image
                                    src={valoraciones.avatar}
                                    alt={valoraciones.nombre}
                                    width={60}
                                    height={60}
                                    className="rounded-full mb-4"
                                />
                                <p className="text-lg font-semibold">{valoraciones.nombre}</p>
                                <div className="flex  my-2">
                                    {[...Array(5)].map((_, i) => (
                                        <StarIcon key={i} className={`h-6 w-6 ${i < valoraciones.estrellas ? "text-yellow-500" : "text-gray-300"}`} />
                                    ))}
                                </div>
                                <p className="text-gray-600 text-center">{valoraciones.texto}</p>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default TestimonialSlider;
