"use client";
import "../globals.css"
import NavbarReducido from "@/components/NavbarReducido";
import Alergenos from "@/components/Alergenos";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { EyeIcon } from "@heroicons/react/24/solid";
import {EyeSlashIcon} from "@heroicons/react/16/solid";
import { useRouter  } from "next/navigation";
import axiosClient from "@/lib/axiosClient";
import NotificacionComponent from "@/components/Notificacion-Component";
import { Notificaciones } from '@/interfaces/Notificaciones';
import axios from "axios";
import Link from "next/link";

// Definir la interfaz para los datos del formulario
interface FormData {
    nombre: string;
    apellidos: string;
    email: string;
    dni: string;
    telefono: string;
    fecha_nacimiento: string;
    direccion: string;
    codigo_postal: string;
    username: string;
    password: string;
    confirmarContrasena: string;
    imagen: string;
}

export default function Registro() {
    const [step, setStep] = useState<number>(1);
    const router = useRouter();
    const [notificacion, setNotificacion] = useState<Notificaciones>();
    const [formData, setFormData] = useState<FormData>({
        nombre: "",
        apellidos: "",
        email: "",
        dni: "",
        telefono: "",
        fecha_nacimiento: "",
        direccion: "",
        codigo_postal: "",
        username: "",
        password: "",
        confirmarContrasena: "",
        imagen: "",
    });
    const handleSubmit = async () => {
        const formDataToSend = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            formDataToSend.append(key, value);
        });
        formDataToSend.append('alergenos', JSON.stringify(selectedAlergenos));

        const jsonObject: { [key: string]: string } = {};
        formDataToSend.forEach((value, key) => {
            if (typeof value === "string") {
                jsonObject[key] = value;
            }
        });

        try {
            console.log(jsonObject);
            const respuesta = await axiosClient.post("/registro/" , jsonObject);
            setNotificacion({ titulo: respuesta.data.titulo, mensaje: respuesta.data.mensaje, code: respuesta.data.code, tipo: respuesta.data.code });
            setTimeout(() => {
                router.push("/login");
            }, 2500);
        }catch (error){
            if (axios.isAxiosError(error) && error.response) {
                setNotificacion({ titulo: error.response.data.titulo, mensaje: error.response.data.mensaje , code: error.response.data.code, tipo: error.response.data.tipo });
            } else {
                setNotificacion({ titulo: 'Error', mensaje: 'Error al crear el plato: Error desconocido', code: 500, tipo: 'error' });
            }
        }
    };

    const [selectedAlergenos, setSelectedAlergenos] = useState<string[]>([]);

    const validateField = (name: string, value: string) => {
        const error:Notificaciones = { titulo: 'Error en el campo', mensaje: '', code: 400, tipo: 'error' };

        switch (name) {
            case "nombre":
            case "apellidos":
                if (!value.trim()) error.mensaje = "Este campo es obligatorio. ";
                break;

            case "email":
                if (!value) error.mensaje += "El email es obligatorio. ";
                else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
                    error.mensaje += "Correo electrónico no válido. ";
                break;

            case "dni":
                if (!/^\d{8}[A-Za-z]$/.test(value))
                    error.mensaje += "DNI no válido (8 números y 1 letra). ";
                break;

            case "telefono":
                if (!/^\d{9}$/.test(value))
                    error.mensaje += "Número de teléfono inválido (9 dígitos). ";
                break;

            case "fechaNacimiento":
                if (!value) error.mensaje += "La fecha de nacimiento es obligatoria. ";
                break;

            case "password":
                if (value.length < 6) error.mensaje += "La contraseña debe tener al menos 6 caracteres. ";
                break;

            case "confirmarContrasena":
                if (value !== formData.password) error.mensaje += "Las contraseñas no coinciden. ";
                break;

            default:
                break;
        }

        if (error) {
            setNotificacion(error);
        }
    };

    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

    // Manejo de cambios en los inputs
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });

        validateField(e.target.name, e.target.value);
    };
    function nextStep() {
        setStep((prev) => (prev < 4 ? prev + 1 : prev));
    }

    const prevStep = () => setStep((prev) => (prev > 1 ? prev - 1 : prev));

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };



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
                            <p className="text-md text-justify pt-4">
                                Regístrate en Delibite y descubre nuestra selección de platos saludables
                                y packs diseñados para tu bienestar. Comidas deliciosas,
                                nutritivas y listas para disfrutar.
                                ¡Simplifica tu día y cuida de tu salud con cada bocado!
                            </p>
                        </div>
                        <div className="pt-8 mt-auto">
                            <p className="text-sm">Si ya dispones de una cuenta, pulsa aqui.
                                <Link href="/login" className="text-black">
                                    &nbsp;Iniciar Sesión.
                                </Link>
                            </p>
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
                                            ? "bg-(--verde-azulado) text-white border-gray-400 shadow-lg"
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
                                    <div className="grid grid-cols-2 gap-6">
                                        <input
                                            name="nombre"
                                            value={formData.nombre}
                                            onChange={handleChange}
                                            onBlur={(e) => validateField(e.target.name, e.target.value)}
                                            className="border p-2 rounded shadow-lg"
                                            placeholder="Nombre"
                                        />
                                        <input
                                            name="apellidos"
                                            value={formData.apellidos}
                                            onChange={handleChange}
                                            onBlur={(e) => validateField(e.target.name, e.target.value)}
                                            className="border p-2 rounded shadow-lg"
                                            placeholder="Apellidos"
                                        />
                                        <input
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            onBlur={(e) => validateField(e.target.name, e.target.value)}
                                            className="border p-2 rounded shadow-lg"
                                            placeholder="Correo electrónico"
                                        />
                                        <input
                                            name="dni"
                                            value={formData.dni}
                                            onChange={handleChange}
                                            onBlur={(e) => validateField(e.target.name, e.target.value)}
                                            className="border p-2 rounded shadow-lg"
                                            placeholder="DNI"
                                        />
                                        <input
                                            name="telefono"
                                            value={formData.telefono}
                                            onChange={handleChange}
                                            onBlur={(e) => validateField(e.target.name, e.target.value)}
                                            className="border p-2 rounded shadow-lg"
                                            placeholder="Teléfono"
                                        />
                                        <input
                                            name="fecha_nacimiento"
                                            type="date"
                                            value={formData.fecha_nacimiento}
                                            onBlur={(e) => validateField(e.target.name, e.target.value)}
                                            onChange={handleChange}
                                            className="border p-2 rounded shadow-lg"
                                        />
                                        <input
                                            name="direccion"
                                            value={formData.direccion}
                                            onChange={handleChange}
                                            onBlur={(e) => validateField(e.target.name, e.target.value)}
                                            className="border p-2 rounded shadow-lg"
                                            placeholder="Dirección"
                                        />
                                        <input
                                            name="codigo_postal"
                                            value={formData.codigo_postal}
                                            onChange={handleChange}
                                            onBlur={(e) => validateField(e.target.name, e.target.value)}
                                            className="border p-2 rounded shadow-lg"
                                            placeholder="Código postal"
                                        />
                                    </div>
                                </div>
                            )}

                            {step === 2 && (
                                <div>
                                    <h2 className="text-xl font-bold mb-4">Detalles de cuenta</h2>
                                    <div className="grid grid-cols-1 gap-4">
                                        <input
                                            name="username"
                                            type="text"
                                            value={formData.username}
                                            onChange={handleChange}
                                            onBlur={(e) => validateField(e.target.name, e.target.value)}
                                            className="border p-2 rounded"
                                            placeholder="Nombre de usuario"
                                        />
                                        <div className="relative">
                                            <input
                                                name="password"
                                                type={showPassword ? "text" : "password"}
                                                value={formData.password}
                                                onChange={handleChange}
                                                className="border p-2 rounded w-full"
                                                placeholder="Contraseña"
                                            />
                                            <div
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                                                onClick={togglePasswordVisibility}
                                            >
                                                {showPassword ? (
                                                    <EyeSlashIcon className="h-5 w-5 text-gray-500"/>
                                                ) : (
                                                    <EyeIcon className="h-5 w-5 text-gray-500"/>
                                                )}
                                            </div>
                                        </div>
                                        <div className="relative">
                                            <input
                                                name="confirmarContrasena"
                                                type={showConfirmPassword ? "text" : "password"}
                                                value={formData.confirmarContrasena}
                                                onChange={handleChange}
                                                className="border p-2 rounded w-full"
                                                placeholder="Confirmar contraseña"
                                            />
                                            <div
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                                                onClick={toggleConfirmPasswordVisibility}
                                            >
                                                {showConfirmPassword ? (
                                                    <EyeSlashIcon className="h-5 w-5 text-(--verde-azulado)"/>
                                                ) : (
                                                    <EyeIcon className="h-5 w-5 text-gray-500"/>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {step === 3 && (
                                <div className="">
                                    <h2 className="text-xl font-bold mb-4">Selecciona tus alérgenos</h2>
                                    <Alergenos selectedAlergenos={selectedAlergenos}
                                               setSelectedAlergenos={setSelectedAlergenos}/>
                                </div>
                            )}

                            {step === 4 && (
                                <div>
                                    <h2 className="text-xl font-bold mb-4">Confirmación</h2>
                                    <p>Revisa tu información antes de enviar el formulario.</p>
                                    <div className="mt-4 grid grid-cols-2 gap-2">
                                        {Object.entries(formData)
                                            .filter(([key]) => key !== "confirmarContrasena" && key !== "imagen")
                                            .map(([key, value]) => (
                                                <div key={key} className="mb-2">
                                                    <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>
                                                    &nbsp;{key === "password" ? value.slice(0, 0) + "****" : value}
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            )}
                        </motion.div>

                        {/* Botones de navegación */}
                        <div className="flex justify-between mt-6">
                            {step > 1 && (
                                <button
                                    onClick={prevStep}
                                    className="px-4 py-2 bg-gray-400 text-white rounded
                                    hover:bg-gray-500 active:bg-gray-600 hover:text-white transition transform active:scale-95 hover:scale-105"
                                >
                                    Atrás
                                </button>
                            )}
                            {step < 4 ? (
                                <button
                                    onClick={nextStep}
                                    className="px-4 py-2 bg-(--verde-azulado) text-white rounded drop-shadow-xl ml-auto
                                    hover:bg-(--oxley-500) active:bg-(--oxley-700) hover:text-white transition transform active:scale-95 hover:scale-105"
                                >
                                    Siguiente
                                </button>
                            ) : (
                                <button  onClick={handleSubmit} className=" px-4 py-2 rounded-lg text-white bg-(--verde-azulado) hover:bg-(--oxley-500) active:bg-(--oxley-700) hover:text-white transition transform active:scale-95 hover:scale-105">
                                    Finalizar
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {notificacion && (
                <NotificacionComponent
                    Notificaciones={notificacion}
                    onClose={() => setNotificacion(undefined)}
                />
            )}
        </div>
    );
}
