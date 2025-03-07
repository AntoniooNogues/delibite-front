'use client';
import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { interfazUsuario } from '@/interfaces/users';
import Loading from '@/components/Loading';
import axiosClient from '@/lib/axiosClient';
import axios from 'axios';
import ErrorPage from "@pages/Error";
import {ArrowPathIcon, ArrowsUpDownIcon} from "@heroicons/react/20/solid";
import {ErrorPropsInterface} from "@/interfaces/ErrorPropsInterface";
import {useAuth} from "@/hooks/useAuth";

export default function UsuariosPage() {
    const {token, error} = useAuth();
    const [datos, setDatos] = useState<interfazUsuario[]>([]);
    const [loading, setLoading] = useState(true);
    const [valueError, setError] = useState<ErrorPropsInterface | null>(null);
    const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    useEffect(() => {
        if (token) {
            const isAdmin = token.roles.includes("ROLE_ADMINISTRADOR");
            if (!isAdmin) {
                setError({
                    errorCode: "401",
                    title: "No autorizado",
                    message: "No tienes autorización para acceder a este recurso.",
                    url: "/administracion/",
                    color: 2,
                    textoBoton: "Ir a la página de inicio"
                });
            }
        }
    }, [token]);

    const fetchDataAndSetState = async (page: number) => {
        try {
            const response = await axiosClient.get<interfazUsuario[]>(`/administracion/usuarios?page=${page}&limit=${itemsPerPage}`);
            setDatos(response.data);
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                setError({
                    errorCode: error.response.data.code || "ERROR",
                    title: error.response.data.titulo || error.cause,
                    message: error.response.data.mensaje || error.message,
                    url: "/administracion/login",
                    color: 2,
                    textoBoton: "Ir al login"
                });
            } else {
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

    const handleVisibilityChange = async (id: number, visibilidad: boolean) => {
        try {
            await axiosClient.patch(`/administracion/usuarios/visibilidad/${id}`, { visibilidad });
            setDatos(prevDatos => prevDatos.map(u => u.id === id ? { ...u, visibilidad } : u));
        } catch (error) {
            console.error('Error al cambiar la visibilidad:', error);
        }
    };

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
        if (newPage < 1 || (newPage > currentPage && datos.length < itemsPerPage)) {
            return;
        }
        setCurrentPage(newPage);
    };

    if (valueError) {
        return <ErrorPage errorCode={valueError.errorCode} title={valueError.title} message={valueError.message} url={valueError.url} color={2} textoBoton={valueError.textoBoton}/>;
    }

    if (error) {
        return <ErrorPage errorCode={error.errorCode} title={error.title} message={error.message} url={error.url} color={2} textoBoton={error.textoBoton}/>;
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
                                className="px-4 py-2 bg-(--oxley-500) text-white rounded-lg hover:bg-(--primary-dark) hover:scale-105 active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={datos.length < itemsPerPage}
                            >
                                Siguiente
                            </button>
                        </div>
                    </div>
                    <div className="scroll overflow-x-auto max-h-[100%] w-full rounded-t-2xl scroll-smooth">
                        <table className="table-auto w-full bg-white border border-gray-200 rounded-tl-2xl">
                            <thead>
                            <tr>
                                <th className="px-6 py-4 border-b-2 border-(--oxley-200) whitespace-nowrap bg-(--oxley-100)">ID</th>
                                <th className="px-6 py-4 border-b-2 border-(--oxley-100) whitespace-nowrap bg-(--oxley-200)">Username</th>
                                <th className="px-6 py-4 border-b-2 border-(--oxley-200) whitespace-nowrap bg-(--oxley-100)">Nombre</th>
                                <th className="px-6 py-4 border-b-2 border-(--oxley-100) whitespace-nowrap bg-(--oxley-200)">Apellidos</th>
                                <th className="px-6 py-4 border-b-2 border-(--oxley-200) whitespace-nowrap bg-(--oxley-100)">Email</th>
                                <th className="px-6 py-4 border-b-2 border-(--oxley-100) whitespace-nowrap bg-(--oxley-200)">DNI</th>
                                <th className="px-6 py-4 border-b-2 border-(--oxley-200) whitespace-nowrap bg-(--oxley-100)">Teléfono</th>
                                <th className="px-6 py-4 border-b-2 border-(--oxley-100) whitespace-nowrap bg-(--oxley-200)">Dirección</th>
                                <th className="px-6 py-4 border-b-2 border-(--oxley-200) whitespace-nowrap bg-(--oxley-100)">Fecha de Nacimiento</th>
                                <th className="px-6 py-4 border-b-2 border-(--oxley-100) whitespace-nowrap bg-(--oxley-200)">Rol</th>
                                <th className="px-6 py-4 border-b-2 border-(--oxley-200) whitespace-nowrap bg-(--oxley-100)">Visibilidad</th>
                                <th className="px-6 py-4 border-b-2 border-(--oxley-100) whitespace-nowrap bg-(--oxley-200)">Fecha de Actividad</th>
                            </tr>
                            </thead>
                            <tbody>
                            {datos.map(usuario => (
                                <tr key={usuario.id}>
                                    <td className="px-6 py-4 border-b-2 border-(--oxley-200) whitespace-nowrap text-center bg-(--oxley-100) font-bold">{usuario.id}</td>
                                    <td className="px-6 py-4 border-b-2 border-(--oxley-100) whitespace-nowrap text-center bg-(--oxley-200)">{usuario.username}</td>
                                    <td className="px-6 py-4 border-b-2 border-(--oxley-200) whitespace-nowrap text-center bg-(--oxley-100)">{usuario.nombre}</td>
                                    <td className="px-6 py-4 border-b-2 border-(--oxley-100) whitespace-nowrap text-center bg-(--oxley-200)">{usuario.apellidos}</td>
                                    <td className="px-6 py-4 border-b-2 border-(--oxley-200) whitespace-nowrap text-center bg-(--oxley-100)">{usuario.email}</td>
                                    <td className="px-6 py-4 border-b-2 border-(--oxley-100) whitespace-nowrap text-center bg-(--oxley-200)">{usuario.dni}</td>
                                    <td className="px-6 py-4 border-b-2 border-(--oxley-200) whitespace-nowrap text-center bg-(--oxley-100)">{usuario.telefono}</td>
                                    <td className="px-6 py-4 border-b-2 border-(--oxley-100) whitespace-nowrap text-center bg-(--oxley-200)">{usuario.direccion}</td>
                                    <td className="px-6 py-4 border-b-2 border-(--oxley-200) whitespace-nowrap text-center bg-(--oxley-100)">{usuario.fecha_nacimiento}</td>
                                    <td className="px-6 py-4 border-b-2 border-(--oxley-100) whitespace-nowrap text-center bg-(--oxley-200)">{usuario.rol.replace('ROLE_', '')}</td>
                                    <td className="px-6 py-4 border-b-2 border-(--oxley-200) whitespace-nowrap text-center bg-(--oxley-100)">
                                        <div className="flex items-center justify-center h-full">
                                            <input
                                                className="h-4 w-4 accent-(--primary-dark)"
                                                type="checkbox"
                                                checked={usuario.visibilidad}
                                                onChange={(e) => handleVisibilityChange(usuario.id, e.target.checked)}
                                            />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 border-b-2 border-(--oxley-100) whitespace-nowrap text-center bg-(--oxley-200)">{usuario.fecha_actividad}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};