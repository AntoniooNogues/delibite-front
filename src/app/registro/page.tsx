"use client";
import "../globals.css"
import NavbarReducido from "@/components/NavbarReducido";

import { useState } from "react";
import { motion } from "framer-motion";

// Definir la interfaz para los datos del formulario
interface FormData {
    nombre: string;
    apellidos: string;
    email: string;
    dni: string;
    telefono: string;
    fechaNacimiento: string;
    direccion: string;
    codigoPostal: string;
    ciudad: string;
    pais: string;
    contrasena: string;
    confirmarContrasena: string;
}

export default function Registro() {
    const [step, setStep] = useState<number>(1);

    const [formData, setFormData] = useState<FormData>({
        nombre: "",
        apellidos: "",
        email: "",
        dni: "",
        telefono: "",
        fechaNacimiento: "",
        direccion: "",
        codigoPostal: "",
        ciudad: "",
        pais: "",
        contrasena: "",
        confirmarContrasena: "",
    });

    // Manejo de cambios en los inputs
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const nextStep = () => setStep((prev) => (prev < 4 ? prev + 1 : prev));
    const prevStep = () => setStep((prev) => (prev > 1 ? prev - 1 : prev));

    return (
        <div className="h-screen flex flex-col w-screen bg-(--gris-registro)">
            <NavbarReducido/>
            <div className="flex-grow flex items-center justify-center shadow-lg">
                <div className="flex justify-center items-stretch">
                    <div className="bg-(--verde-azulado-80) w-1/4 p-8 rounded-l-lg text-white">
                        <div className="mb-2">
                            <span className="text-4xl" style={{fontFamily: 'Limelight, sans-serif'}}>delibite</span>
                        </div>
                        <div className="pt-8">
                            <h3 className="text-2xl">Come saludable, vive mejor</h3>
                            <p className="text-lg text-justify pt-4">
                                Regístrate en Delibite y descubre nuestra selección de platos saludables
                                y packs diseñados para tu bienestar. Comidas deliciosas,
                                nutritivas y listas para disfrutar.
                                ¡Simplifica tu día y cuida de tu salud con cada bocado!
                            </p>
                        </div>
                        <div className="pt-8">
                            <p className="text-md">Si ya dispones de una cuenta, pulsa aqui. <a href="#"
                                                                                                className="text-black">Iniciar
                                Sesión.</a></p>
                        </div>
                    </div>
                    <div className="bg-white p-8  rounded-r-lg w-2/4 max-w-4xl">

                        {/* Barra de progreso */}
                        <div className="flex justify-between mb-6">
                            {[1, 2, 3, 4].map((num) => (
                                <div
                                    key={num}
                                    className={`flex items-center justify-center w-10 h-10 rounded-full text-lg font-semibold border-2 ${
                                        step >= num
                                            ? "bg-gray-200 border-(--verde-azulado)"
                                            : "bg-gray-200 border-gray-400"
                                    }`}
                                >
                                    {num}
                                </div>
                            ))}
                        </div>
                        {/* Contenido dinámico por paso con animación */}
                        <motion.div
                            key={step}
                            initial={{opacity: 0, x: 50}}
                            animate={{opacity: 1, x: 0}}
                            exit={{opacity: 0, x: -50}}
                            transition={{duration: 0.3}}
                        >
                            {step === 1 && (
                                <div>
                                    <h2 className="text-xl font-bold mb-4">Datos personales</h2>
                                    <div className="grid grid-cols-2 gap-4">
                                        <input
                                            name="nombre"
                                            value={formData.nombre}
                                            onChange={handleChange}
                                            className="border p-2 rounded"
                                            placeholder="Nombre"
                                        />
                                        <input
                                            name="apellidos"
                                            value={formData.apellidos}
                                            onChange={handleChange}
                                            className="border p-2 rounded"
                                            placeholder="Apellidos"
                                        />
                                        <input
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="border p-2 rounded"
                                            placeholder="Correo electrónico"
                                        />
                                        <input
                                            name="dni"
                                            value={formData.dni}
                                            onChange={handleChange}
                                            className="border p-2 rounded"
                                            placeholder="DNI"
                                        />
                                        <input
                                            name="telefono"
                                            value={formData.telefono}
                                            onChange={handleChange}
                                            className="border p-2 rounded"
                                            placeholder="Teléfono"
                                        />
                                        <input
                                            name="fechaNacimiento"
                                            type="date"
                                            value={formData.fechaNacimiento}
                                            onChange={handleChange}
                                            className="border p-2 rounded"
                                        />
                                    </div>
                                </div>
                            )}

                            {step === 2 && (
                                <div>
                                    <h2 className="text-xl font-bold mb-4">Dirección</h2>
                                    <div className="grid grid-cols-2 gap-4">
                                        <input
                                            name="direccion"
                                            value={formData.direccion}
                                            onChange={handleChange}
                                            className="border p-2 rounded"
                                            placeholder="Dirección"
                                        />
                                        <input
                                            name="codigoPostal"
                                            value={formData.codigoPostal}
                                            onChange={handleChange}
                                            className="border p-2 rounded"
                                            placeholder="Código postal"
                                        />
                                        <input
                                            name="ciudad"
                                            value={formData.ciudad}
                                            onChange={handleChange}
                                            className="border p-2 rounded"
                                            placeholder="Ciudad"
                                        />
                                        <input
                                            name="pais"
                                            value={formData.pais}
                                            onChange={handleChange}
                                            className="border p-2 rounded"
                                            placeholder="País"
                                        />
                                    </div>
                                </div>
                            )}

                            {step === 3 && (
                                <div>
                                    <h2 className="text-xl font-bold mb-4">Detalles de cuenta</h2>
                                    <div className="grid grid-cols-1 gap-4">
                                        <input
                                            name="contraseña"
                                            type="password"
                                            value={formData.contrasena}
                                            onChange={handleChange}
                                            className="border p-2 rounded"
                                            placeholder="Contraseña"
                                        />
                                        <input
                                            name="confirmarContraseña"
                                            type="password"
                                            value={formData.confirmarContrasena}
                                            onChange={handleChange}
                                            className="border p-2 rounded"
                                            placeholder="Confirmar contraseña"
                                        />
                                    </div>
                                </div>
                            )}

                            {step === 4 && (
                                <div>
                                    <h2 className="text-xl font-bold mb-4">Confirmación</h2>
                                    <p>Revisa tu información antes de enviar el formulario.</p>
                                </div>
                            )}
                        </motion.div>

                        {/* Botones de navegación */}
                        <div className="flex justify-between mt-6">
                            {step > 1 && (
                                <button
                                    onClick={prevStep}
                                    className="px-4 py-2 bg-gray-400 text-white rounded"
                                >
                                    Atrás
                                </button>
                            )}
                            {step < 4 ? (
                                <button
                                    onClick={nextStep}
                                    className="px-4 py-2 bg-(--verde-azulado) text-white rounded"
                                >
                                    Siguiente
                                </button>
                            ) : (
                                <button className="px-4 py-2 bg-blue-500 text-white rounded">
                                    Finalizar
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
