// src/context/useAuth.js
import { createContext, useContext } from 'react';

// Exporta el contexto (aunque a menudo se mantiene junto con el provider)
// En este caso lo movemos para evitar una exportación no-componente en el Provider file
export const AuthContext = createContext(); 

// Exporta el hook personalizado
export const useAuth = () => useContext(AuthContext);