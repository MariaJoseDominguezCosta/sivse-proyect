// src/components/Notificaciones.js
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import api from '../utils/axiosConfig';

const socket = io('http://localhost:3000'); // Backend URL

const Notificaciones = () => {
    const [notifs, setNotifs] = useState([]);

    useEffect(() => {
        socket.on('nueva_postulacion', (data) => {
        setNotifs((prev) => [...prev, data.mensaje]);
        });

        // Cargar notifs de BD si necesario (GET /api/notificaciones)
        const fetchNotifs = async () => {
        const res = await api.get('/notificaciones'); // Agrega endpoint si quieres
        setNotifs(res.data.data.map(n => n.mensaje));
        };
        fetchNotifs();

        return () => socket.off('nueva_postulacion');
    }, []);

    return (
        <div>
        <h2>Notificaciones</h2>
        <ul>{notifs.map((n, i) => <li key={i}>{n}</li>)}</ul>
        </div>
    );
};

export default Notificaciones;