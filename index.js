// index.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config(); // Carga las variables de entorno desde .env

// Importa las rutas
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const inventoryRoutes = require('./routes/inventory');

const app = express();
const PORT = process.env.PORT || 3000; // Puerto del servidor

// Middleware
app.use(cors()); // Habilita CORS para permitir solicitudes desde el frontend
app.use(bodyParser.json()); // Parsea el cuerpo de las solicitudes como JSON

// Rutas
app.use('/api/auth', authRoutes); // Rutas para autenticación (registro, login)
app.use('/api/products', productRoutes); // Rutas para la gestión de productos
app.use('/api/categories', categoryRoutes); // Rutas para la gestión de categorías
app.use('/api/inventory', inventoryRoutes); // Rutas para los movimientos de inventario

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('API de Gestión de Inventario funcionando!');
});

// Inicia el servidor
app.listen(PORT, () => {
    console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});