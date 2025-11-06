import { Route, Routes, Outlet } from "react-router-dom";
import { Login } from '../pages/index';
import ProtectedLayout from "../layouts/ProtectedLayout";

const Router = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<ProtectedLayout><Outlet /></ProtectedLayout>}>
                <Route path="/" element={<h1>Home</h1>} />
            </Route>
        </Routes>
    );
};

export default Router;
