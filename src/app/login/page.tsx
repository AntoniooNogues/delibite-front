"use client";

import NavbarReducido from "@/components/NavbarReducido";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { EyeSlashIcon } from "@heroicons/react/16/solid";
import { EyeIcon } from "@heroicons/react/24/solid";
import { login } from "@/lib/usuario";
import { useRouter } from "next/navigation";

interface UserFormData {
    username: string;
    password: string;
}

export default function Login() {
    const router = useRouter();

    const [formData, setFormData] = useState<UserFormData>({
        username: "",
        password: "",
    });

    const Submit = async () => {
        try {
            const result = await login({
                username: formData.username,
                password: formData.password
            });
            if (result && result.token) {
                localStorage.setItem('token', result.token);
                router.push(`/`);
            } else {
                console.error('Login result is falsy or token is missing, not redirecting.');
            }
        } catch (error) {
            console.error('Error during login:', error);
        }
    };

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [notification, setNotification] = useState<string | null>(null);

    const validateCampo = (name: string, value: string) => {
        let error = "";

        switch (name) {
            case "username":
                if (!value) error = "El correo electrónico es obligatorio";
                break;
            case "password":
                if (!value) error = "La contraseña es obligatoria";
                break;
            default:
                break;
        }

        setErrors((prev) => ({ ...prev, [name]: error }));

        if (error) {
            setNotification(error);
            setTimeout(() => setNotification(null), 3000); // Ocultar después de 3s
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
            {notification && (
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    transition={{ duration: 0.3 }}
                    className="fixed top-5 right-5 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg"
                >
                    {notification}
                </motion.div>
            )}
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
        </div>
    );
}
