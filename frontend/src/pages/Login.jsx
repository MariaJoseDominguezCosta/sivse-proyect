// src/pages/Login.js - Componente de login
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
        const res = await axios.post("http://localhost:5000/api/auth/login", {
            email,
            password,
        });
        localStorage.setItem("token", res.data.token); // Almacena JWT
        navigate("/dashboard"); // Redirige basado en role (puedes verificar en dashboard)
        } catch (err) {
        setError(err.response?.data?.message || "Error en login");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
        <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
        />
        <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
        />
        {error && <p>{error}</p>}
        <button type="submit">Iniciar Sesión</button>
        </form>
    );
};

export default Login;
