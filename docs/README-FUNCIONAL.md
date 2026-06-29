# Documentación funcional (backend) - freelancegt

> Este documento reemplaza al README anterior.

## 1) Stack y componentes
- **Express**: servidor HTTP.
- **JWT**: autenticación mediante `Authorization: Bearer <token>`.
- **Knex + SQLite**: capa de acceso a datos (`db.js`).
- **Routers**: cada módulo define rutas y consultas.

Estructura general:
- `server.js`: monta routers.
- `middlewares/authJwt.js`: valida token y agrega `req.user`.
- `routes/*`: endpoints.

## 2) Autenticación (JWT)
### 2.1 Formato de header
`Authorization: Bearer <token>`

### 2.2 Qué hace `authJwt`
- Lee header `authorization`.
- Verifica `token` contra `process.env.SECRET_KEY`.
- Si es válido: asigna `req.user = decoded`.
- Si no: responde `401`.

> Nota: el contenido del `decoded` depende del `login` (payload). En varios endpoints se usan `req.user.id_usuario` y/o `req.user.id_rol`.

## 3) Mapa de endpoints por router
Base URLs montadas en `server.js`:
- `/users` -> `routes/user.js`
- `/roles` -> `routes/roles.js`
- `/skills` -> `routes/skills.js`
- `/proyectos` -> `routes/proyectos.js`
- `/freelancer_proyectos` -> `routes/freelancer_proyectos.js`
- `/usuario_skills` -> `routes/usuario_skills.js`
- `/login` -> `routes/login.js`
- `/perfil` -> `routes/profile.js`
- `/aplicar` -> `routes/aplicar.js`
- `/messages` -> `routes/messages.js`

Autorización:
- Muchos endpoints usan `authJwt`.
- Algunos endpoints “business” dependen del rol (ej. cliente vs freelancer).

## 4) Flujo/Ciclo de vida de la data (request → validación → DB → response)

### 4.1 Ciclo de vida general (aplica a la mayoría de endpoints)
1. **Cliente** envía request HTTP (query params / body).
2. (Si aplica) **Middleware `authJwt`** valida JWT y define `req.user`.
3. **Router**:
   - toma inputs de `req.query` / `req.params` / `req.body`.
   - sanitiza/transforma con utilidades (por ejemplo `Utilery`).
4. **Construcción de consulta**:
   - usa **Knex** (`db('tabla').select(...).where(...)...`) o SQL crudo con `db.raw`.
   - realiza joins (usuarios, skills, freelancer_proyecto, etc.).
   - aplica filtros (rol, estado, fechas).
5. **Acceso a datos**: SQLite ejecuta la consulta.
6. **Transformación** (cuando corresponde):
   - formatear/armar objetos (por ejemplo agrupar freelancers por proyecto).
7. **Response**: `res.json(...)` con `status`/`data` o lista de resultados.
8. (Opcional) **Cliente** usa la respuesta para render o para seguir el flujo (ej. crear propuesta, aplicar, etc.).

### 4.2 Casos de negocio: ciclo de vida por flujo

#### A) Login (entrada al sistema)
- **Request**: `POST /login` (no documentamos authJwt aquí, porque es la entrada).
- **DB**: busca usuario por email y valida credenciales.
- **Salida**: genera `token` JWT (payload contiene al menos `id_usuario` e `id_rol`).
- **Uso**: el cliente guarda el token y lo envía en llamadas posteriores.

#### B) Publicar/leer proyectos (cliente)
- **Crear proyecto**: `POST /proyectos/` (protegido por `authJwt`)
  1. Request con `titulo`, `descripcion`, `presupuesto`, `id_cliente`, `skill1..skill5`, `estado`.
  2. El router valida/sanitiza inputs.
  3. Si `req.user.id_rol == 3` crea un registro en `proyectos`.
  4. Responde con el registro insertado.

- **Listar/buscar proyectos**: `GET /proyectos/`, `GET /proyectos/search`
  1. Request incluye query params (`id`, `titulo`, `id_cliente`, `estado`).
  2. `authJwt` define `req.user`.
  3. Se filtra por rol:
     - si el rol corresponde, se limita al cliente autenticado o al rol fijo según el endpoint.
  4. Se ejecuta join con `usuarios` (cliente) y joins a `skills` para `skill1..skill5`.
  5. Response: lista de proyectos con skills y datos de cliente.

- **Últimos 20**: `GET /proyectos/latest20`
  - igual al listar, pero restringido a `estado = abierto` y `limit 20`.

#### C) Aplicar a proyectos (freelancer)
- **Aplicar**: `POST /aplicar/apply`
  1. Request con `id_usuario` (freelancer) + `id_proyecto` + `propuesta`.
  2. El router valida duplicidad (no repetir aplicación por par freelancer/proyecto).
  3. Si no existe: inserta en `freelancer_proyecto` con `estado = waiting`.
  4. Response con éxito o error de duplicidad.

#### D) Propuestas/progreso (freelancer ↔ proyecto)
Router: `routes/freelancer_proyectos.js`

- **Listar `freelancer_proyectos`**: `GET /freelancer_proyectos/` (protegido)
  - Filtra por query params (`id`, `id_proyecto`, `id_freelancer`, `estado`).
  - Consulta `freelancer_proyecto` y devuelve filas.

- **Proyectos donde el freelancer aplicó**: `GET /freelancer_proyectos/myprojectsfl` (protegido)
  - Consulta usando SQL/joins para obtener proyectos con skills y freelancer asociado.
  - Agrupa información para devolver `data: { [id_proyecto]: ... }`.

- **Proyectos del cliente donde recibió aplicaciones**: `GET /freelancer_proyectos/myprojectscl` (protegido)
  - Similar al anterior, pero filtrando por `p.id_cliente`.
  - Ensambla un array `freelancers: [...]` dentro de cada proyecto.

- **Cambiar estado seleccionado**: `PUT /freelancer_proyectos/selected/:id`
  - Actualiza `freelancer_proyecto.estado = "selected"` por `id_freelancer_proyecto`.

- **CRUD de `freelancer_proyecto`**
  - `POST /freelancer_proyectos/` (insert)
  - `PUT /freelancer_proyectos/:id` (update por id)
  - `DELETE /freelancer_proyectos/:id` (delete por id)

#### E) Mensajes (chat/registro)
- Router: `routes/messages.js`
- **Get messages agrupados**: `GET /messages/getmessages?id_cliente=<id>`
  1. Recibe `id_cliente`.
  2. SQL agrupa por freelancer (`MAX(m.fecha)` como última fecha).
  3. Retorna un listado con último mensaje por freelancer.

## 5) Consideraciones de seguridad y consistencia de datos
- Algunos endpoints usan `db.raw` con interpolación de strings. Esto puede introducir riesgo si no se sanitiza estrictamente.
- Recomendación: migrar a queries parametrizadas (Knex bindings) cuando sea posible.
- Validar consistentemente:
  - que `req.user.id_rol` coincida con el rol esperado
  - que `req.user.id_usuario` coincida con `id_cliente` cuando el endpoint lo requiere

## 6) Entregables (qué deberías poder hacer con esta doc)
- Identificar qué endpoints leer/escriben qué tablas.
- Entender el recorrido completo de la data por cada tipo de flujo.
- Saber dónde aplica JWT y cómo se usa.

