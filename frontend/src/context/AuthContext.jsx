// src/context/AuthContext.jsx
import React, { useState } from 'react';
// Importa el contexto del nuevo archivo
import { AuthContext } from './useAuth.js'; 

// Ahora este archivo solo exporta el componente AuthProvider (y sus dependencias no-componente internas)
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { id: 1, role: 'egresado' | 'admin', name: 'Juana Pérez' }

  const login = (userData) => setUser(userData);
  const logout = () => setUser(null);

  return (
    // Usa el contexto importado
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
