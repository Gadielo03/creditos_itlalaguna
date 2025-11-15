import type { CreateDocenteDto, Docente } from '../types/docente';
import api from './api';


export class DocentesService {
    private static BASE_URL = '/api/docente';

    static async getAll(): Promise<Docente[]> {
        const response = await api.get(`${this.BASE_URL}/all`);
        return response.data;
    }

    static async create(docente: CreateDocenteDto): Promise<Docente> {
        const response = await api.post<Docente>(`${this.BASE_URL}/create`, docente);
        return response.data;
    }

    static async update(id: number, docente: Docente): Promise<Docente> {
        const response = await api.put<Docente>(`${this.BASE_URL}/update/${id}`, docente);
        return response.data;
    }

    static async delete(id: number): Promise<void> {
        await api.delete(`${this.BASE_URL}/delete/${id}`);
    }
}

export default DocentesService;
