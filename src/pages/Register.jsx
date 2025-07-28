// src/pages/Register.jsx
import React, { useState } from 'react';
import { Form, Button, Container, Card, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';

const Register = () => {
    const [nombre_usuario, setNombreUsuario] = useState('');
    const [email, setEmail] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [confirmContrasena, setConfirmContrasena] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    // Maneja el envío del formulario de registro
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validación de contraseñas
        if (contrasena !== confirmContrasena) {
            setError('Las contraseñas no coinciden.');
            return;
        }

        try {
            // Llama al servicio de autenticación para registrar al usuario
            await authService.register(nombre_usuario, email, contrasena);
            setSuccess('Registro exitoso. Ahora puedes iniciar sesión.');
            setTimeout(() => {
                navigate('/login'); // Redirige al login después de un registro exitoso
            }, 2000); // Espera 2 segundos antes de redirigir
        } catch (err) {
            // Muestra un mensaje de error si el registro falla
            console.error('Error de registro:', err);
            setError(err.response?.data?.message || 'Error al registrar usuario.');
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center min-vh-100">
            <Card className="p-4 shadow-lg rounded-4" style={{ maxWidth: '400px', width: '100%' }}>
                <Card.Body>
                    <h2 className="text-center mb-4">Registrarse</h2>
                    {error && <Alert variant="danger" className="rounded">{error}</Alert>}
                    {success && <Alert variant="success" className="rounded">{success}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Nombre de Usuario</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ingresa tu nombre de usuario"
                                value={nombre_usuario}
                                onChange={(e) => setNombreUsuario(e.target.value)}
                                required
                                className="rounded"
                            />
                        </Form.Group>

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

                        <Form.Group className="mb-3">
                            <Form.Label>Confirmar Contraseña</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Confirma tu contraseña"
                                value={confirmContrasena}
                                onChange={(e) => setConfirmContrasena(e.target.value)}
                                required
                                className="rounded"
                            />
                        </Form.Group>

                        <div className="d-grid gap-2 mb-3">
                            <Button variant="primary" type="submit" className="rounded-pill">
                                Registrarse
                            </Button>
                        </div>
                    </Form>
                    <p className="text-center mt-3">
                        ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión aquí</Link>
                    </p>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Register;
