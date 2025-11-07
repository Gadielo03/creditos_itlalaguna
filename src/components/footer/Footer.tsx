import React from 'react';
import {
    Box,
    Container,
    Typography,
    useTheme,
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';

const Footer: React.FC = () => {
    const theme = useTheme();
    const currentYear = new Date().getFullYear();

    return (
        <Box
            component="footer"
            sx={{
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                py: 3,
                mt: 'auto',
            }}
        >
            <Container maxWidth="lg">
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 2,
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <SchoolIcon sx={{ fontSize: 24, mr: 1 }} />
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                            TEC Laguna
                        </Typography>
                    </Box>

                    <Typography variant="body2" sx={{ opacity: 0.9, textAlign: 'center' }}>
                        &copy; {currentYear} Instituto Tecnológico de La Laguna
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;
