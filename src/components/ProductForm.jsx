// src/components/ProductForm.jsx
import React, { useState, useEffect } from 'react';
import { Form, Button, Modal, Alert } from 'react-bootstrap';
import categoryService from '../services/categoryService'; // Importa el servicio de categorías

const ProductForm = ({ show, handleClose, product, onSave }) => {
    // Estado para los datos del formulario del producto
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        sku: '',
        precio: '',
        stock: '',
        id_categoria: '',
    });
    const [categories, setCategories] = useState([]); // Estado para almacenar las categorías
    const [error, setError] = useState(''); // Estado para mensajes de error
    const [success, setSuccess] = useState(''); // Estado para mensajes de éxito

    // Carga las categorías al montar el componente
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await categoryService.getAllCategories();
                setCategories(response.data);
            } catch (err) {
                console.error('Error al cargar categorías:', err);
                setError('Error al cargar categorías.');
            }
        };
        fetchCategories();
    }, []);

    // Rellena el formulario si se está editando un producto existente
    useEffect(() => {
        if (product) {
            setFormData({
                nombre: product.nombre || '',
                descripcion: product.descripcion || '',
                sku: product.sku || '',
                // Asegúrate de que precio y stock sean números
                precio: product.precio !== undefined ? parseFloat(product.precio) : '',
                stock: product.stock !== undefined ? parseInt(product.stock) : '',
                id_categoria: product.id_categoria || '',
            });
        } else {
            // Limpia el formulario si es un nuevo producto
            setFormData({
                nombre: '',
                descripcion: '',
                sku: '',
                precio: '',
                stock: '',
                id_categoria: '',
            });
        }
        setError('');
        setSuccess('');
    }, [product, show]); // Dependencia 'show' para resetear al abrir/cerrar modal

    // Maneja los cambios en los campos del formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Maneja el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validación básica del lado del cliente
        if (!formData.nombre || !formData.sku || !formData.precio || !formData.stock || !formData.id_categoria) {
            setError('Todos los campos obligatorios deben ser llenados.');
            return;
        }
        if (isNaN(formData.precio) || parseFloat(formData.precio) <= 0) {
            setError('El precio debe ser un número positivo.');
            return;
        }
        if (isNaN(formData.stock) || parseInt(formData.stock) < 0) {
            setError('El stock debe ser un número entero no negativo.');
            return;
        }

        try {
            await onSave(formData); // Llama a la función onSave pasada por props (crear o actualizar)
            setSuccess('Producto guardado exitosamente.');
            // No cerramos el modal aquí, dejamos que el componente padre lo haga después de un éxito
        } catch (err) {
            console.error('Error al guardar producto:', err);
            setError(err.response?.data?.message || 'Error al guardar el producto.');
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>{product ? 'Editar Producto' : 'Agregar Nuevo Producto'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control
                            type="text"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            required
                            placeholder="Nombre del producto"
                            className="rounded"
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Descripción</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="descripcion"
                            value={formData.descripcion}
                            onChange={handleChange}
                            placeholder="Descripción del producto"
                            className="rounded"
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>SKU</Form.Label>
                        <Form.Control
                            type="text"
                            name="sku"
                            value={formData.sku}
                            onChange={handleChange}
                            required
                            placeholder="SKU único"
                            className="rounded"
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Precio</Form.Label>
                        <Form.Control
                            type="number"
                            name="precio"
                            value={formData.precio}
                            onChange={handleChange}
                            required
                            step="0.01"
                            placeholder="0.00"
                            className="rounded"
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Stock</Form.Label>
                        <Form.Control
                            type="number"
                            name="stock"
                            value={formData.stock}
                            onChange={handleChange}
                            required
                            min="0"
                            placeholder="0"
                            className="rounded"
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Categoría</Form.Label>
                        <Form.Select
                            name="id_categoria"
                            value={formData.id_categoria}
                            onChange={handleChange}
                            required
                            className="rounded"
                        >
                            <option value="">Seleccionar Categoría</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.nombre}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <div className="d-grid gap-2">
                        <Button variant="primary" type="submit" className="rounded-pill">
                            Guardar Producto
                        </Button>
                        <Button variant="secondary" onClick={handleClose} className="rounded-pill">
                            Cancelar
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default ProductForm;