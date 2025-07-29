# actividad-08
tarea #8
Sistema de Gestión de Inventario
Este es un sistema completo de gestión de inventario desarrollado con un backend en Node.js (Express) y una base de datos PostgreSQL, y un frontend construido con React y Bootstrap. La aplicación permite a los usuarios registrarse, iniciar sesión, y gestionar productos y movimientos de inventario, con un sistema de roles para diferenciar permisos.

🚀 Características
Autenticación de Usuarios: Registro y login seguro con JWT (JSON Web Tokens).

Roles de Usuario: Diferenciación entre admin y usuario para controlar el acceso a funcionalidades.

Gestión de Productos:

Listado de todos los productos.

Visualización de detalles de un producto.

Creación, edición y eliminación de productos (solo para admin).

Gestión de Categorías:

Listado de categorías.

Creación, edición y eliminación de categorías (solo para admin).

Movimientos de Inventario:

Registro de entradas y salidas de productos.

Actualización automática del stock de productos.

Historial detallado de movimientos.

Dashboard: Vista general del inventario, incluyendo total de productos, productos con bajo stock y movimientos recientes.

Diseño Responsivo: Interfaz de usuario adaptable a diferentes tamaños de pantalla gracias a Bootstrap.

🛠️ Tecnologías Utilizadas
Backend (Node.js / Express)
Node.js: Entorno de ejecución de JavaScript.

Express.js: Framework web para Node.js.

PostgreSQL: Base de datos relacional.

pg: Cliente de PostgreSQL para Node.js.

bcrypt: Para el hashing seguro de contraseñas.

jsonwebtoken: Para la creación y verificación de JWTs.

dotenv: Para cargar variables de entorno desde un archivo .env.

body-parser: Middleware para parsear cuerpos de solicitudes HTTP.

cors: Middleware para habilitar Cross-Origin Resource Sharing.

Frontend (React)
React: Biblioteca de JavaScript para construir interfaces de usuario.

Vite: Herramienta de construcción rápida para proyectos web modernos.

React-Bootstrap: Componentes de Bootstrap para React.

React Router DOM: Para el enrutamiento declarativo en la aplicación.

Axios: Cliente HTTP basado en promesas para el navegador y Node.js.

CSS Personalizado: Para estilos adicionales y ajustes de diseño.

📁 Estructura del Proyecto
El proyecto está dividido en dos directorios principales: inventario-backend y frontend.

.
├── inventario-backend/
│   ├── node_modules/
│   ├── .env                 # Variables de entorno del backend
│   ├── package.json
│   ├── index.js             # Archivo principal del servidor
│   ├── db.js                # Configuración de la conexión a la base de datos
│   ├── middleware/
│   │   └── auth.js          # Middleware de autenticación y autorización
│   ├── routes/
│   │   ├── auth.js          # Rutas de autenticación
│   │   ├── products.js      # Rutas de productos
│   │   ├── categories.js    # Rutas de categorías
│   │   └── inventory.js     # Rutas de movimientos de inventario
│   └── controllers/
│       ├── authController.js
│       ├── productController.js
│       ├── categoryController.js
│       └── inventoryController.js
│
└── frontend/
    ├── node_modules/
    ├── public/
    ├── src/
    │   ├── components/      # Componentes React reutilizables
    │   │   ├── Navbar.jsx
    │   │   ├── PrivateRoute.jsx
    │   │   └── ProductForm.jsx
    │   ├── pages/           # Páginas de la aplicación
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── ProductManagement.jsx
    │   │   └── InventoryHistory.jsx
    │   ├── services/        # Lógica para interactuar con la API del backend
    │   │   ├── authService.js
    │   │   ├── productService.js
    │   │   ├── categoryService.js
    │   │   └── inventoryService.js
    │   ├── App.jsx          # Componente principal de React y enrutamiento
    │   ├── main.jsx         # Punto de entrada de la aplicación React
    │   └── index.css        # Estilos globales de la aplicación
    ├── .gitignore
    ├── index.html           # Archivo HTML principal
    ├── package.json
    └── vite.config.js

📋 Requisitos Previos
Antes de ejecutar la aplicación, asegúrate de tener instalado lo siguiente:

Node.js (versión 14 o superior recomendada)

npm (viene con Node.js)

PostgreSQL (servidor de base de datos)

Un cliente de base de datos como pgAdmin 4 o DBeaver (opcional, pero recomendado para la gestión de la DB).

⚙️ Configuración del Entorno
Sigue estos pasos para configurar y ejecutar la aplicación.

1. Configuración de la Base de Datos (PostgreSQL)
Crea una nueva base de datos en tu servidor PostgreSQL. Puedes llamarla inventario_db.

Si usas pgAdmin 4: Haz clic derecho en "Databases" -> "Create" -> "Database...", y nombra la base de datos inventario_db.

Ejecuta el script SQL para crear las tablas necesarias.

Abre una "Query Tool" en pgAdmin 4 (o DBeaver) conectada a inventario_db.

Pega y ejecuta el contenido del archivo db-creation-sql.sql (que te proporcioné anteriormente en nuestro chat). Este script creará las tablas usuarios, categorias, productos y movimientos_inventario.

-- Ejemplo de estructura de tablas (el script completo es más detallado)
CREATE TABLE usuarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre_usuario VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    contrasena_hash VARCHAR(255) NOT NULL,
    rol VARCHAR(20) DEFAULT 'usuario', -- 'admin' o 'usuario'
    fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ... (otras tablas como categorias, productos, movimientos_inventario)

Crea un usuario administrador (opcional, pero recomendado para pruebas):

Puedes registrar un usuario normal a través de la interfaz de registro del frontend.

Luego, en pgAdmin 4, actualiza el rol de ese usuario a admin:

UPDATE usuarios
SET rol = 'admin'
WHERE email = 'tu_email_registrado@example.com';

Recuerda cerrar sesión y volver a iniciar sesión en la aplicación para que el cambio de rol surta efecto.

2. Configuración del Backend
Navega al directorio del backend:

cd inventario-backend

Instala las dependencias:

npm install

Crea un archivo .env en la raíz del directorio inventario-backend y configura las siguientes variables (reemplaza los valores con los tuyos):

DB_USER=postgres             # Tu usuario de PostgreSQL
DB_HOST=localhost            # Host de tu base de datos (normalmente localhost)
DB_DATABASE=inventario_db    # Nombre de la base de datos creada
DB_PASSWORD=tu_contrasena    # Contraseña de tu usuario de PostgreSQL
DB_PORT=5432                 # Puerto de PostgreSQL (por defecto 5432)
JWT_SECRET=una_cadena_muy_larga_y_segura_para_jwt_inventario_app # Clave secreta fuerte para JWT
PORT=3000                    # Puerto para el servidor backend

Inicia el servidor backend:

node index.js

El servidor debería iniciarse y mostrar el mensaje: Servidor backend corriendo en http://localhost:3000.

3. Configuración del Frontend
Navega al directorio del frontend:

cd frontend

Instala las dependencias:

npm install

Inicia el servidor de desarrollo del frontend:

npm run dev

El servidor de desarrollo de Vite se iniciará y te proporcionará una URL (normalmente http://localhost:5173/).

🚀 Uso de la Aplicación
Abre tu navegador web y ve a la URL proporcionada por el servidor de desarrollo del frontend (ej. http://localhost:5173/).

Serás redirigido a la página de Login.

Registro: Si no tienes una cuenta, haz clic en "Regístrate aquí" para crear una nueva cuenta.

Inicio de Sesión: Ingresa tus credenciales para acceder al Dashboard.

Navegación:

Dashboard: Vista general del inventario.

Productos: Gestión de productos (crear, editar, eliminar, registrar movimientos).

Historial: Ver el historial de todos los movimientos de inventario.

Roles:

Los usuarios con rol usuario pueden ver productos y registrar movimientos de inventario.

Los usuarios con rol admin tienen acceso completo para crear, editar y eliminar productos y categorías, además de todas las funcionalidades de usuario.

📜 Scripts Disponibles
Backend (inventario-backend)
npm install: Instala las dependencias del proyecto.

node index.js: Inicia el servidor backend.

Frontend (frontend)
npm install: Instala las dependencias del proyecto.

npm run dev: Inicia el servidor de desarrollo de React con Vite.

npm run build: Compila la aplicación para producción.

npm run lint: Ejecuta el linter (si configurado).

npm run preview: Sirve la build de producción localmente.

🤝 Contribución
Si deseas contribuir a este proyecto, por favor, sigue estos pasos:

Haz un "fork" de este repositorio.

Crea una nueva rama (git checkout -b feature/nueva-funcionalidad).

Realiza tus cambios y haz "commit" de ellos (git commit -m 'feat: añade nueva funcionalidad X').

Sube tus cambios a tu "fork" (git push origin feature/nueva-funcionalidad).

Abre un "Pull Request" describiendo tus cambios.

📄 Licencia
Este proyecto todavia no tiene licencia.
