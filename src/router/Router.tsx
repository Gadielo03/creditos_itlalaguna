import { Route, Routes, Outlet } from "react-router-dom";
import { 
    Login, 
    Unauthorized,
    Home,
    Creditos,
    Actividades,
    Alumnos,
    Docentes,
    Usuarios,
    NotFound
} from '../pages';
import ProtectedLayout from "../layouts/ProtectedLayout";
import RoleProtectedRoute from "../components/roleProtectedRoute/RoleProtectedRoute";
import routesConfig from './routes.json';

const pageComponents: { [key: string]: React.ComponentType } = {
    '/login': Login,
    '/unauthorized': Unauthorized,
    '/': Home,
    '/creditos': Creditos,
    '/actividades': Actividades,
    '/alumnos': Alumnos,
    '/usuarios': Usuarios,
    '/docentes': Docentes,
    '*': NotFound
};

const Router = () => {
    const renderRoute = (route: any) => {
        const Component = pageComponents[route.path];
        
        if (!Component) {
            console.warn(`No component found for path: ${route.path}`);
            return null;
        }

        if (route.isPublic) {
            return <Route key={route.path} path={route.path} element={<Component />} />;
        }

        return (
            <Route 
                key={route.path} 
                path={route.path} 
                element={
                    route.allowedRoles ? (
                        <RoleProtectedRoute allowedRoles={route.allowedRoles}>
                            <Component />
                        </RoleProtectedRoute>
                    ) : (
                        <Component />
                    )
                } 
            />
        );
    };

    const publicRoutes = routesConfig.routes.filter(route => route.isPublic);
    const protectedRoutes = routesConfig.routes.filter(route => !route.isPublic);

    return (
        <Routes>
            {publicRoutes.map(renderRoute)}
            <Route element={<ProtectedLayout><Outlet /></ProtectedLayout>}>
                {protectedRoutes.map(renderRoute)}
            </Route>
        </Routes>
    );
}

export default Router;
