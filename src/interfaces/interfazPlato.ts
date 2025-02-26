import { Alergenos } from '@/interfaces/Catalogo';

export interface InterfazPlato {
    plato_id: number;
    nombre: string;
    descripcion: string;
    url: string | null;
    ingredientes: string;
    precio?: number;
    tipo: [number, string];
    modo_empleo: [number, string];
    calorias?: number;
    azucares?: number;
    carbohidratos?: number;
    fibra?: number;
    sal?: number;
    grasas?: number;
    grasas_saturadas?: number;
    proteina?: number;
    alergenos: Alergenos[];
    visibilidad?: boolean;
}


