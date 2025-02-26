export interface Notificaciones{
    titulo: string;
    mensaje: string;
    code: number;
    tipo?: string;
}

export function isNotificaciones(error: unknown): error is Notificaciones {
    return (error as Notificaciones).titulo !== undefined;
}