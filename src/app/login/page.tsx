"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { EyeSlashIcon } from "@heroicons/react/16/solid";
import { EyeIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import axiosClient from "@/lib/axiosClient";
import NotificacionComponent from "@/components/Notificacion";
import { Notificaciones } from '@/interfaces/Notificaciones';
import axios from "axios";
import Cookies from "js-cookie";
import Link from "next/link";
import NavbarReducido from "@/components/NavbarReducido";

interface UserFormData {
    username: string;
    password: string;
}

export default function Login() {
    const router = useRouter();
    const [notificacion, setNotificacion] = useState<Notificaciones>();
    const [loading, setLoading] = useState<boolean>(false);
    const [formData, setFormData] = useState<UserFormData>({
        username: "",
        password: "",
    });

    useEffect(() => {
        const storedNotificacion = localStorage.getItem("notificacion");
        if (storedNotificacion) {
            setNotificacion(JSON.parse(storedNotificacion));
            localStorage.removeItem("notificacion");
        }
    }, []);

    const Submit = async () => {
        if (!formData.username || !formData.password) {
            setNotificacion({
                titulo: 'Error',
                mensaje: 'Por favor, rellene todos los campos.',
                code: 400,
                tipo: 'error'
            });
            return;
        }

        setLoading(true);
        try {
            const respuesta = await axiosClient.post('/login_check', formData);
            if (respuesta && respuesta.data.token) {
                Cookies.set('token', respuesta.data.token);
                setNotificacion({
                    titulo: 'Éxito',
                    mensaje: 'Inicio de sesión exitoso',
                    code: 200,
                    tipo: 'success'
                });

                setTimeout(() => {
                    router.push('/');
                }, 1500);
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                if (error.response.data.message === "Invalid credentials.") {
                    setNotificacion({
                        titulo: 'Error de autenticación',
                        mensaje: 'Credenciales incorrectas. Por favor, verifica tu nombre de usuario y contraseña.',
                        code: error.response.data.code || 401,
                        tipo: 'error'
                    });
                } else if (error.response.data.titulo) {
                    setNotificacion({
                        titulo: error.response.data.titulo,
                        mensaje: error.response.data.mensaje,
                        code: error.response.data.code,
                        tipo: error.response.data.tipo
                    });
                } else {
                    setNotificacion({
                        titulo: 'Error',
                        mensaje: error.response.data.message || 'Ha ocurrido un error',
                        code: error.response.data.code || error.response.status,
                        tipo: 'error'
                    });
                }
            }
        } finally {
            setLoading(false);
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
        <div className="bg-(--gris-registro) min-h-screen flex flex-col max-md:space-y-6">
            <NavbarReducido/>
            {loading ?
                <div>
                    <div className="fixed inset-0 flex items-center justify-center  bg-opacity-50 z-50">
                        <div className="flex items-center justify-center px-10 py-6 rounded-lg w-1/3">
                            <div className="w-20 h-20 border-4 border-t-4 border-gray-200 rounded-full animate-spin border-t-(--verde-azulado)"/>
                        </div>
                    </div>
                </div>
                : (
                    <div className="flex-grow flex items-center justify-center w-full px-4">
                        <div className="px-6 py-6 rounded-lg w-full max-w-xl sm:px-10 sm:py-8">
                            <motion.div
                                initial={{opacity: 0, x: 50}}
                                animate={{opacity: 1, x: 0}}
                                exit={{opacity: 0, x: -50}}
                                transition={{duration: 0.3}}
                            >
                                <h2 className="text-4xl font-bold text-center mb-6">Hola de nuevo</h2>

                                <div className="flex flex-col gap-6">
                                    <input
                                        name="username"
                                        value={formData.username}
                                        type="text"
                                        onChange={handleChange}
                                        className="border p-2 bg-white rounded shadow-lg"
                                        placeholder="Nombre de usuario"
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
                                                <EyeSlashIcon className="h-5 w-5 text-gray-500"/>
                                            ) : (
                                                <EyeIcon className="h-5 w-5 text-gray-500"/>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-2 text-center">
                                    <a href="/cambiar-password" className="text-base">¿Olvidaste tu contraseña?</a>
                                </div>
                                <button
                                    onClick={Submit}
                                    className="px-4 py-2 mt-6 text-lg w-full bg-(--verde-azulado) rounded-4xl
                    hover:bg-(--oxley-500) active:bg-(--oxley-700) hover:text-white transition transform active:scale-95 hover:scale-105">
                                    Entrar
                                </button>
                                <div className="text-center mt-6">
                                    <Link href="/registro" className="text-sm">Es mi primera vez y quiero unirme</Link>
                                </div>
                            </motion.div>
                        </div>
                    </div>
            )}

            {notificacion && (
                <NotificacionComponent
                    Notificaciones={notificacion}
                    onClose={() => setNotificacion(undefined)}
                />
            )}
        </div>
    );
}