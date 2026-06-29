# freelancegt (backend)

Backend en **Node.js + Express** para un sistema de **freelancers y proyectos**.

- Servidor: **`server.js`**
- Persistencia: **SQLite** (archivo `data/freelancegt.db`) vía **Knex** (`db.js`)
- Auth: **JWT** (middleware `middlewares/authJwt.js`)

---

## Requisitos
- Tener una base SQLite en `./data/freelancegt.db`
- Archivo `.env` con al menos:
  - `SECRET_KEY=...`

---

## Levantar el servidor
```bash
npm install
npm run dev
```
El servidor corre en **puerto 3001**.

---

## Auth (JWT)
Algunos endpoints usan `authJwt`.

### Header
`Authorization: Bearer <token>`

### Qué hace `authJwt`
- Lee `authorization` del header.
- Verifica el `token` con `process.env.SECRET_KEY`.
- Si es válido: asigna `req.user = decoded`.

> El payload (`decoded`) típicamente incluye: `id_usuario` y `id_rol`.

### Login
- **POST** `/login`

Body:
```json
{ "email": "string", "password": "string" }
```

---

## Estructura / Routers montados
En `server.js` se montan estas bases:

- `/users` → `routes/user.js`
- `/roles` → `routes/roles.js`
- `/skills` → `routes/skills.js`
- `/proyectos` → `routes/proyectos.js`
- `/freelancer_proyectos` → `routes/freelancer_proyectos.js`
- `/usuario_skills` → `routes/usuario_skills.js`
- `/login` → `routes/login.js`
- `/perfil` → `routes/profile.js`
- `/aplicar` → `routes/aplicar.js`
- `/messages` → `routes/messages.js`

---

## Flujo de datos (cómo funciona)
La documentación funcional con el ciclo completo de datos está en:

- **`docs/README-FUNCIONAL.md`**

Resumen del flujo general (request → DB → response):
1. Cliente envía request (query params / params / body)
2. (si aplica) `authJwt` valida el JWT y define `req.user`
3. Router toma entradas y sanitiza con `libs/utilery.js`
4. Router consulta SQLite usando **Knex** o **SQL crudo** (`db.raw`)
5. Si aplica, el router transforma/agrupa resultados (por ejemplo agrupar freelancers por proyecto)
6. Responde con `res.json(...)`

---

## Endpoints principales (vista rápida)

### Proyectos (cliente)
Base: `/proyectos`
- CRUD de `proyectos`
- Listado y búsqueda con joins a:
  - `usuarios` (cliente)
  - `skills` (skill1..skill5)

### Aplicar a proyectos (freelancer)
Base: `/aplicar`
- **POST** `/aplicar/apply`: inserta una aplicación en `freelancer_proyecto` con `estado = "waiting"`

### Progreso/estado y propuesta (freelancer ↔ proyecto)
Base: `/freelancer_proyectos`
- Listados filtrados (con o sin authJwt según ruta)
- Actualizar estado (ej. `selected`)
- CRUD de `freelancer_proyecto`

### Mensajes
Base: `/messages`
- `GET /messages/getmessages?id_cliente=<id>`
  - Devuelve mensajes agrupados por freelancer (última fecha por par)

---

## Notas importantes
- **No todos los endpoints están protegidos con `authJwt`**. La documentación funcional en `docs/README-FUNCIONAL.md` detalla qué rutas usan JWT y qué no.
- Algunos endpoints usan `db.raw` con strings: conviene mantener sanitización estricta y, a futuro, migrar a queries parametrizadas.

