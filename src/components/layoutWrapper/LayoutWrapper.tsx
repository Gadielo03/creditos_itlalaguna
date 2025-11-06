import { Box } from '@mui/material';
import type { ReactNode } from 'react';

interface LayoutWrapperProps {
  children: ReactNode;
}

const LayoutWrapper = ({ children }: LayoutWrapperProps) => {
  return (
    <Box
      sx={{
        minHeight: '100vh', 
        width: '100%', 
        overflow: 'hidden',
        p:0,
        m:0
      }}
    >
      {children}
    </Box>
  );
};

export default LayoutWrapper;