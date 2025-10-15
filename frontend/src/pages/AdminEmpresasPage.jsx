import React from 'react';
import { useParams } from 'react-router-dom';
import EmpresaForm from '../components/EmpresaForm';

const AdminEmpresasPage = () => {
    const { id } = useParams();
    return (
        <div>
        <h2>{id ? 'Editar Empresa' : 'Nueva Empresa'}</h2>
        <EmpresaForm />
        </div>
    );
};

export default AdminEmpresasPage;