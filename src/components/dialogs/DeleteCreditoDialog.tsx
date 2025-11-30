import { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Divider,
    IconButton,
    CircularProgress,
    alpha,
    Chip,
} from '@mui/material';
import {
    Warning as WarningIcon,
    Close as CloseIcon,
    DeleteForever as DeleteIcon,
    CreditCard as CreditIcon,
    Person as PersonIcon,
    School as SchoolIcon,
    Event as EventIcon,
} from '@mui/icons-material';
import type { Credito } from '../../types/credito';

interface DeleteCreditoDialogProps {
    open: boolean;
    credito: Credito | null;
    onClose: () => void;
    onConfirm: () => Promise<void>;
}

export const DeleteCreditoDialog = ({
    open,
    credito,
    onClose,
    onConfirm,
}: DeleteCreditoDialogProps) => {
    const [deleting, setDeleting] = useState(false);

    const handleConfirm = async () => {
        try {
            setDeleting(true);
            await onConfirm();
            setDeleting(false);
            onClose();
        } catch (error) {
            console.error('Error in delete confirm:', error);
            setDeleting(false);
        }
    };

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-MX', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <Dialog 
            open={open} 
            onClose={deleting ? undefined : onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                elevation: 3,
                sx: {
                    borderRadius: 2,
                }
            }}
        >
            <DialogTitle
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    pb: 1,
                    bgcolor: (theme) => alpha(theme.palette.error.main, 0.05),
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <WarningIcon 
                        sx={{ 
                            fontSize: 32, 
                            color: 'error.main',
                        }} 
                    />
                    <Box>
                        <Typography variant="h6" component="div" fontWeight={600} color="error.main">
                            Confirmar Eliminación
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Esta acción es permanente
                        </Typography>
                    </Box>
                </Box>
                <IconButton
                    onClick={onClose}
                    disabled={deleting}
                    size="small"
                    sx={{
                        color: 'text.secondary',
                        '&:hover': {
                            bgcolor: (theme) => alpha(theme.palette.error.main, 0.1),
                            color: 'error.main',
                        }
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <Divider />

            <DialogContent sx={{ pt: 3, pb: 2 }}>
                <Box 
                    sx={{ 
                        p: 2.5, 
                        borderRadius: 2,
                        bgcolor: (theme) => alpha(theme.palette.grey[500], 0.08),
                        border: (theme) => `1px solid ${alpha(theme.palette.grey[500], 0.2)}`,
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                        <CreditIcon color="action" />
                        <Typography variant="body2" color="text.secondary" fontWeight={500}>
                            Datos del Crédito
                        </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                            <PersonIcon sx={{ fontSize: 20, color: 'text.secondary', mt: 0.3 }} />
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="caption" color="text.secondary" display="block">
                                    Alumno
                                </Typography>
                                <Typography variant="body2" fontWeight={600}>
                                    {credito?.alumno.nombres} {credito?.alumno.apellidos}
                                </Typography>
                                <Chip 
                                    label={credito?.alumno.nctrl} 
                                    size="small" 
                                    variant="outlined"
                                    sx={{ mt: 0.5 }}
                                />
                            </Box>
                        </Box>

                        <Divider />
                        
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                            <SchoolIcon sx={{ fontSize: 20, color: 'text.secondary', mt: 0.3 }} />
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="caption" color="text.secondary" display="block">
                                    Actividad
                                </Typography>
                                <Typography variant="body2" fontWeight={600}>
                                    {credito?.actividad.act_nombre}
                                </Typography>
                                <Chip 
                                    label={`${credito?.actividad.act_creditos} crédito${credito?.actividad.act_creditos !== 1 ? 's' : ''}`}
                                    size="small" 
                                    color="primary"
                                    sx={{ mt: 0.5 }}
                                />
                            </Box>
                        </Box>

                        <Divider />
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <EventIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                            <Box>
                                <Typography variant="caption" color="text.secondary" display="block">
                                    Fecha de asignación
                                </Typography>
                                <Typography variant="body2" fontWeight={600}>
                                    {credito ? formatDate(credito.cred_fecha) : ''}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>

                <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ mt: 2.5, fontStyle: 'italic', textAlign: 'center' }}
                >
                    ¿Estás seguro de que deseas continuar?
                </Typography>
            </DialogContent>

            <Divider />

            <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
                <Button 
                    onClick={onClose} 
                    disabled={deleting}
                    variant="outlined"
                    color="inherit"
                    sx={{
                        minWidth: 100,
                        textTransform: 'none',
                        fontWeight: 500,
                    }}
                >
                    Cancelar
                </Button>
                <Button 
                    onClick={handleConfirm} 
                    variant="contained" 
                    color="error"
                    disabled={deleting}
                    startIcon={deleting ? <CircularProgress size={18} color="inherit" /> : <DeleteIcon />}
                    sx={{
                        minWidth: 140,
                        textTransform: 'none',
                        fontWeight: 600,
                        boxShadow: 2,
                        '&:hover': {
                            boxShadow: 4,
                        }
                    }}
                >
                    {deleting ? 'Eliminando...' : 'Eliminar Crédito'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteCreditoDialog;
