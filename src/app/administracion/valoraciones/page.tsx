'use client';
import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Valoraciones } from "@/interfaces/Administracion-Interfaces";
import Loading from '@/components/Loading';
import axiosClient from '@/lib/axiosClient';
import axios from 'axios';
import ErrorPage from "@pages/Error";
import {ArrowPathIcon, ArrowsUpDownIcon} from "@heroicons/react/20/solid";
import { ErrorPropsInterface } from "@/interfaces/ErrorPropsInterface";
import { useAuth } from "@/hooks/useAuth";
import NotificacionComponent from "@/components/Notificacion";
import { Notificaciones } from '@/interfaces/Notificaciones';

export default function UsuariosPage() {
    const { token, error } = useAuth();
    const [datos, setDatos] = useState<Valoraciones[]>([]);
    const [loading, setLoading] = useState(true);
    const [valueError, setError] = useState<ErrorPropsInterface | null>(null);
    const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 25;
    const [notificacion, setNotificacion] = useState<Notificaciones>();

    const fetchDataAndSetState = async (page: number) => {
        try {
            const response = await axiosClient.get<Valoraciones[]>(`/administracion/valoraciones/cargar?page=${page}&limit=${itemsPerPage}`);
            console.log(response.data)
            setDatos(response.data);
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                setError({
                    errorCode: error.response.data.code || "ERROR",
                    title: error.response.data.titulo || error.cause,
                    message: error.response.data.mensaje || error.message,
                    url: error.response.data.url || "/administracion/",
                    color: 2,
                    textoBoton: "Ir al login"
                });
        }   else {
                console.error('Error fetching user data:', error);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchDataAndSetState(currentPage);
        }
    }, [token, currentPage]);

    const handleSort = () => {
        const sortedDatos = [...datos].sort((a, b) => {
            if (sortOrder === 'desc') {
                return b.id - a.id;
            } else {
                return a.id - b.id;
            }
        });
        setDatos(sortedDatos);
        setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    };

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };


    const handleVisibilityChange = async (id: number, visibilidad: boolean) => {
        try {
            const respuesta = await axiosClient.patch(`/administracion/valoraciones/visibilidad/${id}`, { visibilidad });
            setNotificacion({ titulo: respuesta.data.titulo, mensaje: respuesta.data.mensaje, code: respuesta.data.code, tipo: respuesta.data.code });
            setDatos(prevDatos => prevDatos.map(u => u.id === id ? { ...u, visibilidad } : u));
        }catch (error){
            if (axios.isAxiosError(error) && error.response) {
                setNotificacion({ titulo: error.response.data.titulo, mensaje: error.response.data.mensaje , code: error.response.data.code, tipo: error.response.data.tipo });
            } else {
                setNotificacion({ titulo: 'Error', mensaje: 'Error al cambiar la visibilidad de la reseña', code: 500, tipo: 'error' });
            }
        }
    };


    if (valueError) {
        return <ErrorPage errorCode={valueError.errorCode} title={valueError.title} message={valueError.message} url={valueError.url} color={2} textoBoton={"Ir al login"}/>;
    }

    if (error) {
        return <ErrorPage errorCode={error.errorCode} title={error.title} message={error.message} url={error.url} color={2} textoBoton={"Ir al login"}/>;
    }

    return (
        <AdminLayout>
            {loading ? (
                <Loading />
            ) : (
                <div>
                    <div className="flex flex-row gap-2 mb-4 justify-between">
                        <div className="flex flex-row gap-4">
                            <button
                                onClick={handleSort}
                                className="flex flex-row gap-2 px-4 py-2 bg-(--oxley-500) text-white rounded-lg hover:bg-(--primary-dark) hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                            >
                                Ordenar
                                <ArrowsUpDownIcon className="h-6 w-6 text-white hover:animate-bounce" />
                            </button>
                            <button
                                onClick={() => fetchDataAndSetState(currentPage)}
                                className="flex flex-row gap-2 px-4 py-2 bg-(--oxley-500) text-white rounded-lg hover:bg-(--primary-dark) hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                            >
                                <ArrowPathIcon className="h-6 w-6 text-white rotate-360 hover:animate-spin" />
                            </button>
                        </div>
                        <div className="flex gap-4">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="px-4 py-2 bg-(--oxley-500) text-white rounded-lg hover:bg-(--primary-dark) hover:scale-105 active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Anterior
                            </button>
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={datos.length < itemsPerPage}
                                className="px-4 py-2 bg-(--oxley-500) text-white rounded-lg hover:bg-(--primary-dark) hover:scale-105 active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Siguiente
                            </button>
                        </div>
                    </div>
                    <div className="scroll overflow-x-auto  max-h-[100%] w-full rounded-t-2xl scroll-smooth">
                        <table className="table-auto w-full bg-white border border-gray-200 rounded-tl-2xl">
                            <thead>
                            <tr className="min-h-[4rem]">
                                <th className="px-6 py-4 border-b-2 border-(--oxley-200) whitespace-nowrap bg-(--oxley-100)">ID</th>
                                <th className="px-6 py-4 border-b-2 border-(--oxley-100) whitespace-nowrap bg-(--oxley-200)">Pedido id</th>
                                <th className="px-6 py-4 border-b-2 border-(--oxley-200) whitespace-nowrap bg-(--oxley-100)">Plato id</th>
                                <th className="px-6 py-4 border-b-2 border-(--oxley-100) whitespace-nowrap bg-(--oxley-200)">Username</th>
                                <th className="px-6 py-4 border-b-2 border-(--oxley-200) whitespace-nowrap bg-(--oxley-100)">Valoracion</th>
                                <th className="px-6 py-4 border-b-2 border-(--oxley-100) whitespace-nowrap bg-(--oxley-200)">Descripcion</th>
                                <th className="px-6 py-4 border-b-2 border-(--oxley-200) whitespace-nowrap bg-(--oxley-100)">Fecha</th>
                                <th className="px-6 py-4 border-b-2 border-(--oxley-100) whitespace-nowrap bg-(--oxley-200) cursor-help" title="El campo en la base de datos se actualiza automáticamente cada vez que se marca o desmarca el input, garantizando la persistencia inmediata del cambio.">
                                    Visibilidad
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {datos.map(valoracion => (
                                <tr key={valoracion.id}>
                                    <td className="px-6 py-4 border-b-2 border-(--oxley-200) whitespace-nowrap text-center bg-(--oxley-100) font-bold">{valoracion.id}</td>
                                    <td className="px-6 py-4 border-b-2 border-(--oxley-100) whitespace-nowrap text-center bg-(--oxley-200)">{valoracion.pedido_id}</td>
                                    <td className="px-6 py-4 border-b-2 border-(--oxley-200) whitespace-nowrap text-center bg-(--oxley-100) font-bold">{valoracion.plato_id}</td>
                                    <td className="px-6 py-4 border-b-2 border-(--oxley-100) whitespace-nowrap text-center bg-(--oxley-200)">{valoracion.username}</td>
                                    <td className="px-6 py-4 border-b-2 border-(--oxley-200) whitespace-nowrap text-center bg-(--oxley-100) font-bold">{valoracion.valoracion}</td>
                                    <td className="px-6 py-4 border-b-2 border-(--oxley-100) whitespace-nowrap text-center bg-(--oxley-200) truncate max-w-xs" title={valoracion.descripcion}>{valoracion.descripcion}</td>
                                    <td className="px-6 py-4 border-b-2 border-(--oxley-200) whitespace-nowrap text-center bg-(--oxley-100) font-bold">{valoracion.fecha}</td>
                                    <td className="px-6 py-4 border-b-2 border-(--oxley-100) whitespace-nowrap text-center bg-(--oxley-200)">
                                        <input
                                            className="h-4 w-4 accent-(--primary-dark)"
                                            type="checkbox"
                                            checked={valoracion.visibilidad}
                                            onChange={(e) => handleVisibilityChange(valoracion.id, e.target.checked)}
                                        />
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            {notificacion && (
                <NotificacionComponent
                    Notificaciones={notificacion}
                    onClose={() => setNotificacion(undefined)}
                />
            )}
        </AdminLayout>
    );
};