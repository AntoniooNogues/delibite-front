import {Alergenos} from "@/interfaces/Catalogo";

export interface Plato {
    plato_id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    tipo: string;
    modo_empleo: string;
    ingredientes: string;
    calorias: number;
    azucares: number;
    carbohidratos: number;
    fibra: number;
    sal: number;
    grasas: number;
    grasas_saturadas: number;
    proteina: number;
    url: string;
    alergenos: Alergenos[];
}