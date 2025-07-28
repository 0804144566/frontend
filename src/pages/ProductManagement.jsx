// src/pages/ProductManagement.jsx
import React, { useState, useEffect } from 'react';
import { Container, Button, Table, Spinner, Alert, Modal, Form } from 'react-bootstrap';
import ProductForm from '../components/ProductForm';
import productService from '../services/productService';
import inventoryService from '../services/inventoryService'; // Para registrar movimientos
import authService from '../services/authService'; // Para obtener el rol del usuario

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showProductModal, setShowProductModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const [showMovementModal, setShowMovementModal] = useState(false);
    const [movementData, setMovementData] = useState({
        id_producto: '',
        tipo_movimiento: 'entrada',
        cantidad: '',
        observaciones: '',
    });
    const [movementError, setMovementError] = useState('');
    const [movementSuccess, setMovementSuccess] = useState('');

    const currentUser = authService.getCurrentUser();
    const isAdmin = currentUser && currentUser.rol === 'admin';

    // Carga los productos al montar el componente
    useEffect(() => {
        fetchProducts();
    }, []);

    // Función para obtener los productos desde la API
    const fetchProducts = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await productService.getAllProducts();
            setProducts(response.data);
        } catch (err) {
            console.error('Error al cargar productos:', err);
            setError(err.response?.data?.message || 'Error al cargar los productos.');
        } finally {
            setLoading(false);
        }
    };

    // Abre el modal para agregar un nuevo producto
    const handleAddProduct = () => {
        setSelectedProduct(null); // Asegura que el formulario esté vacío
        setShowProductModal(true);
    };

    // Abre el modal para editar un producto existente
    const handleEditProduct = (product) => {
        setSelectedProduct(product);
        setShowProductModal(true);
    };

    // Cierra el modal de producto
    const handleCloseProductModal = () => {
        setShowProductModal(false);
        setSelectedProduct(null); // Limpia el producto seleccionado al cerrar
    };

    // Maneja el guardado (creación o actualización) de un producto
    const handleSaveProduct = async (formData) => {
        try {
            if (selectedProduct) {
                await productService.updateProduct(selectedProduct.id, formData);
            } else {
                await productService.createProduct(formData);
            }
            fetchProducts(); // Vuelve a cargar los productos después de guardar
            handleCloseProductModal(); // Cierra el modal
        } catch (err) {
            console.error('Error al guardar producto:', err);
            throw err; // Lanza el error para que el ProductForm lo maneje
        }
    };

    // Abre el modal de confirmación para eliminar un producto
    const handleDeleteConfirm = (product) => {
        setProductToDelete(product);
        setShowConfirmModal(true);
    };

    // Cierra el modal de confirmación
    const handleCloseConfirmModal = () => {
        setShowConfirmModal(false);
        setProductToDelete(null);
    };

    // Elimina el producto después de la confirmación
    const handleDeleteProduct = async () => {
        if (!productToDelete) return;
        try {
            await productService.deleteProduct(productToDelete.id);
            fetchProducts(); // Vuelve a cargar los productos
            handleCloseConfirmModal(); // Cierra el modal de confirmación
        } catch (err) {
            console.error('Error al eliminar producto:', err);
            setError(err.response?.data?.message || 'Error al eliminar el producto.');
            handleCloseConfirmModal();
        }
    };

    // Abre el modal para registrar un movimiento de inventario
    const handleRecordMovement = (product) => {
        setMovementData({
            id_producto: product.id,
            tipo_movimiento: 'entrada', // Por defecto 'entrada'
            cantidad: '',
            observaciones: '',
        });
        setShowMovementModal(true);
        setMovementError('');
        setMovementSuccess('');
    };

    // Cierra el modal de movimiento de inventario
    const handleCloseMovementModal = () => {
        setShowMovementModal(false);
        setMovementData({
            id_producto: '',
            tipo_movimiento: 'entrada',
            cantidad: '',
            observaciones: '',
        });
    };

    // Maneja los cambios en el formulario de movimiento
    const handleMovementChange = (e) => {
        const { name, value } = e.target;
        setMovementData({ ...movementData, [name]: value });
    };

    // Envía el formulario de movimiento de inventario
    const handleSubmitMovement = async (e) => {
        e.preventDefault();
        setMovementError('');
        setMovementSuccess('');

        if (!movementData.cantidad || isNaN(movementData.cantidad) || parseInt(movementData.cantidad) <= 0) {
            setMovementError('La cantidad debe ser un número positivo.');
            return;
        }

        try {
            await inventoryService.recordMovement(movementData);
            setMovementSuccess('Movimiento de inventario registrado exitosamente.');
            fetchProducts(); // Actualiza la lista de productos para reflejar el nuevo stock
            setTimeout(() => {
                handleCloseMovementModal();
            }, 1500); // Cierra el modal después de un breve retraso
        } catch (err) {
            console.error('Error al registrar movimiento:', err);
            setMovementError(err.response?.data?.message || 'Error al registrar el movimiento de inventario.');
        }
    };

    if (loading) {
        return (
            <Container className="text-center mt-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </Spinner>
                <p className="mt-2">Cargando productos...</p>
            </Container>
        );
    }

    return (
        <Container className="mt-4">
            <h1 className="mb-4">Gestión de Productos</h1>
            {error && <Alert variant="danger" className="rounded">{error}</Alert>}

            {isAdmin && (
                <div className="mb-3 text-end">
                    <Button variant="primary" onClick={handleAddProduct} className="rounded-pill">
                        Agregar Nuevo Producto
                    </Button>
                </div>
            )}

            {products.length > 0 ? (
                <div className="table-responsive">
                    <Table striped bordered hover responsive className="rounded-3 shadow-sm">
                        <thead className="table-dark">
                            <tr>
                                <th>Nombre</th>
                                <th>Descripción</th>
                                <th>SKU</th>
                                <th>Precio</th>
                                <th>Stock</th>
                                <th>Categoría</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product.id}>
                                    <td>{product.nombre}</td>
                                    <td>{product.descripcion}</td>
                                    <td>{product.sku}</td>
                                    <td>${product.precio}</td>
                                    <td>{product.stock}</td>
                                    <td>{product.nombre_categoria || 'N/A'}</td>
                                    <td>
                                        <div className="d-flex gap-2">
                                            {isAdmin && (
                                                <>
                                                    <Button variant="info" size="sm" onClick={() => handleEditProduct(product)} className="rounded-pill">
                                                        Editar
                                                    </Button>
                                                    <Button variant="danger" size="sm" onClick={() => handleDeleteConfirm(product)} className="rounded-pill">
                                                        Eliminar
                                                    </Button>
                                                </>
                                            )}
                                            <Button variant="success" size="sm" onClick={() => handleRecordMovement(product)} className="rounded-pill">
                                                Movimiento
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            ) : (
                <Alert variant="info" className="text-center rounded">No hay productos registrados. ¡Agrega uno!</Alert>
            )}

            {/* Modal para Agregar/Editar Producto */}
            <ProductForm
                show={showProductModal}
                handleClose={handleCloseProductModal}
                product={selectedProduct}
                onSave={handleSaveProduct}
            />

            {/* Modal de Confirmación de Eliminación */}
            <Modal show={showConfirmModal} onHide={handleCloseConfirmModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar Eliminación</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    ¿Estás seguro de que quieres eliminar el producto <strong>{productToDelete?.nombre}</strong>?
                    Esta acción no se puede deshacer.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseConfirmModal} className="rounded-pill">
                        Cancelar
                    </Button>
                    <Button variant="danger" onClick={handleDeleteProduct} className="rounded-pill">
                        Eliminar
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal para Registrar Movimiento de Inventario */}
            <Modal show={showMovementModal} onHide={handleCloseMovementModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Registrar Movimiento de Inventario</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {movementError && <Alert variant="danger" className="rounded">{movementError}</Alert>}
                    {movementSuccess && <Alert variant="success" className="rounded">{movementSuccess}</Alert>}
                    <Form onSubmit={handleSubmitMovement}>
                        <Form.Group className="mb-3">
                            <Form.Label>Producto</Form.Label>
                            <Form.Control
                                type="text"
                                value={products.find(p => p.id === movementData.id_producto)?.nombre || ''}
                                disabled
                                className="rounded"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Tipo de Movimiento</Form.Label>
                            <Form.Select
                                name="tipo_movimiento"
                                value={movementData.tipo_movimiento}
                                onChange={handleMovementChange}
                                required
                                className="rounded"
                            >
                                <option value="entrada">Entrada</option>
                                <option value="salida">Salida</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Cantidad</Form.Label>
                            <Form.Control
                                type="number"
                                name="cantidad"
                                value={movementData.cantidad}
                                onChange={handleMovementChange}
                                required
                                min="1"
                                placeholder="Cantidad"
                                className="rounded"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Observaciones</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="observaciones"
                                value={movementData.observaciones}
                                onChange={handleMovementChange}
                                placeholder="Notas adicionales sobre el movimiento"
                                className="rounded"
                            />
                        </Form.Group>
                        <div className="d-grid gap-2">
                            <Button variant="primary" type="submit" className="rounded-pill">
                                Registrar Movimiento
                            </Button>
                            <Button variant="secondary" onClick={handleCloseMovementModal} className="rounded-pill">
                                Cancelar
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default ProductManagement;
