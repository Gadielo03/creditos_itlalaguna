import { Box } from '@mui/material';
import type { ReactNode } from 'react';
import { Header } from '../header/Header';
import { useLocation } from 'react-router-dom';
import Footer from '../footer/Footer';
import { getProtectedRoutes } from '../../router/routesConfig';

interface LayoutWrapperProps {
  children: ReactNode;
}

const LayoutWrapper = ({ children }: LayoutWrapperProps) => {
  const location = useLocation();
  
  const protectedRoutePaths = getProtectedRoutes().map(route => route.path);
  
  const isProtectedRoute = protectedRoutePaths.includes(location.pathname);
  const showHeader = isProtectedRoute;
  
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