import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Box,
    Typography,
} from '@mui/material';
import { Warning as WarningIcon } from '@mui/icons-material';
import type { Periodo } from '../../types/periodo';
import { useState } from 'react';

interface DeletePeriodoDialogProps {
    open: boolean;
    periodo: Periodo | null;
    onClose: () => void;
    onConfirm: () => Promise<void>;
}

export const DeletePeriodoDialog = ({ open, periodo, onClose, onConfirm }: DeletePeriodoDialogProps) => {
    const [deleting, setDeleting] = useState(false);

    const handleConfirm = async () => {
        setDeleting(true);
        try {
            await onConfirm();
            onClose();
        } catch (error) {
            console.error('Error deleting periodo:', error);
        } finally {
            setDeleting(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <WarningIcon color="warning" />
                    Confirmar Eliminación
                </Box>
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    ¿Estás seguro de que deseas eliminar este periodo?
                </DialogContentText>
                {periodo && (
                    <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                        <Typography variant="body2" gutterBottom>
                            <strong>Nombre:</strong> {periodo.nombre}
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                            <strong>Inicio:</strong> {formatDate(periodo.inicio)}
                        </Typography>
                        <Typography variant="body2">
                            <strong>Fin:</strong> {formatDate(periodo.fin)}
                        </Typography>
                    </Box>
                )}
                <DialogContentText sx={{ mt: 2 }}>
                    Esta acción no se puede deshacer.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={deleting}>
                    Cancelar
                </Button>
                <Button
                    onClick={handleConfirm}
                    color="error"
                    variant="contained"
                    disabled={deleting}
                >
                    {deleting ? 'Eliminando...' : 'Eliminar'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeletePeriodoDialog;
