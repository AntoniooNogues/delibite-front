"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import axiosClient from '@/lib/axiosClient';
import PerfilLayout from '@/components/PerfilLayout';
import {ArrowLeft} from "lucide-react";
import LoadingComponent from "@/components/Loading-Component";
import {Notificaciones} from "@/interfaces/Notificaciones";
import NotificacionComponent from "@/components/Notificacion-Component";

const Facturacion: React.FC = () => {
    const [direccion, setDireccion] = useState('');
    const [codigoPostal, setCodigoPostal] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [notificacion, setNotificacion] = useState<Notificaciones>();

    useEffect(() => {
        const fetchAddress = async () => {
            try {
                const response = await axiosClient.get('/registro/getUsuario');
                if (response.data) {
                    setDireccion(response.data.direccion);
                    setCodigoPostal(response.data.codigo_postal);
                }
            } catch (error) {
                if (axios.isAxiosError(error) && error.response) {
                    setNotificacion({
                        titulo: error.response.data.titulo,
                        mensaje: error.response.data.mensaje,
                        code: error.response.data.code,
                        tipo: error.response.data.tipo
                    });
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchAddress();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!/^\d{5,}$/.test(codigoPostal)) {
            setNotificacion({
                titulo: "Código Postal inválido",
                mensaje: "El código postal debe tener al menos 5 caracteres y solo contener números.",
                code: 422,
                tipo: "error"
            });
            return;
        }
        try {
            await axios.post('/registro/facturacion', { direccion, codigoPostal });
            setNotificacion({
                titulo: "Perfil actualizado con éxito",
                mensaje: "Se ha actualizado su perfil correctamente",
                code: 201,
                tipo: "access"
            });
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
    };
    if (isLoading) {
        return <div className="flex w-full h-screen items-center justify-center">
            <LoadingComponent></LoadingComponent>
        </div>;
    }
    return (
        <PerfilLayout>
            <div className="bg-white rounded-xl px-8 py-6 w-full">
                <div className="flex items-center space-x-6 mb-4">
                    <ArrowLeft onClick={() => window.history.back()} className="cursor-pointer"/>
                    <h2 className="text-2xl font-bold">Dirección de Facturación</h2>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <label className="block">
                        <span className="text-gray-700">Dirección</span>
                        <input
                            type="text"
                            value={direccion}
                            onChange={(e) => setDireccion(e.target.value)}
                            className="mt-1 block w-full p-2 bg-white border border-gray-300 rounded-md"
                        />
                    </label>
                    <label className="block">
                        <span className="text-gray-700">Código Postal</span>
                        <input
                            type="text"
                            value={codigoPostal}
                            onChange={(e) => {
                                if (/^\d*$/.test(e.target.value)) {
                                    setCodigoPostal(e.target.value);
                                }
                            }}
                            className="mt-1 block w-full p-2 bg-white border border-gray-300 rounded-md"
                        />
                    </label>
                    <div className="flex w-full justify-end">
                        <button type="submit" className="px-4 py-2 rounded-lg text-white bg-(--oxley-500)
                        hover:bg-(--oxley-700) active:bg-(--oxley-800) hover:text-white transition transform
                        active:scale-95 hover:scale-105">
                            Guardar
                        </button>
                    </div>

                </form>
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

export default Facturacion;