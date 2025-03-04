'use client';
import React, { useEffect, useState } from 'react';
import PerfilLayout from "@/components/PerfilLayout";
import axiosClient from "@/lib/axiosClient";
import Loading from "@/components/Loading";
import { Notificaciones } from "@/interfaces/Notificaciones";
import NotificacionComponent from "@/components/Notificacion";
import { ArrowLeft } from "lucide-react";
import { format, parseISO } from 'date-fns';
import Image from 'next/image';

interface Plato {
    id: number;
    nombre: string;
    imagen: string;
    cantidad: number;
    precio: number;
}

interface Suscripcion {
    numPlatos: number;
    fechaRenovacion: {
        date: string;
        timezone: string;
        timezone_type: number;
    };
    total: number;
    estado: number;
    platos: Plato[];
}

const SuscripcionPage: React.FC = () => {
    const [suscripcion, setSuscripcion] = useState<Suscripcion | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [notificacion, setNotificacion] = useState<Notificaciones | undefined>(undefined);

    useEffect(() => {
        axiosClient.get('/suscripcion/info')
            .then(response => {
                setSuscripcion(response.data);
            })
            .catch(error => {
                console.error('Error al obtener la información de la suscripción:', error);
                setNotificacion({
                    titulo: 'Error',
                    mensaje: 'Ocurrió un error al obtener la información de la suscripción',
                    code: 500,
                    tipo: 'error'
                });
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    const handleRenewSubscription = async () => {
        try {
            const response = await axiosClient.post('/suscripcion/renovar');
            if (response.status === 200) {
                setNotificacion({
                    titulo: 'Éxito',
                    mensaje: 'Suscripción renovada con éxito',
                    code: 200,
                    tipo: 'success'
                });
                setSuscripcion(prev => prev ? { ...prev, estado: 1 } : null);
            }
        } catch (error) {
            console.error('Error al renovar la suscripción:', error);
            setNotificacion({
                titulo: 'Error',
                mensaje: 'Ocurrió un error al renovar la suscripción',
                code: 500,
                tipo: 'error'
            });
        }
    };

    const handleCancelSubscription = async () => {
        try {
            const response = await axiosClient.post('/suscripcion/cancelar');
            if (response.status === 200) {
                setNotificacion({
                    titulo: 'Éxito',
                    mensaje: 'Suscripción cancelada con éxito',
                    code: 200,
                    tipo: 'success'
                });
                setSuscripcion(prev => prev ? { ...prev, estado: 2 } : null);
            }
        } catch (error) {
            console.error('Error al cancelar la suscripción:', error);
            setNotificacion({
                titulo: 'Error',
                mensaje: 'Ocurrió un error al cancelar la suscripción',
                code: 500,
                tipo: 'error'
            });
        }
    };

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center"><Loading /></div>;
    }

    const formatDate = (dateObject: { date: string }) => {
        const dateString = dateObject.date;
        if (!dateString) {
            console.error('Invalid date string:', dateString);
            return 'Fecha inválida';
        }
        try {
            return format(parseISO(dateString), 'dd/MM/yyyy');
        } catch (error) {
            console.error('Error al formatear la fecha:', error);
            return 'Fecha inválida';
        }
    };

    return (
        <PerfilLayout>
            <div className="p-8 w-full mx-auto">
                <div className="flex md:flex-row items-center space-x-2 md:space-x-4 mb-6">
                    <ArrowLeft onClick={() => window.history.back()} className="cursor-pointer text-gray-600 hover:text-gray-800 mb-4 md:mb-0" />
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Modifica tu suscripción</h2>
                </div>
                {suscripcion && (
                    <div className="flex flex-col md:flex-row w-full justify-center items-center space-x-8">
                        <div className={`space-y-4 ${suscripcion.estado === 2 ? 'opacity-50' : ''}`}>
                            <p className="text-2xl text-gray-700"><span className="font-semibold">Número de platos:</span> {suscripcion.numPlatos}</p>
                            <p className="text-2xl text-gray-700"><span className="font-semibold">Fecha de renovación:</span> {formatDate(suscripcion.fechaRenovacion)}</p>
                        </div>
                        <div className={`space-y-4 ${suscripcion.estado === 2 ? 'opacity-50' : ''}`}>
                            <p className="text-2xl text-gray-700"><span
                                className="font-semibold">Total:</span> {suscripcion.total.toFixed(2)}€</p>
                            <p className="text-2xl text-gray-700">
                                <span className="font-semibold">Estado:</span>
                                <span
                                    className={`ml-2 inline-block w-3 h-3 rounded-full ${suscripcion.estado === 1 ? 'bg-green-500' : 'bg-orange-500'}`}></span>
                            </p>
                        </div>
                    </div>
                )}
                {suscripcion && suscripcion.platos && suscripcion.platos.length > 0 && (
                    <div className="mt-8 w-full">
                        {suscripcion.estado === 2
                            ? <h3 className="text-xl font-semibold mb-4 ps-10">Platos en tu última suscripción</h3>
                            : <h3 className="text-xl font-semibold mb-4">Platos en tu suscripción actual</h3>
                        }
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {suscripcion.platos.map((plato) => (
                                <div
                                    key={plato.id}
                                    className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                                >
                                    <div className="w-full h-40 relative">
                                        <Image
                                            src={plato.imagen.startsWith('http') ? plato.imagen : `/images/${plato.imagen}`}
                                            alt={plato.nombre}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <h4 className="font-semibold text-lg text-gray-700">{plato.nombre}</h4>
                                        <div className="flex justify-between mt-2 text-gray-700">
                                            <span>Cantidad: {plato.cantidad}</span>
                                            <span>{plato.precio}€</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {suscripcion?.estado === 1 && (
                    <div className="flex items-center w-full justify-start">
                        <div className="flex flex-col">
                            <p className="mt-4 text-lg text-green-500">
                                Puedes modificar tu suscripción realizando una nueva.
                            </p>
                            <div className="flex space-x-4">
                                <button
                                    onClick={() => window.location.href = '/suscripcion'}
                                    className="mt-4 px-4 py-2 rounded-lg text-white bg-(--oxley-500)
                    hover:bg-(--oxley-700) active:bg-(--oxley-800) hover:text-white transition transform
                    active:scale-95 hover:scale-105 w-1/2"
                                >
                                    Modificar suscripción
                                </button>
                                <button
                                    onClick={handleCancelSubscription}
                                    className="mt-4 px-4 py-2 rounded-lg text-white bg-(--danger-200)
                    hover:bg-(--danger-400) active:bg-(--danger-600) hover:text-white transition transform
                    active:scale-95 hover:scale-105 w-1/2"
                                >
                                    Cancelar suscripción
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {suscripcion?.estado === 2 && (
                    <div className="flex items-center w-full justify-end">
                        <button
                            onClick={handleRenewSubscription}
                            className="mt-4 px-4 py-2 rounded-lg text-white bg-(--oxley-500)
            hover:bg-(--oxley-700) active:bg-(--oxley-800) hover:text-white transition transform
            active:scale-95 hover:scale-105 opacity-100"
                        >
                            Renovar suscripción
                        </button>
                    </div>
                )}
            </div>
            {notificacion && (
                <NotificacionComponent
                    Notificaciones={notificacion}
                    onClose={() => setNotificacion(undefined)}
                />
            )}
        </PerfilLayout>
    );
};

export default SuscripcionPage;