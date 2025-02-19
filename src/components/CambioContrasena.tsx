import React, { useState } from 'react';
import { Input } from '@headlessui/react';
import {Notificaciones} from "@/interfaces/Notificaciones";
import NotificacionComponent from "@/components/Notificacion-Component";

interface CambioContrasenaModal {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (currentPassword: string, newPassword: string, repeatPassword: string) => void;
}

const CambioContrasena: React.FC<CambioContrasenaModal> = ({ isOpen, onClose, onSubmit }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [notificacion, setNotificacion] = useState<Notificaciones>();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword.length < 6) {
            setNotificacion({
                titulo: "Caracteres contraseña.",
                mensaje: "La contraseña tiene que tener al menos 6 caracteres.",
                code: 422,
                tipo: "error"
            });
            return;
        }
        onSubmit(currentPassword, newPassword, repeatPassword);
        setCurrentPassword('');
        setNewPassword('');
        setRepeatPassword('');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-(--gris-muy-claro)">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Cambiar Contraseña</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <label className="block">
                        <span className="text-gray-700">Contraseña Actual</span>
                        <Input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="mt-1 block w-full p-2 bg-white border border-gray-300 rounded-md"
                        />
                    </label>
                    <label className="block">
                        <span className="text-gray-700">Nueva Contraseña</span>
                        <Input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="mt-1 block w-full p-2 bg-white border border-gray-300 rounded-md"
                        />
                    </label>
                    <label className="block">
                        <span className="text-gray-700">Repetir Contraseña</span>
                        <Input
                            type="password"
                            value={repeatPassword}
                            onChange={(e) => setRepeatPassword(e.target.value)}
                            className="mt-1 block w-full p-2 bg-white border border-gray-300 rounded-md"
                        />
                    </label>
                    <div className="flex justify-end space-x-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-400 text-white rounded-lg
                                    hover:bg-gray-500 active:bg-gray-600 hover:text-white transition transform active:scale-95 hover:scale-105">Cancelar</button>
                        <button type="submit" className="px-4 py-2 rounded-lg text-white bg-(--oxley-500)
                        hover:bg-(--oxley-700) active:bg-(--oxley-800) hover:text-white transition transform
                        active:scale-95 hover:scale-105">Guardar</button>
                    </div>
                </form>
            </div>
            {notificacion && (
                <NotificacionComponent
                    Notificaciones={notificacion}
                    onClose={() => setNotificacion(undefined)}
                />
            )}
        </div>
    );
};

export default CambioContrasena;