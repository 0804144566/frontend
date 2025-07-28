// src/components/Navbar.jsx
import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const AppNavbar = () => {
    const navigate = useNavigate();
    const currentUser = authService.getCurrentUser();

    // Función para manejar el cierre de sesión
    const handleLogout = () => {
        authService.logout(); // Llama a la función de cierre de sesión del servicio
        navigate('/login'); // Redirige al usuario a la página de login
    };

    return (
        <Navbar bg="dark" variant="dark" expand="lg" className="mb-4 rounded-bottom-3">
            <Container>
                <Navbar.Brand as={Link} to="/">Gestión de Inventario</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        {currentUser ? (
                            <>
                                <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
                                <Nav.Link as={Link} to="/products">Productos</Nav.Link>
                                <Nav.Link as={Link} to="/inventory-history">Historial</Nav.Link>
                                {/* Opcional: Enlace a categorías si se implementa una página dedicada */}
                                {/* <Nav.Link as={Link} to="/categories">Categorías</Nav.Link> */}
                            </>
                        ) : (
                            <>
                                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                                <Nav.Link as={Link} to="/register">Registro</Nav.Link>
                            </>
                        )}
                    </Nav>
                    <Nav>
                        {currentUser && (
                            <>
                                <Navbar.Text className="me-3">
                                    Bienvenido, {currentUser.nombre_usuario} ({currentUser.rol})
                                </Navbar.Text>
                                <Nav.Link onClick={handleLogout}>Cerrar Sesión</Nav.Link>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default AppNavbar;