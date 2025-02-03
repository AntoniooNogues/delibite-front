export interface Catalogo {
    plato_id: number;
    nombre: string;
    precio: number;
    tipo: string;
    modo_empleo: string;
    alergenos: Alergenos[];
}


export interface Alergenos {
    alergeno_id: number;
    nombre: string;
}