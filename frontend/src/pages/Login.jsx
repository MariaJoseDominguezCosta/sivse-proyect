// pages/Login.js
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
        const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('role', res.data.role);
        navigate(res.data.role === 'admin' ? '/admin-dashboard' : '/egresado-dashboard');
        } catch (err) {
        setError(err.response?.data?.error || 'Error en login');
        }
    };

    return (
        <div className="min-h-screen bg-blue-50 flex flex-col items-center justify-center">
        <header className="w-full bg-blue-900 text-white py-4 flex justify-between px-8">
            <div>Logo TecNM</div> {/* Reemplaza con <img src="logo-tecnm.png" /> */}
            <h1 className="text-4xl">SIVSE</h1>
            <div>Logo Comitán</div> {/* Reemplaza con img */}
        </header>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mt-20">
            <label className="block mb-2">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 border rounded mb-4" required />
            <label className="block mb-2">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 border rounded mb-4" required />
            <button type="submit" className="w-full bg-black text-white py-2 rounded">Iniciar Sesión</button>
            <p className="text-center mt-2"><a href="/forgot-password" className="text-blue-500">¿Olvidaste tu contraseña?</a></p>
            <p className="text-center"><a href="/register" className="text-blue-500">¿Eres egresado? Regístrate</a></p>
        </form>
        {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
    );
};

export default Login;