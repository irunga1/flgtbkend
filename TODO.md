# TODO: Implementar DataValidator en todos los endpoints de routes

## Archivos a modificar:

### 1. routes/aplicar.js ✅
- [x] Agregar import de DataValidator
- [x] GET `/`: validar `id_usuario` con numValidator
- [x] POST `/apply`: validar `id_usuario`, `id_proyecto` con numValidator; `propuesta` con textValidator

### 2. routes/messages.js ✅
- [x] GET `/test`: validar `id_user` con numValidator
- [x] GET `/`: validar `id_user` con numValidator

### 3. routes/profile.js ✅
- [x] Agregar import de DataValidator
- [x] GET `/`: validar `id_usuario` con numValidator
- [x] PUT `/`: validar `id_usuario` con numValidator; `email` con mailValidator; `nombre`, `descripcion` con textValidator

### 4. routes/usuario_skills.js ✅
- [x] Agregar import de DataValidator
- [x] GET `/`: validar `id`, `id_usuario`, `id_skill` con numValidator
- [x] GET `/search`: validar `id`, `id_usuario`, `id_skill` con numValidator
- [x] POST `/`: validar `id_usuario`, `id_skill` con numValidator
- [x] PUT `/:id`: validar `id` param con numValidator
- [x] DELETE `/:id`: validar `id` param con numValidator

### 5. routes/skills.js ✅
- [x] GET `/search`: validar `id` con numValidator, `nombre` con textValidator
- [x] POST `/`: validar `nombre` con textValidator
- [x] PUT `/:id`: validar `id` param con numValidator, `nombre` con textValidator
- [x] DELETE `/:id`: validar `id` param con numValidator

### 6. routes/proyectos.js ✅
- [x] GET `/search`: validar `id`, `id_cliente` con numValidator
- [x] POST `/`: validar `presupuesto`, `id_cliente`, `skill1-5` con numValidator; `titulo` con textValidator
- [x] PUT `/:id`: validar `id` param con numValidator; `presupuesto`, `skill1-5` con numValidator; `titulo` con textValidator
- [x] DELETE `/:id`: validar `id` param con numValidator

### 7. routes/user.js ✅
- [x] DELETE `/:id`: validar `id` param con numValidator

