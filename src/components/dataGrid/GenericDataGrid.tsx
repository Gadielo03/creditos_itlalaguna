import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import type { GridColDef, GridRowParams, GridRowIdGetter, GridValidRowModel } from '@mui/x-data-grid';
import { Box, Paper, CircularProgress, Typography } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

interface GenericDataGridProps<T extends GridValidRowModel> {
    rows: T[];
    columns: GridColDef[];
    loading?: boolean;
    onEdit?: (row: T) => void;
    onDelete?: (row: T) => void;
    showActions?: boolean;
    emptyMessage?: string;
    pageSize?: number;
    autoHeight?: boolean;
    getRowId?: GridRowIdGetter<T>;
}

export function GenericDataGrid<T extends GridValidRowModel>({
    rows,
    columns,
    loading = false,
    onEdit,
    onDelete,
    showActions = true,
    emptyMessage = 'No hay datos disponibles',
    pageSize = 10,
    autoHeight = true,
    getRowId,
}: GenericDataGridProps<T>) {
    const actionsColumn: GridColDef = {
        field: 'actions',
        type: 'actions',
        headerName: 'Acciones',
        width: 120,
        getActions: (params: GridRowParams<T>) => {
            const actions = [];
            
            if (onEdit) {
                actions.push(
                    <GridActionsCellItem
                        icon={<EditIcon />}
                        label="Editar"
                        onClick={() => onEdit(params.row)}
                        color="primary"
                    />
                );
            }
            
            if (onDelete) {
                actions.push(
                    <GridActionsCellItem
                        icon={<DeleteIcon color="error" />}
                        label="Eliminar"
                        onClick={() => onDelete(params.row)}
                    />
                );
            }
            
            return actions;
        },
    };

    const finalColumns = showActions && (onEdit || onDelete)
        ? [...columns, actionsColumn]
        : columns;

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (rows.length === 0) {
        return (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                    {emptyMessage}
                </Typography>
            </Paper>
        );
    }

    return (
        <Paper sx={{ width: '100%' }}>
            <DataGrid
                rows={rows}
                columns={finalColumns}
                getRowId={getRowId}
                initialState={{
                    pagination: {
                        paginationModel: { pageSize: pageSize, page: 0 },
                    },
                }}
                pageSizeOptions={[5, 10, 25, 50]}
                disableRowSelectionOnClick
                autoHeight={autoHeight}
                sx={{
                    border: 0,
                    '& .MuiDataGrid-cell:focus': {
                        outline: 'none',
                    },
                    '& .MuiDataGrid-row:hover': {
                        backgroundColor: 'action.hover',
                    },
                }}
                localeText={{
                    noRowsLabel: emptyMessage,
                    footerRowSelected: (count) =>
                        count !== 1
                            ? `${count.toLocaleString()} filas seleccionadas`
                            : `${count.toLocaleString()} fila seleccionada`,
                }}
            />
        </Paper>
    );
}

export default GenericDataGrid;
