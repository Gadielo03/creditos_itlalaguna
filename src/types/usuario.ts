export type Usuario = {
    id: number,
    nombre: string,
    contraseña?: string,
    roles?: string[]
}

export type CreateUsuarioDto = {
    nombre: string,
    contraseña: string,
    roles: string[]
}

export type UpdateUsuarioContraseñaDto = {
    id: string,
    contraseña: string,
    nuevaContraseña: string
}