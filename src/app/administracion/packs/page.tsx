'use client';
import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import LoadingComponent from '@/components/Loading-Component';
import axiosClient from '@/lib/axiosClient';
import axios from 'axios';
import ErrorPage from "@/pages/[_error]";
import {ArrowPathIcon, ArrowsUpDownIcon, PlusCircleIcon} from "@heroicons/react/20/solid";
import { useAuth } from "@/hooks/useAuth";
import FormularioPack from "@/components/FormularioPack-Component";
import NotificacionComponent from "@/components/Notificacion-Component";
import { Notificaciones } from '@/interfaces/Notificaciones';
import {Pack} from "@/interfaces/Administracion-Interfaces";

export default function UsuariosPage() {
    const { token, error } = useAuth();
    const [datos, setDatos] = useState<Pack[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
    const [currentPage, setCurrentPage] = useState(1);
    const [open, setOpen] = useState(false);
    const [selectedPlato, setSelectedPlato] = useState<Pack | null>(null);
    const itemsPerPage = 25;
    const [crearPlato, setCrearPlato] = useState(false);
    const [notificacion, setNotificacion] = useState<Notificaciones>();

    const fetchDataAndSetState = async (page: number) => {
        try {
            const response = await axiosClient.get<Pack[]>(`/administracion/packs/cargar?page=${page}&limit=${itemsPerPage}`);
            setDatos(response.data);
        } catch (error) {
            console.error('Error fetching user data:', error);

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchDataAndSetState(currentPage);
        }
    }, [token, currentPage]);

    const handleVisibilityChange = async (id: number, visibilidad: boolean) => {
        try {
            const respuesta = await axiosClient.patch(`/administracion/packs/visibilidad/${id}`, { visibilidad });
            setNotificacion({ titulo: respuesta.data.titulo, mensaje: respuesta.data.mensaje, code: respuesta.data.code, tipo: respuesta.data.code });
            setDatos(prevDatos => prevDatos.map(p => p.pack_id === id ? { ...p, visibilidad } : p));
        }catch (error){
            if (axios.isAxiosError(error) && error.response) {
                setNotificacion({ titulo: error.response.data.titulo, mensaje: error.response.data.mensaje , code: error.response.data.code, tipo: error.response.data.tipo });
            } else {
                setNotificacion({ titulo: 'Error', mensaje: 'Error al cambiar la visibilidad del pack', code: 500, tipo: 'error' });
            }
        }
    };

    const handleSort = () => {
        const sortedDatos = [...datos].sort((a, b) => {
            if (sortOrder === 'desc') {
                return b.pack_id - a.pack_id;
            } else {
                return a.pack_id - b.pack_id;
            }
        });
        setDatos(sortedDatos);
        setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    };

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    const handleEditClick = (pack: Pack) => {
        setSelectedPlato(pack);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedPlato(null);
        fetchDataAndSetState(currentPage);
    };


    if (error) {
        return <ErrorPage errorCode={error.errorCode} title={error.title} message={error.message} url={error.url} color={2}/>;
    }

    return (
        <AdminLayout>
            {loading ? (
                <LoadingComponent />
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
                                onClick={() => setCrearPlato(true)}
                                className="flex flex-row gap-2 px-4 py-2 bg-(--oxley-500) text-white rounded-lg hover:bg-(--primary-dark) hover:scale-105 active:scale-95 transition-transform "
                            >
                                Añadir Pack
                                <PlusCircleIcon className="h-6 w-6 text-white" />
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
                    <div className="scroll overflow-x-auto max-h-[100%] w-full rounded-t-2xl scroll-smooth">
                        <table className="table-auto w-full bg-white border border-gray-200 rounded-tl-2xl">
                            <thead>
                            <tr className="min-h-[4rem]">
                                <th className="px-6 py-4 border-b border-r whitespace-nowrap bg-(--oxley-100)">ID</th>
                                <th className="px-6 py-4 border-b whitespace-nowrap bg-(--oxley-200)">Nombre</th>
                                <th className="px-6 py-4 border-b whitespace-nowrap bg-(--oxley-100)">Descripción</th>
                                <th className="px-6 py-4 border-b whitespace-nowrap bg-(--oxley-200)">Precio</th>
                                <th className="px-6 py-4 border-b whitespace-nowrap bg-(--oxley-100)">Visibilidad</th>
                                <th className="px-6 py-4 border-b whitespace-nowrap bg-(--oxley-200)">ID Platos</th>
                                <th className="px-6 py-4 border-b whitespace-nowrap bg-(--oxley-100)">Platos</th>
                                <th className="px-6 py-4 border-b b whitespace-nowrap bg-(--oxley-200)">Editar</th>
                            </tr>
                            </thead>
                            <tbody>
                            {datos.map(pack => (
                                <tr key={pack.pack_id}>
                                    <td className="px-6 py-4 border-r border-b whitespace-nowrap text-center bg-(--oxley-100) font-bold">{pack.pack_id}</td>
                                    <td className="px-6 py-4 border-b whitespace-nowrap text-center bg-(--oxley-200)">{pack.nombre}</td>
                                    <td className="px-6 py-4 border-b whitespace-nowrap text-center bg-(--oxley-100)">{pack.descripcion}</td>
                                    <td className="px-6 py-4 border-b whitespace-nowrap text-center bg-(--oxley-200)">{pack.precio}€</td>
                                    <td className="px-6 py-4 border-b whitespace-nowrap text-center bg-(--oxley-100)">
                                        <input
                                            className="h-4 w-4 accent-(--primary-dark)"
                                            type="checkbox"
                                            checked={pack.visibilidad}
                                            onChange={(e) => handleVisibilityChange(pack.pack_id, e.target.checked)}
                                        />
                                    </td>
                                    <td className="px-6 py-4 border-b whitespace-nowrap text-center bg-(--oxley-200)">
                                        <ul>
                                            {pack.platos.map(p => (
                                                <li key={p.id}>{p.id}</li>
                                            ))}
                                        </ul>
                                    </td>
                                    <td className="px-6 py-4 border-b whitespace-nowrap text-center bg-(--oxley-100)">
                                        <ul>
                                            {pack.platos.map(p => (
                                                <li key={p.id}>{p.nombre}</li>
                                            ))}
                                        </ul>
                                    </td>
                                    <td className="px-6 py-4 border-b whitespace-nowrap text-center bg-(--oxley-200)">
                                        <button className="px-4 py-2 bg-(--oxley-500) text-white rounded-lg hover:bg-(--primary-dark) hover:scale-105 active:scale-95 transition-transform" onClick={() => handleEditClick(pack)}>
                                            Editar
                                        </button>
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
            {selectedPlato && (
                <FormularioPack
                    pack={selectedPlato}
                    open={open}
                    handleClose={handleClose}
                    modo={'editar'}
                />
            )}
            {crearPlato && (
                <FormularioPack
                    pack={undefined}
                    open={crearPlato}
                    handleClose={() => setCrearPlato(false)}
                    modo={'crear'}
                />
            )}
        </AdminLayout>
    );
};