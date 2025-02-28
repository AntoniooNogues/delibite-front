export type LineaPedido = {
    pedido_id: number;
    plato_id: number;
    nombre: string;
    valoracion: number;
    descripcion: string;
    url: string;
}

export type Valoracion = {
    pedido_id: number;
    plato_id: number;
    valoracion: number;
    descripcion: string;
}