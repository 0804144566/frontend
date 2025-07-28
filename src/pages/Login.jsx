// src/pages/Login.jsx
import React, { useState } from 'react';
import { Form, Button, Container, Card, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';

const Login = () => {
    const [email, setEmail] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Maneja el envío del formulario de login
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Limpia cualquier error previo

        try {
            // Llama al servicio de autenticación para iniciar sesión
            await authService.login(email, contrasena);
            navigate('/dashboard'); // Redirige al dashboard si el login es exitoso
        } catch (err) {
            // Muestra un mensaje de error si el login falla
            console.error('Error de login:', err);
            setError(err.response?.data?.message || 'Error al iniciar sesión. Verifica tus credenciales.');
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center min-vh-100">
            <Card className="p-4 shadow-lg rounded-4" style={{ maxWidth: '400px', width: '100%' }}>
                <Card.Body>
                    <h2 className="text-center mb-4">Iniciar Sesión</h2>
                    {error && <Alert variant="danger" className="rounded">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Ingresa tu email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="rounded"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Contraseña</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Ingresa tu contraseña"
                                value={contrasena}
                                onChange={(e) => setContrasena(e.target.value)}
                                required
                                className="rounded"
                            />
                        </Form.Group>

                        <div className="d-grid gap-2 mb-3">
                            <Button variant="primary" type="submit" className="rounded-pill">
                                Iniciar Sesión
                            </Button>
                        </div>
                    </Form>
                    <p className="text-center mt-3">
                        ¿No tienes una cuenta? <Link to="/register">Regístrate aquí</Link>
                    </p>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Login;