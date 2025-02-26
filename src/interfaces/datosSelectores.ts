import {Alergenos} from "@/interfaces/Catalogo";

export interface DatosSelectores {
    tipos:[number, string][],
    modos_empleo: [number, string][],
    alergenos: Alergenos[];
}

