// src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../services/authService';

// Componente para proteger rutas que requieren autenticación
const PrivateRoute = ({ children, roles }) => {
    const currentUser = authService.getCurrentUser();

    // Si no hay usuario autenticado, redirige a la página de login
    if (!currentUser) {
        return <Navigate to="/login" replace />;
    }

    // Si se especifican roles y el usuario no tiene uno de ellos, redirige a una página de acceso denegado o al dashboard
    if (roles && roles.length > 0 && !roles.includes(currentUser.rol)) {
        return <Navigate to="/dashboard" replace />; // O a una página de "Acceso Denegado"
    }

    // Si el usuario está autenticado y tiene el rol correcto, renderiza los componentes hijos
    return children;
};

export default PrivateRoute;
