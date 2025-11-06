import { Alert, Box, Button, Card, CardContent, Snackbar, Stack, TextField, Typography } from "@mui/material"
import loginBackground from '../../assets/login-background.png'
import { useState } from "react"
import { login } from "../../services/loginService"
import { useNavigate, useLocation } from "react-router-dom"

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [severity, setSeverity] = useState<'success' | 'error' | 'warning' | 'info'>('success');
    const [formData, setFormData] = useState({
        usuario: '',
        contraseña: ''
    })

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        try {
            const response = await login(formData.usuario, formData.contraseña)
            if (response.success) {
                setSnackbarMessage('Inicio de sesión exitoso');
                setSeverity('success');
                setOpenSnackbar(true);
                setTimeout(() => {
                    const from = location.state?.from?.pathname || "/";
                    navigate(from, { replace: true });
                }, 1000);
            } else {
                setSnackbarMessage('Usuario o contraseña incorrectos');
                setSeverity('error');
                setOpenSnackbar(true);
            }
        } catch (error) {
            setSnackbarMessage('Error en el inicio de sesión');
            setSeverity('error');
            setOpenSnackbar(true);
            console.error('Login failed:', error)
        }
    }

    return (
        <>
            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
                <Alert
                    onClose={() => setOpenSnackbar(false)}
                    severity={severity}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
            <Box
                sx={{
                    position: 'relative',
                    height: '100vh',
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    overflow: 'hidden'
                }}
            >
                <img
                    src={loginBackground}
                    alt="Background"
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        zIndex: -1,
                        filter: 'brightness(0.5) contrast(1.1)',
                    }}
                />
                <Card sx={{ borderRadius: 5, boxShadow: 6 }}>
                    <CardContent sx={{ p: 6 }}>
                        <form id="login-form" onSubmit={handleSubmit}>
                            <Stack spacing={2} textAlign="center" sx={{ mb: 2 }}>
                                <Typography variant="h5" fontWeight={1000}>Iniciar sesión</Typography>
                                <Typography variant='subtitle1'>Ingresa tus credenciales Para acceder a tu cuenta</Typography>
                                <Stack spacing={1} sx={{ width: '100%', alignItems: 'flex-start' }}>
                                    <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 900 }}>
                                        Usuario
                                    </Typography>
                                    <TextField
                                        id="outlined-size-small"
                                        placeholder="Ejemplo: 221305....."
                                        size="small"
                                        sx={{ width: '100%' }}
                                        required
                                        onChange={(e) => setFormData(p => ({ ...p, usuario: e.target.value }))}
                                    />
                                </Stack>
                                <Stack spacing={1} sx={{ width: '100%', alignItems: 'flex-start' }}>
                                    <Stack direction='row' sx={{ width: '100%' }} justifyContent={'space-between'} alignItems='center'>
                                        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 900 }}>
                                            Contraseña
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 900, cursor: 'pointer' }}>
                                            ¿Olvidaste tu contraseña?
                                        </Typography>
                                    </Stack>
                                    <TextField
                                        type="password"
                                        id="outlined-password"
                                        placeholder="******"
                                        size="small"
                                        sx={{ width: '100%' }}
                                        required
                                        onChange={(e) => setFormData(p => ({ ...p, contraseña: e.target.value }))}
                                    />
                                </Stack>
                                <Button variant='contained' type="submit" form="login-form">Iniciar Sesion</Button>
                            </Stack>
                        </form>
                    </CardContent>
                </Card>
            </Box>
        </>
    )
}

export default Login