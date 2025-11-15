import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    Typography,
    Divider,
    IconButton,
    CircularProgress,
    InputAdornment,
    alpha,
} from '@mui/material';
import {
    Close as CloseIcon,
    Save as SaveIcon,
    PersonAdd as PersonAddIcon,
    Edit as EditIcon,
    Person as PersonIcon,
    FamilyRestroom as FamilyIcon,
} from '@mui/icons-material';
import type { Docente, CreateDocenteDto } from '../../types/docente';

interface FormData {
    nombre: string;
    apellidos: string;
}

const initialFormData: FormData = {
    nombre: '',
    apellidos: '',
};

interface DocenteFormDialogProps {
    open: boolean;
    docente: Docente | null;
    onClose: () => void;
    onSubmit: (data: CreateDocenteDto) => Promise<void>;
}

export const DocenteFormDialog = ({
    open,
    docente,
    onClose,
    onSubmit,
}: DocenteFormDialogProps) => {
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [formErrors, setFormErrors] = useState<Partial<FormData>>({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (docente) {
            setFormData({
                nombre: docente.nombre,
                apellidos: docente.apellidos,
            });
        } else {
            setFormData(initialFormData);
        }
        setFormErrors({});
    }, [docente, open]);

    const validateForm = (): boolean => {
        const errors: Partial<FormData> = {};

        if (!formData.nombre.trim()) {
            errors.nombre = 'El nombre es requerido';
        }
        if (!formData.apellidos.trim()) {
            errors.apellidos = 'Los apellidos son requeridos';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            setSubmitting(true);
            const docenteData: CreateDocenteDto = {
                nombre: formData.nombre.trim(),
                apellidos: formData.apellidos.trim(),
            };

            await onSubmit(docenteData);
            handleClose();
        } catch (error) {
            console.error('Error in form submit:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleClose = () => {
        setFormData(initialFormData);
        setFormErrors({});
        onClose();
    };

    const handleInputChange = (field: keyof FormData, value: string) => {
        setFormData({ ...formData, [field]: value });
        if (formErrors[field]) {
            setFormErrors({ ...formErrors, [field]: undefined });
        }
    };

    return (
        <Dialog 
            open={open} 
            onClose={submitting ? undefined : handleClose} 
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
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.05),
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    {docente ? (
                        <EditIcon color="primary" sx={{ fontSize: 28 }} />
                    ) : (
                        <PersonAddIcon color="primary" sx={{ fontSize: 28 }} />
                    )}
                    <Box>
                        <Typography variant="h6" component="div" fontWeight={600}>
                            {docente ? 'Editar Docente' : 'Nuevo Docente'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {docente 
                                ? 'Modifica la información del docente' 
                                : 'Completa el formulario para registrar un nuevo docente'}
                        </Typography>
                    </Box>
                </Box>
                <IconButton
                    onClick={handleClose}
                    disabled={submitting}
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
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    <TextField
                        label="Nombre"
                        value={formData.nombre}
                        onChange={(e) => handleInputChange('nombre', e.target.value)}
                        error={!!formErrors.nombre}
                        helperText={formErrors.nombre || 'Ingresa el nombre del docente'}
                        fullWidth
                        required
                        disabled={submitting}
                        autoFocus
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <PersonIcon color={formErrors.nombre ? 'error' : 'action'} />
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '&:hover fieldset': {
                                    borderColor: 'primary.main',
                                },
                            }
                        }}
                    />
                    
                    <TextField
                        label="Apellidos"
                        value={formData.apellidos}
                        onChange={(e) => handleInputChange('apellidos', e.target.value)}
                        error={!!formErrors.apellidos}
                        helperText={formErrors.apellidos || 'Apellido(s) del docente'}
                        fullWidth
                        required
                        disabled={submitting}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <FamilyIcon color={formErrors.apellidos ? 'error' : 'action'} />
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '&:hover fieldset': {
                                    borderColor: 'primary.main',
                                },
                            }
                        }}
                    />
                </Box>
            </DialogContent>

            <Divider />

            <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
                <Button 
                    onClick={handleClose} 
                    disabled={submitting}
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
                    onClick={handleSubmit} 
                    variant="contained"
                    disabled={submitting}
                    startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : <SaveIcon />}
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
                    {submitting 
                        ? 'Guardando...' 
                        : docente ? 'Guardar Cambios' : 'Crear Docente'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DocenteFormDialog;
