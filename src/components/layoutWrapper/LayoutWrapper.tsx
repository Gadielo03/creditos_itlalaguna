import { Box } from '@mui/material';
import type { ReactNode } from 'react';
import { Header } from '../header/Header';
import { useLocation } from 'react-router-dom';
import Footer from '../footer/Footer';

interface LayoutWrapperProps {
  children: ReactNode;
}

const LayoutWrapper = ({ children }: LayoutWrapperProps) => {
  const location = useLocation();
  const pagesWithoutHeader = ["/login", "/unauthorized"];
  const validProtectedRoutes = ["/", "/creditos", "/actividades", "/alumnos", "/docentes", "/usuarios"];
  
  const isPageWithoutHeader = pagesWithoutHeader.includes(location.pathname);
  const isValidRoute = validProtectedRoutes.includes(location.pathname);
  const showHeader = !isPageWithoutHeader && isValidRoute;
  
  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        overflow: 'hidden',
        p: 0,
        m: 0,
        display: 'flex',
        flexDirection: 'column',
      }}
    > 
      {showHeader && <Header />}
      <Box sx={{ flex: 1 }}>
        {children}
      </Box>
      {showHeader && <Footer />}
    </Box>
  );
};

export default LayoutWrapper;