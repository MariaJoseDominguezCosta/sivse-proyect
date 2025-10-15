// src/pages/Register.js - Componente de registro
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("egresado");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password.length < 8) {
        setError("Password mínimo 8 caracteres");
        return;
        }

        try {
        await axios.post("http://localhost:5000/api/auth/register", {
            email,
            password,
            role,
        });
        navigate("/login"); // Redirige a login tras registro
        } catch (err) {
        setError(err.response?.data?.message || "Error en registro");
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
        <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="egresado">Egresado</option>
            <option value="admin">Admin</option>
        </select>
        {error && <p>{error}</p>}
        <button type="submit">Registrarse</button>
        </form>
    );
};

export default Register;
