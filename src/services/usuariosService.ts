import type { CreateUsuarioDto, Usuario } from '../types/usuario';
import api from './api';

export class UsuariosService {
    private static BASE_URL = '/api/Usuario';

    static async getAll(): Promise<Usuario[]> {
        const response = await api.get(`${this.BASE_URL}/allUsers`);
        return response.data;
    }

    static async create(usuario: CreateUsuarioDto): Promise<Usuario> {
        const response = await api.post<Usuario>(`${this.BASE_URL}/create`, {
            nombre: usuario.nombre,
            contraseña: usuario.contraseña,
            roles: usuario.roles
        });
        return response.data;
    }

    static async update(id: number, usuario: Partial<CreateUsuarioDto>): Promise<Usuario> {
        const response = await api.post<Usuario>(`${this.BASE_URL}/updateUserInfo`, {
            id,
            nombre: usuario.nombre,
            rol: usuario.roles 
        });
        return response.data;
    }

    static async delete(id: number): Promise<void> {
        await api.delete(`${this.BASE_URL}/delete/${id}`);
    }

    static async getRoles(): Promise<any[]> {
        const response = await api.get<any[]>(`${this.BASE_URL}/roles`);
        return response.data;
    }

    static async changePassword(id: number, contraseña: string, nuevaContraseña: string): Promise<void> {
        await api.post(`${this.BASE_URL}/updatePassword`, {
            id,
            contraseña, 
            nuevaContraseña
        });
    }
}

export default UsuariosService;
