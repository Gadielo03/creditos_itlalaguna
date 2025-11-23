import api from './api';
import type { Actividad, CreateActividadDto, UpdateActividadDto } from '../types/actividad';

export class ActividadesService {
    private static BASE_URL = '/api/actividades';

    static async getAll(): Promise<Actividad[]> {
        const response = await api.get(`${this.BASE_URL}/all`);
        return response.data;
    }

    static async getById(id: string): Promise<Actividad> {
        const response = await api.get<Actividad>(`${this.BASE_URL}/${id}`);
        return response.data;
    }

    static async create(actividad: CreateActividadDto): Promise<Actividad> {
        const response = await api.post<Actividad>(`${this.BASE_URL}/create`, actividad);
        return response.data;
    }

    static async update(actividad: UpdateActividadDto): Promise<Actividad> {
        const response = await api.post<Actividad>(`${this.BASE_URL}/update`, actividad);
        return response.data;
    }

    static async delete(id: string): Promise<void> {
        await api.delete(`${this.BASE_URL}/${id}`);
    }
}

export default ActividadesService;
