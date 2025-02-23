export interface Packs {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    Plato: Plato[];
}

export interface Plato {
    plato_id: number;
    nombre: string;
    url: string;
}