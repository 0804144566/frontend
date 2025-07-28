// src/pages/InventoryHistory.jsx
import React, { useState, useEffect } from 'react';
import { Container, Table, Spinner, Alert } from 'react-bootstrap';
import inventoryService from '../services/inventoryService';

const InventoryHistory = () => {
    const [movements, setMovements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Carga el historial de movimientos al montar el componente
    useEffect(() => {
        const fetchHistory = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await inventoryService.getInventoryHistory();
                setMovements(response.data);
            } catch (err) {
                console.error('Error al cargar historial de movimientos:', err);
                setError(err.response?.data?.message || 'Error al cargar el historial de movimientos.');
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    if (loading) {
        return (
            <Container className="text-center mt-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </Spinner>
                <p className="mt-2">Cargando historial de movimientos...</p>
            </Container>
        );
    }

    return (
        <Container className="mt-4">
            <h1 className="mb-4">Historial de Movimientos de Inventario</h1>
            {error && <Alert variant="danger" className="rounded">{error}</Alert>}

            {movements.length > 0 ? (
                <div className="table-responsive">
                    <Table striped bordered hover responsive className="rounded-3 shadow-sm">
                        <thead className="table-dark">
                            <tr>
                                <th>Producto</th>
                                <th>Tipo</th>
                                <th>Cantidad</th>
                                <th>Fecha</th>
                                <th>Usuario</th>
                                <th>Observaciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {movements.map((movement) => (
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
                                    <td>{movement.observaciones || 'Sin observaciones'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            ) : (
                <Alert variant="info" className="text-center rounded">No hay movimientos de inventario registrados.</Alert>
            )}
        </Container>
    );
};

export default InventoryHistory;
