# freelancegt (backend)

Backend en **Node.js/Express** para un sistema de **freelancers y proyectos**.

## Estructura del proyecto
- `server.js`: inicializa Express y monta rutas.
- `db.js`: conexión Knex (SQLite) hacia `./data/freelancegt.db`.
- `middlewares/authJwt.js`: middleware JWT.
- `routes/*`: controladores HTTP.
- `libs/*`: utilidades (p.ej. `utilery`, `cripter`).

## Stack
- Express
- Knex + SQLite
- JWT (Bearer token)

## Variables de entorno
Crea un archivo `.env` con al menos:
- `SECRET_KEY=...`

## Cómo levantar el servidor
```bash
npm install
npm run dev
```

El servidor corre en el puerto configurado en `server.js` (en el código: `3001`).

## Autenticación (JWT)
### Middleware: `authJwt`
Requiere header:

`Authorization: Bearer <token>`

Valida el token JWT con `process.env.SECRET_KEY` y pone el payload en `req.user`.

### Login
- `POST /login`
  - Body: `{ "email": string, "password": string }`
  - Busca credenciales en tabla `usuarios`.
  - Si coincide, devuelve `token`.

Rutas `login/forgot` y `login/reset` también existen:
- `POST /login/forgot`
- `POST /login/reset`

## Rutas principales

### Users
Montado en `server.js` como: `/users`.
- `GET /users`
- `GET /users/search?nombre&email&rol`
- `GET /users/:id`
- `POST /users`
- `PUT /users/:id`
- `DELETE /users/:id`

> Nota: estas rutas (tal como están) no aplican `authJwt`.

### Roles
Montado como: `/roles`.
- `GET /roles` (protección JWT)
- `GET /roles/search` (protección JWT)
- `GET /roles/:id` (protección JWT)
- `POST /roles` (protección JWT)
- `PUT /roles/:id` (protección JWT)
- `DELETE /roles/:id` (protección JWT)

### Skills
Montado como: `/skills`.
- CRUD de skills (según `routes/skills.js`, montado con `authJwt`).

### Proyectos (cliente)
Montado como: `/proyectos` (archivo `routes/proyectos.js`).

Endpoints:
- `GET /proyectos/` (protección JWT)
- `GET /proyectos/latest20` (protección JWT)
- `GET /proyectos/search` (protección JWT)
- `POST /proyectos/` (protección JWT)
- `PUT /proyectos/:id` (protección JWT)
- `DELETE /proyectos/:id` (protección JWT)

Campos típicos en `proyectos`:
- `id_proyecto`, `titulo`, `descripcion`, `presupuesto`, `fecha_publicacion`, `id_cliente`, `estado`

La respuesta incluye joins a:
- `usuarios` (nombre/email del cliente)
- `skills` (skill1..skill5)

**Nota de seguridad/roles (según código actual):**
- El middleware `authJwt` coloca `id_rol` y `id_usuario` en `req.user` (payload del JWT).
- `routes/proyectos.js` aplica restricciones basadas en esos valores.

Regla aplicada en el código actual:
- Si `id_rol == 3`: solo se filtra por los proyectos del cliente creado por el usuario autenticado.
- Si `id_rol == 2`: se permite ver “todo” (sin limitar al rol del cliente a `id_rol=3`).

### Freelancer ↔ Proyectos (propuestas)
Montado como: `/freelancer_proyectos`.
- `routes/freelancer_proyectos.js` controla la tabla `freelancer_proyecto`.

### Perfil del usuario
Montado como: `/perfil`.
- En `routes/profile.js` se consulta/actualiza información del usuario y sus skills.

## Checklist de uso (flujo típico)
- Autenticar con `POST /login` para obtener JWT.
- Llamar rutas protegidas con `Authorization: Bearer <token>`.
- Gestionar proyectos desde `/proyectos`.
- Gestionar propuestas desde `/freelancer_proyectos`.

## Consideraciones (importantes)
- El cifrado/“encriptación” (`libs/cripter.js`) usa `btoa(...)` en el código, lo cual puede depender del entorno.
- Existen diferencias de tablas para “perfil”: en algunos endpoints se lee de `users` y en otros se actualiza `usuarios`. Revisar consistencia según la base real.


