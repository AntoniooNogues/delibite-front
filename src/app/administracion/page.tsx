'use client';
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import AdminLayout from "@/components/AdminLayout";
import { HomeInterface } from "@/interfaces/Administracion-Interfaces";
import { motion } from 'framer-motion';
import LoadingComponent from "@/components/Loading-Component";
import axiosClient from "@/lib/axiosClient";
import ErrorPage from "@/pages/[_error]";
import NotificacionComponent from "@/components/Notificacion-Component";
import { Notificaciones } from "@/interfaces/Notificaciones";
import axios from "axios";

export default function Home() {
    const { token, error } = useAuth();
    const [datos, setData] = useState<HomeInterface | null>(null);
    const [notificacion, setNotificacion] = useState<Notificaciones>();
    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    useEffect(() => {
        const fetchDataAndSetState = async () => {
            try {
                const response = await axiosClient.get<HomeInterface>('/administracion/home');
                setData(response.data);
            } catch (error) {
                if (axios.isAxiosError(error) && error.response) {
                    if (axios.isAxiosError(error) && error.response) {
                        setNotificacion({ titulo: error.response.data.titulo, mensaje: error.response.data.mensaje , code: error.response.data.code, tipo: error.response.data.tipo });
                    } else {
                        setNotificacion({ titulo: 'Error', mensaje: 'Error al cargar la administracion', code: 500, tipo: 'error' });
                    }
                }
            }
        };
        if (token) {
            fetchDataAndSetState();
        }
    }, [token]);

    if (error) {
        return <ErrorPage errorCode={error.errorCode} title={error.title} message={error.message} url={error.url} />;
    }

    if (notificacion && notificacion.code === 401) {
        return <ErrorPage errorCode={"401"} title="No autorizado" message="No tienes autorización para acceder a este recurso." url="/administracion/login" />;
    }

    return (
        <AdminLayout>
            {datos ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full max-w-4xl mx-auto">
                    <motion.div className="bg-white rounded-lg shadow-md p-5 text-center" initial="hidden" animate="visible" variants={cardVariants}>
                        <p>Usuarios totales: {datos.num_usuarios}</p>
                    </motion.div>
                    <motion.div className="bg-white rounded-lg shadow-md p-5 text-center" initial="hidden" animate="visible" variants={cardVariants}>
                        <p>Pedidos totales: {datos.pedidos_totales}</p>
                    </motion.div>
                    <motion.div className="bg-white rounded-lg shadow-md p-5 text-center" initial="hidden" animate="visible" variants={cardVariants}>
                        <p>Valoración media de platos: {datos.valoracion_media_platos}</p>
                    </motion.div>
                    <motion.div className="bg-white rounded-lg shadow-md p-5 text-center" initial="hidden" animate="visible" variants={cardVariants}>
                        <p>Usuarios activos últimos 7 días: {datos.usuarios_activos_ultimos_7_dias}</p>
                    </motion.div>
                </div>
            ) : (
                <LoadingComponent />
            )}
            {notificacion && (
                <NotificacionComponent
                    Notificaciones={notificacion}
                    onClose={() => setNotificacion(undefined)}
                />
            )}
        </AdminLayout>
    );
}