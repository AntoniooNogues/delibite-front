'use client';
import React, { JSX, useState } from 'react';
import '../administracion.css';
import { motion } from 'framer-motion';
import { EyeSlashIcon, EyeIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/navigation';
import {adminLogin} from '@/lib/administracion';
import { InformationCircleIcon, XMarkIcon } from '@heroicons/react/20/solid';
import {UserFormData} from "@/interfaces/UserForm";
import Cookies from 'js-cookie';

const ErrorNotification = ({ mensaje, cerrar }: { mensaje: string | null, cerrar: () => void }) => (
    mensaje ? (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-5 right-5 w-fit px-3 py-2 flex items-center rounded-full bg-black text-white gap-2 shadow-2xl "
        >
            <InformationCircleIcon className="h-6 w-6 text-red-600" />

            <span className="text-lg font-medium">{mensaje}</span>
            <button onClick={cerrar} className="ml-auto hover:scale-105 active:scale-95 transition-transform cursor-pointer">
                <XMarkIcon className="h-6 w-6 text-white" />
            </button>
        </motion.div>
    ) : null
);

export default function LoginAdministracion(): JSX.Element {
    const router = useRouter();
    const [formData, setFormData] = useState<UserFormData>({ username: '', password: '' });
    const [notification, setNotification] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validarCampos = (name: string, value: string) => {
        let error = "";

        switch (name) {
            case "username":
                if (!value) error = "El nombre de usuario es obligatorio";
                break;
            case "password":
                if (!value) error = "La contraseña es obligatoria";
                break;
            default:
                break;
        }

        if (error) {
            setNotification(error);
            setTimeout(() => setNotification(null), 3000);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const result = await adminLogin({
                username: formData.username,
                password: formData.password
            });
            if (result && result.token) {
                Cookies.set('token', result.token);
                router.push(`/administracion/`);
            } else {
                console.error('El token no se ha devuelto.');
            }
        } catch (error) {
            console.error('Error en el inicio de sesión:', error);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-pattern">
            <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                <ErrorNotification mensaje={notification} cerrar={() => setNotification(null)} />
                <form className="administracion flex flex-col items-center gap-8 bg-black/80 text-white rounded-xl p-8 shadow-lg w-96" onSubmit={handleSubmit}>
                    <div>
                        <span className="text-4xl text-(--oxley-50) cursor-pointer" style={{ fontFamily: "Limelight, sans-serif" }} onClick={() => router.push('/')}>
                            delibite
                        </span>
                    </div>
                    <div className="w-full flex flex-col gap-2">
                        <label htmlFor="usuario" className="text-white font-semibold pb-2">
                            Nombre de usuario:
                        </label>
                        <input type="text" name="username" id="username" autoComplete="off" value={formData.username} onChange={handleChange} onBlur={(e) => validarCampos(e.target.name, e.target.value)} className="w-full p-3 rounded-lg bg-[var(--oxley-800)] text-[var(--oxley-50)] outline-none border-2 border-transparent focus:border-[var(--verde-azulado)] transition" />
                    </div>

                    {/* Campo de Contraseña */}
                    <div className="w-full flex flex-col gap-2 relative">
                        <label htmlFor="password" className="text-white font-semibold pb-2">
                            Contraseña:
                        </label>
                        <div className="relative">
                            <input type={showPassword ? "text" : "password"} name="password" id="password" value={formData.password} onChange={handleChange} onBlur={(e) => validarCampos(e.target.name, e.target.value)} className="w-full p-3 rounded-lg bg-[var(--oxley-800)] text-[var(--oxley-50)] outline-none border-2 border-transparent focus:border-[var(--verde-azulado)] transition" />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center cursor-pointer" onClick={togglePasswordVisibility}>
                                {showPassword ? (
                                    <EyeSlashIcon className="h-5 w-5 text-[var(--oxley-200)]" />
                                ) : (
                                    <EyeIcon className="h-5 w-5 text-[var(--oxley-200)]" />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Botón de Envío */}
                    <button type="submit" className="mt-4 w-full p-3 rounded-full bg-[var(--oxley-700)] text-[var(--oxley-50)] font-semibold transition-all duration-300 hover:bg-[var(--verde-azulado)] hover:text-[var(--oxley-900)]">
                        Inicio de Sesión
                    </button>
                </form>
            </motion.div>
        </div>
    );
}