// pages/Profile.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import EditProfile from './EditProfile';

const EgresadoDashboard = () => {
    const [profile, setProfile] = useState({});
    const [notification, setNotification] = useState('');
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        axios.get('http://localhost:5000/api/egresado/profile').then(res => {
        setProfile(res.data);
        localStorage.setItem('userName', res.data.nombre_completo);
        setNotification('Perfil cargado exitosamente.');
        setTimeout(() => setNotification(''), 3000); // Desaparece después de 3s
        }).catch(() => setNotification('Error al cargar el perfil.'));
    }, []);

    const handleEditClick = () => setEditing(true);

    if (editing) {
        return <EditProfile profile={profile} onSave={() => setEditing(false)} />;
    }

    return (
        <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-100 p-4 rounded">
            <img src={profile.foto_perfil || 'default.jpg'} alt="Foto" className="rounded-full w-20 mb-2" />
            <p><strong>Nombre:</strong> {profile.nombre_completo}</p>
            <p><strong>Generación:</strong> {profile.generacion}</p>
            <p><strong>Carrera:</strong> {profile.carrera}</p>
            <p><strong>Estado laboral:</strong> {profile.estado_laboral}</p>
            <button onClick={handleEditClick} className="mt-2 bg-blue-500 text-white py-1 px-2 rounded">Editar Datos</button>
        </div>
        <div className="bg-gray-100 p-4 rounded">
            <h2 className="text-lg font-bold">Información Adicional</h2>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Teléfono:</strong> {profile.telefono}</p>
            <p><strong>Ubicación:</strong> {profile.ubicacion}</p>
        </div>
        {notification && <p className="text-green-500 mt-4 col-span-2">{notification}</p>}
        </div>
    );
};

export default EgresadoDashboard;