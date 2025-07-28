// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Alert, Button } from 'react-bootstrap';
import productService from '../services/productService';
import inventoryService from '../services/inventoryService';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [totalProducts, setTotalProducts] = useState(0);
    const [lowStockProducts, setLowStockProducts] = useState([]);
    const [recentMovements, setRecentMovements] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Obtener todos los productos
                const productsRes = await productService.getAllProducts();
                setTotalProducts(productsRes.data.length);
                // Filtrar productos con bajo stock (ej. stock < 10)
                setLowStockProducts(productsRes.data.filter(p => p.stock < 10));

                // Obtener historial de movimientos (últimos 5)
                const movementsRes = await inventoryService.getInventoryHistory();
                setRecentMovements(movementsRes.data.slice(0, 5)); // Mostrar los 5 más recientes

            } catch (err) {
                console.error('Error al cargar datos del dashboard:', err);
                setError('Error al cargar la información del dashboard.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <Container className="text-center mt-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </Spinner>
                <p className="mt-2">Cargando datos del panel...</p>
            </Container>
        );
    }

    return (
        <Container className="mt-4">
            <h1 className="mb-4">Panel de Inventario</h1>
            {error && <Alert variant="danger" className="rounded">{error}</Alert>}

            <Row className="mb-4">
                <Col md={4}>
                    <Card className="text-center p-3 rounded-4 shadow-sm">
                        <Card.Body>
                            <Card.Title className="h5">Total de Productos</Card.Title>
                            <Card.Text className="display-4 fw-bold text-primary">{totalProducts}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="text-center p-3 rounded-4 shadow-sm">
                        <Card.Body>
                            <Card.Title className="h5">Productos con Bajo Stock</Card.Title>
                            <Card.Text className="display-4 fw-bold text-warning">{lowStockProducts.length}</Card.Text>
                            {lowStockProducts.length > 0 && (
                                <Link to="/products" className="btn btn-sm btn-outline-warning rounded-pill">Ver Productos</Link>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="text-center p-3 rounded-4 shadow-sm">
                        <Card.Body>
                            <Card.Title className="h5">Movimientos Recientes</Card.Title>
                            <Card.Text className="display-4 fw-bold text-info">{recentMovements.length}</Card.Text>
                            {recentMovements.length > 0 && (
                                <Link to="/inventory-history" className="btn btn-sm btn-outline-info rounded-pill">Ver Historial</Link>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="mt-5">
                <Col md={12}>
                    <Card className="p-4 rounded-4 shadow-sm">
                        <Card.Body>
                            <h3 className="mb-3">Últimos Movimientos de Inventario</h3>
                            {recentMovements.length > 0 ? (
                                <div className="table-responsive">
                                    <table className="table table-striped table-hover rounded">
                                        <thead>
                                            <tr>
                                                <th>Producto</th>
                                                <th>Tipo</th>
                                                <th>Cantidad</th>
                                                <th>Fecha</th>
                                                <th>Usuario</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {recentMovements.map(movement => (
                                                <tr key={movement.id}>
                                                    <td>{movement.nombre_producto}</td>
                                                    <td>
                                                        <span className={`badge ${movement.tipo_movimiento === 'entrada' ? 'bg-success' : 'bg-danger'} rounded-pill`}>
                                                            {movement.tipo_movimiento.charAt(0).toUpperCase() + movement.tipo_movimiento.slice(1)}
                                                        </span>
                                                        </td>
                                                    <td>{movement.cantidad}</td>
                                                    <td>{new Date(movement.fecha_movimiento).toLocaleString()}</td>
                                                    <td>{movement.nombre_usuario || 'N/A'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <Alert variant="info" className="text-center rounded">No hay movimientos recientes para mostrar.</Alert>
                            )}
                            <div className="text-center mt-3">
                                <Link to="/inventory-history" className="btn btn-outline-secondary rounded-pill">Ver Historial Completo</Link>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Dashboard;

