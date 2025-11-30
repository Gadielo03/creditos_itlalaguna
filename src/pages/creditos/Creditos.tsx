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
    Chip,
} from '@mui/material';
import {
    Add as AddIcon,
    Search as SearchIcon,
} from '@mui/icons-material';
import type { GridColDef } from '@mui/x-data-grid';
import CreditosService from '../../services/creditosService';
import type { Credito, CreateCreditoDto } from '../../types/credito';
import CreditoFormDialog from '../../components/dialogs/CreditoFormDialog';
import DeleteCreditoDialog from '../../components/dialogs/DeleteCreditoDialog';
import GenericDataGrid from '../../components/dataGrid/GenericDataGrid';

export const Creditos = () => {
    const [creditos, setCreditos] = useState<Credito[]>([]);
    const [filteredCreditos, setFilteredCreditos] = useState<Credito[]>([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [editingCredito, setEditingCredito] = useState<Credito | null>(null);
    const [deletingCredito, setDeletingCredito] = useState<Credito | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [snackbar, setSnackbar] = useState<{
        open: boolean;
        message: string;
        severity: 'success' | 'error' | 'info';
    }>({ open: false, message: '', severity: 'success' });

    const columns: GridColDef[] = [
        {
            field: 'credito_id',
            headerName: 'ID',
            width: 90,
        },
        {
            field: 'alumno_nctrl',
            headerName: 'No. Control',
            width: 130,
            flex: 1,
            valueGetter: (_value, row) => row.alumno?.nctrl || '',
        },
        {
            field: 'alumno_nombre',
            headerName: 'Alumno',
            width: 250,
            flex: 2,
            valueGetter: (_value, row) => {
                const alumno = row.alumno;
                return alumno ? `${alumno.nombres} ${alumno.apellidos}` : '';
            },
        },
        {
            field: 'actividad_nombre',
            headerName: 'Actividad',
            width: 200,
            flex: 1.5,
            valueGetter: (_value, row) => row.actividad?.act_nombre || '',
        },
        {
            field: 'creditos',
            headerName: 'Créditos',
            width: 110,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => (
                <Chip
                    label={params.row.actividad?.act_creditos || 0}
                    color="primary"
                    size="small"
                    sx={{ fontWeight: 600 }}
                />
            ),
        },
        {
            field: 'cred_fecha',
            headerName: 'Fecha',
            width: 130,
            flex: 1,
            valueGetter: (value) => {
                if (!value) return '';
                const date = new Date(value);
                return date.toLocaleDateString('es-MX', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                });
            },
        },
    ];

    useEffect(() => {
        loadCreditos();
    }, []);

    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredCreditos(creditos);
        } else {
            const query = searchQuery.toLowerCase();
            const filtered = creditos.filter(
                (credito) => {
                    const alumnoNombre = `${credito.alumno.nombres} ${credito.alumno.apellidos}`.toLowerCase();
                    const alumnoNctrl = credito.alumno.nctrl.toLowerCase();
                    const actividadNombre = credito.actividad.act_nombre.toLowerCase();
                    
                    return (
                        alumnoNombre.includes(query) ||
                        alumnoNctrl.includes(query) ||
                        actividadNombre.includes(query)
                    );
                }
            );
            setFilteredCreditos(filtered);
        }
    }, [searchQuery, creditos]);

    const loadCreditos = async () => {
        try {
            setLoading(true);
            const data = await CreditosService.getAll();
            setCreditos(data);
        } catch (error) {
            showSnackbar('Error al cargar los créditos', 'error');
            console.error('Error loading creditos:', error);
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

    const handleOpenDialog = (credito?: Credito) => {
        setEditingCredito(credito || null);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingCredito(null);
    };

    const handleSubmitCredito = async (creditoData: CreateCreditoDto) => {
        try {
            if (editingCredito) {
                await CreditosService.update({
                    credito_id: editingCredito.credito_id,
                    ...creditoData,
                });
                showSnackbar('Crédito actualizado exitosamente', 'success');
            } else {
                await CreditosService.create(creditoData);
                showSnackbar('Crédito creado exitosamente', 'success');
            }
            loadCreditos();
        } catch (error: any) {
            const message = error.response?.data?.message || 'Error al guardar el crédito';
            showSnackbar(message, 'error');
            throw error;
        }
    };

    const handleOpenDeleteDialog = (credito: Credito) => {
        setDeletingCredito(credito);
        setOpenDeleteDialog(true);
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
        setDeletingCredito(null);
    };

    const handleDeleteCredito = async () => {
        if (!deletingCredito) return;

        try {
            await CreditosService.delete(deletingCredito.credito_id);
            showSnackbar('Crédito eliminado exitosamente', 'success');
            loadCreditos();
        } catch (error: any) {
            const message = error.response?.data?.message || 'Error al eliminar el crédito';
            showSnackbar(message, 'error');
            throw error;
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Gestión de Créditos
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Administra los créditos asignados a los alumnos por actividades realizadas
                </Typography>
            </Box>

            <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
                <TextField
                    placeholder="Buscar por alumno, número de control o actividad..."
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
                    Nuevo Crédito
                </Button>
            </Box>

            <GenericDataGrid
                rows={filteredCreditos}
                columns={columns}
                loading={loading}
                onEdit={handleOpenDialog}
                onDelete={handleOpenDeleteDialog}
                emptyMessage={
                    searchQuery
                        ? 'No se encontraron créditos que coincidan con la búsqueda'
                        : 'No hay créditos registrados. Crea uno nuevo para comenzar.'
                }
                pageSize={10}
                getRowId={(row) => row.credito_id}
            />

            <CreditoFormDialog
                open={openDialog}
                credito={editingCredito}
                onClose={handleCloseDialog}
                onSubmit={handleSubmitCredito}
            />

            <DeleteCreditoDialog
                open={openDeleteDialog}
                credito={deletingCredito}
                onClose={handleCloseDeleteDialog}
                onConfirm={handleDeleteCredito}
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

export default Creditos;