'use client';
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import AdminLayout from "@/components/AdminLayout";
import { HomeInterface } from "@/interfaces/Administracion-Interfaces";
import { motion } from 'framer-motion';
import Loading from "@/components/Loading";
import axiosClient from "@/lib/axiosClient";
import ErrorPage from "@pages/Error";
import NotificacionComponent from "@/components/Notificacion";
import { Notificaciones } from "@/interfaces/Notificaciones";
import axios from "axios";
import {ClockIcon, ShoppingCartIcon, StarIcon, UserGroupIcon, UserIcon} from "@heroicons/react/20/solid";
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = ['#fe0902', '#0E4595'];
export default function Home() {
    const { token, error } = useAuth();
    const [datos, setData] = useState<HomeInterface | null>(null);
    const [notificacion, setNotificacion] = useState<Notificaciones>();


    useEffect(() => {
        const fetchDataAndSetState = async () => {
            try {
                const response = await axiosClient.get<HomeInterface>('/administracion/home');
                console.log(response.data);
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
        return <ErrorPage errorCode={error.errorCode} title={error.title} message={error.message} url={error.url} color={2} textoBoton={"Ir al login"}/>;
    }

    if (notificacion && notificacion.code === 401) {
        return <ErrorPage errorCode={"401"} title="No autorizado" message="No tienes autorización para acceder a este recurso." url="/administracion/login" color={2} textoBoton={"Ir al login"}/>;
    }

    return (
        <AdminLayout>
            {datos ? (
                <div className="w-full mx-auto p-5 space-y-6">
                    <div className="flex flex-row gap-4">
                        <div className="flex flex-col justify-center items-center p-6 bg-[#2E5C4F] rounded-2xl shadow-lg w-1/2">
                            <p className="text-white text-lg font-semibold mb-4">Tipo de plato más vendido (principales o postres):</p>
                            <PieChart width={400} height={400}>
                                <Pie
                                    data={datos.tipo_plato_mas_vendido}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={120}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={({ x, y, value }) => (
                                        <text x={x} y={y} fill="#FEFEFE" textAnchor="middle" dominantBaseline="central">
                                            {value}
                                        </text>
                                    )}
                                >
                                    {datos.tipo_plato_mas_vendido.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend formatter={(value) => <span style={{ color: '#FEFEFE' }}>{value}</span>} />
                            </PieChart>
                        </div>

                        <div className="flex flex-col justify-center items-center p-6 bg-[#2E5C4F] rounded-2xl shadow-lg w-1/2">
                            <p className="text-white text-lg font-semibold mb-4">Tipo de plato más vendido (frío o caliente):</p>
                            <PieChart width={400} height={400}>
                                <Pie
                                    data={datos.modo_empleo_mas_vendido}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={120}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={({ x, y, value }) => (
                                        <text x={x} y={y} fill="#FEFEFE" textAnchor="middle" dominantBaseline="central">
                                            {value}
                                        </text>
                                    )}
                                >
                                    {datos.modo_empleo_mas_vendido.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend formatter={(value) => <span style={{ color: '#FEFEFE' }}>{value}</span>} />
                            </PieChart>
                        </div>
                    </div>

                    <motion.div
                        className="grid grid-cols-2 gap-4 bg-[#2E5C4F] p-6 rounded-2xl shadow-lg text-white"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="flex items-center gap-3 bg-[#3B6B62] p-4 rounded-xl shadow-md">
                            <UserGroupIcon className="w-7 h-7 text-stone-900" />
                            <span className="text-lg">Usuarios totales:</span> <span className="font-semibold">{datos.num_usuarios}</span>
                        </div>

                        <div className="flex items-center gap-3 bg-[#3B6B62] p-4 rounded-xl shadow-md">
                            <ShoppingCartIcon className="w-7 h-7 text-emerald-500" />
                            <span className="text-lg">Pedidos totales:</span> <span className="font-semibold">{datos.pedidos_totales}</span>
                        </div>

                        <div className="flex items-center gap-3 bg-[#3B6B62] p-4 rounded-xl shadow-md">
                            <StarIcon className="w-7 h-7 text-yellow-500" />
                            <span className="text-lg">Valoración media de platos:</span> <span className="font-semibold">{datos.valoracion_media_platos}</span>
                        </div>

                        <div className="flex items-center gap-3 bg-[#3B6B62] p-4 rounded-xl shadow-md">
                            <ClockIcon className="w-7 h-7 text-lime-500" />
                            <span className="text-lg">Usuarios activos últimos 7 días:</span> <span className="font-semibold">{datos.usuarios_activos_ultimos_7_dias}</span>
                        </div>

                        <div className="flex items-center gap-3 bg-[#3B6B62] p-4 rounded-xl shadow-md col-span-2">
                            <UserIcon className="w-7 h-7 text-purple-500" />
                            <span className="text-lg">Suscripciones activas:</span> <span className="font-semibold">{datos.suscripciones_activas}</span>
                        </div>
                    </motion.div>
                </div>

            ) : (
                <Loading />
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