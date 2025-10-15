// pages/ResetPassword.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const token = searchParams.get('token');

    useEffect(() => {
        if (!token) setMessage('Token inválido');
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
        await axios.post('http://localhost:5000/api/auth/reset-password', { token, newPassword, confirmPassword });
        setMessage('Contraseña restablecida. Ve a login.');
        } catch (err) {
        setMessage('Error: ' + err.response?.data?.error);
        }
    };

    return (
        <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
            <label>Nueva contraseña</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full p-2 border rounded mb-4" required />
            <label>Confirmar nueva contraseña</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full p-2 border rounded mb-4" required />
            <button type="submit" className="w-full bg-black text-white py-2 rounded">Restablecer</button>
            <p className="text-center mt-2"><a href="/login" className="text-blue-500">Volver a Iniciar Sesión</a></p>
        </form>
        <p>{message}</p>
        </div>
    );
};

export default ResetPassword;