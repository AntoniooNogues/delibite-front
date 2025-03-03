"use client";

import React, { Suspense, useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import ErrorPage from "@pages/Error";
import Navbar from "@/components/Navbar";
import axiosClient from '@/lib/axiosClient';
import axios from 'axios';
import type { Notificaciones } from '@/interfaces/Notificaciones';
import NotificacionComponent from "@/components/Notificacion";
import type { LineaPedido, Valoracion } from '@/interfaces/Valoraciones';
import Loading from "@/components/Loading";
import Rating from '@mui/material/Rating';
import Image from "next/image";
import Footer from "@/components/Footer";

function ValoracionesContent() {
    const searchParams = useSearchParams();
    const codigo = searchParams ? searchParams.get('codigo') : null;
    const [notificacion, setNotificacion] = useState<Notificaciones>();
    const [error, setError] = useState<boolean>(false);
    const [textoError, setTextoError] = useState<{ titulo: string; mensaje: string, codigo: string }>({ titulo: "", mensaje: "", codigo: "" });
    const [platos, setPlatos] = useState<LineaPedido[]>([]);
    const [loading, setLoading] = useState(true);
    const [pedidoID, setPedidoID] = useState<number | null>(null);

    const fetchData = useCallback(async () => {
        try {
            const response = await axiosClient.post(`/valoraciones/verificar`, { codigo });
            setPlatos(response.data);
            console.log(response.data);
            setPedidoID(response.data[0].pedido_id);

            const valoracionesIniciales = response.data.reduce((acc: Record<number, Valoracion>, plato: LineaPedido) => {
                acc[plato.plato_id] = {
                    plato_id: plato.plato_id,
                    pedido_id: plato.pedido_id,
                    valoracion: plato.valoracion || 0,
                    descripcion: plato.descripcion || ""
                };
                return acc;
            }, {});
            setValoraciones(valoracionesIniciales);
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                setTextoError({ titulo: error.response.data.titulo, mensaje: error.response.data.mensaje, codigo: error.response.data.code });
                setError(true);
            }
        } finally {
            setLoading(false);
        }
    }, [codigo]);

    useEffect(() => {
        fetchData();
        setPedidoID(platos.map((plato) => plato.pedido_id)[0]);
    }, [fetchData, platos]);

    const [valoraciones, setValoraciones] = useState<Record<number, Valoracion>>({});

    const handleValoracionChange = (platoId: number, key: keyof Valoracion, value: string | number) => {
        if (pedidoID === null) return;
        setValoraciones((prev) => {
            return {
                ...prev,
                [platoId]: {
                    ...prev[platoId],
                    plato_id: platoId,
                    pedido_id: pedidoID,
                    [key]: value
                }
            };
        });
    };

    return (
        <main>
            {error ? (
                <>
                    <div className={"fixed top-0 w-full z-50"}>
                        <Navbar />
                    </div>
                    <ErrorPage errorCode={textoError.codigo} color={1} url={"/"} message={textoError.mensaje} title={textoError.titulo} textoBoton={"Ir a la pantalla principal"} />
                </>
            ) : (
                loading ? (
                    <>
                        <div className={"fixed top-0 w-full z-50"}>
                            <Navbar />
                        </div>
                        <div className={"flex justify-center items-center h-screen"}>
                            <Loading />
                        </div>
                    </>
                ) : (
                    <>
                        <Navbar />
                        <div className="max-md:w-full lg:w-3/4 xl:w-2/3 2xl:w-1/2 mx-auto my-10  rounded-md p-8 bg-white shadow-2xl ">
                            <h1 className="text-4xl font-bold text-center text-[--primary-dark]">Valorar Pedido</h1>
                            <div className="mt-4 space-y-8 p-4">
                                {platos.map((plato, index) => (
                                    <div key={plato.plato_id} className={`border-b pb-6 ${index === platos.length - 1 ? 'border-b-0' : ''}`}>
                                        <Image className="w-full h-64 object-cover rounded-md" src={plato.url} alt={plato.nombre} width={300} height={300} />
                                        <div className="mt-4">
                                            <h2 className="text-2xl font-semibold text-[--primary-dark]">{plato.nombre}</h2>
                                        </div>

                                        <div className="mt-4">
                                            <div className="flex flex-row gap-2 items-center">
                                                <h3 className="text-lg font-semibold text-[--primary-dark]">Añadir valoración: </h3>
                                                <Rating
                                                    name={`rating-${plato.plato_id}`}
                                                    defaultValue={0}
                                                    precision={1}
                                                    value={valoraciones[plato.plato_id]?.valoracion || 0}
                                                    onChange={(_event, newValue) => handleValoracionChange(plato.plato_id, "valoracion", newValue ?? 0)}
                                                />
                                            </div>
                                            <form className="mt-2">
                                                <label className="text-sm font-semibold text-[--primary-dark]">Descripción</label>
                                                <div className="mt-2">
                                                    <textarea
                                                        className="w-full p-2 border rounded-md bg-[--oxley-100]"
                                                        rows={3}
                                                        placeholder="Escribe una descripción"
                                                        value={valoraciones[plato.plato_id]?.descripcion || ""}
                                                        onChange={(event) => handleValoracionChange(plato.plato_id, "descripcion", event.target.value)}
                                                    />
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button
                                className="mt-8 w-full bg-(--primary-dark) text-white py-2.5 rounded-full hover:scale-105 active:scale-95"
                                onClick={async () => {
                                    try {
                                        await axiosClient.post(`/valoraciones/valorar`, Object.values(valoraciones));
                                        setNotificacion({ titulo: "Valoraciones enviadas", mensaje: "Tus valoraciones han sido enviadas con éxito", code: 200, tipo: "success" });
                                        setTimeout(() => {
                                            window.location.href = "/";
                                        }, 2000);
                                    } catch {
                                        setNotificacion({ titulo: "Ha ocurrido un error ", mensaje: "No se han podido valorar los platos del pedido", code: 500, tipo: "error" });
                                    }
                                }}
                            >Enviar valoraciones</button>
                        </div>
                        <div className="mt-20">
                            <Footer />
                        </div>
                    </>
                )
            )}

            {notificacion && (
                <NotificacionComponent
                    Notificaciones={notificacion}
                    onClose={() => setNotificacion(undefined)}
                />
            )}
        </main>
    );
}

export default function ValoracionesPage() {
    return (
        <Suspense fallback={<Loading />}>
            <ValoracionesContent />
        </Suspense>
    );
}