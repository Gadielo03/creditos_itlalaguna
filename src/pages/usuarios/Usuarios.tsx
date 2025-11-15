import { useEffect, useState } from "react";
import type { Usuario, CreateUsuarioDto, UpdateUsuarioContraseñaDto } from "../../types/usuario";
import UsuariosService from "../../services/usuariosService";
import { Box, Container, Stack } from "@mui/system";
import { Button, Card, CardContent, Divider, InputAdornment, List, ListItemButton, TextField, Typography, Avatar, Chip, IconButton, MenuItem, Select, FormControl, InputLabel, ListItem, ListItemText, Snackbar, Alert, Tooltip } from "@mui/material";
import { Add, Search, Save, Delete, Person, Lock, Badge, Close } from "@mui/icons-material";
import { ChangePasswordDialog } from "../../components/dialogs/ChangePasswordDialog";
import { ConfirmationDialog } from "../../components/dialogs/ConfirmationDialog";
import AuthService from "../../services/authService";

export const Usuarios = () => {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [filteredUsuarios, setFilteredUsuarios] = useState<Usuario[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null);
    const [loading, setLoading] = useState(false);
    const [editedRoles, setEditedRoles] = useState<string[]>([]);
    const [newRole, setNewRole] = useState('');
    const [availableRoles, setAvailableRoles] = useState<string[]>([]);
    const [isCreatingNew, setIsCreatingNew] = useState(false);
    const [formData, setFormData] = useState<CreateUsuarioDto>({
        nombre: '',
        contraseña: '',
        roles: []
    });
    const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [severity, setSeverity] = useState<'success' | 'error' | 'warning' | 'info'>('success');

    // Verificar si el usuario seleccionado es el usuario actual
    const isCurrentUser = () => {
        const currentUser = AuthService.getUser();
        return selectedUsuario && currentUser && selectedUsuario.id === currentUser.id;
    };

    useEffect(() => {
        if (selectedUsuario) {
            setEditedRoles(selectedUsuario.roles || []);
            setFormData({
                nombre: selectedUsuario.nombre,
                contraseña: '',
                roles: selectedUsuario.roles || []
            });
            setNewRole(''); // Limpiar el rol seleccionado
        } else {
            setEditedRoles([]);
            setFormData({
                nombre: '',
                contraseña: '',
                roles: []
            });
            setNewRole(''); // Limpiar el rol seleccionado
        }
    }, [selectedUsuario]);

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleAddRole = () => {
        if (newRole && !editedRoles.includes(newRole)) {
            const updatedRoles = [...editedRoles, newRole];
            setEditedRoles(updatedRoles);
            setFormData(prev => ({
                ...prev,
                roles: updatedRoles
            }));
            setNewRole('');
        }
    };

    const handleRemoveRole = (roleToRemove: string) => {
        const updatedRoles = editedRoles.filter(role => role !== roleToRemove);
        setEditedRoles(updatedRoles);
        setFormData(prev => ({
            ...prev,
            roles: updatedRoles
        }));
    };

    const handleCreateUsuario = async () => {
        try {
            if (!formData.nombre.trim()) {
                setSnackbarMessage('El nombre de usuario es requerido');
                setSeverity('warning');
                setOpenSnackbar(true);
                return;
            }

            if (!formData.contraseña || formData.contraseña.length < 6) {
                setSnackbarMessage('La contraseña debe tener al menos 6 caracteres');
                setSeverity('warning');
                setOpenSnackbar(true);
                return;
            }

            if (formData.roles.length === 0) {
                setSnackbarMessage('Debe asignar al menos un rol al usuario');
                setSeverity('warning');
                setOpenSnackbar(true);
                return;
            }

            setLoading(true);

            await UsuariosService.create(formData);
            
            setSnackbarMessage('Usuario creado exitosamente');
            setSeverity('success');
            setOpenSnackbar(true);
            
            await fetchUsuarios();
            
            setIsCreatingNew(false);
            setFormData({
                nombre: '',
                contraseña: '',
                roles: []
            });
            setEditedRoles([]);
        } catch (error: any) {
            console.error('Error al crear usuario:', error);
            setSnackbarMessage(error.response?.data?.message || 'Error al crear usuario');
            setSeverity('error');
            setOpenSnackbar(true);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateUsuario = async () => {
        try {
            if (!selectedUsuario) {
                setSnackbarMessage('No hay usuario seleccionado');
                setSeverity('warning');
                setOpenSnackbar(true);
                return;
            }

            if (!formData.nombre.trim()) {
                setSnackbarMessage('El nombre de usuario es requerido');
                setSeverity('warning');
                setOpenSnackbar(true);
                return;
            }

            if (formData.roles.length === 0) {
                setSnackbarMessage('Debe asignar al menos un rol al usuario');
                setSeverity('warning');
                setOpenSnackbar(true);
                return;
            }

            setLoading(true);

            const updateData: Partial<CreateUsuarioDto> = {
                nombre: formData.nombre,
                roles: formData.roles
            };

            await UsuariosService.update(selectedUsuario.id, updateData);
            
            setSnackbarMessage('Usuario actualizado exitosamente');
            setSeverity('success');
            setOpenSnackbar(true);
            
            // Recargar lista de usuarios
            await fetchUsuarios();
            
            // Actualizar el usuario seleccionado con los nuevos datos
            const updatedUsuarios = await UsuariosService.getAll();
            const updatedUsuario = updatedUsuarios.find(u => u.id === selectedUsuario.id);
            if (updatedUsuario) {
                setSelectedUsuario(updatedUsuario);
            }
        } catch (error: any) {
            console.error('Error al actualizar usuario:', error);
            setSnackbarMessage(error.response?.data?.message || 'Error al actualizar usuario');
            setSeverity('error');
            setOpenSnackbar(true);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUsuario = async () => {
        try {
            if (!selectedUsuario) {
                setSnackbarMessage('No hay usuario seleccionado');
                setSeverity('warning');
                setOpenSnackbar(true);
                return;
            }

            setLoading(true);

            await UsuariosService.delete(selectedUsuario.id);
            
            setSnackbarMessage('Usuario eliminado exitosamente');
            setSeverity('success');
            setOpenSnackbar(true);
            
            setSelectedUsuario(null);
            setFormData({
                nombre: '',
                contraseña: '',
                roles: []
            });
            setEditedRoles([]);
            
            await fetchUsuarios();
            setOpenConfirmDialog(false);
        } catch (error: any) {
            console.error('Error al eliminar usuario:', error);
            setSnackbarMessage(error.response?.data?.message || 'Error al eliminar usuario');
            setSeverity('error');
            setOpenSnackbar(true);
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async (data: UpdateUsuarioContraseñaDto) => {
        try {
            if (!data.id || !data.contraseña || !data.nuevaContraseña) {
                throw new Error('Datos incompletos para cambiar la contraseña');
            }

            if (data.nuevaContraseña.length < 6) {
                throw new Error('La nueva contraseña debe tener al menos 6 caracteres');
            }

            if (data.contraseña === data.nuevaContraseña) {
                throw new Error('La nueva contraseña debe ser diferente a la actual');
            }

            const usuarioId = parseInt(data.id);
            if (isNaN(usuarioId)) {
                throw new Error('ID de usuario inválido');
            }

            await UsuariosService.changePassword(usuarioId, data.contraseña, data.nuevaContraseña);
            
            setSnackbarMessage('Contraseña cambiada exitosamente');
            setSeverity('success');
            setOpenSnackbar(true);
        } catch (error: any) {
            console.error('Error al cambiar contraseña:', error);
            throw error;
        }
    };

    const fetchUsuarios = async () => {
        try {
            setLoading(true);
            const response = await UsuariosService.getAll();
            setUsuarios(response);
        } catch (error) {
            console.log("Error fetching usuarios:", error);
        } finally {
            setLoading(false);
        }
    }

    const fetchRoles = async () => {
        try {
            setLoading(true);
            const response = await UsuariosService.getRoles();
            setAvailableRoles(response.map(role => role.rol_nombre));
        } catch (error) {
            console.log("Error fetching roles:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredUsuarios(usuarios);
        } else {
            const query = searchQuery.toLowerCase();
            const filtered = usuarios.filter(
                (usuario) =>
                    usuario.nombre.toLowerCase().includes(query) ||
                    usuario.roles?.some(role => role.toLowerCase().includes(query))
            );
            setFilteredUsuarios(filtered);
        }
    }, [searchQuery, usuarios]);

    useEffect(() => {
        fetchUsuarios();
        fetchRoles();
    }, []);

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
            <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Gestión de Usuarios
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Administra la información de los usuarios del sistema
                    </Typography>
                </Box>

            <Stack direction="row" spacing={3} sx={{ height: 'calc(90vh - 250px)' }}>
                <Card sx={{ width: 350, display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ mb: 2 }}>
                            <TextField
                                placeholder="Buscar por nombre o rol..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                size="small"
                                fullWidth
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Search />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Box>
                        
                        <Button
                            variant="contained"
                            startIcon={<Add />}
                            fullWidth
                            sx={{ mb: 2 }}
                            onClick={() => {
                                setIsCreatingNew(true);
                                setSelectedUsuario(null);
                                setEditedRoles([]);
                                setFormData({
                                    nombre: '',
                                    contraseña: '',
                                    roles: []
                                });
                            }}
                        >
                            Agregar Usuario
                        </Button>
                        
                        <Divider sx={{ mb: 2 }} />

                        <Box sx={{ flex: 1, overflow: 'auto' }}>
                            {filteredUsuarios.length > 0 ? (
                                <List>
                                    {filteredUsuarios.map((usuario) => (
                                        <ListItemButton
                                            key={usuario.id}
                                            selected={selectedUsuario?.id === usuario.id && !isCreatingNew}
                                            onClick={() => {
                                                setSelectedUsuario(usuario);
                                                setIsCreatingNew(false);
                                            }}
                                            sx={{ borderRadius: 1, mb: 1, p: 1.5 }}
                                        >
                                            <Box sx={{ width: '100%' }}>
                                                <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                                                    {usuario.nombre}
                                                </Typography>
                                                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                                    {(usuario.roles && usuario.roles.length > 0) ? (
                                                        usuario.roles.map((role, index) => (
                                                            <Chip
                                                                key={index}
                                                                label={role}
                                                                size="small"
                                                                variant="outlined"
                                                                sx={{ height: 20, fontSize: '0.7rem' }}
                                                            />
                                                        ))
                                                    ) : (
                                                        <Typography variant="caption" color="text.secondary">
                                                            Sin roles
                                                        </Typography>
                                                    )}
                                                </Box>
                                            </Box>
                                        </ListItemButton>
                                    ))}
                                </List>
                            ) : (
                                <Box sx={{ textAlign: 'center', py: 4 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        No se encontraron usuarios
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    </CardContent>
                </Card>

                <Stack spacing={3} sx={{ flex: 1 }}>
                    <Card sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                        <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', p: 0 }}>
                            {isCreatingNew ? (
                                <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                    <Box sx={{ px: 3, pt: 3 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                            <Avatar
                                                sx={{
                                                    width: 64,
                                                    height: 64,
                                                    bgcolor: 'success.main',
                                                    fontSize: '1.5rem'
                                                }}
                                            >
                                                <Add fontSize="large" />
                                            </Avatar>
                                            <Box sx={{ flex: 1 }}>
                                                <Typography variant="h6" gutterBottom sx={{ mb: 0.5 }}>
                                                    Nuevo Usuario
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Completa los campos para crear un nuevo usuario
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Divider />
                                    </Box>

                                    <Box sx={{ flex: 1, overflow: 'auto', px: 3, py: 3 }}>
                                        <Stack spacing={2.5} sx={{ maxWidth: 600, mx: 'auto' }}>
                                            <TextField
                                                label="Nombre de Usuario"
                                                placeholder="Ingrese el nombre de usuario"
                                                size="small"
                                                variant="outlined"
                                                fullWidth
                                                value={formData.nombre}
                                                onChange={(e) => handleChange('nombre', e.target.value)}
                                            />

                                            <TextField
                                                label="Contraseña"
                                                type="password"
                                                placeholder="Ingrese la contraseña"
                                                size="small"
                                                variant="outlined"
                                                fullWidth
                                                value={formData.contraseña}
                                                onChange={(e) => handleChange('contraseña', e.target.value)}
                                            />

                                            <Box>
                                                <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
                                                    Roles del Usuario
                                                </Typography>
                                                <Card variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
                                                    <Box sx={{ mb: 2, display: 'flex', gap: 1, maxWidth: 400 }}>
                                                        <FormControl size="small" sx={{ flex: 1, minWidth: 200 }}>
                                                            <InputLabel>Agregar Rol</InputLabel>
                                                            <Select
                                                                value={newRole}
                                                                label="Agregar Rol"
                                                                onChange={(e) => setNewRole(e.target.value)}
                                                            >
                                                                {availableRoles
                                                                    .filter(role => !editedRoles.includes(role))
                                                                    .map(role => (
                                                                        <MenuItem key={role} value={role}>
                                                                            {role}
                                                                        </MenuItem>
                                                                    ))
                                                                }
                                                            </Select>
                                                        </FormControl>
                                                        <IconButton
                                                            color="primary"
                                                            onClick={handleAddRole}
                                                            disabled={!newRole}
                                                            sx={{ bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' } }}
                                                        >
                                                            <Add />
                                                        </IconButton>
                                                    </Box>

                                                    <Box>
                                                        <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                                                            Roles Asignados ({editedRoles.length})
                                                        </Typography>
                                                        {editedRoles.length > 0 ? (
                                                            <List dense sx={{ bgcolor: 'background.paper', borderRadius: 1 }}>
                                                                {editedRoles.map((role, index) => (
                                                                    <ListItem
                                                                        key={index}
                                                                        secondaryAction={
                                                                            <IconButton
                                                                                edge="end"
                                                                                size="small"
                                                                                onClick={() => handleRemoveRole(role)}
                                                                                color="error"
                                                                            >
                                                                                <Close fontSize="small" />
                                                                            </IconButton>
                                                                        }
                                                                        sx={{
                                                                            borderBottom: index < editedRoles.length - 1 ? 1 : 0,
                                                                            borderColor: 'divider'
                                                                        }}
                                                                    >
                                                                        <ListItemText
                                                                            primary={
                                                                                <Chip
                                                                                    label={role}
                                                                                    size="small"
                                                                                    color="primary"
                                                                                    variant="outlined"
                                                                                    icon={<Badge />}
                                                                                />
                                                                            }
                                                                        />
                                                                    </ListItem>
                                                                ))}
                                                            </List>
                                                        ) : (
                                                            <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center', fontStyle: 'italic' }}>
                                                                Sin roles asignados
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                </Card>
                                            </Box>
                                        </Stack>
                                    </Box>
                                    <Divider />

                                    <Box sx={{ px: 3, pb: 3, pt: 2 }}>
                                        <Stack direction="row" spacing={2} sx={{ maxWidth: 600, mx: 'auto' }}>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                startIcon={<Save />}
                                                onClick={handleCreateUsuario}
                                                disabled={loading}
                                                sx={{ minWidth: 140 }}
                                            >
                                                Crear Usuario
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                color="secondary"
                                                onClick={() => {
                                                    setIsCreatingNew(false);
                                                    setEditedRoles([]);
                                                    setFormData({
                                                        nombre: '',
                                                        contraseña: '',
                                                        roles: []
                                                    });
                                                }}
                                                sx={{ minWidth: 140 }}
                                            >
                                                Cancelar
                                            </Button>
                                        </Stack>
                                    </Box>
                                </Box>
                            ) : selectedUsuario ? (
                                <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                    <Box sx={{ px: 3, pt: 3 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                            <Avatar
                                                sx={{
                                                    width: 64,
                                                    height: 64,
                                                    bgcolor: 'primary.main',
                                                    fontSize: '1.5rem'
                                                }}
                                            >
                                                <Person fontSize="large" />
                                            </Avatar>
                                            <Box sx={{ flex: 1 }}>
                                                <Typography variant="h6" gutterBottom sx={{ mb: 0.5 }}>
                                                    Detalles del Usuario
                                                </Typography>
                                                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                                    {(selectedUsuario.roles && selectedUsuario.roles.length > 0) ? (
                                                        selectedUsuario.roles.map((role, index) => (
                                                            <Chip
                                                                key={index}
                                                                label={role}
                                                                size="small"
                                                                color="primary"
                                                                icon={<Badge />}
                                                            />
                                                        ))
                                                    ) : (
                                                        <Chip
                                                            label="Sin roles"
                                                            size="small"
                                                            variant="outlined"
                                                        />
                                                    )}
                                                </Box>
                                            </Box>
                                        </Box>
                                        <Divider />
                                    </Box>

                                    <Box sx={{ flex: 1, overflow: 'auto', px: 3, py: 3 }}>
                                        <Stack spacing={2.5} sx={{ maxWidth: 600, mx: 'auto' }}>
                                            <Stack direction='row' spacing={2}>
                                                <TextField
                                                    label="Nombre"
                                                    value={formData.nombre}
                                                    onChange={(e) => handleChange('nombre', e.target.value)}
                                                    size="small"
                                                    variant="outlined"
                                                />

                                                <Button
                                                    variant="outlined"
                                                    startIcon={<Lock />}
                                                    onClick={() => setOpenPasswordDialog(true)}
                                                    sx={{ mt: 1, maxWidth: 300, alignSelf: 'flex-start' }}
                                                >
                                                    Cambiar Contraseña
                                                </Button>
                                            </Stack>

                                            <Box>
                                                <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
                                                    Roles del Usuario
                                                </Typography>
                                                <Card variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
                                                    <Box sx={{ mb: 2, display: 'flex', gap: 1, maxWidth: 400 }}>
                                                        <FormControl size="small" sx={{ flex: 1, minWidth: 200 }}>
                                                            <InputLabel>Agregar Rol</InputLabel>
                                                            <Select
                                                                value={newRole}
                                                                label="Agregar Rol"
                                                                onChange={(e) => setNewRole(e.target.value)}
                                                            >
                                                                {availableRoles
                                                                    .filter(role => !editedRoles.includes(role))
                                                                    .map(role => (
                                                                        <MenuItem key={role} value={role}>
                                                                            {role}
                                                                        </MenuItem>
                                                                    ))
                                                                }
                                                            </Select>
                                                        </FormControl>
                                                        <IconButton
                                                            color="primary"
                                                            onClick={handleAddRole}
                                                            disabled={!newRole}
                                                            sx={{ bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' } }}
                                                        >
                                                            <Add />
                                                        </IconButton>
                                                    </Box>

                                                    <Box>
                                                        <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                                                            Roles Asignados ({editedRoles.length})
                                                        </Typography>
                                                        {editedRoles.length > 0 ? (
                                                            <List dense sx={{ bgcolor: 'background.paper', borderRadius: 1 }}>
                                                                {editedRoles.map((role, index) => (
                                                                    <ListItem
                                                                        key={index}
                                                                        secondaryAction={
                                                                            <IconButton
                                                                                edge="end"
                                                                                size="small"
                                                                                onClick={() => handleRemoveRole(role)}
                                                                                color="error"
                                                                            >
                                                                                <Close fontSize="small" />
                                                                            </IconButton>
                                                                        }
                                                                        sx={{
                                                                            borderBottom: index < editedRoles.length - 1 ? 1 : 0,
                                                                            borderColor: 'divider'
                                                                        }}
                                                                    >
                                                                        <ListItemText
                                                                            primary={
                                                                                <Chip
                                                                                    label={role}
                                                                                    size="small"
                                                                                    color="primary"
                                                                                    variant="outlined"
                                                                                    icon={<Badge />}
                                                                                />
                                                                            }
                                                                        />
                                                                    </ListItem>
                                                                ))}
                                                            </List>
                                                        ) : (
                                                            <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center', fontStyle: 'italic' }}>
                                                                Sin roles asignados
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                </Card>
                                            </Box>
                                        </Stack>
                                    </Box>
                                    <Divider />

                                    <Box sx={{ px: 3, pb: 3, pt: 2 }}>
                                        <Stack direction="row" spacing={2} sx={{ maxWidth: 600, mx: 'auto' }}>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                startIcon={<Save />}
                                                onClick={handleUpdateUsuario}
                                                disabled={loading}
                                                sx={{ minWidth: 140 }}
                                            >
                                                Guardar
                                            </Button>
                                            <Tooltip 
                                                title={isCurrentUser() ? "No puedes eliminar tu propio usuario" : ""}
                                                arrow
                                            >
                                                <span>
                                                    <Button
                                                        variant="contained"
                                                        color="error"
                                                        startIcon={<Delete />}
                                                        onClick={() => setOpenConfirmDialog(true)}
                                                        disabled={loading || isCurrentUser()}
                                                        sx={{ minWidth: 140 }}
                                                    >
                                                        Eliminar
                                                    </Button>
                                                </span>
                                            </Tooltip>
                                        </Stack>
                                    </Box>
                                </Box>
                            ) : (
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        height: '100%',
                                        textAlign: 'center',
                                        p: 4
                                    }}
                                >
                                    <Avatar
                                        sx={{
                                            width: 80,
                                            height: 80,
                                            bgcolor: 'grey.200',
                                            color: 'grey.400',
                                            mb: 2
                                        }}
                                    >
                                        <Person fontSize="large" />
                                    </Avatar>
                                    <Typography variant="h6" color="text.secondary" gutterBottom>
                                        Sin usuario seleccionado
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Selecciona un usuario de la lista para ver y editar sus detalles
                                    </Typography>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Stack>
            </Stack>

            <ChangePasswordDialog
                open={openPasswordDialog}
                usuarioId={selectedUsuario?.id || null}
                usuarioNombre={selectedUsuario?.nombre || ''}
                onClose={() => setOpenPasswordDialog(false)}
                onSubmit={handleChangePassword}
            />

            <ConfirmationDialog
                open={openConfirmDialog}
                title="Confirmar eliminación"
                message={`¿Está seguro de que desea eliminar el usuario "${selectedUsuario?.nombre}"? Esta acción no se puede deshacer.`}
                confirmText="Eliminar"
                cancelText="Cancelar"
                confirmColor="error"
                onConfirm={handleDeleteUsuario}
                onCancel={() => setOpenConfirmDialog(false)}
            />
        </Container>
        </>
    )
}

export default Usuarios