import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

const PrivateRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/" replace />;

  try {
    const decoded = jwtDecode(token);
    if (allowedRoles.includes(decoded.role)) {
      return <Outlet />;
    } else {
      return <Navigate to="/" replace />;
    }
  } catch (err) {
    console.error('Error decoding token', err);
    localStorage.removeItem('token');
    return <Navigate to="/" replace />;
  }
};

export default PrivateRoute;