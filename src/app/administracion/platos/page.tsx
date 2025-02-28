'use client';
import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { InterfazPlato } from "@/interfaces/interfazPlato";
import Loading from '@/components/Loading';
import axiosClient from '@/lib/axiosClient';
import axios from 'axios';
import ErrorPage from "@/pages/[_error]";
import {ArrowPathIcon, ArrowsUpDownIcon, PlusCircleIcon} from "@heroicons/react/20/solid";
import { ErrorPropsInterface } from "@/interfaces/ErrorPropsInterface";
import { useAuth } from "@/hooks/useAuth";
import FormularioPlato from "@/components/FormularioPlato";
import NotificacionComponent from "@/components/Notificacion";
import { Notificaciones } from '@/interfaces/Notificaciones';

export default function UsuariosPage() {
    const { token, error } = useAuth();
    const [datos, setDatos] = useState<InterfazPlato[]>([]);
    const [loading, setLoading] = useState(true);
    const [valueError, setError] = useState<ErrorPropsInterface | null>(null);
    const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
    const [currentPage, setCurrentPage] = useState(1);
    const [open, setOpen] = useState(false);
    const [selectedPlato, setSelectedPlato] = useState<InterfazPlato | null>(null);
    const itemsPerPage = 25;
    const [crearPlato, setCrearPlato] = useState(false);
    const [notificacion, setNotificacion] = useState<Notificaciones>();

    const fetchDataAndSetState = async (page: number) => {
        try {
            const response = await axiosClient.get<InterfazPlato[]>(`/administracion/platos/cargar?page=${page}&limit=${itemsPerPage}`);
            setDatos(response.data);
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                setError({
                    errorCode: error.response.data.code || "ERROR",
                    title: error.response.data.titulo || error.cause,
                    message: error.response.data.mensaje || error.message,
                    url: error.response.data.url || "/administracion/platos",
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
                return b.plato_id - a.plato_id;
            } else {
                return a.plato_id - b.plato_id;
            }
        });
        setDatos(sortedDatos);
        setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    };

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    const handleEditClick = (plato: InterfazPlato) => {
        setSelectedPlato(plato);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedPlato(null);
        fetchDataAndSetState(currentPage);
    };

    const handleVisibilityChange = async (id: number, visibilidad: boolean) => {
        try {
            const respuesta = await axiosClient.patch(`/administracion/platos/visibilidad/${id}`, { visibilidad });
            setNotificacion({ titulo: respuesta.data.titulo, mensaje: respuesta.data.mensaje, code: respuesta.data.code, tipo: respuesta.data.code });
            setDatos(prevDatos => prevDatos.map(u => u.plato_id === id ? { ...u, visibilidad } : u));
        }catch (error){
            if (axios.isAxiosError(error) && error.response) {
                setNotificacion({ titulo: error.response.data.titulo, mensaje: error.response.data.mensaje , code: error.response.data.code, tipo: error.response.data.tipo });
            } else {
                setNotificacion({ titulo: 'Error', mensaje: 'Error al crear el plato: Error desconocido', code: 500, tipo: 'error' });
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
                                className="flex flex-row gap-2 px-4 py-2 bg-(--oxley-500) text-white rounded-lg hover:bg-(--primary-dark) hover:scale-105 active:scale-95 transition-transform "
                            >
                                Ordenar
                                <ArrowsUpDownIcon className="h-6 w-6 text-white" />
                            </button>
                            <button
                                onClick={() => setCrearPlato(true)}
                                className="flex flex-row gap-2 px-4 py-2 bg-(--oxley-500) text-white rounded-lg hover:bg-(--primary-dark) hover:scale-105 active:scale-95 transition-transform "
                            >
                                Añadir Plato
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
                    <div className="scroll overflow-x-auto  max-h-[100%] w-full rounded-t-2xl scroll-smooth">
                        <table className="table-auto w-full bg-white border border-gray-200 rounded-tl-2xl">
                            <thead>
                            <tr className="min-h-[4rem]">
                                <th className="px-6 py-4 border-b border-r whitespace-nowrap bg-(--oxley-100)">ID</th>
                                <th className="px-6 py-4 border-b whitespace-nowrap bg-(--oxley-200)">Nombre</th>
                                <th className="px-6 py-4 border-b whitespace-nowrap bg-(--oxley-100)">Descripción</th>
                                <th className="px-6 py-4 border-b whitespace-nowrap bg-(--oxley-200)">URL</th>
                                <th className="px-6 py-4 border-b whitespace-nowrap bg-(--oxley-100)">Ingredientes</th>
                                <th className="px-6 py-4 border-b whitespace-nowrap bg-(--oxley-200)">Precio</th>
                                <th className="px-6 py-4 border-b whitespace-nowrap bg-(--oxley-100)">Tipo</th>
                                <th className="px-6 py-4 border-b whitespace-nowrap bg-(--oxley-200)">Modo de Empleo</th>
                                <th className="px-6 py-4 border-b whitespace-nowrap bg-(--oxley-100)">Calorías</th>
                                <th className="px-6 py-4 border-b whitespace-nowrap bg-(--oxley-200)">Azúcares</th>
                                <th className="px-6 py-4 border-b whitespace-nowrap bg-(--oxley-100)">Carbohidratos</th>
                                <th className="px-6 py-4 border-b whitespace-nowrap bg-(--oxley-200)">Fibra</th>
                                <th className="px-6 py-4 border-b whitespace-nowrap bg-(--oxley-100)">Sal</th>
                                <th className="px-6 py-4 border-b whitespace-nowrap bg-(--oxley-200)">Grasas</th>
                                <th className="px-6 py-4 border-b whitespace-nowrap bg-(--oxley-100)">Grasas Saturadas</th>
                                <th className="px-6 py-4 border-b whitespace-nowrap bg-(--oxley-200)">Proteína</th>
                                <th className="px-6 py-4 border-b whitespace-nowrap bg-(--oxley-100)">Alérgenos</th>
                                <th className="px-6 py-4 border-b whitespace-nowrap bg-(--oxley-200) cursor-help" title="El campo en la base de datos se actualiza automáticamente cada vez que se marca o desmarca el input, garantizando la persistencia inmediata del cambio.">
                                    Visibilidad
                                </th>
                                <th className="px-6 py-4 border-b whitespace-nowrap bg-(--oxley-100)">Editar</th>
                            </tr>
                            </thead>
                            <tbody>
                            {datos.map(plato => (
                                <tr key={plato.plato_id}>
                                    <td className="px-6 py-4 border-r border-b whitespace-nowrap text-center bg-(--oxley-100) font-bold">{plato.plato_id}</td>
                                    <td className="px-6 py-4 border-b whitespace-nowrap text-center bg-(--oxley-200)">{plato.nombre}</td>
                                    <td className="px-6 py-4 border-b whitespace-nowrap text-center bg-(--oxley-100) truncate max-w-xs" title={plato.descripcion}>{plato.descripcion}</td>
                                    <td className="px-6 py-4 border-b whitespace-nowrap text-center bg-(--oxley-200)">
                                        {plato.url ? (
                                            <a href={plato.url}>URL</a>
                                        ) : (
                                            "No tiene imagen asociada"
                                        )}
                                    </td>
                                    <td className="px-6 py-4 border-b whitespace-nowrap text-center bg-(--oxley-100) truncate max-w-xs" title={plato.ingredientes}>{plato.ingredientes}</td>
                                    <td className="px-6 py-4 border-b whitespace-nowrap text-center bg-(--oxley-200)">{plato.precio}€</td>
                                    <td className="px-6 py-4 border-b whitespace-nowrap text-center bg-(--oxley-100)">{plato.tipo[1]}</td>
                                    <td className="px-6 py-4 border-b whitespace-nowrap text-center bg-(--oxley-200)">{plato.modo_empleo[1]}</td>
                                    <td className="px-6 py-4 border-b whitespace-nowrap text-center bg-(--oxley-100)">{plato.calorias}</td>
                                    <td className="px-6 py-4 border-b whitespace-nowrap text-center bg-(--oxley-200)">{plato.azucares}</td>
                                    <td className="px-6 py-4 border-b whitespace-nowrap text-center bg-(--oxley-100)">{plato.carbohidratos}</td>
                                    <td className="px-6 py-4 border-b whitespace-nowrap text-center bg-(--oxley-200)">{plato.fibra}</td>
                                    <td className="px-6 py-4 border-b whitespace-nowrap text-center bg-(--oxley-100)">{plato.sal}</td>
                                    <td className="px-6 py-4 border-b whitespace-nowrap text-center bg-(--oxley-200)">{plato.grasas}</td>
                                    <td className="px-6 py-4 border-b whitespace-nowrap text-center bg-(--oxley-100)">{plato.grasas_saturadas}</td>
                                    <td className="px-6 py-4 border-b whitespace-nowrap text-center bg-(--oxley-200)">{plato.proteina}</td>
                                    <td className="px-6 py-4 border-b text-center bg-(--oxley-100) max-w-xs max-h-xl" title={plato.alergenos.map(a => a.nombre).join(', ') }>{plato.alergenos.map(a => a.nombre).join(', ') || "No tiene alérgenos"}</td>
                                    <td className="px-6 py-4 border-b whitespace-nowrap text-center bg-(--oxley-200)">
                                        <input
                                            className="h-4 w-4 accent-(--primary-dark)"
                                            type="checkbox"
                                            checked={plato.visibilidad}
                                            onChange={(e) => handleVisibilityChange(plato.plato_id, e.target.checked)}
                                        />
                                    </td>
                                    <td className="px-6 py-4 border-b whitespace-nowrap text-center bg-(--oxley-100)">
                                        <button className="px-4 py-2 bg-(--oxley-500) text-white rounded-lg hover:bg-(--primary-dark) hover:scale-105 active:scale-95 transition-transform" onClick={() => handleEditClick(plato)}>
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
                <FormularioPlato
                    plato={selectedPlato}
                    open={open}
                    handleClose={handleClose}
                    modo={'editar'}
                />
            )}
            {crearPlato && (
                <FormularioPlato
                    plato={undefined}
                    open={crearPlato}
                    handleClose={() => setCrearPlato(false)}
                    modo={'crear'}
                />
            )}
        </AdminLayout>
    );
};