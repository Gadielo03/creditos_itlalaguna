import { Navigate } from 'react-router-dom';
import { AuthService } from '../../services/authService';

type RoleProtectedRouteProps = {
    children: React.ReactNode;
    allowedRoles: string | string[];
    redirectTo?: string;
};

const RoleProtectedRoute = ({ 
    children, 
    allowedRoles, 
    redirectTo = '/unauthorized' 
}: RoleProtectedRouteProps) => {
    const hasRequiredRole = AuthService.hasRole(allowedRoles);

    if (!hasRequiredRole) {
        return <Navigate to={redirectTo} replace />;
    }

    return <>{children}</>;
};

export default RoleProtectedRoute;