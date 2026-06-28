# TODO - AuthJwt en endpoints

- [ ] Revisar todos los routers y detectar endpoints que carecen de `authJwt`.
- [ ] Para cada endpoint que lo necesite:
  - [ ] Agregar `authJwt` en la firma del endpoint.
  - [ ] Agregar debajo una línea comentada con el mismo endpoint pero **sin** `authJwt`.
- [x] Aplicar cambios en:
  - [x] `routes/freelancer_proyectos.js`
  - [x] `routes/proyectos.js`
  - [x] `routes/aplicar.js`
  - [x] `routes/profile.js`
  - [x] `routes/user.js`
  - [x] `routes/usuario_skills.js`

- [ ] No tocar `routes/login.js`.
- [ ] No duplicar el comentario si el endpoint ya está manejado con el patrón existente.
- [x] Ejecutar `node server.js` para validar sintaxis.
- [ ] Probar 1-2 endpoints con y sin token para confirmar comportamiento.


