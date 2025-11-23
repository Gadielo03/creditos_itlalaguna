import { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Container,
    Typography,
    TextField,
    Alert,
    Snackbar,
    InputAdornment,
} from '@mui/material';
import {
    Add as AddIcon,
    Search as SearchIcon,
} from '@mui/icons-material';
import type { GridColDef } from '@mui/x-data-grid';
import PeriodoService from '../../services/periodoService';
import type { Periodo, CreateUpdatePeriodoDto } from '../../types/periodo';
import PeriodoFormDialog from '../../components/dialogs/PeriodoFormDialog';
import DeletePeriodoDialog from '../../components/dialogs/DeletePeriodoDialog';
import GenericDataGrid from '../../components/dataGrid/GenericDataGrid';

export const Periodos = () => {
    const [periodos, setPeriodos] = useState<Periodo[]>([]);
    const [filteredPeriodos, setFilteredPeriodos] = useState<Periodo[]>([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [editingPeriodo, setEditingPeriodo] = useState<Periodo | null>(null);
    const [deletingPeriodo, setDeletingPeriodo] = useState<Periodo | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [snackbar, setSnackbar] = useState<{
        open: boolean;
        message: string;
        severity: 'success' | 'error' | 'info';
    }>({ open: false, message: '', severity: 'success' });

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };

    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: 'ID',
            width: 90,
        },
        {
            field: 'nombre',
            headerName: 'Nombre del Periodo',
            width: 250,
            flex: 1,
        },
        {
            field: 'inicio',
            headerName: 'Fecha de Inicio',
            width: 200,
            flex: 1,
            valueFormatter: (value) => formatDate(value),
        },
        {
            field: 'fin',
            headerName: 'Fecha de Fin',
            width: 200,
            flex: 1,
            valueFormatter: (value) => formatDate(value),
        },
    ];

    useEffect(() => {
        loadPeriodos();
    }, []);

    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredPeriodos(periodos);
        } else {
            const query = searchQuery.toLowerCase();
            const filtered = periodos.filter(
                (periodo) =>
                    periodo.nombre.toLowerCase().includes(query) ||
                    formatDate(periodo.inicio).toLowerCase().includes(query) ||
                    formatDate(periodo.fin).toLowerCase().includes(query)
            );
            setFilteredPeriodos(filtered);
        }
    }, [searchQuery, periodos]);

    const loadPeriodos = async () => {
        try {
            setLoading(true);
            const data = await PeriodoService.getAll();
            setPeriodos(data);
        } catch (error) {
            showSnackbar('Error al cargar los periodos', 'error');
            console.error('Error loading periodos:', error);
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

    const handleOpenDialog = (periodo?: Periodo) => {
        setEditingPeriodo(periodo || null);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingPeriodo(null);
    };

    const handleSubmitPeriodo = async (periodoData: CreateUpdatePeriodoDto) => {
        try {
            if (editingPeriodo) {
                await PeriodoService.update(editingPeriodo.id, periodoData);
                showSnackbar('Periodo actualizado exitosamente', 'success');
            } else {
                await PeriodoService.create(periodoData);
                showSnackbar('Periodo creado exitosamente', 'success');
            }
            loadPeriodos();
        } catch (error: any) {
            const message = error.response?.data?.message || 'Error al guardar el periodo';
            showSnackbar(message, 'error');
            throw error;
        }
    };

    const handleOpenDeleteDialog = (periodo: Periodo) => {
        setDeletingPeriodo(periodo);
        setOpenDeleteDialog(true);
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
        setDeletingPeriodo(null);
    };

    const handleDeletePeriodo = async () => {
        if (!deletingPeriodo) return;

        try {
            await PeriodoService.delete(deletingPeriodo.id);
            showSnackbar('Periodo eliminado exitosamente', 'success');
            loadPeriodos();
        } catch (error: any) {
            const message = error.response?.data?.message || 'Error al eliminar el periodo';
            showSnackbar(message, 'error');
            throw error;
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Gestión de Periodos
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Administra los periodos académicos del sistema
                </Typography>
            </Box>

            <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
                <TextField
                    placeholder="Buscar por nombre o fecha..."
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
                    Nuevo Periodo
                </Button>
            </Box>

            <GenericDataGrid
                rows={filteredPeriodos}
                columns={columns}
                loading={loading}
                onEdit={handleOpenDialog}
                onDelete={handleOpenDeleteDialog}
                emptyMessage={
                    searchQuery
                        ? 'No se encontraron periodos que coincidan con la búsqueda'
                        : 'No hay periodos registrados. Crea uno nuevo para comenzar.'
                }
                pageSize={10}
            />

            <PeriodoFormDialog
                open={openDialog}
                periodo={editingPeriodo}
                onClose={handleCloseDialog}
                onSubmit={handleSubmitPeriodo}
            />

            <DeletePeriodoDialog
                open={openDeleteDialog}
                periodo={deletingPeriodo}
                onClose={handleCloseDeleteDialog}
                onConfirm={handleDeletePeriodo}
            />

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
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

export default Periodos;