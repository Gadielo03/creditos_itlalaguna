import React from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    Container,
    Avatar,
    useTheme,
    Menu,
    MenuItem,
    ListItemIcon,
    IconButton,
} from '@mui/material';
import type { SvgIconProps } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SchoolIcon from '@mui/icons-material/School';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import EventNoteIcon from '@mui/icons-material/EventNote';
import AssessmentIcon from '@mui/icons-material/Assessment';
import LogoutIcon from '@mui/icons-material/Logout';
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
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => setAnchorEl(null);

    const handleLogout = () => {
        handleClose();
        AuthService.logout();
    };

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
                        <IconButton
                            onClick={handleAvatarClick}
                            size="small"
                            aria-controls={open ? 'account-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                        >
                            <Avatar
                                sx={{
                                    bgcolor: theme.palette.primary.main + '1A',
                                    color: theme.palette.primary.main,
                                    width: 36,
                                    height: 36,
                                }}
                            >
                                {AuthService.getUser()?.nombre?.[0]?.toUpperCase() || 'U'}
                            </Avatar>
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            id="account-menu"
                            open={open}
                            onClose={handleClose}
                            onClick={handleClose}
                            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                        >
                            <MenuItem onClick={handleLogout}>
                                <ListItemIcon>
                                    <LogoutIcon fontSize="small" />
                                </ListItemIcon>
                                Cerrar sesión
                            </MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}