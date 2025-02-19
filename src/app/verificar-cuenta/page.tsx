"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axiosClient from "@/lib/axiosClient";
import NotificacionComponent from "@/components/Notificacion-Component";
import { Notificaciones } from '@/interfaces/Notificaciones';
import axios from "axios";
import NavbarReducido from "@/components/NavbarReducido";
import type { VerificarCuenta } from "@/interfaces/VerificarCuenta";
import { BackwardIcon } from "@heroicons/react/20/solid";
import Cookies from "js-cookie";
import ErrorPage from "@/pages/[_error]";

export default function VerificarCuenta() {
    const router = useRouter();
    const [propiedadesCuenta, setPropiedades] = useState<VerificarCuenta>();
    const [notificacion, setNotificacion] = useState<Notificaciones | undefined>(undefined);
    const [existeToken, setExisteToken] = useState(false);
    const token = Cookies.get("token");

    useEffect(() => {
        if (token) {
            setExisteToken(true);
        }

    }, [token, router]);

    const [errorInput, setErrorInput] = useState(false);
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");

    const handleNextStep = async () => {
        const gmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (gmailRegex.test(email)) {
            setErrorInput(false);
            try {
                console.log(email);
                await axiosClient.post("/enviar-email/verificacion", email);
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
            setErrorInput(true);
            setNotificacion({
                titulo: 'Error',
                mensaje: 'Por favor, introduce un correo con formato válido',
                code: 400,
                tipo: 'error'
            });
        }
    };

    const handleVerify = () => {
        setPropiedades({ email: email, codigo: code });
        verificarCuenta();
    };

    const verificarCuenta = async () => {
        try {
            console.log(propiedadesCuenta);
            const respuesta = await axiosClient.post("/verificar-email", propiedadesCuenta);
            setNotificacion({ titulo: respuesta.data.titulo, mensaje: respuesta.data.mensaje, code: respuesta.data.code, tipo: respuesta.data.tipo });
            setTimeout(() => {
                router.push("/login");
            }, 2500);
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                setNotificacion({ titulo: error.response.data.titulo, mensaje: error.response.data.mensaje, code: error.response.data.code, tipo: error.response.data.tipo });
            }   
        }
    };

    return (
        <>
            {existeToken ? (
                <ErrorPage errorCode="403" title="No tienes permisos para acceder a esta pagina" message="Ya has verificado la cuenta." url="/" />
            ) : (
                <div className="h-screen flex flex-col w-screen bg-(--gris-registro)">
                    <NavbarReducido />
                    <div className="h-screen flex items-center justify-center bg-oxley-50 p-4">
                        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
                            {step === 1 ? (
                                <>
                                    <h2 className="text-3xl font-bold text-center text-primary-dark mb-2">
                                        Verificación de Cuenta
                                    </h2>
                                    <p className="text-center text-oxley-500">
                                        Introduce tu correo para recibir el código
                                    </p>
                                    <div className="mt-6">
                                        <label className="block text-base font-medium text-oxley-700">
                                            Correo Electrónico
                                        </label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className={`mt-2 w-full border-2 ${errorInput ? 'border-(--danger-600)' : 'border-black'} p-3 rounded-lg`}
                                        />
                                    </div>
                                    <button
                                        onClick={handleNextStep}
                                        className="mt-6 w-full px-5 py-3 bg-(--oxley-500) text-white rounded-lg hover:bg-(--primary-dark) hover:scale-105 active:scale-95 transition-transform"
                                    >
                                        Enviar Código
                                    </button>
                                </>
                            ) : (
                                <>
                                    <div className="flex items-center justify-between">
                                        <button onClick={() => setStep(1)} className="placeholder:scale-105 active:scale-95 transition-transform">
                                            <BackwardIcon className="h-6 w-6 text-gray-800" />
                                        </button>
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-bold text-center text-primary-dark mb-2 flex-grow">
                                            Verificar Código
                                        </h2>
                                    </div>
                                    <p className="text-center text-oxley-500">
                                        Introduce el código enviado a {email}
                                    </p>
                                    <div className="mt-6">
                                        <label className="block text-base font-medium text-oxley-700">
                                            Código de Verificación
                                        </label>
                                        <input
                                            type="text"
                                            value={code}
                                            onChange={(e) => setCode(e.target.value)}
                                            className="mt-2 w-full border border-oxley-300 p-3 rounded-lg text-center tracking-widest "
                                        />
                                    </div>
                                    <button
                                        onClick={handleVerify}
                                        className="mt-6 w-full px-5 py-3 bg-(--oxley-500) text-white rounded-lg hover:bg-(--primary-dark) hover:scale-105 active:scale-95 transition-transform"
                                    >
                                        Verificar
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
            )}
        </>
    );
}

