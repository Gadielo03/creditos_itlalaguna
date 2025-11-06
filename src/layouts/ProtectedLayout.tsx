import { Navigate, useLocation } from "react-router-dom";
import type { ReactElement } from 'react';
import AuthService from "../services/authService";

const ProtectedLayout = ({ children }: { children: ReactElement }) => {
    const location = useLocation();
    
    if (!AuthService.isAuthenticated() || AuthService.isTokenExpired()) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedLayout;