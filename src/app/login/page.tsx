"use client";

import NavbarReducido from "@/components/NavbarReducido";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { EyeSlashIcon } from "@heroicons/react/16/solid";
import { EyeIcon } from "@heroicons/react/24/solid";
import { login } from "@/lib/usuario";
import { useRouter } from "next/navigation";
import axiosClient from "@/lib/axiosClient";
import NotificacionComponent from "@/components/Notificacion-Component";
import { Notificaciones } from '@/interfaces/Notificaciones';
import axios from "axios";
import Cookies from "js-cookie";

interface UserFormData {
    username: string;
    password: string;
}

export default function Login() {
    const router = useRouter();
    const [notificacion, setNotificacion] = useState<Notificaciones>();
    const [formData, setFormData] = useState<UserFormData>({
        username: "",
        password: "",
    });

    const Submit = async () => {
        try {
            const respuesta = await axiosClient.post('/login_check', formData);
            if (respuesta && respuesta.data.token) {
                Cookies.set('token', respuesta.data.token);
            }
            setNotificacion({ titulo: 'Éxito', mensaje: 'Inicio de sesión exitoso', code: 200, tipo: 'success' });
            setTimeout(() => {
                router.push(`/`);
            }, 2000);
        }catch (error){
            if (axios.isAxiosError(error) && error.response) {
                setNotificacion({ titulo: error.response.data.titulo, mensaje: error.response.data.mensaje , code: error.response.data.code, tipo: error.response.data.tipo });
            } else {
                setNotificacion({ titulo: 'Error', mensaje: 'Error al crear el plato: Error desconocido', code: 500, tipo: 'error' });
            }
        }
    };

    const validateCampo = (name: string, value: string) => {
        let error:Notificaciones = { titulo: 'Error en el campo', mensaje: '', code: 400, tipo: 'error' };

        switch (name) {
            case "username":
                if (!value) error.mensaje = "El correo electrónico es obligatorio";
                break;
            case "password":
                if (!value) error.mensaje = "La contraseña es obligatoria";
                break;
            default:
                break;
        }


        if (error) {
            setNotificacion(error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const [showPassword, setShowPassword] = useState<boolean>(false);
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="bg-(--gris-registro) min-h-screen flex flex-col">
            <NavbarReducido />
            <div className="flex-grow flex items-center justify-center">
                <div className="px-10 py-8 rounded-4xl bg-(--verde-azulado-80) min-w-sm">
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3 }}
                    >
                        <span className="text-center">
                            <h2 className="text-3xl font-bold text-white mb-4 pb-8">Hola de nuevo</h2>
                        </span>

                        <div className="flex flex-col gap-8">
                            <input
                                name="username"
                                value={formData.username}
                                type="email"
                                onChange={handleChange}
                                onBlur={(e) => validateCampo(e.target.name, e.target.value)}
                                className="border p-2 bg-white rounded shadow-lg"
                                placeholder="Correo electrónico"
                            />
                            <div className="relative">
                                <input
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="border bg-white p-2 rounded w-full"
                                    placeholder="Contraseña"
                                />
                                <div
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                                    onClick={togglePasswordVisibility}
                                >
                                    {showPassword ? (
                                        <EyeSlashIcon className="h-5 w-5 text-gray-500" />
                                    ) : (
                                        <EyeIcon className="h-5 w-5 text-gray-500" />
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="mt-2">
                            <a href="#" className="text-sm">¿Olvidaste tu contraseña?</a>
                            <button onClick={Submit} className="px-4 py-2 mt-8 text-lg w-full bg-white rounded-4xl">
                                Entrar
                            </button>
                            <div className="text-center mt-4">
                                <a href="/registro" className="text-sm">Es mi primera vez y quiero unirme</a>
                            </div>
                        </div>
                    </motion.div>
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
