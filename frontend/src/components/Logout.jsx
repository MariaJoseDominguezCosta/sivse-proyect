// src/components/Logout.js - Componente para cerrar sesión
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.removeItem("token");
        navigate("/login");
    }, [navigate]);

    return <div>Cerrando sesión...</div>;
};

export default Logout;
