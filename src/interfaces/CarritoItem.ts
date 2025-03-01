
export interface CarritoItem {
    id: number;
    nombre: string;
    precio: number;
    cantidad: number;
    img: string;
    tipo: 'plato' | 'suscripcion';
}