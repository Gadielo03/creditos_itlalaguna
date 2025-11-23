import api from './api';
import type { CreateUpdatePeriodoDto, Periodo } from '../types/periodo';

export class PeriodoService {
    private static BASE_URL = '/api/periodo';

    static async getAll(): Promise<Periodo[]> {
        const response = await api.get(`${this.BASE_URL}/getAll`);
        return response.data;
    }

    static async create(periodo: CreateUpdatePeriodoDto): Promise<Periodo> {
        const response = await api.post<Periodo>(`${this.BASE_URL}/createPeriodo`, periodo);
        return response.data;
    }

    static async update(id: number, periodo: CreateUpdatePeriodoDto): Promise<Periodo> {
        const response = await api.put<Periodo>(`${this.BASE_URL}/updatePeriodo/${id}`, periodo);
        return response.data;
    }

    static async delete(id: number): Promise<void> {
        await api.delete(`${this.BASE_URL}/deletePeriodo/${id}`);
    }
}

export default PeriodoService;
