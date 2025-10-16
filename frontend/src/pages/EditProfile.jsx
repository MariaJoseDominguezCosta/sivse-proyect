// pages/EditProfile.js
import { useState } from 'react';
import axios from 'axios';

const EditProfile = ({ profile, onSave }) => {
    const [formData, setFormData] = useState(profile);
    const [notification, setNotification] = useState('');

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            await axios.put('http://localhost:5000/api/egresado/profile', formData, { headers: { Authorization: `Bearer ${token}` } });
            setNotification('Perfil actualizado exitosamente.');
            setTimeout(onSave, 1000); // Cierra modal después de notificación
        } catch (err) {
            setNotification('Error al actualizar el perfil: ' + err.response?.data?.error || 'Error en la solicitud');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-1/2">
            <h2 className="text-xl mb-4">Editar Perfil</h2>
            <div className="grid grid-cols-2 gap-4">
            <input name="nombre_completo" value={formData.nombre_completo || ''} onChange={handleChange} placeholder="Nombre completo" className="p-2 border rounded" />
            <input name="telefono" value={formData.telefono || ''} onChange={handleChange} placeholder="Teléfono" className="p-2 border rounded" />
            <input name="generacion" value={formData.generacion || ''} onChange={handleChange} placeholder="Generación" className="p-2 border rounded" />
            <input name="carrera" value={formData.carrera || ''} onChange={handleChange} placeholder="Carrera" className="p-2 border rounded" />
            <input name="email" value={formData.email || ''} onChange={handleChange} placeholder="Email" className="p-2 border rounded" />
            <input name="ubicacion" value={formData.ubicacion || ''} onChange={handleChange} placeholder="Ubicación" className="p-2 border rounded" />
            <input name="empresa_actual" value={formData.empresa_actual || ''} onChange={handleChange} placeholder="Empresa actual" className="p-2 border rounded" />
            <input name="puesto" value={formData.puesto || ''} onChange={handleChange} placeholder="Puesto" className="p-2 border rounded" />
            <input name="modalidad" value={formData.modalidad || ''} onChange={handleChange} placeholder="Modalidad" className="p-2 border rounded" />
            </div>
            <div className="mt-4 flex justify-end gap-2">
            <button type="button" onClick={onSave} className="bg-gray-300 py-1 px-4 rounded">Cancelar</button>
            <button type="submit" className="bg-blue-500 text-white py-1 px-4 rounded">Guardar</button>
            </div>
            {notification && <p className="text-green-500 mt-2">{notification}</p>}
        </form>
        </div>
    );
};

export default EditProfile;