export interface Alumno {
    id: number;
    nctrl: string;
    nombres: string;
    apellidos: string;
}

export interface CreateAlumnoDto {
    nctrl: string;
    nombres: string;
    apellidos: string;
}

export interface UpdateAlumnoDto extends Partial<CreateAlumnoDto> {}
