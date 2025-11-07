import { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Container,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    IconButton,
    TextField,
    CircularProgress,
    Alert,
    Snackbar,
    Tooltip,
    InputAdornment,
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Search as SearchIcon,
} from '@mui/icons-material';
import AlumnosService from '../../services/alumnosService';
import type { Alumno, CreateAlumnoDto } from '../../types/alumno';
import AlumnoFormDialog from '../../components/dialogs/AlumnoFormDialog';
import DeleteAlumnoDialog from '../../components/dialogs/DeleteAlumnoDialog';

export const Alumnos = () => {
    const [alumnos, setAlumnos] = useState<Alumno[]>([]);
    const [filteredAlumnos, setFilteredAlumnos] = useState<Alumno[]>([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [editingAlumno, setEditingAlumno] = useState<Alumno | null>(null);
    const [deletingAlumno, setDeletingAlumno] = useState<Alumno | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [snackbar, setSnackbar] = useState<{
        open: boolean;
        message: string;
        severity: 'success' | 'error' | 'info';
    }>({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        loadAlumnos();
    }, []);

    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredAlumnos(alumnos);
        } else {
            const query = searchQuery.toLowerCase();
            const filtered = alumnos.filter(
                (alumno) =>
                    alumno.nctrl.toLowerCase().includes(query) ||
                    alumno.nombres.toLowerCase().includes(query) ||
                    alumno.apellidos.toLowerCase().includes(query)
            );
            setFilteredAlumnos(filtered);
        }
    }, [searchQuery, alumnos]);

    const loadAlumnos = async () => {
        try {
            setLoading(true);
            const data = await AlumnosService.getAll();
            setAlumnos(data);
        } catch (error) {
            showSnackbar('Error al cargar los alumnos', 'error');
            console.error('Error loading alumnos:', error);
        } finally {
            setLoading(false);
        }
    };

    const showSnackbar = (message: string, severity: 'success' | 'error' | 'info') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const handleOpenDialog = (alumno?: Alumno) => {
        setEditingAlumno(alumno || null);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingAlumno(null);
    };

    const handleSubmitAlumno = async (alumnoData: CreateAlumnoDto) => {
        try {
            if (editingAlumno) {
                await AlumnosService.update(editingAlumno.id, alumnoData);
                showSnackbar('Alumno actualizado exitosamente', 'success');
            } else {
                await AlumnosService.create(alumnoData);
                showSnackbar('Alumno creado exitosamente', 'success');
            }
            loadAlumnos();
        } catch (error: any) {
            const message = error.response?.data?.message || 'Error al guardar el alumno';
            showSnackbar(message, 'error');
            throw error;
        }
    };

    const handleOpenDeleteDialog = (alumno: Alumno) => {
        setDeletingAlumno(alumno);
        setOpenDeleteDialog(true);
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
        setDeletingAlumno(null);
    };

    const handleDeleteAlumno = async () => {
        if (!deletingAlumno) return;

        try {
            await AlumnosService.delete(deletingAlumno.id);
            showSnackbar('Alumno eliminado exitosamente', 'success');
            loadAlumnos();
        } catch (error: any) {
            const message = error.response?.data?.message || 'Error al eliminar el alumno';
            showSnackbar(message, 'error');
            throw error;
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Gestión de Alumnos
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Administra la información de los alumnos del sistema
                </Typography>
            </Box>

            <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
                <TextField
                    placeholder="Buscar por número de control, nombre o apellido..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    size="small"
                    sx={{ flexGrow: 1 }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                >
                    Nuevo Alumno
                </Button>
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <CircularProgress />
                </Box>
            ) : filteredAlumnos.length === 0 ? (
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="body1" color="text.secondary">
                        {searchQuery
                            ? 'No se encontraron alumnos que coincidan con la búsqueda'
                            : 'No hay alumnos registrados. Crea uno nuevo para comenzar.'}
                    </Typography>
                </Paper>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>ID</strong></TableCell>
                                <TableCell><strong>No. Control</strong></TableCell>
                                <TableCell><strong>Nombres</strong></TableCell>
                                <TableCell><strong>Apellidos</strong></TableCell>
                                <TableCell align="right"><strong>Acciones</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredAlumnos.map((alumno) => (
                                <TableRow key={alumno.id} hover>
                                    <TableCell>{alumno.id}</TableCell>
                                    <TableCell>{alumno.nctrl}</TableCell>
                                    <TableCell>{alumno.nombres}</TableCell>
                                    <TableCell>{alumno.apellidos}</TableCell>
                                    <TableCell align="right">
                                        <Tooltip title="Editar">
                                            <IconButton
                                                size="small"
                                                color="primary"
                                                onClick={() => handleOpenDialog(alumno)}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Eliminar">
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => handleOpenDeleteDialog(alumno)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <AlumnoFormDialog
                open={openDialog}
                alumno={editingAlumno}
                onClose={handleCloseDialog}
                onSubmit={handleSubmitAlumno}
            />

            <DeleteAlumnoDialog
                open={openDeleteDialog}
                alumno={deletingAlumno}
                onClose={handleCloseDeleteDialog}
                onConfirm={handleDeleteAlumno}
            />

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default Alumnos;