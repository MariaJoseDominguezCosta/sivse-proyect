// pages/Register.js
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        nombre_completo: '', telefono: '', generacion: '', carrera: '', email: '', password: '', confirm_password: '',
    });
    const [error, setError] = useState('');
    const [notification, setNotification] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirm_password) return setError('Contraseñas no coinciden');
        try {
        await axios.post('http://localhost:5000/api/auth/register', formData);
        setNotification('Registro exitoso. Redirigiendo a login...');
        setTimeout(() => navigate('/login'), 1000);
        } catch (err) {
        setError(err.response?.data?.error || 'Error en registro');
        }
    };

    return (
        <div className="min-h-screen bg-blue-50 flex flex-col items-center justify-center">
        <header className="w-full bg-blue-900 text-white py-4 flex justify-between px-8">
            <div>Logo TecNM</div>
            <h1 className="text-4xl">Registro de Egresado</h1>
            <div>Logo Comitán</div>
        </header>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mt-20 grid grid-cols-2 gap-4">
            <div><label>Nombre completo</label><input name="nombre_completo" value={formData.nombre_completo} onChange={handleChange} className="w-full p-2 border rounded" required /></div>
            <div><label>Teléfono</label><input name="telefono" value={formData.telefono} onChange={handleChange} className="w-full p-2 border rounded" /></div>
            <div><label>Generación</label><select name="generacion" value={formData.generacion} onChange={handleChange} className="w-full p-2 border rounded" required><option value="">Selecciona</option><option value="2020-2025">2020-2025</option></select></div>
            <div><label>Contraseña</label><input name="password" type="password" value={formData.password} onChange={handleChange} className="w-full p-2 border rounded" required /></div>
            <div><label>Carrera</label><input name="carrera" value={formData.carrera} onChange={handleChange} className="w-full p-2 border rounded" required /></div>
            <div><label>Confirmar contraseña</label><input name="confirm_password" type="password" value={formData.confirm_password} onChange={handleChange} className="w-full p-2 border rounded" required /></div>
            <div className="col-span-2"><label>Email</label><input name="email" type="email" value={formData.email} onChange={handleChange} className="w-full p-2 border rounded" required /></div>
            <button type="submit" className="col-span-2 bg-black text-white py-2 rounded">Registrarse</button>
            <p className="col-span-2 text-center"><a href="/login" className="text-blue-500">¿Ya tienes cuenta? Iniciar Sesión</a></p>
        </form>
        {error && <p className="text-red-500 mt-4">{error}</p>}
        {notification && <p className="text-green-500 mt-4">{notification}</p>}
        </div>
    );
};

export default Register;