// src/services/inventoryService.js
import axios from 'axios';
import authService from './authService'; // Importa el servicio de autenticación para obtener el token

const API_URL = 'http://localhost:3000/api/inventory'; // URL base de la API de movimientos de inventario

// Configuración para incluir el token de autorización en los encabezados
const authHeader = () => {
    const token = authService.getToken();
    if (token) {
        return { Authorization: `Bearer ${token}` };
    } else {
        return {};
    }
};

// Registrar un movimiento de inventario (entrada/salida)
const recordMovement = (movementData) => {
    return axios.post(API_URL, movementData, { headers: authHeader() });
};

// Obtener el historial de movimientos de inventario
const getInventoryHistory = () => {
    return axios.get(`${API_URL}/history`, { headers: authHeader() });
};

const inventoryService = {
    recordMovement,
    getInventoryHistory,
};

export default inventoryService;
