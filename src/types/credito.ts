import type { Actividad } from "./actividad";
import type { Alumno } from "./alumno";

export type CreditoDB = {
    credito_id: number;
    alu_id: string;
    act_id: string;
    cred_fecha: string;
}

export type Credito = {
    credito_id: number;
    alumno: Alumno;
    actividad: Actividad;
    cred_fecha: string;
}

export interface CreateCreditoDto {
    alu_id: string;
    act_id: number;
    cred_fecha: string;
}

export interface UpdateCreditoDto {
    credito_id: number;
    alu_id?: string;
    act_id?: number;
    cred_fecha?: string;
}