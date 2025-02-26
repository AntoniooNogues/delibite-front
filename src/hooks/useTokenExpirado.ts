import { useState, useEffect } from "react";
import {Notificaciones} from "@/interfaces/Notificaciones";

export function useTokenExpirado() {
    const [notificacion, setNotificacion] = useState<Notificaciones | null>(null);

    useEffect(() => {
        const handleTokenExpirado = (event: CustomEvent) => {
            localStorage.setItem("notificacion", JSON.stringify(event.detail));
            window.location.reload();
        };

        window.addEventListener("tokenExpirado", handleTokenExpirado as EventListener);

        return () => {
            window.removeEventListener("tokenExpirado", handleTokenExpirado as EventListener);
        };
    }, []);

    useEffect(() => {
        const storedNotificacion = localStorage.getItem("notificacion");
        if (storedNotificacion) {
            setNotificacion(JSON.parse(storedNotificacion));
            localStorage.removeItem("notificacion");
        }
    }, []);

    return notificacion;
}
