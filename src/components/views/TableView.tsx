import { useMemo } from "react";
import { Box, Container, Paper, Typography, LinearProgress, Chip } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import type { AlumnoCreditosReport } from "../../types/alumno";

interface TableViewProps {
    filteredReports: AlumnoCreditosReport[];
    page: number;
    rowsPerPage: number;
    onRowClick: (report: AlumnoCreditosReport) => void;
    onPageChange: (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
    onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const CREDITOS_REQUERIDOS = 6;

const boldTextStyle = { fontWeight: 600 };
const mediumTextStyle = { fontWeight: 500 };

export const TableView = ({
    filteredReports,
    page,
    rowsPerPage,
    onRowClick,
    onPageChange,
    onRowsPerPageChange,
}: TableViewProps) => {
    const columns: GridColDef[] = useMemo(() => [
        {
            field: 'nctrl',
            headerName: 'No. Control',
            flex: 1,
            valueGetter: (_value, row) => row.alumno.nctrl,
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant="body2" sx={boldTextStyle}>
                    {params.value}
                </Typography>
            ),
        },
        {
            field: 'nombres',
            headerName: 'Nombres',
            flex: 1.5,
            valueGetter: (_value, row) => row.alumno.nombres,
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant="body2" sx={mediumTextStyle}>
                    {params.value}
                </Typography>
            ),
        },
        {
            field: 'apellidos',
            headerName: 'Apellidos',
            flex: 1.5,
            valueGetter: (_value, row) => row.alumno.apellidos,
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant="body2" sx={mediumTextStyle}>
                    {params.value}
                </Typography>
            ),
        },
        {
            field: 'totalCreditos',
            headerName: 'Progreso',
            flex: 1.8,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params: GridRenderCellParams) => {
                const report = params.row as AlumnoCreditosReport;
                const porcentaje = Math.min((report.totalCreditos / CREDITOS_REQUERIDOS) * 100, 100);
                const creditosCompletos = report.totalCreditos >= CREDITOS_REQUERIDOS;
                const color = creditosCompletos ? '#4caf50' : '#ff9800';

                return (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%', px: 2 }}>
                        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                            <LinearProgress
                                variant="determinate"
                                value={porcentaje}
                                sx={{
                                    height: 8,
                                    borderRadius: 5,
                                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                                    '& .MuiLinearProgress-bar': {
                                        backgroundColor: color,
                                        borderRadius: 5,
                                    },
                                }}
                            />
                        </Box>
                        <Typography 
                            variant="body2" 
                            component="span"
                            sx={{ 
                                fontWeight: 700, 
                                fontSize: '0.9rem',
                                color: color,
                                minWidth: 'fit-content'
                            }}
                        >
                            {report.totalCreditos}/{CREDITOS_REQUERIDOS}
                        </Typography>
                    </Box>
                );
            },
        },
        {
            field: 'status',
            headerName: 'Estado',
            flex: 1,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params: GridRenderCellParams) => {
                const report = params.row as AlumnoCreditosReport;
                const creditosCompletos = report.totalCreditos >= CREDITOS_REQUERIDOS;

                return creditosCompletos ? (
                    <Chip
                        icon={<CheckCircleIcon />}
                        label="Completado"
                        color="success"
                        size="small"
                        sx={boldTextStyle}
                    />
                ) : (
                    <Chip
                        label="En Progreso"
                        color="warning"
                        size="small"
                        sx={boldTextStyle}
                    />
                );
            },
        },
        {
            field: 'creditos',
            headerName: 'Actividades',
            flex: 0.8,
            align: 'center',
            headerAlign: 'center',
            valueGetter: (_value, row) => row.creditos.length,
            renderCell: (params: GridRenderCellParams) => (
                <Chip
                    label={params.value}
                    variant="outlined"
                    size="small"
                    sx={boldTextStyle}
                />
            ),
        },
    ], []);

    return (
        <Box
            sx={{
                flexGrow: 1,
                px: 3,
                pt: 2,
                pb: 2
            }}
        >
            <Container maxWidth="xl">
                <Paper sx={{ 
                    width: '100%', 
                    height: 'calc(100vh - 350px)',
                    boxShadow: 3,
                    borderRadius: 2
                }}>
                    <DataGrid
                        rows={filteredReports}
                        columns={columns}
                        getRowId={(row) => row.alumno.id}
                        initialState={{
                            pagination: {
                                paginationModel: { pageSize: rowsPerPage, page: page },
                            },
                        }}
                        pageSizeOptions={[5, 10, 25, 50]}
                        disableRowSelectionOnClick
                        disableColumnMenu
                        disableColumnFilter
                        disableColumnSelector
                        disableDensitySelector
                        onRowClick={(params) => onRowClick(params.row)}
                        sx={{
                            cursor: 'pointer',
                            border: 'none',
                            '& .MuiDataGrid-main': {
                                borderRadius: 2,
                            },
                            '& .MuiDataGrid-columnHeaders': {
                                backgroundColor: '#f5f5f5',
                                borderBottom: '2px solid rgba(0, 0, 0, 0.12)',
                                fontWeight: 700,
                            },
                            '& .MuiDataGrid-columnHeaderTitle': {
                                fontWeight: 700,
                            },
                            '& .MuiDataGrid-row': {
                                '&:hover': {
                                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                },
                            },
                            '& .MuiDataGrid-cell': {
                                borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
                                display: 'flex',
                                alignItems: 'center',
                            },
                            '& .MuiDataGrid-footerContainer': {
                                borderTop: '2px solid rgba(0, 0, 0, 0.12)',
                                backgroundColor: '#fafafa',
                            },
                        }}
                        paginationModel={{
                            page: page,
                            pageSize: rowsPerPage,
                        }}
                        onPaginationModelChange={(model) => {
                            if (model.page !== page) {
                                onPageChange(null, model.page);
                            }
                            if (model.pageSize !== rowsPerPage) {
                                const syntheticEvent = {
                                    target: { value: model.pageSize.toString() }
                                } as React.ChangeEvent<HTMLInputElement>;
                                onRowsPerPageChange(syntheticEvent);
                            }
                        }}
                        localeText={{
                            noRowsLabel: 'No hay datos disponibles',
                        }}
                    />
                </Paper>
            </Container>
        </Box>
    );
};

export default TableView;
