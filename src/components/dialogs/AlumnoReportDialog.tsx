import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Box,
    Typography,
    Divider,
    Card,
    CardContent,
    Chip
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import BadgeIcon from "@mui/icons-material/Badge";
import EventIcon from "@mui/icons-material/Event";
import SchoolIcon from "@mui/icons-material/School";
import type { AlumnoCreditosReport } from "../../types/credito";

interface AlumnoReportDialogProps {
    open: boolean;
    onClose: () => void;
    report: AlumnoCreditosReport | null;
}

const CREDITOS_REQUERIDOS = 6;

export const AlumnoReportDialog = ({ open, onClose, report }: AlumnoReportDialogProps) => {
    if (!report) return null;

    const creditosCompletos = report.totalCreditos >= CREDITOS_REQUERIDOS;
    const porcentaje = Math.min((report.totalCreditos / CREDITOS_REQUERIDOS) * 100, 100);

    const formatDate = (dateString: string): string => {
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return dateString;
            return date.toISOString().split('T')[0];
        } catch {
            return dateString;
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    border: creditosCompletos ? '2px solid #4caf50' : 'none'
                }
            }}
        >
            <DialogTitle
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    bgcolor: creditosCompletos ? '#4caf50' : 'primary.main',
                    color: 'white',
                    pb: 2
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PersonIcon />
                    <Typography variant="h6" component="span">
                        Detalles del Alumno
                    </Typography>
                </Box>
                <IconButton
                    onClick={onClose}
                    sx={{
                        color: 'white',
                        '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' }
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ pt: 3 }}>
                <Card variant="outlined" sx={{ mb: 3 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <PersonIcon /> Información General
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                                <Box sx={{ flex: '1 1 200px' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                        <BadgeIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                                        <Typography variant="body2" color="text.secondary">
                                            Número de Control:
                                        </Typography>
                                    </Box>
                                    <Typography variant="body1" fontWeight={600}>
                                        {report.alumno.nctrl}
                                    </Typography>
                                </Box>

                                <Box sx={{ flex: '1 1 200px' }}>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                        Nombre Completo:
                                    </Typography>
                                    <Typography variant="body1" fontWeight={600}>
                                        {report.alumno.nombres} {report.alumno.apellidos}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                                <Box sx={{ flex: '1 1 200px' }}>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                        Total de Créditos:
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Typography variant="h5" fontWeight={700} color={creditosCompletos ? 'success.main' : 'warning.main'}>
                                            {report.totalCreditos}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            de {CREDITOS_REQUERIDOS}
                                        </Typography>
                                        <Chip
                                            label={`${Math.round(porcentaje)}%`}
                                            color={creditosCompletos ? 'success' : 'warning'}
                                            size="small"
                                            sx={{ ml: 1 }}
                                        />
                                    </Box>
                                </Box>

                                <Box sx={{ flex: '1 1 200px' }}>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                        Estado:
                                    </Typography>
                                    <Chip
                                        label={creditosCompletos ? 'Completado' : 'En Progreso'}
                                        color={creditosCompletos ? 'success' : 'warning'}
                                        icon={<SchoolIcon />}
                                    />
                                </Box>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>

                <Card variant="outlined">
                    <CardContent>
                        <Typography variant="h6" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <EventIcon /> Historial de Créditos
                        </Typography>
                        <Divider sx={{ mb: 2 }} />

                        {report.creditos && report.creditos.length > 0 ? (
                            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                {report.creditos.map((credito, index) => (
                                    <Box
                                        component="li"
                                        key={index}
                                        sx={{
                                            p: 2,
                                            borderLeft: '3px solid',
                                            borderColor: 'primary.main',
                                            bgcolor: 'background.default',
                                            borderRadius: 1,
                                            transition: 'all 0.2s',
                                            '&:hover': {
                                                bgcolor: 'action.hover',
                                                borderColor: 'primary.dark',
                                                transform: 'translateX(4px)'
                                            }
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2, flexWrap: 'wrap' }}>
                                            <Box sx={{ flex: '1 1 250px' }}>
                                                <Typography variant="body1" fontWeight={600} gutterBottom>
                                                    {credito.actividad}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    <strong>Docente:</strong> {credito.docente}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <EventIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                                                <Typography variant="body2" color="text.secondary" fontWeight={500}>
                                                    {formatDate(credito.fecha)}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        ) : (
                            <Box sx={{ textAlign: 'center', py: 4 }}>
                                <Typography variant="body1" color="text.secondary">
                                    No hay créditos registrados para este alumno.
                                </Typography>
                            </Box>
                        )}
                    </CardContent>
                </Card>
            </DialogContent>
        </Dialog>
    );
};

export default AlumnoReportDialog;
