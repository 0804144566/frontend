// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppNavbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProductManagement from './pages/ProductManagement';
import InventoryHistory from './pages/InventoryHistory';
import { Container } from 'react-bootstrap';

function App() {
    return (
        <Router>
            <AppNavbar /> {/* La barra de navegación se muestra en todas las páginas */}
            <Container fluid>
                <Routes>
                    {/* Rutas públicas */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Rutas protegidas */}
                    <Route
                        path="/"
                        element={
                            <PrivateRoute>
                                <Dashboard />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/dashboard"
                        element={
                            <PrivateRoute>
                                <Dashboard />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/products"
                        element={
                            <PrivateRoute>
                                <ProductManagement />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/inventory-history"
                        element={
                            <PrivateRoute>
                                <InventoryHistory />
                            </PrivateRoute>
                        }
                    />
                    { /* se puede agregar más rutas protegidas aquí según sea necesario */ }

                    
                </Routes>
            </Container>
        </Router>
    );
}

export default App;
