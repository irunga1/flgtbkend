# freelancegt (backend)

Backend en Node/Express para un sistema de freelancers y proyectos en Guatemala.

Incluye endpoints para:
- Autenticación (login)
- Gestión de usuarios, roles, skills
- Gestión de proyectos
- Relación freelancer-proyecto (propuestas)
- Perfil del usuario (datos + skills)

---

## Stack y arquitectura

- **Express**: servidor HTTP y rutas
- **Knex + SQLite**: acceso a base de datos (`./data/freelancegt.db`)
- **JWT**: middleware `authJwt` (algunas rutas lo protegen)

Servidor principal:
- `server.js`

Base de datos:
- `db.js` (Knex apuntando a `./data/freelancegt.db`)

---

## Endpoints principales (resumen)

### Auth
- `POST /login`  
  - Recibe `{ email, password }`.
  - Busca el usuario en tabla `usuarios`.
  - Responde con `token` (si el usuario existe).

- `POST /login/forgot`
  - Recibe `{ email }`.
  - Busca el usuario y simula flujo de recuperación.

### Usuarios
- `GET /users`
- `GET /users/search?nombre&email&rol`
- `GET /users/:id`
- `POST /users`
- `PUT /users/:id`
- `DELETE /users/:id`

> Nota: estas rutas no usan `authJwt` actualmente (tal como está en el código).

### Roles
Rutas protegidas con `authJwt`:
- `GET /roles`
- `GET /roles/search?nombre&id`
- `GET /roles/:id`
- `POST /roles`
- `PUT /roles/:id`
- `DELETE /roles/:id`

### Skills
Rutas protegidas con `authJwt`:
- `GET /skills`
- `GET /skills/search?id&nombre`
- `POST /skills`
- `PUT /skills/:id`
- `DELETE /skills/:id`

### Proyectos (cliente)
Rutas protegidas con `authJwt`:
- `GET /proyectos`
- `GET /proyectos/search?id&titulo&id_cliente&estado`
- `POST /proyectos`
- `PUT /proyectos/:id`
- `DELETE /proyectos/:id`

### Freelancer ↔ Proyectos (propuestas)
- `GET /freelancer_proyectos` (protegida)
- `GET /freelancer_proyectos/search` (sin `authJwt` según el código)
- `POST /freelancer_proyectos`
- `PUT /freelancer_proyectos/:id`
- `DELETE /freelancer_proyectos/:id`

> La tabla que se usa en el código es `freelancer_proyecto`.

### Perfil del usuario
- `GET /perfil?id_usuario=<id>`
  - Obtiene:
    - datos del usuario desde `users` si existe la tabla
    - skills del usuario haciendo JOIN entre `usuario_skills` y `skills`

- `PUT /perfil`
  - Actualiza datos del usuario en `usuarios` (email/nombre/password)
  - Gestiona skills del usuario:
    - elimina (`skillsToDelete`) desde `usuario_skills`
    - inserta (`skillsToAdd`) en `usuario_skills`

---

## Flujo de datos: Freelancer vs Cliente

A continuación se describe **cómo viaja la información** en el sistema para cada rol, conectando endpoints con tablas.

> Tablas relevantes (según el código):
- `usuarios` (usuarios del sistema)
- `roles`
- `skills`
- `usuario_skills` (relación usuario ↔ skill con `nivel`) 
- `proyectos` (proyectos creados por cliente)
- `freelancer_proyecto` (relación freelancer ↔ proyecto con `propuesta` y `estado`)

---

## 1) Flujo del Cliente

### A. Registro/alta de usuario (si aplica)
1. (Opcional) Crear usuario en `POST /users`
2. Usuario queda en **`usuarios`** con `id_rol`.

### B. Crear un proyecto
1. Cliente (autenticado) llama:
   - `POST /proyectos`
   - Body: `{ titulo, descripcion, presupuesto, id_cliente, estado }`
2. Backend inserta en **`proyectos`**.
3. Respuesta incluye datos del proyecto creado.

### C. Consultar proyectos
1. Cliente (autenticado) llama:
   - `GET /proyectos?id&titulo&id_cliente&estado` (o `/proyectos/search`)
2. Backend consulta **`proyectos`** aplicando filtros.
3. Respuesta: lista de proyectos.

### D. Ver propuestas de freelancers (indirecto)
1. Cliente consulta (o la app consulta) las relaciones en:
   - `GET /freelancer_proyectos` o `/freelancer_proyectos/search`
2. Backend consulta **`freelancer_proyecto`** con filtros como `id_proyecto`, `id_freelancer`, `estado`.
3. Respuesta: propuestas relacionadas a proyectos.

> El código actual no realiza un JOIN para traer el nombre del freelancer, solo devuelve filas de `freelancer_proyecto`.

---

## 2) Flujo del Freelancer

### A. Preparar su catálogo de skills
1. Crear skills (admin o sistema):
   - `POST /skills` → inserta en **`skills`**
2. Para asignar skills al freelancer:
   - **Opción 1 (asignación directa)**: `POST /usuario_skills`
     - Body: `{ id_usuario, id_skill, nivel }`
     - Inserta en **`usuario_skills`**.
   - **Opción 2 (desde perfil)**: `PUT /perfil`
     - Body: `{ id_usuario, skillsToAdd, skillsToDelete, ... }`
     - `skillsToAdd`: inserta filas en **`usuario_skills`**
     - `skillsToDelete`: elimina filas desde **`usuario_skills`**

### B. Consultar su perfil (datos + skills)
1. Freelancer llama:
   - `GET /perfil?id_usuario=<id>`
2. Backend:
   - Intenta leer datos del usuario desde **`users`** (si existe tabla)
   - Obtiene skills con JOIN:
     - **`usuario_skills`** JOIN **`skills`**
     - selecciona `skills.id_skill`, `skills.nombre`, `usuario_skills.nivel`
3. Respuesta:
   - `user` (o `null`)
   - `skills` (lista con nivel)

> Nota: hay una diferencia importante entre tablas usadas: el perfil GET intenta `users`, mientras que el perfil PUT actualiza `usuarios`.

### C. Proponer a un proyecto
1. Freelancer (según el flujo de la app) llama:
   - `POST /freelancer_proyectos`
   - Body: `{ id_proyecto, id_freelancer, propuesta, estado }`
2. Backend inserta en **`freelancer_proyecto`**.
3. Respuesta: registro creado (con `id_freelancer_proyecto`).

### D. Actualizar su propuesta
1. Llama:
   - `PUT /freelancer_proyectos/:id`
   - Body parcial: `{ id_proyecto, id_freelancer, propuesta, estado }`
2. Backend actualiza **`freelancer_proyecto`** filtrando por `id_freelancer_proyecto`.

### E. Eliminar propuesta
- `DELETE /freelancer_proyectos/:id`
- Backend elimina de **`freelancer_proyecto`**.

---

## Autenticación (JWT) y uso de Bearer

Las rutas que usan `authJwt` requieren el header:

`Authorization: Bearer <token>`

El middleware `authJwt`:
1. Lee `Authorization`.
2. Verifica el token JWT con `process.env.SECRET_KEY`.
3. Coloca el payload en `req.user`.

---

## Configuración

1. Crear `.env` con al menos:
- `SECRET_KEY=...`

2. Ejecutar:
- `npm run dev`

---

## Consideraciones actuales (a tener en cuenta)

- En `routes/profile.js`, el `GET /perfil` intenta leer de tabla `users` si existe, mientras el `PUT /perfil` usa `usuarios`.
- En `routes/freelancer_proyectos.js`, `/search` no está protegido con `authJwt` (según el código).
- El esquema de cifrado/cripter usa una implementación no estándar (usa `btoa` y manipulación); revisar si se planea producción.

---

## Rutas usadas en el flujo (checklist)

**Cliente**
- `POST /proyectos`
- `GET /proyectos` o `GET /proyectos/search`
- `GET /freelancer_proyectos` (para ver propuestas)

**Freelancer**
- `PUT /perfil` (skills + datos)
- `GET /perfil?id_usuario=` (perfil y skills)
- `POST /freelancer_proyectos` (propuesta)
- `PUT /freelancer_proyectos/:id` (actualiza propuesta)


