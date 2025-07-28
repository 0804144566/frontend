// src/services/authService.js
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/auth'; // URL base de la API de autenticación

// Función para registrar un usuario
const register = (nombre_usuario, email, contrasena) => {
    return axios.post(`${API_URL}/register`, {
        nombre_usuario,
        email,
        contrasena,
    });
};

// Función para iniciar sesión
const login = (email, contrasena) => {
    return axios.post(`${API_URL}/login`, {
        email,
        contrasena,
    })
    .then(response => {
        // Si el inicio de sesión es exitoso, guarda el token y la información del usuario en el almacenamiento local
        if (response.data.token) {
            localStorage.setItem('user', JSON.stringify(response.data.user));
            localStorage.setItem('token', response.data.token);
        }
        return response.data;
    });
};

// Función para cerrar sesión
const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
};

// Función para obtener el usuario actual del almacenamiento local
const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem('user'));
};

// Función para obtener el token JWT
const getToken = () => {
    return localStorage.getItem('token');
};

const authService = {
    register,
    login,
    logout,
    getCurrentUser,
    getToken,
};

export default authService;