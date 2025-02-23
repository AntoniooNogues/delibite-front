export interface HomeInterface {
    num_usuarios: number;
    pedidos_totales: number;
    valoracion_media_platos: number;
    usuarios_activos_ultimos_7_dias: number;
    suscripciones_activas: number;
    tipo_plato_mas_vendido: [];
    modo_empleo_mas_vendido: [];
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