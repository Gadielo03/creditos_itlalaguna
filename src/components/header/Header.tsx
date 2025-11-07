import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    Container,
    Avatar,
    useTheme,
} from '@mui/material';
import type { SvgIconProps } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SchoolIcon from '@mui/icons-material/School';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import EventNoteIcon from '@mui/icons-material/EventNote';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SettingsIcon from '@mui/icons-material/Settings';
import AuthService from '../../services/authService';

interface NavItem {
    label: string;
    path: string;
    icon: React.ComponentType<SvgIconProps>;
    allowedRoles?: string[];
}

const navigationItems: NavItem[] = [
    {
        label: 'Inicio',
        path: '/',
        icon: HomeIcon,
    },
    {
        label: 'Créditos',
        path: '/creditos',
        icon: PeopleIcon,
        allowedRoles: ['ADMINISTRADOR', 'DOCENTE']
    },
    {
        label: 'Actividades',
        path: '/actividades',
        icon: EventNoteIcon,
        allowedRoles: ['ADMINISTRADOR', 'DOCENTE']
    },
    {
        label: 'Alumnos',
        path: '/alumnos',
        icon: AssessmentIcon,
        allowedRoles: ['ADMINISTRADOR']
    },
    {
        label: 'Configuración',
        path: '/configuracion',
        icon: SettingsIcon,
        allowedRoles: ['ADMINISTRADOR']
    },
    {
        label: 'Docentes',
        path: '/docentes',
        icon: PeopleIcon,
        allowedRoles: ['ADMINISTRADOR']
    },
    {
        label: 'Usuarios',
        path: '/usuarios',
        icon: PeopleIcon,
        allowedRoles: ['ADMINISTRADOR']
    }
];

export const Header = () => {
    const theme = useTheme();
    const navigate = useNavigate();

    return (
        <AppBar position="sticky" color="default" elevation={1}>
            <Container maxWidth="xl">
                <Toolbar sx={{ py: 1, px: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 0 }}>
                        <Box
                            sx={{
                                width: 40,
                                height: 40,
                                bgcolor: theme.palette.primary.main,
                                borderRadius: 2,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <SchoolIcon sx={{ width: 24, height: 24, color: 'white' }} />
                        </Box>
                        <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 500, lineHeight: 1.2 }}>
                                Sistema de Gestión Académica
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Control de actividades y créditos
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', gap: 1 }}>
                        {navigationItems
                            .filter(item => {
                                if (!item.allowedRoles) return true;
                                return AuthService.hasRole(item.allowedRoles);
                            })
                            .map((item) => {
                                const Icon = item.icon;
                                return (
                                    <Button
                                        key={item.path}
                                        startIcon={<Icon sx={{ fontSize: 20 }} />}
                                        onClick={() => navigate(item.path)}
                                        color="inherit"
                                        sx={{ borderRadius: 2 }}
                                    >
                                        {item.label}
                                    </Button>
                                );
                            })}
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 0 }}>
                        <Box sx={{ textAlign: 'right' }}>
                            <Typography variant="body2">{AuthService.getUser()?.nombre || 'Usuario'}</Typography>
                            <Typography variant="caption" color="text.secondary">
                                {AuthService.getUser()?.roles?.[0] || 'Sin rol'}
                            </Typography>
                        </Box>
                        <Avatar
                            sx={{
                                bgcolor: theme.palette.primary.main + '1A',
                                color: theme.palette.primary.main
                            }}
                        >
                            {AuthService.getUser()?.nombre?.[0]?.toUpperCase() || 'U'}</Avatar>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}