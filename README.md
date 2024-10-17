# Proyecto de Backend - Coderhouse Entrega Final

Este es el proyecto final del curso de Backend en Coderhouse, que implementa un **eCommerce** completo con funcionalidades avanzadas de gestión de usuarios, carritos de compra, productos y tickets de compra. El proyecto utiliza **Node.js** y **MongoDB** con una arquitectura profesional que incluye DAO, DTO, Repository, autenticación y autorización con JWT y Passport.js.

## Características del Proyecto

### Backend

- **Gestión de Usuarios**:
  - **Modelo de Usuario**:
    - Campos:
      - `name`: Nombre del usuario.
      - `lastName`: Apellido del usuario.
      - `email`: Correo electrónico único.
      - `age`: Edad del usuario.
      - `password`: Contraseña encriptada con bcrypt.
      - `cart`: ID que referencia al carrito del usuario.
      - `role`: Rol del usuario (default: ‘user’, puede ser ‘admin’).
    - Se utiliza **bcrypt** para encriptar contraseñas.

- **Gestión de Carritos**:
  - **Creación automática de carritos** al registrar un usuario.
  - Los usuarios pueden **agregar, actualizar y eliminar productos** en su carrito.
  - Solo los **usuarios autenticados** pueden gestionar su carrito.
  - Ruta `/api/carts/:cid/purchase` para finalizar la compra del carrito y generar un ticket.

- **Gestión de Productos**:
  - Los productos tienen stock y están vinculados con categorías.
  - Solo los **administradores** pueden **crear, actualizar y eliminar** productos.

- **Autenticación y Autorización**:
  - **Passport.js** y **JWT** se usan para la autenticación y gestión de sesiones.
  - **Middleware de autorización**:
    - Solo los **administradores** pueden gestionar productos.
    - Solo los **usuarios** pueden gestionar su carrito.

- **Patrón Repository y DAO**:
  - Implementación del **patrón Repository** para abstraer la lógica de acceso a la base de datos.
  - DAO (Data Access Object) utilizado para interactuar con MongoDB de manera estructurada.

- **DTO (Data Transfer Object)**:
  - Los **DTOs** se implementan para estructurar y enviar datos sensibles al frontend, evitando la exposición de información innecesaria.

- **Modelo de Ticket**:
  - Al finalizar una compra, se genera un **ticket** con los detalles:
    - `code`: Código único del ticket.
    - `purchase_datetime`: Fecha y hora de la compra.
    - `amount`: Total de la compra.
    - `purchaser`: Correo del usuario comprador.

### Rutas API

- **Usuarios**:
  - `POST /register`: Crear un nuevo usuario.
  - `POST /login`: Autenticación de usuario con JWT.
  - `GET /profile`: Mostrar perfil del usuario autenticado.
  - `GET /api/sessions/current`: Validar sesión actual y obtener datos del usuario.

- **Productos**:
  - `GET /api/products`: Obtener lista de productos con paginación.
  - `POST /api/products`: Crear un nuevo producto (solo admin).
  - `PUT /api/products/:pid`: Actualizar un producto por ID (solo admin).
  - `DELETE /api/products/:pid`: Eliminar un producto por ID (solo admin).

- **Carritos**:
  - `POST /api/carts`: Crear un nuevo carrito.
  - `GET /api/carts/:cid`: Obtener un carrito por ID.
  - `PUT /api/carts/:cid`: Actualizar productos en el carrito.
  - `DELETE /api/carts/:cid`: Eliminar un carrito por ID.
  - `POST /api/carts/:cid/purchase`: Finalizar la compra y generar un ticket.

### Frontend

- **Vistas de Productos**:
  - **Página de Productos**: Muestra una lista de productos con paginación y opciones de compra.
  - **Vista de Producto en Tiempo Real**: Accesible solo para administradores, actualiza la lista de productos en tiempo real.

- **Vistas de Usuario**:
  - **Registro**: Formulario para registrar nuevos usuarios.
  - **Inicio de sesión**: Formulario para autenticación de usuarios.
  - **Perfil**: Vista del perfil del usuario autenticado.

- **Vistas de Carrito**:
  - Visualización de los productos agregados al carrito del usuario.

### Funcionalidades de Tiempo Real

- **Socket.io**:
  - Utilizado para actualizar la lista de productos en tiempo real, permitiendo a los administradores gestionar productos de forma dinámica sin recargar la página.

### Estilos

- **CSS personalizado** para un diseño simple y eficiente, con **Tailwind CSS** utilizado para estilos rápidos y responsive.

## Tecnologías Utilizadas

- **Node.js**: Plataforma de desarrollo backend.
- **Express**: Framework para aplicaciones web y APIs.
- **MongoDB**: Base de datos NoSQL.
- **Mongoose**: ODM para modelar los datos en MongoDB.
- **JWT**: Para la gestión de sesiones con autenticación basada en tokens.
- **Bcrypt**: Para el hashing de contraseñas.
- **Passport.js**: Middleware para la autenticación con soporte para estrategias JWT.
- **Socket.io**: Para funcionalidades en tiempo real en el frontend.
- **Handlebars**: Motor de plantillas para generar vistas dinámicas en el frontend.
- **Tailwind CSS**: Framework CSS para el diseño responsivo y estilizado.

## Ejecución del Proyecto

1. Clona el repositorio:
   `git clone <URL_DEL_REPOSITORIO>`

2. Instala las dependencias:
  `npm install`

3. Configura las variables de entorno en un archivo.
-.env:

   `-JWT_SECRET: Clave secreta para firmar tokens JWT.`
   
   `-MONGO_URI: Conexión a la base de datos MongoDB.`
   
   `-PORT: Puerto donde se ejecutará la aplicación.`

5. Ejecuta el servidor:
  `npm run dev`

## Autor

Patricio Pittana - [Linkedin](https://www.linkedin.com/in/patricio-pittana-2185b6177/) - [GitHub](https://github.com/Lunatico0) - [Web](https://pittanapatricio.vercel.app)

*ProyectoEcommerceBackend*
```
├─ .gitignore
├─ package.json
├─ README.md
└─ src
   ├─ app.js
   ├─ config
   │  └─ passport.config.js
   ├─ controllers
   │  └─ userController.js
   ├─ dao
   │  ├─ cartDao.js
   │  ├─ productDao.js
   │  ├─ userDao.js
   │  └─ models
   │     ├─ cart.model.js
   │     ├─ product.model.js
   │     ├─ ticket.model.js
   │     └─ user.model.js
   ├─ dtos
   │  └─ userDto.js
   ├─ middlewares
   │  ├─ authMiddleware.js
   ├─ routes
   │  ├─ cart.router.js
   │  ├─ product.router.js
   │  └─ user.router.js
   ├─ services
   │  ├─ cartService.js
   │  ├─ productService.js
   │  └─ ticketService.js
   └─ views
      ├─ layouts
      │  └─ main.handlebars
      ├─ login.handlebars
      ├─ home.handlebars
      └─ register.handlebars
```
