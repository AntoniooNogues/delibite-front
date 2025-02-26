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
import {ClockIcon, ShoppingCartIcon, StarIcon, UserGroupIcon, UserIcon} from "@heroicons/react/20/solid";
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
export default function Home() {
    const { token, error } = useAuth();
    const [datos, setData] = useState<HomeInterface | null>(null);
    const [notificacion, setNotificacion] = useState<Notificaciones>();
    

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

    const tipoPlatoData = datos?.tipo_plato_mas_vendido.map((item, index) => ({
        name: `Tipo ${index + 1}`,
        value: item,
    })) || [];

    const modoEmpleoData = datos?.modo_empleo_mas_vendido.map((item, index) => ({
        name: `Modo ${index + 1}`,
        value: item,
    })) || [];

    if (error) {
        return <ErrorPage errorCode={error.errorCode} title={error.title} message={error.message} url={error.url} color={2}/>;
    }

    if (notificacion && notificacion.code === 401) {
        return <ErrorPage errorCode={"401"} title="No autorizado" message="No tienes autorización para acceder a este recurso." url="/administracion/login" color={2}/>;
    }

    return (
        <AdminLayout>
            {datos ? (
                <div className="w-full max-w-4xl mx-auto p-5">
                    <motion.ul
                        className="space-y-4 text-gray-300 bg-(--oxley-700) text-lg p-4 rounded-2xl"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}>
                        <li className="flex items-center gap-3">
                            <UserGroupIcon className="w-6 h-6 text-blue-500" />
                            <span className=" text-gray-200">Usuarios totales:</span> {datos.num_usuarios}
                        </li>
                        <li className="flex items-center gap-3">
                            <ShoppingCartIcon className="w-6 h-6 text-green-500" />
                            <span className=" text-gray-200">Pedidos totales:</span> {datos.pedidos_totales}
                        </li>
                        <li className="flex items-center gap-3">
                            <StarIcon className="w-6 h-6 text-yellow-500" />
                            <span className=" text-gray-200">Valoración media de platos:</span> {datos.valoracion_media_platos}
                        </li>
                        <li className="flex items-center gap-3">
                            <ClockIcon className="w-6 h-6 text-red-500" />
                            <span className=" text-gray-200">Usuarios activos últimos 7 días:</span> {datos.usuarios_activos_ultimos_7_dias}
                        </li>
                        <li className="flex items-center gap-3">
                            <UserIcon   className="w-6 h-6 text-red-500" />
                            <span className=" text-gray-200">Suscripciones activas:</span> {datos.suscripciones_activas}
                        </li>


                    </motion.ul>
                    <div className="flex justify-center items-center p-5">
                        <PieChart width={400} height={400}>
                            <Pie
                                data={tipoPlatoData}
                                cx="50%"
                                cy="50%"
                                outerRadius={120}
                                fill="#8884d8"
                                dataKey="value"
                                label
                            >
                                {tipoPlatoData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </div>
                    <div className="flex justify-center items-center p-5">
                        <PieChart width={400} height={400}>
                            <Pie
                                data={modoEmpleoData}
                                cx="50%"
                                cy="50%"
                                outerRadius={120}
                                fill="#8884d8"
                                dataKey="value"
                                label
                            >
                                {modoEmpleoData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </div>
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