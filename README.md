# Proyecto de Backend Coderhouse

Primera entrega del curso de Backend 2 en Coderhouse. Esta entrega incluye la implementación de funcionalidades clave relacionadas con la gestión de usuarios y carritos de compras.

## Características del Proyecto

### Backend

- **Gestión de Usuarios:**
  - **Modelo de Usuario:**
    - Campos:
      - `name`: String
      - `lastName`: String
      - `email`: String (único)
      - `age`: Number
      - `password`: String (hash)
      - `cart`: Id con referencia a `Carts`
      - `role`: String (default: ‘user’)
    - Se utilizó el paquete **bcrypt** para encriptar contraseñas mediante el método `hashSync`.
  
- **Gestión de Carritos:**
  - **Creación de Carritos:**
    - Se creó un carrito automáticamente para cada usuario registrado.
  
- **Autenticación y Autorización:**
  - **Estrategias de Passport:**
    - Implementadas para funcionar con el modelo de usuarios.
  - **Sistema de Login:**
    - Autenticación mediante JWT (JSON Web Tokens) para sesiones de usuario.

- **Estrategia “current”:**
  - Permite extraer el token de la cookie y obtener el usuario asociado.
  - Devuelve los datos del usuario si el token es válido, o un error en caso contrario.

- **Rutas API:**
  - Agregada la ruta `/api/sessions/current` para validar al usuario logueado y devolver sus datos asociados al JWT.

### Endpoints

- **Usuarios:**
  - `POST /register`: Crear un nuevo usuario.

- **Carritos:**
  - `POST /api/carts`: Crear un nuevo carrito.
  - `GET /api/carts/:cid`: Obtener un carrito por ID.
  - `PUT /api/carts/:cid`: Actualizar un carrito existente.
  - `DELETE /api/carts/:cid`: Eliminar un carrito por ID.

  ### Frontend

- **Interactividad en Tiempo Real:**
  - **Socket.io:** Actualiza la lista de productos en tiempo real en la interfaz de usuario sin necesidad de refrescar la página.
  - **Eventos de WebSocket:** Emisión de eventos dentro de las peticiones POST para la creación y eliminación de productos.

- **Vistas Actualizadas:**
  - **Página de Productos:** `http://localhost:8080/products` - Muestra una lista de productos con opción para comprar y paginación.
  - **Página de Productos en Tiempo Real:** `http://localhost:8080/realtimeproducts` - Actualización en tiempo real de los productos, con formulario que permite agregar productos, esta vista es accesible solo siendo usuario 'admin'.
  - **Vista de Detalles del Producto:** `http://localhost:8080/products/:pid` - Detalles completos del producto.
  - **Vista de Carritos:** `http://localhost:8080/carts/:cid` - Visualiza un carrito específico con los productos correspondientes.

- **Estilos Personalizados:**
  - **CSS:** Estilización simple y minimalista para una experiencia de usuario más atractiva.

## Tecnologías Utilizadas

- **Node.js:** Plataforma de desarrollo backend.
- **Express:** Framework de Node.js para construir aplicaciones web y APIs.
- **MongoDB:** Base de datos NoSQL para almacenamiento de datos.
- **Mongoose:** ODM para MongoDB, facilita la interacción con la base de datos.
- **Bcrypt:** Biblioteca para encriptar contraseñas.
- **Passport.js:** Middleware para la autenticación.
- **JWT:** Método para gestionar sesiones de usuario.

## Ejecución del Proyecto

1. Clona el repositorio.
2. Instala las dependencias con `npm install`.
3. Configura las variables de entorno necesarias (por ejemplo, `JWT_SECRET`).
4. Ejecuta el servidor con `npm run dev`.
5. Utiliza Postman para probar los diferentes endpoints.


## Autor

Patricio Pittana - [Linkedin](https://www.linkedin.com/in/patricio-pittana-2185b6177/) - [GitHub](https://github.com/Lunatico0) - [Web](https://pittanapatricio.vercel.app)

```
ExampleEntregaBackend2
├─ .gitignore
├─ package-lock.json
├─ package.json
├─ readme.md
└─ src
   ├─ app.js
   ├─ config
   │  └─ passport.config.js
   ├─ utils
   │  ├─ util.js
   ├─ dao
   │  ├─ db
   │  │  ├─ cart-manager-db.js
   │  │  └─ product-manager-db.js
   │  ├─ fs
   │  │  ├─ carts.json
   │  │  ├─ products-sinImg.json
   │  │  ├─ products.json
   │  │  └─ manager
   │  │    └─ products.json
   │  │       ├─ cart-manager.json
   │  │       └─ product-manager.json
   │  └─ models
   │     ├─ cart.model.js
   │     ├─ categories.model.js
   │     ├─ product.model.js
   │     └─ user.model.js
   ├─ db.js
   ├─ middlewares
   │  └─ authMiddleware.js
   ├─ public
   │  ├─ img
   │  │  └─ favCircle.png
   │  └─ js
   │     └─ index.js
   ├─ routes
   │  ├─ session.router.js
   │  ├─ cart.router.js
   │  ├─ products.router.js
   │  └─ views.router.js
   └─ views
      ├─ cart.handlebars
      ├─ layouts
      │  └─ main.handlebars
      ├─ login.handlebars
      ├─ home.handlebars
      ├─ realtimeproducts.handlebars
      └─ register.handlebars

```
