import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Perfil from "../pages/Gestion de Usuario y Progreso/Perfil";
import Register from "../pages/Gestion de Usuario y Progreso/Register";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/perfil" element={<Perfil />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}
