// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axiosConfig';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          setUser({
            id: payload.sub,
            role: payload.role,
            nombre: payload.nombre || payload.nombre_completo || 'Usuario',
          });
          // Configurar axios
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } catch (err) {
          console.error('Token inválido', err);
          logout();
        }
      }
      setLoading(false);
    };
    loadUser();
  }, [logout]);

  const login = (token) => {
    localStorage.setItem('token', token);
    const payload = JSON.parse(atob(token.split('.')[1]));
    setUser({
      id: payload.sub,
      role: payload.role,
      nombre: payload.nombre || payload.nombre_completo || 'Usuario',
    });
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  };

  const logout = React.useCallback(() => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    navigate('/login');
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};