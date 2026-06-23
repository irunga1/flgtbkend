# freelancegt (backend)

Backend en **Node.js/Express** para un sistema de **freelancers y proyectos**.

## Stack
- Express
- Knex + SQLite
- JWT (Bearer token)

## Requisitos
- Tener una base SQLite en `./data/freelancegt.db`
- Archivo `.env` con al menos:
  - `SECRET_KEY=...`

## Levantar el servidor
```bash
npm install
npm run dev
```
Por código, el servidor corre en **puerto 3001**.

---

## Auth: `authJwt` (JWT)
Algunos endpoints usan el middleware `authJwt`. Este requiere:

**Header**
- `Authorization: Bearer <token>`

El middleware valida el JWT con `process.env.SECRET_KEY` y pone el payload en `req.user` con (al menos):
- `req.user.id_usuario`
- `req.user.id_rol`

### Login
**POST** `/login`

**Body**
```json
{ "email": "string", "password": "string" }
```

**Respuestas**
- Si el usuario existe, devuelve `token` y datos básicos.
- Si no existe, devuelve `{ status: "error", desc: "not logged" }`.

### Forgot / Reset password
**POST** `/login/forgot`
- Body: `{ "email": "string" }`
- Cambia la contraseña (lógica local; no envía email real en este repo).

**POST** `/login/reset`
- Body: `{ "email": "string", "newPassword": "string" }`
- Actualiza la contraseña.

---

## Módulos y Endpoints

### 1) Users (`routes/user.js`) -> base path: `/users`
> Nota: en el archivo actual, muchas rutas **no aplican** `authJwt`.

- **GET** `/users`
- **GET** `/users/search?nombre&email&rol`
- **GET** `/users/latest20` (existe en el código pero no aparece en server montado; verificar si lo usas)
- **GET** `/users/:id`
- **POST** `/users`
- **PUT** `/users/:id`
- **DELETE** `/users/:id`

---

### 2) Roles (`routes/roles.js`) -> base path: `/roles`
Estas rutas **sí** usan `authJwt`.

- **GET** `/roles`
- **GET** `/roles/search?id&nombre`
- **GET** `/roles/:id`
- **POST** `/roles`
- **PUT** `/roles/:id`
- **DELETE** `/roles/:id`

---

### 3) Skills (`routes/skills.js`) -> base path: `/skills`
CRUD con `authJwt`.

- **GET** `/skills?id=<id_skill>&nombre=<texto>`
- **GET** `/skills/search?id=<id_skill>&nombre=<texto>`
- **POST** `/skills` 
  - Body: `{ "nombre": "string" }`
- **PUT** `/skills/:id`
  - Body: `{ "nombre": "string" }`
- **DELETE** `/skills/:id`

---

### 4) Proyectos (cliente) (`routes/proyectos.js`) -> base path: `/proyectos`

#### Endpoints protegidos (`authJwt`)
- **GET** `/proyectos/`
- **GET** `/proyectos/latest20` *(actualmente NO está protegido por `authJwt` en el código)*
- **GET** `/proyectos/search` *(actualmente NO está protegido por `authJwt` en el código)*
- **POST** `/proyectos/`
- **PUT** `/proyectos/:id`
- **DELETE** `/proyectos/:id`

#### GET `/proyectos/` (proyectos con joins)
**GET** `/proyectos/?id=&titulo=&id_cliente=&estado=`

**Qué hace**
- Lee de `proyectos`
- Hace join con `usuarios` para traer datos del cliente
- Hace leftJoin con `skills` para traer `skill1..skill5`

**Filtro por rol (crítico)**
- Si `req.user.id_rol == 3`:
  - filtra para que el cliente sea el `id_usuario` autenticado
- Si `req.user.id_rol != 3`:
  - aplica filtro fijo: `usuarios.id_rol = 3`

**Nota de fecha**
- También filtra por rango de últimos **30 días** (`fecha_publicacion >= ...`).

#### GET `/proyectos/latest20`
**GET** `/proyectos/latest20`

- Devuelve hasta 20 proyectos **estado = `abierto`**
- Filtro `usuarios.id_rol = 3`
- Ordena por `fecha_publicacion desc`

#### GET `/proyectos/search`
**GET** `/proyectos/search?id=&titulo=&id_cliente=&estado=`

- Similar a `/proyectos/`, pero:
  - `usuarios.id_rol` se fija en `3`
  - no aplica `authJwt` en el código actual

#### POST `/proyectos/`
**POST** `/proyectos/`

**Body**
```json
{
  "titulo": "string",
  "descripcion": "string",
  "presupuesto": "number|string",
  "id_cliente": "number",
  "estado": "string" 
}
```

- `estado` por defecto: `activo`

#### PUT `/proyectos/:id`
**PUT** `/proyectos/:id`
- Param: `:id` = `id_proyecto`

**Body (parcial)**
```json
{
  "titulo": "string",
  "descripcion": "string",
  "presupuesto": "number|string",
  "estado": "string",
  "id_cliente": "number"
}
```

#### DELETE `/proyectos/:id`
**DELETE** `/proyectos/:id`
- Borra por `id_proyecto`

---

### 5) Freelancer ↔ Proyectos (`routes/freelancer_proyectos.js`) -> base path: `/freelancer_proyectos`

Este módulo gestiona la tabla `freelancer_proyecto`.

#### GET `/freelancer_proyectos/` (protegido)
**GET** `/freelancer_proyectos/?id=&id_proyecto=&id_freelancer=&estado=`

- Requiere `authJwt`
- Filtra en `freelancer_proyecto` según query params

#### GET “mis proyectos”
Estos endpoints **no** usan `authJwt`.

- **GET** `/freelancer_proyectos/myprojectscl?idclient=<id>`
  - Consulta proyectos donde el `id_cliente = idclient`
  - Une con `freelancer_proyecto`, `usuarios` y `skills`
  - **Devuelve** proyectos con el freelancer aplicado y `skill1..skill5` del proyecto

- **GET** `/freelancer_proyectos/myprojectsfl?idclient=<id>`
  - Actualmente tiene el mismo SQL que `myprojectscl` (misma salida)
  - Ojo: el nombre sugiere “mis proyectos como freelancer”, pero el filtro real sigue siendo `p.id_cliente = idclient`

#### GET `/freelancer_proyectos/search`
**GET** `/freelancer_proyectos/search?id=&id_proyecto=&id_freelancer=&estado=`

- Devuelve filas de `freelancer_proyecto` filtradas

#### Crear / actualizar / eliminar propuestas en `freelancer_proyecto`
En este archivo, estos endpoints **no** usan `authJwt`.

- **POST** `/freelancer_proyectos/`
  - Body: `{ "id_proyecto": number, "id_freelancer": number, "propuesta": string, "estado": string }`

- **PUT** `/freelancer_proyectos/:id`
  - `:id` = `id_freelancer_proyecto`
  - Body parcial: `{ "id_proyecto"?, "id_freelancer"?, "propuesta"?, "estado"? }`

- **DELETE** `/freelancer_proyectos/:id`
  - Borra por `id_freelancer_proyecto`

---

### 6) Aplicar a proyectos (`routes/aplicar.js`) -> base path: `/aplicar`

#### GET `/aplicar`
**GET** `/aplicar?id_usuario=<id_usuario>`

- Consulta aplicaciones desde `freelancer_proyecto`
- Une con `proyectos`
- Devuelve: `proyectos.id_proyecto`, `proyectos.titulo`, `proyectos.descripcion`, `proyectos.id_cliente`, `freelancer_proyecto.estado`

#### POST `/aplicar/apply`
**POST** `/aplicar/apply`

**Body**
```json
{
  "id_usuario": 1,
  "id_proyecto": 2,
  "propuesta": "texto"
}
```

**Qué hace**
- Valida que no exista una aplicación previa para `(id_freelancer=id_usuario, id_proyecto)`
- Si no existe, inserta en `freelancer_proyecto` con `estado = "waiting"`
- Si existe, responde: `{ status: "error", desc: "No puede aplicar más de una vez" }`

---

### 7) Perfil (`routes/profile.js`) -> base path: `/perfil`

#### GET `/perfil?id_usuario=<id>`
- Devuelve:
  - datos del usuario (tabla `usuarios`) si existe
  - skills del usuario (join `usuario_skills` + `skills`)

#### PUT `/perfil`
- Actualiza usuario y/o skills.

**Body** (parcial)
```json
{
  "id_usuario": 1,
  "email": "string" ,
  "nombre": "string",
  "password": "string" ,
  "descripcion": "string" ,
  "skillsToDelete": [1,2,3],
  "skillsToAdd": [{"id_skill": 4}, {"id_skill": 5}]
}
```

> Nota: este archivo actualmente **no** usa `authJwt` (rutas comentadas), por lo que depende de que el frontend mande el `id_usuario` correcto.

---

## Flujo de uso (“cómo debe funcionar”)
1. **Login**
   - Llama **POST** `/login` con email y password.
   - Obtén `token`.

2. **Llamadas protegidas**
   - En endpoints que tengan `authJwt`, usa:
     - `Authorization: Bearer <token>`

3. **Ver proyectos (cliente)**
   - Llama **GET** `/proyectos/` con tu token.
   - El backend filtra según `req.user.id_rol` (ver sección de filtros).

4. **Crear proyectos (cliente)**
   - Llama **POST** `/proyectos/` con token.

5. **Propuestas (freelancer ↔ proyecto)**
   - Para crear/actualizar propuestas en `freelancer_proyecto`:
     - usa POST/PUT/DELETE dentro de `/freelancer_proyectos`
   - Para “aplicar” con validación de duplicados:
     - usa **POST** `/aplicar/apply`

6. **Perfil y skills**
   - Llama **GET** `/perfil?id_usuario=...`
   - Para actualizar datos/skills: **PUT** `/perfil`

---

## Importante (diferencias reales del código)
- No todos los endpoints están protegidos con `authJwt`. Ejemplos:
  - en `routes/proyectos.js`, `latest20` y `search` no aplican `authJwt`.
  - en `routes/freelancer_proyectos.js`, casi todos los endpoints extra (`myprojectscl`, `myprojectsfl`, `search`) no aplican `authJwt`.

Este README refleja lo que está implementado actualmente.

