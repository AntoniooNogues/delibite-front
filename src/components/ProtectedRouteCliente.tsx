import React, { ReactNode, useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuthClient";
import { Notificaciones } from "@/interfaces/Notificaciones";
import NotificacionComponent from "@/components/Notificacion";

interface ProtectedRouteProps {
    children: ReactNode;
}

const ProtectedRouteCliente = ({ children }: ProtectedRouteProps) => {
    const { error } = useAuth();
    const [notificacion, setNotificacion] = useState<Notificaciones>();

    useEffect(() => {
        if (error) {
            const newNotificacion = { titulo: error.title, mensaje: error.message, code: Number(error.errorCode), tipo: "error" };
            setNotificacion(newNotificacion);
            localStorage.setItem("notificacion", JSON.stringify(newNotificacion));
        }
    }, [error]);

    if (notificacion) {
        return (
            <NotificacionComponent
                Notificaciones={notificacion}
                onClose={() => setNotificacion(undefined)}
            />
        );
    }
    return <>{children}</>;
};

export default ProtectedRouteCliente;