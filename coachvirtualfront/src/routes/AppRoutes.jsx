import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Perfil from "../pages/Gestion de Usuario y Progreso/Perfil";

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/perfil" element={<Perfil/>} />
        </Routes>
    );
};