"use client";

import React, { useState, useEffect } from 'react';
import axiosClient from '@/lib/axiosClient';
import { interfazUsuario } from '@/interfaces/users';
import PerfilLayout from "@/components/PerfilLayout";
import LoadingComponent from "@/components/Loading-Component";
import { ArrowLeft } from "lucide-react";
import { Input } from '@headlessui/react';
import {Notificaciones} from "@/interfaces/Notificaciones";
import axios from "axios";
import NotificacionComponent from "@/components/Notificacion-Component";
import CambioContrasenaModal from "@/components/CambioContrasena";

const DatosPersonalesPage: React.FC = () => {
    const [user, setUser] = useState<interfazUsuario | null>(null);
    const [formData, setFormData] = useState({
        nombre: '',
        apellidos: '',
        telefono: '',
        username: ''
    });
    const [notificacion, setNotificacion] = useState<Notificaciones>();
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axiosClient.get('/usuario/getUsuario');
                setUser(response.data);
                setFormData({
                    nombre: response.data.nombre,
                    apellidos: response.data.apellidos,
                    telefono: response.data.telefono,
                    username: response.data.username
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

        fetchUserData();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axiosClient.put('/usuario/editar', formData);
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

    const handlePasswordChange = async (currentPassword: string, newPassword: string, repeatPassword: string) => {
        if (newPassword !== repeatPassword) {
            setNotificacion({
                titulo: "Las contraseñas introducidas no coinciden",
                mensaje: "Las contraseñas introducidas deben ser iguales",
                code: 422,
                tipo: "error"
            });
            return;
        }
        try {
            await axiosClient.post('/usuario/cambiarContrasena', {
                currentPassword,
                newPassword
            });
            setNotificacion({
                titulo: "Contraseña cambiada con éxito.",
                mensaje: "La contraseña ha sido actualiza con exito.",
                code: 200,
                tipo: "access"
            });
            setIsModalOpen(false);
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
    return (
        <PerfilLayout>
            <div className="bg-white rounded-xl px-8 py-6 w-full">
                {user ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="flex items-center space-x-6 mb-4">
                            <ArrowLeft onClick={() => window.history.back()} className="cursor-pointer"/>
                            <h2 className="text-2xl font-bold">Editar Datos Personales</h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <label className="block">
                                <span className="text-gray-700">Nombre</span>
                                <Input name="nombre" value={formData.nombre} onChange={handleChange}
                                       className="mt-1 block w-full p-2 bg-white border border-gray-300 rounded-md"/>
                            </label>
                            <label className="block">
                                <span className="text-gray-700">Apellidos</span>
                                <Input name="apellidos" value={formData.apellidos} onChange={handleChange}
                                       className="mt-1 block w-full p-2 bg-white border border-gray-300 rounded-md"/>
                            </label>
                            <label className="block">
                                <span className="text-gray-700">Teléfono</span>
                                <Input name="telefono" value={formData.telefono} onChange={handleChange}
                                       className="mt-1 block w-full p-2 bg-white border border-gray-300 rounded-md"/>
                            </label>
                            <label className="block">
                                <span className="text-gray-700">Username</span>
                                <Input name="username" value={formData.username} onChange={handleChange}
                                       className="mt-1 block w-full p-2 bg-white border border-gray-300 rounded-md"/>
                            </label>
                            <label className="block">
                                <span className="text-gray-700">Email</span>
                                <Input value={user.email} disabled
                                       className="mt-1 block w-full p-2 bg-gray-100 border border-gray-300 rounded-md"/>
                            </label>
                            <label className="block">
                                <span className="text-gray-700">Fecha de Nacimiento</span>
                                <Input value={user.fecha_nacimiento} disabled
                                       className="mt-1 block w-full p-2 bg-gray-100 border border-gray-300 rounded-md"/>
                            </label>
                            <label className="block">
                                <span className="text-gray-700">DNI</span>
                                <Input value={user.dni} disabled
                                       className="mt-1 block w-full p-2 bg-gray-100 border border-gray-300 rounded-md"/>
                            </label>
                        </div>

                        <div className="mt-8 flex justify-between">
                            <button type="submit" className="w-full sm:w-auto px-4 py-2 rounded-lg text-white bg-(--verde-azulado) hover:bg-(--oxley-500) active:bg-(--oxley-700) hover:text-white transition transform active:scale-95 hover:scale-105">Guardar Cambios</button>
                            <button type="button" onClick={() => setIsModalOpen(true)}
                                    className="w-full sm:w-auto px-4 py-2 rounded-lg text-white bg-(--verde-azulado) hover:bg-(--oxley-500) active:bg-(--oxley-700) hover:text-white transition transform active:scale-95 hover:scale-105">Cambiar
                                contraseña
                            </button>
                        </div>

                    </form>
                ) : (
                    <div className="flex sm:min-h-screen items-center justify-center">
                        <LoadingComponent/>
                    </div>
                )}
            </div>
            {notificacion && (
                <NotificacionComponent
                    Notificaciones={notificacion}
                    onClose={() => setNotificacion(undefined)}
                />
            )}
            <CambioContrasenaModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handlePasswordChange}
            />
        </PerfilLayout>
    );
};

export default DatosPersonalesPage;