"use client";
import React, { useState} from "react";
import { useRouter } from "next/navigation";
import axiosClient from "@/lib/axiosClient";
import NotificacionComponent from "@/components/Notificacion-Component";
import { Notificaciones } from '@/interfaces/Notificaciones';
import axios from "axios";
import {ArrowLeftIcon} from "@heroicons/react/20/solid";
import Navbar from "@/components/Navbar";

export default function VerificarCuenta() {
    const router = useRouter();
    const [notificacion, setNotificacion] = useState<Notificaciones | undefined>(undefined);
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");

    const handleNextStep = async () => {
        const gmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (gmailRegex.test(email)) {
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
            const data = { "email": email, "codigo": code };
            console.log(data);
            const respuesta = await axiosClient.post("/verificar-email", data);
            console.log(respuesta);
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
            <div className="h-screen flex flex-col w-screen bg-(--gris-registro)">
                <div className="absolute w-full">
                    <Navbar />
                </div>
                <div className="h-screen flex items-center justify-center p-4">
                    <div className="p-8 rounded-lg w-full max-w-xl min-h-96 flex flex-col gap-8  items-center justify-center">
                        {step === 1 ? (
                            <>
                                <header className="space-y-3 flex flex-col">
                                    <h2 className="text-3xl font-bold text-center text-primary-dark">
                                        Verificación de Cuenta
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
                                        className={`mt-2 w-full border border-(--oxley-300) p-3 rounded-lg text-center tracking-widest`}
                                    />
                                </div>
                                <button
                                    onClick={handleNextStep}
                                    className=" w-full px-5 py-3 bg-(--oxley-500) text-white rounded-lg hover:bg-(--primary-dark) hover:scale-105 active:scale-95 transition-transform"
                                >
                                    Enviar Código
                                </button>
                            </>
                        ) : (
                            <>
                                <div className="flex items-center justify-between w-full">
                                    <button onClick={() => setStep(1)} className="w-12 h-12 hover:scale-105 active:scale-95 transition-transform ">
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

