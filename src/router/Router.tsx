import { Route, Routes, Outlet } from "react-router-dom";
import ProtectedLayout from "../layouts/ProtectedLayout";
import RoleProtectedRoute from "../components/roleProtectedRoute/RoleProtectedRoute";
import { getPublicRoutes, getProtectedRoutes, type RouteConfig } from './routesConfig';

const Router = () => {
    const renderRoute = (route: RouteConfig) => {
        const Component = route.component;

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

    const publicRoutes = getPublicRoutes();
    const protectedRoutes = getProtectedRoutes();

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
