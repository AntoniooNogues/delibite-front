# Delibite - MVP

¡Bienvenido a **Delibite**, una plataforma web diseñada para la compra de comida preparada y gestionada de forma personalizada!

## 🚀 Características principales

### Gestión de usuarios
- **Roles y permisos**:
  - **Cliente**: Puede buscar en el catálogo y realizar compras.
  - **Supervisor**: Accede a administración para gestionar productos y visibilidad de reseñas.
  - **Administrador**: Gestión completa, incluyendo usuarios y análisis estadísticos.
- **Autenticación**: Inicio de sesión seguro mediante usuario y contraseña.
- **Registro**: Registro de nuevos usuarios con datos personales detallados.
- **Recuperación de contraseña**: Mediante código enviado por correo electrónico.

### Catálogo de productos
- Más de **65 platos disponibles**:
  - **60 platos principales**.
  - **5 postres**.
- **Filtros inteligentes**: Excluyen alérgenos según el perfil del usuario.
- **Buscador avanzado**: Encuentra platos específicos rápidamente.

### Gestión de pedidos
- **Carrito de compra**:
  - Añadir platos o packs.
  - Modificar cantidad de productos.
  - Confirmación de pedidos.
- **Pasarela de pago segura**.
- **Suscripción semanal**:
  - Configuración de menú personalizado.
  - Notificaciones por correo.
  - Flexibilidad para cambios y cancelaciones.

### Reseñas y valoraciones
- Valora los platos del pedido entregado (0-5 estrellas).
- Deja descripciones detalladas sobre tu experiencia.

## 🛠️ Requisitos técnicos
- **Symfony**: Framework principal para el backend.
- **Base de datos**: MySQL o PostgreSQL.
- **PHP**: Versión 8.0 o superior.

## 📖 Cómo usar para un proyecto React 19

1. **Clonar el repositorio**
  ```bash
  git clone https://github.com/tuusuario/delibite.git
  cd delibite
  ```
2. **Instalar dependencias**
Primero, asegúrate de tener Node.js y npm instalados. Luego, instala las dependencias del proyecto.
  ```bash
  npm install
  ```
3. **Configurar variables de entorno (.env)**
Crea un archivo .env en la raíz del proyecto y configura las variables necesarias, como la API base, clave de la base de datos, o cualquier otra configuración que tu aplicación necesite. Por ejemplo:
  ```bash
  REACT_APP_API_URL="http://localhost:5000/api"
  ```
4. **Ejecutar el servidor de desarrollo**
Inicia el servidor de desarrollo de React:
  ```bash
  npm start
  ```
Esto levantará el servidor de desarrollo de React en http://localhost:3000.



## 📝 Créditos
Proyecto desarrollado por:  
- **Antonio Nogues Gómez** - [anogues23@sgmail.com](mailto:anogues23@gmail.com)  
- **Rodrigo Jaén Cobos** - [rjaenc18@gmail.com](mailto:rjaenc18@gmail.com)

