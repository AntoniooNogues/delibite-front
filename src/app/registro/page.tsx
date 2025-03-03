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
import NotificacionComponent from "@/components/Notificacion";
import { Notificaciones } from '@/interfaces/Notificaciones';
import axios from "axios";
import Link from "next/link";

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
            const respuesta = await axiosClient.post("/usuario/registro/" , jsonObject);
            setNotificacion({ titulo: respuesta.data.titulo, mensaje: respuesta.data.mensaje, code: respuesta.data.code, tipo: respuesta.data.code });
            setTimeout(() => {
                router.push("/verificar-cuenta/");
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
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

    const highlightPasswordFields = (inputNames: string[]) => {
        inputNames.forEach((inputName) => {
            const inputElement = document.querySelector(`input[name="${inputName}"]`);
            if (inputElement) {
                inputElement.classList.add("border-red-500");
            }
        });
    };

    const removeHighlightFromFields = (inputNames: string[]) => {
        inputNames.forEach((inputName) => {
            const inputElement = document.querySelector(`input[name="${inputName}"]`);
            if (inputElement) {
                inputElement.classList.remove("border-red-500");
            }
        });
    };

    const validateStep = async ()  => {
        const errors = [];
        const errorBase = { titulo: 'Error', code: 400, tipo: 'error' };
        const camposResaltar = [];

        switch (step) {
            case 1:
                if (!formData.nombre || !formData.apellidos || !formData.email || !formData.dni || !formData.telefono || !formData.fecha_nacimiento || !formData.direccion || !formData.codigo_postal) {
                    errors.push('Por favor, complete todos los campos obligatorios.');
                    camposResaltar.push("nombre", "apellidos", "email", "dni", "telefono", "fecha_nacimiento", "direccion", "codigo_postal");
                    break;
                }
                if (!/^\d{9}$/.test(formData.telefono)) {
                    errors.push('El teléfono debe tener exactamente 9 números.');
                    camposResaltar.push("telefono");
                }
                if (!/^\d{8}[A-Z]$/.test(formData.dni)) {
                    errors.push('El DNI debe tener 8 números seguidos de una letra mayúscula.');
                    camposResaltar.push("dni");
                }
                if (!/^\d{5}$/.test(formData.codigo_postal as string)) {
                    errors.push('El código postal debe tener exactamente 5 números.');
                    camposResaltar.push("codigo_postal");
                }
                if (new Date(formData.fecha_nacimiento) > new Date(new Date().setFullYear(new Date().getFullYear() - 18))) {
                    errors.push('Debes ser mayor de edad para registrarte.');
                    camposResaltar.push("fecha_nacimiento");
                }
                break;
            case 2:

                if (!formData.username || !formData.password || !formData.confirmarContrasena) {
                    errors.push('Por favor, complete todos los campos obligatorios.');
                    camposResaltar.push("username", "password", "confirmarContrasena");
                    break
                }
                if (formData.password !== formData.confirmarContrasena) {
                    errors.push('Las contraseñas no coinciden.');
                    camposResaltar.push("password", "confirmarContrasena");
                }
                if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(formData.password)) {
                    errors.push('La contraseña no cumple con los requisitos mínimos.');
                    camposResaltar.push("password", "confirmarContrasena");
                }
                try {
                    await axiosClient.get(`/usuario/comprobar-username/${formData.username}`);
                } catch (error) {
                    if (axios.isAxiosError(error) && error.response) {
                        if (error.response.status === 409) {
                            errors.push('El nombre de usuario ya está en uso.');
                            camposResaltar.push("username");
                        }
                    }
                }
                break;
            case 3:
                if (selectedAlergenos.length === 0) {
                    errors.push('Por favor, seleccione al menos un alérgeno.');
                }
                break;
            default:
                break;
        }

        if (errors.length > 0) {
            setNotificacion({ ...errorBase, mensaje: errors.join(' \n ') });
            highlightPasswordFields(camposResaltar);
            return false;
        }

        return true;
    };



    async function nextStep() {
        removeHighlightFromFields(["nombre", "apellidos", "email", "dni", "telefono", "fecha_nacimiento", "direccion", "codigo_postal", "username", "password", "confirmarContrasena"]);
        if (await validateStep()) {
            setStep((prev) => (prev < 4 ? prev + 1 : prev));
        }
    }

    const prevStep = () => {
        removeHighlightFromFields(["nombre", "apellidos", "email", "dni", "telefono", "fecha_nacimiento", "direccion", "codigo_postal", "username", "password", "confirmarContrasena"]);
        setStep((prev) => (prev > 1 ? prev - 1 : prev));
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    return (
        <div className="min-h-screen flex flex-col w-full bg-(--gris-registro)">
            <NavbarReducido />
            <div className="flex-grow flex items-center justify-center shadow-lg">
                <div className="flex flex-col md:flex-row justify-center items-stretch w-full max-w-6xl">
                    <div className="bg-(--verde-azulado-80) w-full md:w-1/3 p-8 rounded-t-lg md:rounded-l-lg md:rounded-tr-none text-white">
                        <div className="mb-2">
                            <span className="text-4xl" style={{ fontFamily: 'Limelight, sans-serif' }}>delibite</span>
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
                    <div className="bg-white p-8 rounded-b-lg md:rounded-r-lg md:rounded-bl-none w-full md:w-2/3 max-w-4xl">

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

                        <motion.div
                            key={step}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.3 }}
                        >
                            {step === 1 && (
                                <div>
                                    <h2 className="text-xl font-bold mb-4">Datos personales</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <input
                                            name="nombre"
                                            value={formData.nombre}
                                            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                            className={`border p-2 rounded w-full`}
                                            placeholder="Nombre"
                                        />
                                        <input
                                            name="apellidos"
                                            value={formData.apellidos}
                                            onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}
                                            className={`border p-2 rounded w-full`}
                                            placeholder="Apellidos"
                                        />
                                        <input
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className={`border p-2 rounded w-full`}
                                            placeholder="Correo electrónico"
                                        />
                                        <input
                                            name="dni"
                                            value={formData.dni}
                                            onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
                                            className={`border p-2 rounded w-full`}
                                            maxLength={9}
                                            placeholder="DNI"
                                        />
                                        <input
                                            name="telefono"
                                            value={formData.telefono}
                                            onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                                            className={`border p-2 rounded w-full`}
                                            maxLength={9}
                                            placeholder="Teléfono"
                                        />
                                        <input
                                            name="fecha_nacimiento"
                                            type="date"
                                            value={formData.fecha_nacimiento}
                                            onChange={(e) => setFormData({ ...formData, fecha_nacimiento: e.target.value })}
                                            className={`border p-2 rounded w-full`}
                                            max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                                        />
                                        <input
                                            name="direccion"
                                            value={formData.direccion}
                                            onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                                            className={`border p-2 rounded w-full`}
                                            placeholder="Dirección"
                                        />
                                        <input
                                            name="codigo_postal"
                                            value={formData.codigo_postal}
                                            onChange={(e) => setFormData({ ...formData, codigo_postal: e.target.value })}
                                            className={`border p-2 rounded w-full`}
                                            maxLength={5}
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
                                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                            className={`border p-2 rounded w-full`}
                                            placeholder="Nombre de usuario"
                                        />
                                        <div className="relative">
                                            <input
                                                name="password"
                                                type={showPassword ? "text" : "password"}
                                                value={formData.password}
                                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                className={`border p-2 rounded w-full `}
                                                placeholder="Contraseña"
                                            />
                                            <div
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                                                onClick={togglePasswordVisibility}
                                            >
                                                {showPassword ? (
                                                    <EyeSlashIcon className="h-5 w-5 text-black"/>
                                                ) : (
                                                    <EyeIcon className="h-5 w-5 text-black"/>
                                                )}
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-600 text-justify text-wrap">La contraseña debe tener como mínimo 1 número, 1 caracter especial (@$!%*?&.), 1 mayúscula y minúscula y 8 caracteres</p>
                                        <div className="relative">
                                            <input
                                                name="confirmarContrasena"
                                                type={showConfirmPassword ? "text" : "password"}
                                                value={formData.confirmarContrasena}
                                                onChange={(e) => setFormData({ ...formData, confirmarContrasena: e.target.value })}
                                                className={`border p-2 rounded w-full`}
                                                placeholder="Confirmar contraseña"
                                            />
                                            <div
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                                                onClick={toggleConfirmPasswordVisibility}
                                            >
                                                {showConfirmPassword ? (
                                                    <EyeSlashIcon className="h-5 w-5 text-black"/>
                                                ) : (
                                                    <EyeIcon className="h-5 w-5 text-black"/>
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
                                               setSelectedAlergenos={setSelectedAlergenos} />
                                </div>
                            )}

                            {step === 4 && (
                                <div>
                                    <h2 className="text-xl font-bold mb-4">Confirmación</h2>
                                    <p>Revisa tu información antes de enviar el formulario.</p>
                                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
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