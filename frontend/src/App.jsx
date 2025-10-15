// src/App.jsx - Rutas principales con React Router
import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login"; // Usa el componente con Formik
import Register from "./components/Register"; // Usa el componente con Formik
import AdminDashboard from "./pages/AdminDashboard";
import EgresadoDashboard from "./pages/EgresadoDashboard";
import Logout from "./components/Logout";

const ProtectedRoute = ({ children, allowedRole }) => {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" />;

  try {
    const decoded = JSON.parse(atob(token.split(".")[1])); // Decodifica JWT
    if (decoded.role !== allowedRole) return <Navigate to="/login" />;
    return children;
  } catch (err) {
    console.error("Error decoding token:", err);
    return <Navigate to="/login" />;
  }
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/logout" element={<Logout />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/egresado/dashboard"
          element={
            <ProtectedRoute allowedRole="egresado">
              <EgresadoDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/admin/empresas" element={<EmpresasList />} />
        <Route
          path="/admin/empresas/:id/editar"
          element={<AdminEmpresasPage />}
        />
        <Route path="/admin/empresas/nueva" element={<AdminEmpresasPage />} />
        <Route path="/admin/empresas/:id" element={<EmpresaDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
