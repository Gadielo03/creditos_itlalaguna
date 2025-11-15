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
    Alert,
} from '@mui/material';
import {
    Close as CloseIcon,
    Save as SaveIcon,
    Lock as LockIcon,
    Visibility,
    VisibilityOff,
} from '@mui/icons-material';
import type { UpdateUsuarioContraseñaDto } from '../../types/usuario';

interface PasswordFormData {
    contraseñaActual: string;
    nuevaContraseña: string;
    confirmarContraseña: string;
}

const initialFormData: PasswordFormData = {
    contraseñaActual: '',
    nuevaContraseña: '',
    confirmarContraseña: '',
};

interface ChangePasswordDialogProps {
    open: boolean;
    usuarioId: number | null;
    usuarioNombre: string;
    onClose: () => void;
    onSubmit: (data: UpdateUsuarioContraseñaDto) => Promise<void>;
}

export const ChangePasswordDialog = ({
    open,
    usuarioId,
    usuarioNombre,
    onClose,
    onSubmit,
}: ChangePasswordDialogProps) => {
    const [formData, setFormData] = useState<PasswordFormData>(initialFormData);
    const [loading, setLoading] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState<Partial<PasswordFormData>>({});
    const [generalError, setGeneralError] = useState<string>('');

    useEffect(() => {
        if (open) {
            setFormData(initialFormData);
            setErrors({});
            setGeneralError('');
        }
    }, [open]);

    const handleChange = (field: keyof PasswordFormData) => (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const newValue = e.target.value;
        const updatedFormData = {
            ...formData,
            [field]: newValue,
        };
        
        setFormData(updatedFormData);
        
        const newErrors: Partial<PasswordFormData> = { ...errors };
        
        if (field === 'contraseñaActual') {
            if (!newValue.trim()) {
                newErrors.contraseñaActual = 'La contraseña actual es requerida';
            } else {
                delete newErrors.contraseñaActual;
                if (updatedFormData.nuevaContraseña && newValue === updatedFormData.nuevaContraseña) {
                    newErrors.nuevaContraseña = 'La nueva contraseña debe ser diferente a la actual';
                } else if (newErrors.nuevaContraseña === 'La nueva contraseña debe ser diferente a la actual') {
                    delete newErrors.nuevaContraseña;
                }
            }
        }
        
        if (field === 'nuevaContraseña') {
            if (!newValue.trim()) {
                newErrors.nuevaContraseña = 'La nueva contraseña es requerida';
            } else if (newValue.length < 6) {
                newErrors.nuevaContraseña = 'La contraseña debe tener al menos 6 caracteres';
            } else if (updatedFormData.contraseñaActual && newValue === updatedFormData.contraseñaActual) {
                newErrors.nuevaContraseña = 'La nueva contraseña debe ser diferente a la actual';
            } else {
                delete newErrors.nuevaContraseña;
            }
            
            if (updatedFormData.confirmarContraseña) {
                if (newValue !== updatedFormData.confirmarContraseña) {
                    newErrors.confirmarContraseña = 'Las contraseñas no coinciden';
                } else {
                    delete newErrors.confirmarContraseña;
                }
            }
        }
        
        if (field === 'confirmarContraseña') {
            if (!newValue.trim()) {
                newErrors.confirmarContraseña = 'Debe confirmar la nueva contraseña';
            } else if (newValue !== updatedFormData.nuevaContraseña) {
                newErrors.confirmarContraseña = 'Las contraseñas no coinciden';
            } else {
                delete newErrors.confirmarContraseña;
            }
        }
        
        setErrors(newErrors);
        
        if (generalError) {
            setGeneralError('');
        }
    };

    const isFormValid = (): boolean => {
        if (!formData.contraseñaActual.trim() || 
            !formData.nuevaContraseña.trim() || 
            !formData.confirmarContraseña.trim()) {
            return false;
        }

        if (formData.nuevaContraseña.length < 6) {
            return false;
        }

        if (formData.nuevaContraseña !== formData.confirmarContraseña) {
            return false;
        }

        if (formData.contraseñaActual === formData.nuevaContraseña) {
            return false;
        }

        return true;
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<PasswordFormData> = {};

        if (!formData.contraseñaActual.trim()) {
            newErrors.contraseñaActual = 'La contraseña actual es requerida';
        }

        if (!formData.nuevaContraseña.trim()) {
            newErrors.nuevaContraseña = 'La nueva contraseña es requerida';
        } else if (formData.nuevaContraseña.length < 6) {
            newErrors.nuevaContraseña = 'La contraseña debe tener al menos 6 caracteres';
        }

        if (!formData.confirmarContraseña.trim()) {
            newErrors.confirmarContraseña = 'Debe confirmar la nueva contraseña';
        } else if (formData.nuevaContraseña !== formData.confirmarContraseña) {
            newErrors.confirmarContraseña = 'Las contraseñas no coinciden';
        }

        if (formData.contraseñaActual === formData.nuevaContraseña) {
            newErrors.nuevaContraseña = 'La nueva contraseña debe ser diferente a la actual';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm() || !usuarioId) return;

        try {
            setLoading(true);
            setGeneralError('');

            const passwordData: UpdateUsuarioContraseñaDto = {
                id: usuarioId.toString(),
                contraseña: formData.contraseñaActual,
                nuevaContraseña: formData.nuevaContraseña,
            };

            await onSubmit(passwordData);
            onClose();
        } catch (error: any) {
            console.error('Error al cambiar contraseña:', error);
            setGeneralError(
                error.response?.data?.message ||
                error.message ||
                'Error al cambiar la contraseña. Por favor, verifica que la contraseña actual sea correcta.'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !loading && isFormValid()) {
            handleSubmit();
        }
    };

    return (
        <Dialog
            open={open}
            onClose={loading ? undefined : onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    boxShadow: (theme) => theme.shadows[10],
                },
            }}
        >
            <DialogTitle
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    pb: 1,
                    background: (theme) =>
                        `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(
                            theme.palette.primary.light,
                            0.05
                        )} 100%)`,
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 40,
                            height: 40,
                            borderRadius: '10px',
                            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                            color: 'primary.main',
                        }}
                    >
                        <LockIcon />
                    </Box>
                    <Box>
                        <Typography variant="h6" component="div" fontWeight={600}>
                            Cambiar Contraseña
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Usuario: {usuarioNombre}
                        </Typography>
                    </Box>
                </Box>
                <IconButton
                    onClick={onClose}
                    disabled={loading}
                    size="small"
                    sx={{
                        color: 'text.secondary',
                        '&:hover': {
                            bgcolor: (theme) => alpha(theme.palette.error.main, 0.1),
                            color: 'error.main',
                        },
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <Divider />

            <DialogContent sx={{ pt: 3, pb: 2 }}>
                {generalError && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {generalError}
                    </Alert>
                )}

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    <TextField
                        label="Contraseña Actual"
                        type={showCurrentPassword ? 'text' : 'password'}
                        value={formData.contraseñaActual}
                        onChange={handleChange('contraseñaActual')}
                        onKeyPress={handleKeyPress}
                        error={!!errors.contraseñaActual}
                        helperText={errors.contraseñaActual}
                        disabled={loading}
                        fullWidth
                        autoFocus
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <LockIcon fontSize="small" color="action" />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                        edge="end"
                                        size="small"
                                    >
                                        {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    <Divider>
                        <Typography variant="caption" color="text.secondary">
                            Nueva Contraseña
                        </Typography>
                    </Divider>

                    <TextField
                        label="Nueva Contraseña"
                        type={showNewPassword ? 'text' : 'password'}
                        value={formData.nuevaContraseña}
                        onChange={handleChange('nuevaContraseña')}
                        onKeyPress={handleKeyPress}
                        error={!!errors.nuevaContraseña}
                        helperText={errors.nuevaContraseña || 'Mínimo 6 caracteres'}
                        disabled={loading}
                        fullWidth
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <LockIcon fontSize="small" color="action" />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        edge="end"
                                        size="small"
                                    >
                                        {showNewPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    <TextField
                        label="Confirmar Nueva Contraseña"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.confirmarContraseña}
                        onChange={handleChange('confirmarContraseña')}
                        onKeyPress={handleKeyPress}
                        error={!!errors.confirmarContraseña}
                        helperText={errors.confirmarContraseña}
                        disabled={loading}
                        fullWidth
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <LockIcon fontSize="small" color="action" />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        edge="end"
                                        size="small"
                                    >
                                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>
            </DialogContent>

            <Divider />

            <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
                <Button
                    onClick={onClose}
                    disabled={loading}
                    variant="outlined"
                    color="inherit"
                    sx={{ minWidth: 100 }}
                >
                    Cancelar
                </Button>
                <Button
                    onClick={handleSubmit}
                    disabled={loading || !isFormValid()}
                    variant="contained"
                    startIcon={loading ? <CircularProgress size={18} /> : <SaveIcon />}
                    sx={{ minWidth: 150 }}
                >
                    {loading ? 'Guardando...' : 'Cambiar Contraseña'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ChangePasswordDialog;
