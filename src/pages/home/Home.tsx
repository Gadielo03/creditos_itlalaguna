import { useEffect, useState } from "react";
import AlumnosService from "../../services/alumnosService";
import type { AlumnoCreditosReport } from "../../types/alumno";
import { TablePagination, Paper, Box, Typography, Container, TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useReportsPagination } from "../../hooks/useReportsPagination";
import ReportCard from "../../components/cards/reporCard/ReportCard";
import AlumnoReportDialog from "../../components/dialogs/AlumnoReportDialog";

export const Home = () => {
    const [reports, setReports] = useState<AlumnoCreditosReport[]>([]);
    const [selectedReport, setSelectedReport] = useState<AlumnoCreditosReport | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    const {
        page,
        rowsPerPage,
        searchQuery,
        filteredReports,
        paginatedReports,
        handleChangePage,
        handleChangeRowsPerPage,
        handleSearchChange,
    } = useReportsPagination({ reports });

    const fetchReport = async () => {
        try {
            const reports = await AlumnosService.getAlumnosCreditosReport();
            console.log('Fetched reports:', reports);
            setReports(reports);
        } catch (error) {
            console.error('Error fetching report:', error);
        }
    }

    const getData = async () => {
        fetchReport();
    };

    useEffect(() => {
        getData();
    }, []);

    const handleCardClick = (report: AlumnoCreditosReport) => {
        setSelectedReport(report);
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setSelectedReport(null);
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: 'calc(100vh - 200px)',
                overflow: 'hidden'
            }}
        >
            <Container maxWidth="xl" sx={{ pt: 4, pb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h4" component="h1">
                        Créditos ITL
                    </Typography>
                    <TextField
                        placeholder="Buscar alumno..."
                        variant="outlined"
                        size="small"
                        value={searchQuery}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        sx={{ width: '300px' }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>
            </Container>

            <Box
                sx={{
                    flexGrow: 1,
                    overflowY: 'auto',
                    px: 3,
                    pt: 2
                }}
            >
                <Container maxWidth="xl">
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                            gap: 2.5,
                            justifyContent: 'center'
                        }}
                    >
                        {
                            paginatedReports.map((report) => (
                                <Box 
                                    key={report.alumno.id} 
                                    onClick={() => handleCardClick(report)}
                                    sx={{ cursor: 'pointer' }}
                                >
                                    <ReportCard report={report} />
                                </Box>
                            ))
                        }
                    </Box>
                </Container>
            </Box>

            <Paper
                elevation={3}
                sx={{
                    position: 'sticky',
                    bottom: 0,
                    zIndex: 10,
                    display: 'flex',
                    justifyContent: 'flex-end',
                    borderTop: '1px solid rgba(0, 0, 0, 0.12)'
                }}
            >
                <TablePagination
                    component="div"
                    count={filteredReports.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    labelRowsPerPage="Filas por página:"
                    labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
                />
            </Paper>

            <AlumnoReportDialog
                open={dialogOpen}
                onClose={handleCloseDialog}
                report={selectedReport}
            />
        </Box>
    )
}

export default Home