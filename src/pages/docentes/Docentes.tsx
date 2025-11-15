import { useEffect, useState } from "react";
import { DocentesService } from "../../services/docentsService";
import type { Docente, CreateDocenteDto } from "../../types/docente";
import { Alert, Box, Button, Container, InputAdornment, Snackbar, TextField, Typography } from "@mui/material";
import { Add, Search } from "@mui/icons-material";
import type { GridColDef } from "@mui/x-data-grid";
import GenericDataGrid from "../../components/dataGrid/GenericDataGrid";
import DocenteFormDialog from "../../components/dialogs/DocenteFormDialog";
import DeleteDocenteDialog from "../../components/dialogs/DeleteDocenteDialog";

export const Docentes = () => {
    const [docentes, setDocentes] = useState<Docente[]>([]);
    const [filteredDocentes, setFilteredDocentes] = useState<Docente[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [editingDocente, setEditingDocente] = useState<Docente | null>(null);
    const [deletingDocente, setDeletingDocente] = useState<Docente | null>(null);
    const [loading, setLoading] = useState(true);
    const [snackbar, setSnackbar] = useState<{
        open: boolean;
        message: string;
        severity: 'success' | 'error' | 'info';
    }>({ open: false, message: '', severity: 'success' });

    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: 'ID',
            width: 90,
        },
        {
            field: 'nombre',
            headerName: 'Nombre',
            width: 200,
            flex: 1,
        },
        {
            field: 'apellidos',
            headerName: 'Apellidos',
            width: 200,
            flex: 1,
        },
    ];

    const loadDocentes = async () => {
        try {
            setLoading(true);
            const data = await DocentesService.getAll();
            setDocentes(data);
        } catch (error) {
            console.error("Error loading docentes:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDocentes();
    }, []);

    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredDocentes(docentes);
        } else {
            const query = searchQuery.toLowerCase();
            const filtered = docentes.filter(
                (docente) =>
                    docente.nombre.toLowerCase().includes(query) ||
                    docente.apellidos.toLowerCase().includes(query)
            );
            setFilteredDocentes(filtered);
        }
    }, [searchQuery, docentes]);

    const handleOpenDialog = (docente?: Docente) => {
        setEditingDocente(docente || null);
        setOpenDialog(true);
    };

    const showSnackbar = (message: string, severity: 'success' | 'error' | 'info') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingDocente(null);
    };

    const handleSubmitDocente = async (docenteData: CreateDocenteDto) => {
        try {
            if (editingDocente) {
                await DocentesService.update(Number(editingDocente.id), docenteData as any);
                showSnackbar('Docente actualizado exitosamente', 'success');
            } else {
                await DocentesService.create(docenteData);
                showSnackbar('Docente creado exitosamente', 'success');
            }
            loadDocentes();
        } catch (error: any) {
            const message = error.response?.data?.message || 'Error al guardar el docente';
            showSnackbar(message, 'error');
            throw error;
        }
    };

    const handleOpenDeleteDialog = (docente: Docente) => {
        setDeletingDocente(docente);
        setOpenDeleteDialog(true);
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
        setDeletingDocente(null);
    };

    const handleDeleteDocente = async () => {
        if (!deletingDocente) return;

        try {
            await DocentesService.delete(Number(deletingDocente.id));
            showSnackbar('Docente eliminado exitosamente', 'success');
            loadDocentes();
        } catch (error: any) {
            const message = error.response?.data?.message || 'Error al eliminar el docente';
            showSnackbar(message, 'error');
            throw error;
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Gestión de Docentes
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Administra la información de los Docentes del sistema
                </Typography>
            </Box>

            <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
                <TextField
                    placeholder="Buscar por nombre o apellido..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    size="small"
                    sx={{ flexGrow: 1 }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search />
                            </InputAdornment>
                        ),
                    }}
                />
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => handleOpenDialog()}
                >
                    Nuevo Docente
                </Button>
            </Box>

            <GenericDataGrid
                rows={filteredDocentes}
                columns={columns}
                loading={loading}
                onEdit={handleOpenDialog}
                onDelete={handleOpenDeleteDialog}
                emptyMessage={
                    searchQuery
                        ? 'No se encontraron docentes que coincidan con la búsqueda'
                        : 'No hay docentes registrados. Crea uno nuevo para comenzar.'
                }
                pageSize={10}
            />

            <DocenteFormDialog
                open={openDialog}
                docente={editingDocente}
                onClose={handleCloseDialog}
                onSubmit={handleSubmitDocente}
            />

            <DeleteDocenteDialog
                open={openDeleteDialog}
                docente={deletingDocente}
                onClose={handleCloseDeleteDialog}
                onConfirm={handleDeleteDocente}
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
    )
}

export default Docentes