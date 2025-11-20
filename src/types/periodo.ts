export type Periodo = {
    id: number;
    inicio: string;
    fin: string;
    nombre: string;
}

export type CreateUpdatePeriodoDto = {
    inicio: string;
    fin: string;
    nombre: string;
}