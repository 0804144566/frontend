// src/services/productService.js
import axios from 'axios';
import authService from './authService'; // Importa el servicio de autenticación para obtener el token

const API_URL = 'http://localhost:3000/api/products'; // URL base de la API de productos

// Configuración para incluir el token de autorización en los encabezados
const authHeader = () => {
    const token = authService.getToken();
    if (token) {
        return { Authorization: `Bearer ${token}` };
    } else {
        return {};
    }
};

// Obtener todos los productos
const getAllProducts = () => {
    return axios.get(API_URL, { headers: authHeader() });
};

// Obtener un producto por ID
const getProductById = (id) => {
    return axios.get(`${API_URL}/${id}`, { headers: authHeader() });
};

// Crear un nuevo producto
const createProduct = (productData) => {
    return axios.post(API_URL, productData, { headers: authHeader() });
};

// Actualizar un producto existente
const updateProduct = (id, productData) => {
    return axios.put(`${API_URL}/${id}`, productData, { headers: authHeader() });
};

// Eliminar un producto
const deleteProduct = (id) => {
    return axios.delete(`${API_URL}/${id}`, { headers: authHeader() });
};

const productService = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
};

export default productService;