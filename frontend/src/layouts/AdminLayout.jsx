// src/components/AdminLayout.js
import { Outlet, useNavigate } from 'react-router-dom';
import '../assets/AdminLayout.css';
const AdminLayout = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div className="h-screen w-screen bg-blue-50 flex">
        <aside className="bg-blue-900 text-white w-1/5 p-4">
            <div className="mb-8">Logo TecNM</div>
            <ul className="space-y-4">
            <li className="cursor-pointer" onClick={() => navigate('/admin-dashboard')}>🏠 Inicio</li>
            <li className="cursor-pointer" onClick={() => navigate('/admin-dashboard/seguimiento-egresados')}>👤 Seguimiento de Egresados</li>
            <li className="cursor-pointer" onClick={() => navigate('/admin-dashboard/bolsa-trabajo')}>💼 Bolsa de Trabajo</li>
            <li className="cursor-pointer" onClick={() => navigate('/admin-dashboard/gestion-empresas')}>🏢 Gestión de Empresas</li>
            <li className="cursor-pointer" onClick={() => navigate('/admin-dashboard/reportes')}>📊 Reportes y Estadísticas</li>
            </ul>
            <button onClick={handleLogout} className="mt-auto w-full bg-red-500 text-white py-2 rounded">← Cerrar Sesión</button>
        </aside>
        <main className="flex-1 p-8">
            <header className="flex justify-between items-center mb-6">
            <h1 className="text-4xl forced-colors:to-black">SIVSE</h1>
            <div>
            <h2 className="text-3xl">Bienvenido, {localStorage.getItem('userName') || '👤 Administrador'}</h2></div>
            </header>
            <div className="bg-white p-6 rounded-lg shadow-md">
            <Outlet />
            </div>
        </main>
        </div>
    );
};

export default AdminLayout;