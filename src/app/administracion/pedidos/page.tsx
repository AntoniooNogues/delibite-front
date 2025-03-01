'use client';
import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import {Pedidos} from "@/interfaces/Administracion-Interfaces";
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
    const [datos, setDatos] = useState<Pedidos[]>([]);
    const [loading, setLoading] = useState(true);
    const [valueError, setError] = useState<ErrorPropsInterface | null>(null);
    const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 25;
    const [notificacion, setNotificacion] = useState<Notificaciones>();

    const fetchDataAndSetState = async (page: number) => {
        try {
            const response = await axiosClient.get<Pedidos[]>(`/administracion/pedidos/cargar?page=${page}&limit=${itemsPerPage}`);
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
                return b.pedido_id - a.pedido_id;
            } else {
                return a.pedido_id - b.pedido_id;
            }
        });
        setDatos(sortedDatos);
        setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    };

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
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
                                className="flex flex-row gap-2 px-4 py-2 bg-(--oxley-500) text-white rounded-lg hover:bg-(--primary-dark) hover:scale-105 active:scale-95 transition-transform "
                            >
                                Ordenar
                                <ArrowsUpDownIcon className="h-6 w-6 text-white" />
                            </button>
                            <button
                                onClick={() => fetchDataAndSetState(currentPage)}
                                className="flex flex-row gap-2 px-4 py-2 bg-(--oxley-500) text-white rounded-lg hover:bg-(--primary-dark) hover:scale-105 active:scale-95 transition-transform"
                            >
                                <ArrowPathIcon className="h-6 w-6 text-white rotate-360" />
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
                                <tr className="min-h-[4rem] ">
                                    <th className="px-6 py-4 border-b border-r whitespace-nowrap bg-(--oxley-100)">ID</th>
                                    <th className="px-6 py-4 border-b whitespace-nowrap bg-(--oxley-200)">Nombre de usuario</th>
                                    <th className="px-6 py-4 border-b whitespace-nowrap bg-(--oxley-100)">Estado</th>
                                    <th className="px-6 py-4 border-b whitespace-nowrap bg-(--oxley-200)">Fecha de pedido</th>
                                    <th className="px-6 py-4 border-b whitespace-nowrap bg-(--oxley-100)">Fecha de entrega</th>
                                    <th className="px-6 py-4 border-b whitespace-nowrap bg-(--oxley-200)">Codigo</th>
                                    <th className="px-6 py-4 border-b whitespace-nowrap bg-(--oxley-100)">Cantidad</th>
                                    <th className="px-6 py-4 border-b whitespace-nowrap bg-(--oxley-200)">Precio</th>
                                    <th className="px-6 py-4 border-b whitespace-nowrap bg-(--oxley-100)">ID de platos</th>
                                    <th className="px-6 py-4 border-b whitespace-nowrap bg-(--oxley-200)">Nombre de platos</th>
                                </tr>
                            </thead>
                            <tbody>
                            {datos.map(pedido => (
                                <tr key={pedido.pedido_id}>
                                    <td className="px-6 py-4 border-r border-b whitespace-nowrap text-center bg-(--oxley-100) font-bold">{pedido.pedido_id}</td>
                                    <td className="px-6 py-4 border-b whitespace-nowrap text-center bg-(--oxley-200)">{pedido.username}</td>
                                    <td className="px-6 py-4 border-r border-b whitespace-nowrap text-center bg-(--oxley-100) font-bold">{pedido.estado}</td>
                                    <td className="px-6 py-4 border-b whitespace-nowrap text-center bg-(--oxley-200)">{pedido.fecha_pedido}</td>
                                    <td className="px-6 py-4 border-r border-b whitespace-nowrap text-center bg-(--oxley-100) font-bold">{pedido.fecha_entrega}</td>
                                    <td className="px-6 py-4 border-b whitespace-nowrap text-center bg-(--oxley-200)">{pedido.codigo}</td>
                                    <td className="px-6 py-4 border-r border-b whitespace-nowrap text-center bg-(--oxley-100) font-bold">{pedido.cantidad}</td>
                                    <td className="px-6 py-4 border-b whitespace-nowrap text-center bg-(--oxley-200)">{pedido.precio}€</td>
                                    <td className="px-6 py-4 border-b whitespace-nowrap text-center bg-(--oxley-100)">
                                        <ul>
                                            {pedido.platos.map(p => (
                                                <li key={p.plato_id}>{p.plato_id}</li>
                                            ))}
                                        </ul>
                                    </td>
                                    <td className="px-6 py-4 border-b whitespace-nowrap text-center bg-(--oxley-200)">
                                        <ul>
                                            {pedido.platos.map(p => (
                                                <li key={p.nombre}>{p.nombre}</li>
                                            ))}
                                        </ul>
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