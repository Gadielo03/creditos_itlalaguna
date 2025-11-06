import { Box, Button, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();

  const goBack = () => navigate(-1);

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <Box textAlign="center">
        <Typography variant="h1" component="h1" gutterBottom>
          403
        </Typography>
        <Typography variant="h4" component="h2" gutterBottom>
          Acceso denegado
        </Typography>
        <Typography variant="body1" gutterBottom>
          No tienes permiso para acceder a esta página.
        </Typography>
        <Button variant="contained" color="primary" onClick={goBack}>
          Regresar
        </Button>
      </Box>
    </Container>
  );
};

export default Unauthorized;
