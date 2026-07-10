# FreelanceGT Backend

Backend en Node.js + Express para una plataforma de freelancers y proyectos en Guatemala. La API gestiona usuarios, roles, skills, proyectos, postulaciones, perfiles y mensajes, usando SQLite como base de datos y JWT para autenticación.

## Stack

- Node.js
- Express
- Knex
- SQLite3
- JSON Web Token (jsonwebtoken)
- Nodemailer
- CORS
- dotenv

## Estructura del proyecto

- [server.js](server.js): punto de entrada y montaje de rutas.
- [db.js](db.js): configuración de Knex para SQLite.
- [routes/](routes): endpoints organizados por dominio.
- [middlewares/](middlewares): autenticación y validaciones.
- [libs/](libs): utilidades y helpers para sanitización, encriptación y validación.
- [data/](data): datos y recursos del proyecto.
- [docs/](docs): documentación funcional adicional.

## Requisitos

- Node.js 18 o superior
- npm
- Archivo .env con al menos:

```env
SECRET_KEY=tu_clave_secreta
EMAIL_USER=tu_correo
EMAIL_PASS=tu_password
```

## Instalación

```bash
npm install
```

## Ejecución

### Desarrollo

```bash
npm run dev
```

### Producción

```bash
npm start
```

El servidor corre por defecto en el puerto 3001.

## Base de datos

La aplicación usa SQLite con la base de datos ubicada en:

- [data/freelancegt.db](data/freelancegt.db)

La conexión está definida en [db.js](db.js).

## Autenticación

La autenticación se realiza con JWT mediante el middleware [middlewares/authJwt.js](middlewares/authJwt.js).

### Header esperado

```http
Authorization: Bearer <token>
```

### Login

Ruta:

- POST /login

Body esperado:

```json
{
  "email": "usuario@email.com",
  "password": "123456"
}
```

Respuesta esperada:

```json
{
  "status": "ok",
  "token": "...",
  "user": {
    "id": 1,
    "nombre": "Juan",
    "email": "usuario@email.com",
    "id_rol": 2
  }
}
```

## Endpoints principales

### Usuarios

- GET /users
- GET /users/search
- GET /users/latest20
- GET /users/:id
- POST /users
- PUT /users/:id
- DELETE /users/:id

### Roles

- GET /roles
- GET /roles/search
- GET /roles/:id
- POST /roles
- PUT /roles/:id
- DELETE /roles/:id

### Skills

- GET /skills
- GET /skills/search
- POST /skills
- PUT /skills/:id
- DELETE /skills/:id

### Proyectos

- GET /proyectos
- GET /proyectos/latest20
- GET /proyectos/search
- POST /proyectos
- PUT /proyectos/:id
- DELETE /proyectos/:id

### Aplicaciones a proyectos

- GET /aplicar
- POST /aplicar/apply

### Freelancers por proyecto

- GET /freelancer_proyectos
- GET /freelancer_proyectos/myprojectsfl
- GET /freelancer_proyectos/selected/:id
- POST /freelancer_proyectos
- PUT /freelancer_proyectos/:id
- DELETE /freelancer_proyectos/:id

### Perfil

- GET /perfil
- PUT /perfil

### Mensajes

- GET /messages
- POST /messages

## Flujo general de la API

1. El cliente envía una petición HTTP.
2. Si la ruta requiere autenticación, el middleware JWT valida el token.
3. El router recibe los parámetros, los sanitiza y construye la consulta.
4. Se accede a SQLite mediante Knex o SQL crudo.
5. La respuesta llega como JSON al cliente.

## Notas importantes

- La API realiza sanitización de entradas antes de interactuar con la base de datos.
- Algunas rutas utilizan queries SQL crudas; en futuras iteraciones conviene migrarlas a consultas parametrizadas para reforzar la seguridad.
- Para una documentación funcional más detallada, revisar [docs/README-FUNCIONAL.md](docs/README-FUNCIONAL.md).

## Sugerencias de mejora

- Mejorar la validación de datos por endpoint.
- Standardizar respuestas JSON con campos consistentes como status, desc y data.
- Añadir pruebas automáticas.
- Migrar a PostgreSQL o MySQL en producción.
