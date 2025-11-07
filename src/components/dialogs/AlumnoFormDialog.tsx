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
    Paper,
    alpha,
} from '@mui/material';
import {
    Close as CloseIcon,
    Save as SaveIcon,
    PersonAdd as PersonAddIcon,
    Edit as EditIcon,
    Badge as BadgeIcon,
    Person as PersonIcon,
    FamilyRestroom as FamilyIcon,
} from '@mui/icons-material';
import type { Alumno, CreateAlumnoDto } from '../../types/alumno';

interface FormData {
    nctrl: string;
    nombres: string;
    apellidos: string;
}

const initialFormData: FormData = {
    nctrl: '',
    nombres: '',
    apellidos: '',
};

interface AlumnoFormDialogProps {
    open: boolean;
    alumno: Alumno | null;
    onClose: () => void;
    onSubmit: (data: CreateAlumnoDto) => Promise<void>;
}

export const AlumnoFormDialog = ({
    open,
    alumno,
    onClose,
    onSubmit,
}: AlumnoFormDialogProps) => {
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [formErrors, setFormErrors] = useState<Partial<FormData>>({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (alumno) {
            setFormData({
                nctrl: alumno.nctrl,
                nombres: alumno.nombres,
                apellidos: alumno.apellidos,
            });
        } else {
            setFormData(initialFormData);
        }
        setFormErrors({});
    }, [alumno, open]);

    const validateForm = (): boolean => {
        const errors: Partial<FormData> = {};

        if (!formData.nctrl.trim()) {
            errors.nctrl = 'El número de control es requerido';
        }
        if (!formData.nombres.trim()) {
            errors.nombres = 'Los nombres son requeridos';
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
            const alumnoData: CreateAlumnoDto = {
                nctrl: formData.nctrl.trim(),
                nombres: formData.nombres.trim(),
                apellidos: formData.apellidos.trim(),
            };

            await onSubmit(alumnoData);
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
                    {alumno ? (
                        <EditIcon color="primary" sx={{ fontSize: 28 }} />
                    ) : (
                        <PersonAddIcon color="primary" sx={{ fontSize: 28 }} />
                    )}
                    <Box>
                        <Typography variant="h6" component="div" fontWeight={600}>
                            {alumno ? 'Editar Alumno' : 'Nuevo Alumno'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {alumno 
                                ? 'Modifica la información del alumno' 
                                : 'Completa el formulario para registrar un nuevo alumno'}
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
                        label="Número de Control"
                        value={formData.nctrl}
                        onChange={(e) => handleInputChange('nctrl', e.target.value)}
                        error={!!formErrors.nctrl}
                        helperText={formErrors.nctrl || 'Ingresa el número de control del alumno'}
                        fullWidth
                        required
                        disabled={submitting}
                        autoFocus
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <BadgeIcon color={formErrors.nctrl ? 'error' : 'action'} />
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
                        label="Nombres"
                        value={formData.nombres}
                        onChange={(e) => handleInputChange('nombres', e.target.value)}
                        error={!!formErrors.nombres}
                        helperText={formErrors.nombres || 'Nombre(s) del alumno'}
                        fullWidth
                        required
                        disabled={submitting}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <PersonIcon color={formErrors.nombres ? 'error' : 'action'} />
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
                        helperText={formErrors.apellidos || 'Apellido(s) del alumno'}
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
                        : alumno ? 'Guardar Cambios' : 'Crear Alumno'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AlumnoFormDialog;
