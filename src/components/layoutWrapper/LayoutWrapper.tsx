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
  const pagesWithoutHeader = ["/login","/unauthorized"];
  const isLoginPage = pagesWithoutHeader.find(page => page === location.pathname);
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
      {!isLoginPage && <Header />}
      <Box sx={{ flex: 1 }}>
        {children}
      </Box>
      {!isLoginPage && <Footer />}
    </Box>
  );
};

export default LayoutWrapper;