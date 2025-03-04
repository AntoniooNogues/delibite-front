"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axiosClient from "@/lib/axiosClient";
import NotificacionComponent from "@/components/Notificacion";
import { Notificaciones } from '@/interfaces/Notificaciones';
import axios from "axios";
import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import Navbar from "@/components/Navbar";
import { EyeOff, Eye } from 'lucide-react';
import Cookies from 'js-cookie';
const PasswordInput = ({ placeholder, value, onChange }: { placeholder: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => {
    const [showPassword, setShowPassword] = useState(false);

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="flex items-center border border-(--oxley-300) p-3 rounded-lg mt-2 w-full">
            <input
                type={showPassword ? "text" : "password"}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="flex-grow text-center tracking-widest outline-none"
            />
            <button
                type="button"
                onClick={toggleShowPassword}
                className="ml-2 flex items-center"
            >
                {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
            </button>
        </div>

    );
};

export default function VerificarCuenta() {
    const router = useRouter();
    const [notificacion, setNotificacion] = useState<Notificaciones | undefined>(undefined);
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");


    const handleNextStep = async () => {
        const gmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (gmailRegex.test(email)) {
            try {
                await axiosClient.post("/enviar-email/cambiar-password", { email });
                setStep(2);
            } catch (error) {
                if (axios.isAxiosError(error) && error.response) {
                    setNotificacion({
                        titulo: error.response.data.titulo,
                        mensaje: error.response.data.mensaje,
                        code: error.response.data.code,
                        tipo: error.response.data.tipo
                    });
                }
            }
        } else {
            setNotificacion({
                titulo: 'Error',
                mensaje: 'Por favor, introduce un correo con formato válido',
                code: 400,
                tipo: 'error'
            });
        }
    };

    const handleVerify = async () => {
        try {
            const data = { email, codigo: code };
            await axiosClient.post("/usuario/verificar-codigo", data);
            setStep(3);
        } catch (error: any) {
            if (axios.isAxiosError(error) && error.response) {
                setNotificacion({
                    titulo: error.response.data.titulo,
                    mensaje: error.response.data.mensaje,
                    code: error.response.data.code,
                    tipo: error.response.data.tipo
                });
            }
        }
    };

    const handleChangePassword = async () => {

        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.,]).{8,}$/.test(newPassword)) {
            setNotificacion({
                titulo: 'Error',
                mensaje: 'La contraseña debe tener al menos 1 número, 1 caracter especial (@$!%*?&.,), 1 mayúscula y minúscula y 8 caracteres',
                code: 400,
                tipo: 'error'
            });
            return;
        }

        if (newPassword !== confirmPassword) {
            setNotificacion({
                titulo: 'Error',
                mensaje: 'Las contraseñas no coinciden',
                code: 400,
                tipo: 'error'
            });
            return;
        }

        try {
            const data = { email, newPassword, confirmPassword};
            await axiosClient.patch("/usuario/cambiar-password", data);
            setNotificacion({
                titulo: 'Éxito',
                mensaje: 'Contraseña cambiada correctamente',
                code: 200,
                tipo: 'success'
            });
            setTimeout(() => {
                Cookies.remove('token');
                router.push("/login");
            }, 2500);
        } catch (error: any) {
            if (axios.isAxiosError(error) && error.response) {
                setNotificacion({
                    titulo: error.response.data.titulo,
                    mensaje: error.response.data.mensaje,
                    code: error.response.data.code,
                    tipo: error.response.data.tipo
                });
            }
        }
    };

    return (
        <>
            <div className="h-screen flex flex-col w-screen bg-(--gris-registro)">
                <div className="absolute w-full">
                    <Navbar />
                </div>
                <div className="h-screen flex items-center justify-center p-4">
                    <div className="p-8 rounded-lg w-full max-w-xl min-h-96 flex flex-col gap-8 items-center justify-center">
                        {step === 1 && (
                            <>
                                <header className="space-y-3 flex flex-col">
                                    <h2 className="text-3xl font-bold text-center text-primary-dark">
                                        Cambiar Contraseña
                                    </h2>
                                    <p className="text-center text-oxley-500">
                                        Introduce tu correo para recibir el código
                                    </p>
                                </header>
                                <div className="space-y-6 flex flex-col w-full">
                                    <input
                                        type="email"
                                        placeholder={"Correo Electrónico"}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="mt-2 w-full border border-(--oxley-300) p-3 rounded-lg text-center tracking-widest"
                                    />
                                </div>
                                <button
                                    onClick={handleNextStep}
                                    className="w-full px-5 py-3 bg-(--oxley-500) text-white rounded-lg hover:bg-(--primary-dark) hover:scale-105 active:scale-95 transition-transform"
                                >
                                    Enviar Código
                                </button>
                            </>
                        )}
                        {step === 2 && (
                            <>
                                <div className="flex items-center justify-between w-full">
                                    <button onClick={() => setStep(1)} className="w-12 h-12 hover:scale-105 active:scale-95 transition-transform">
                                        <ArrowLeftIcon className="h-fit w-fit text-gray-800 bg-white p-3 rounded-full sha" />
                                    </button>
                                    <h2 className="text-3xl font-bold text-center text-primary-dark mx-auto">
                                        Verificar Código
                                    </h2>
                                </div>
                                <p className="text-center text-oxley-500">
                                    Introduce el código enviado a {email}
                                </p>
                                <div className="w-full">
                                    <input
                                        type="text"
                                        placeholder={"Código de Verificación"}
                                        value={code}
                                        onChange={(e) => setCode(e.target.value)}
                                        className="mt-2 w-full border border-(--oxley-300) p-3 rounded-lg text-center tracking-widest"
                                    />
                                </div>
                                <button
                                    onClick={handleVerify}
                                    className="w-full px-5 py-3 bg-(--oxley-500) text-white rounded-lg hover:bg-(--primary-dark) hover:scale-105 active:scale-95 transition-transform"
                                >
                                    Verificar
                                </button>
                            </>
                        )}
                        {step === 3 && (
                            <>
                                <div className="flex items-center justify-between w-full">
                                    <button onClick={() => setStep(2)} className="w-12 h-12 hover:scale-105 active:scale-95 transition-transform">
                                        <ArrowLeftIcon className="h-fit w-fit text-gray-800 bg-white p-3 rounded-full sha" />
                                    </button>
                                    <h2 className="text-3xl font-bold text-center text-primary-dark mx-auto">
                                        Cambiar Contraseña
                                    </h2>
                                </div>
                                <div className={"w-full"}>
                                    <PasswordInput
                                        placeholder="Nueva Contraseña"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                    <p className="mt-2 mb-4 text-sm text-gray-600 text-justify text-wrap">La contraseña debe tener como mínimo 1 número, 1 caracter especial (@$!%*?&.,), 1 mayúscula y minúscula y 8 caracteres.</p>
                                    <PasswordInput
                                        placeholder="Confirmar Contraseña"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </div>
                                <button
                                    onClick={handleChangePassword}
                                    className="w-full px-5 py-3 bg-(--oxley-500) text-white rounded-lg hover:bg-(--primary-dark) hover:scale-105 active:scale-95 transition-transform"
                                >
                                    Cambiar Contraseña
                                </button>
                            </>
                        )}
                    </div>
                </div>
                {notificacion && (
                    <NotificacionComponent
                        Notificaciones={notificacion}
                        onClose={() => setNotificacion(undefined)}
                    />
                )}
            </div>
        </>
    );
}