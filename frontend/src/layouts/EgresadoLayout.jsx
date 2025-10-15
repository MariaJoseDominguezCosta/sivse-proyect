// components/EgresadoLayout.js
import { Outlet, useNavigate } from 'react-router-dom';

const EgresadoLayout = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-blue-50 flex">
        <aside className="bg-blue-900 text-white w-1/5 p-4">
            <div className="mb-8">Logo TecNM</div> {/* Reemplaza con <img src="logo-tecnm.png" /> */}
            <ul className="space-y-4">
            <li className="cursor-pointer" onClick={() => navigate('/egresado-dashboard/profile')}>🏠 Perfil</li>
            <li className="cursor-pointer" onClick={() => navigate('/egresado-dashboard/vacantes')}>💼 Vacantes</li>
            <li className="cursor-pointer" onClick={() => navigate('/egresado-dashboard/favoritos')}>❤️ Favoritos</li>
            </ul>
            <button onClick={handleLogout} className="mt-auto w-full bg-red-500 text-white py-2 rounded">← Cerrar Sesión</button>
        </aside>
        <main className="flex-1 p-8">
            <header className="flex justify-between items-center mb-6">
            <h1 className="text-3xl">Bienvenido, {localStorage.getItem('userName') || 'Egresado'}</h1>
            <div>👤 Egresado</div>
            </header>
            <div className="bg-white p-6 rounded-lg shadow-md">
            <Outlet /> {/* Renderiza las vistas hijas aquí */}
            </div>
        </main>
        </div>
    );
};

export default EgresadoLayout;