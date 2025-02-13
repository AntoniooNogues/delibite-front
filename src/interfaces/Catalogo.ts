export interface Catalogo {
    plato_id: number;
    nombre: string;
    calorias:number;
    precio: number;
    tipo: string;
    modo_empleo: string;
    url: string;
    alergenos: Alergenos[];
}


export interface Alergenos {
    alergeno_id: number;
    nombre: string;
}