// src/services/categoryService.js
import axios from 'axios';
import authService from './authService'; // Importa el servicio de autenticación para obtener el token

const API_URL = 'http://localhost:3000/api/categories'; // URL base de la API de categorías

// Configuración para incluir el token de autorización en los encabezados
const authHeader = () => {
    const token = authService.getToken();
    if (token) {
        return { Authorization: `Bearer ${token}` };
    } else {
        return {};
    }
};

// Obtener todas las categorías
const getAllCategories = () => {
    return axios.get(API_URL, { headers: authHeader() });
};

// Obtener una categoría por ID
const getCategoryById = (id) => {
    return axios.get(`${API_URL}/${id}`, { headers: authHeader() });
};

// Crear una nueva categoría
const createCategory = (categoryData) => {
    return axios.post(API_URL, categoryData, { headers: authHeader() });
};

// Actualizar una categoría existente
const updateCategory = (id, categoryData) => {
    return axios.put(`${API_URL}/${id}`, categoryData, { headers: authHeader() });
};

// Eliminar una categoría
const deleteCategory = (id) => {
    return axios.delete(`${API_URL}/${id}`, { headers: authHeader() });
};

const categoryService = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
};

export default categoryService;
