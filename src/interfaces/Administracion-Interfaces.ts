export interface HomeInterface {
    num_usuarios: number;
    pedidos_totales: number;
    valoracion_media_platos: number;
    usuarios_activos_ultimos_7_dias: number;
    suscripciones_activas: number;
    tipo_plato_mas_vendido: InterfazGraficos[];
    modo_empleo_mas_vendido: InterfazGraficos[];
}

export interface InterfazGraficos {
    name: string;
    value: number;
}


export interface cargarPlatosPack{
    platos: Plato[];
}

export interface Pack {
    pack_id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    visibilidad: boolean;
    platos: Plato[];
}

export interface Plato {
    id: number;
    nombre: string;
    precio: number;
}

export interface Valoraciones{
    id: number;
    pedido_id: number;
    plato_id: number;
    username: string;
    valoracion: number;
    descripcion: string;
    fecha: string;
    visibilidad: boolean;
}

export interface Pedidos {
    pedido_id: number;
    username: string;
    estado: string;
    fecha_pedido: string;
    fecha_entrega: string;
    codigo: string;
    cantidad: number;
    precio: number;
    platos: PlatosPedidos[];

}

export interface PlatosPedidos {
    plato_id: number;
    nombre: string;
}