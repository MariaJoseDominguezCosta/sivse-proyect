// pages/ForgotPassword.js
import { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
        await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
        setMessage('Enlace enviado a tu email');
        } catch (err) {
        setMessage('Error: ' + err.response?.data?.error);
        }
    };

    return (
        <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 border rounded mb-4" required />
            <div className="flex justify-between">
            <button type="button" onClick={() => window.location.href='/login'} className="bg-gray-200 py-2 px-4 rounded">Cancelar</button>
            <button type="submit" className="bg-black text-white py-2 px-4 rounded">Enviar enlace</button>
            </div>
        </form>
        <p>{message}</p>
        </div>
    );
};

export default ForgotPassword;