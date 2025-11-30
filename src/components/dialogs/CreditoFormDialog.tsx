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
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    FormHelperText,
} from '@mui/material';
import {
    Close as CloseIcon,
    Save as SaveIcon,
    Add as AddIcon,
    Edit as EditIcon,
    Person as PersonIcon,
    Event as EventIcon,
    School as SchoolIcon,
} from '@mui/icons-material';
import type { Credito, CreateCreditoDto } from '../../types/credito';
import type { Alumno } from '../../types/alumno';
import type { Actividad } from '../../types/actividad';
import AlumnosService from '../../services/alumnosService';
import ActividadesService from '../../services/actividadesService';

interface FormData {
    alu_id: string;
    act_id: number | '';
    cred_fecha: string;
}

const initialFormData: FormData = {
    alu_id: '',
    act_id: '',
    cred_fecha: new Date().toISOString().split('T')[0],
};

interface CreditoFormDialogProps {
    open: boolean;
    credito: Credito | null;
    onClose: () => void;
    onSubmit: (data: CreateCreditoDto) => Promise<void>;
}

export const CreditoFormDialog = ({
    open,
    credito,
    onClose,
    onSubmit,
}: CreditoFormDialogProps) => {
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [formErrors, setFormErrors] = useState<Partial<Record<keyof FormData, string>>>({});
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(false);
    const [alumnos, setAlumnos] = useState<Alumno[]>([]);
    const [actividades, setActividades] = useState<Actividad[]>([]);

    useEffect(() => {
        if (open) {
            loadData();
        }
    }, [open]);

    useEffect(() => {
        if (credito) {
            setFormData({
                alu_id: String(credito.alumno.id),
                act_id: credito.actividad.act_id,
                cred_fecha: credito.cred_fecha.split('T')[0],
            });
        } else {
            setFormData(initialFormData);
        }
        setFormErrors({});
    }, [credito, open]);

    const loadData = async () => {
        try {
            setLoading(true);
            const [alumnosData, actividadesData] = await Promise.all([
                AlumnosService.getAll(),
                ActividadesService.getAll(),
            ]);
            setAlumnos(alumnosData);
            setActividades(actividadesData);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const validateForm = (): boolean => {
        const errors: Partial<Record<keyof FormData, string>> = {};

        if (!formData.alu_id) {
            errors.alu_id = 'El alumno es requerido';
        }
        if (!formData.act_id) {
            errors.act_id = 'La actividad es requerida';
        }
        if (!formData.cred_fecha) {
            errors.cred_fecha = 'La fecha es requerida';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            setSubmitting(true);
            const creditoData: CreateCreditoDto = {
                alu_id: formData.alu_id,
                act_id: Number(formData.act_id),
                cred_fecha: formData.cred_fecha,
            };

            await onSubmit(creditoData);
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

    const handleInputChange = (field: keyof FormData, value: string | number) => {
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
                    {credito ? (
                        <EditIcon color="primary" sx={{ fontSize: 28 }} />
                    ) : (
                        <AddIcon color="primary" sx={{ fontSize: 28 }} />
                    )}
                    <Box>
                        <Typography variant="h6" component="div" fontWeight={600}>
                            {credito ? 'Editar Crédito' : 'Nuevo Crédito'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {credito 
                                ? 'Modifica la información del crédito' 
                                : 'Completa el formulario para registrar un nuevo crédito'}
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
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                        <FormControl 
                            fullWidth 
                            required 
                            error={!!formErrors.alu_id}
                            disabled={submitting}
                        >
                            <InputLabel id="alumno-label">Alumno</InputLabel>
                            <Select
                                labelId="alumno-label"
                                value={formData.alu_id}
                                onChange={(e) => handleInputChange('alu_id', e.target.value)}
                                label="Alumno"
                                startAdornment={
                                    <InputAdornment position="start">
                                        <PersonIcon color={formErrors.alu_id ? 'error' : 'action'} />
                                    </InputAdornment>
                                }
                            >
                                <MenuItem value="">
                                    <em>Selecciona un alumno</em>
                                </MenuItem>
                                {alumnos.map((alumno) => (
                                    <MenuItem key={alumno.id} value={String(alumno.id)}>
                                        {alumno.nctrl} - {alumno.nombres} {alumno.apellidos}
                                    </MenuItem>
                                ))}
                            </Select>
                            {formErrors.alu_id && (
                                <FormHelperText>{formErrors.alu_id}</FormHelperText>
                            )}
                            {!formErrors.alu_id && (
                                <FormHelperText>Selecciona el alumno al que se asignará el crédito</FormHelperText>
                            )}
                        </FormControl>

                        <FormControl 
                            fullWidth 
                            required 
                            error={!!formErrors.act_id}
                            disabled={submitting}
                        >
                            <InputLabel id="actividad-label">Actividad</InputLabel>
                            <Select
                                labelId="actividad-label"
                                value={formData.act_id}
                                onChange={(e) => handleInputChange('act_id', e.target.value)}
                                label="Actividad"
                                startAdornment={
                                    <InputAdornment position="start">
                                        <SchoolIcon color={formErrors.act_id ? 'error' : 'action'} />
                                    </InputAdornment>
                                }
                            >
                                <MenuItem value="">
                                    <em>Selecciona una actividad</em>
                                </MenuItem>
                                {actividades.map((actividad) => (
                                    <MenuItem key={actividad.act_id} value={actividad.act_id}>
                                        {actividad.act_nombre} ({actividad.act_creditos} crédito{actividad.act_creditos !== 1 ? 's' : ''})
                                    </MenuItem>
                                ))}
                            </Select>
                            {formErrors.act_id && (
                                <FormHelperText>{formErrors.act_id}</FormHelperText>
                            )}
                            {!formErrors.act_id && (
                                <FormHelperText>Selecciona la actividad que genera el crédito</FormHelperText>
                            )}
                        </FormControl>
                    
                        <TextField
                            label="Fecha"
                            type="date"
                            value={formData.cred_fecha}
                            onChange={(e) => handleInputChange('cred_fecha', e.target.value)}
                            error={!!formErrors.cred_fecha}
                            helperText={formErrors.cred_fecha || 'Fecha de asignación del crédito'}
                            fullWidth
                            required
                            disabled={submitting}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <EventIcon color={formErrors.cred_fecha ? 'error' : 'action'} />
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
                )}
            </DialogContent>

            <Divider />

            <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
                <Button 
                    onClick={handleClose} 
                    disabled={submitting || loading}
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
                    disabled={submitting || loading}
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
                        : credito ? 'Guardar Cambios' : 'Crear Crédito'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CreditoFormDialog;
