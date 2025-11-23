import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
} from '@mui/material';
import type { Periodo, CreateUpdatePeriodoDto } from '../../types/periodo';

interface PeriodoFormDialogProps {
    open: boolean;
    periodo: Periodo | null;
    onClose: () => void;
    onSubmit: (data: CreateUpdatePeriodoDto) => Promise<void>;
}

export const PeriodoFormDialog = ({ open, periodo, onClose, onSubmit }: PeriodoFormDialogProps) => {
    const [formData, setFormData] = useState<CreateUpdatePeriodoDto>({
        inicio: '',
        fin: '',
        nombre: '',
    });
    const [errors, setErrors] = useState<Partial<Record<keyof CreateUpdatePeriodoDto, string>>>({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (open) {
            if (periodo) {
                // Convert dates from ISO string to YYYY-MM-DD format for date inputs
                const inicioDate = new Date(periodo.inicio);
                const finDate = new Date(periodo.fin);
                
                setFormData({
                    inicio: inicioDate.toISOString().split('T')[0],
                    fin: finDate.toISOString().split('T')[0],
                    nombre: periodo.nombre,
                });
            } else {
                setFormData({
                    inicio: '',
                    fin: '',
                    nombre: '',
                });
            }
            setErrors({});
        }
    }, [open, periodo]);

    const validate = (): boolean => {
        const newErrors: Partial<Record<keyof CreateUpdatePeriodoDto, string>> = {};

        if (!formData.nombre.trim()) {
            newErrors.nombre = 'El nombre es requerido';
        }

        if (!formData.inicio) {
            newErrors.inicio = 'La fecha de inicio es requerida';
        }

        if (!formData.fin) {
            newErrors.fin = 'La fecha de fin es requerida';
        }

        if (formData.inicio && formData.fin) {
            const inicioDate = new Date(formData.inicio);
            const finDate = new Date(formData.fin);
            
            if (finDate <= inicioDate) {
                newErrors.fin = 'La fecha de fin debe ser posterior a la fecha de inicio';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (field: keyof CreateUpdatePeriodoDto) => (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setFormData({
            ...formData,
            [field]: event.target.value,
        });
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors({
                ...errors,
                [field]: undefined,
            });
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!validate()) {
            return;
        }

        setSubmitting(true);
        try {
            await onSubmit(formData);
            onClose();
        } catch (error) {
            console.error('Error submitting periodo:', error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <form onSubmit={handleSubmit}>
                <DialogTitle>
                    {periodo ? 'Editar Periodo' : 'Nuevo Periodo'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
                        <TextField
                            label="Nombre del Periodo"
                            value={formData.nombre}
                            onChange={handleChange('nombre')}
                            error={!!errors.nombre}
                            helperText={errors.nombre}
                            fullWidth
                            required
                            placeholder="Ej: Enero - Junio 2024"
                        />
                        <TextField
                            label="Fecha de Inicio"
                            type="date"
                            value={formData.inicio}
                            onChange={handleChange('inicio')}
                            error={!!errors.inicio}
                            helperText={errors.inicio}
                            fullWidth
                            required
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <TextField
                            label="Fecha de Fin"
                            type="date"
                            value={formData.fin}
                            onChange={handleChange('fin')}
                            error={!!errors.fin}
                            helperText={errors.fin}
                            fullWidth
                            required
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} disabled={submitting}>
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={submitting}
                    >
                        {submitting ? 'Guardando...' : periodo ? 'Actualizar' : 'Crear'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default PeriodoFormDialog;
