import type { Docente } from "./docente";
import type { Periodo } from "./periodo";

export type Actividad = {
    act_id: number;
    act_nombre: string;
    act_creditos: number;
    act_hora_inicio: string;
    act_hora_fin: string;
    periodo: Periodo;
    docente: Docente;
};

export type ActividadDB = {
    act_id: string;
    act_nombre: string;
    act_creditos: number;
    act_hor_ini: string;
    act_hor_fin: string;
    per_id: number;
    doc_responsable: number;
};

export interface CreateActividadDto {
    act_nombre: string;
    act_creditos: number;
    act_hor_ini: string;
    act_hor_fin: string;
    per_id: number;
    doc_responsable: number;
}

export interface UpdateActividadDto {
    act_id: number;
    act_nombre?: string;
    act_creditos?: number;
    act_hor_ini?: string;
    act_hor_fin?: string;
    per_id?: number;
    doc_responsable?: number;
}