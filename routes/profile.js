const Utilery = require("../libs/utilery");
const router = require("express").Router();
const { authJwt } = require("../middlewares/authJwt");
const db = require("../db");

// router.get("/",authJwt ,async (req, res) => {
router.get("/", authJwt, async (req, res) => {
// router.get("/", async (req, res) => {
  try {
    const ut = new Utilery("");
    let { id_usuario } = req.query;

    id_usuario = ut.sanitizeText(id_usuario);
    id_usuario = Number(id_usuario);

    if (!id_usuario || Number.isNaN(id_usuario)) {
      return res.status(400).json({ error: "id_usuario requerido (número)" });
    }

    // Datos del usuario
    let user = null;
    const hasUsuariosTable = await db.schema.hasTable("usuarios");
    if (hasUsuariosTable) {
      const usuariosRows = await db("usuarios")
        .select("*")
        .where({ id_usuario })
        .limit(1);

      user = usuariosRows?.[0] || null;
    }

    // Skills del usuario
    const skills = await db("usuario_skills")
      .join("skills", "usuario_skills.id_skill", "skills.id_skill")
      .select("skills.id_skill", "skills.nombre")
      .where({ "usuario_skills.id_usuario": id_usuario });

    res.json({
      id_usuario,
      user,
      skills,
    });
  } catch (error) {
    res.status(500).json({ error: error.message || String(error) });
  }
});


// router.put("/", authJwt, async (req, res) => {
router.put("/", authJwt, async (req, res) => {
// router.put("/", async (req, res) => {
    try {
        const ut = new Utilery("");
        const { id_usuario, email, nombre, password, skillsToDelete, skillsToAdd,descripcion } = req.body;

        let id = ut.sanitizeText(id_usuario);
        id = Number(id);
        if (!id || Number.isNaN(id)) {
            return res.status(400).json({ error: 'id_usuario requerido (número)' });
        }
        const hasUsuariosTable = await db.schema.hasTable('usuarios');
        if (!hasUsuariosTable) {
            return res.status(500).json({ error: 'No existe tabla `usuarios` en la base de datos' });
        }
        const updateUser = {};
        if (email !== undefined) updateUser.email = ut.sanitizeEmail(email);
        if (nombre !== undefined) updateUser.nombre = ut.sanitizeText(nombre);
        if (password !== undefined) {
            const Cripter = require("../libs/cripter");
            const cripter = new Cripter("");
            updateUser.password = cripter.encript(ut.sanitizeText(password));
            updateUser.descripcion = ut.sanitizeParagraph(descripcion)
        }
        if (Object.keys(updateUser).length > 0) {
            await db('usuarios').where({ id_usuario: id }).update(updateUser);
        }
        if (skillsToDelete !== undefined) {
            if (!Array.isArray(skillsToDelete)) {
                return res.status(400).json({ error: 'skillsToDelete debe ser un array de id_usuario_skill' });
            }
            const ids = skillsToDelete
                .map((x) => Number(ut.sanitizeText(x)))
                .filter((x) => x && !Number.isNaN(x));

            if (ids.length > 0) {
                await db('usuario_skills')
                    .whereIn('id_usuario_skill', ids)
                    .andWhere({ id_usuario: id })
                    .del();
            }
        }
        if (skillsToAdd !== undefined) {
            if (!Array.isArray(skillsToAdd)) {
                return res.status(400).json({ error: 'skillsToAdd debe ser un array de objetos {id_skill}' });
            }
            const newSkills = skillsToAdd.map(skill => ({
                id_usuario: id,
                id_skill: Number(ut.sanitizeText(skill.id_skill))
            })).filter(s => s.id_skill && !Number.isNaN(s.id_skill));
            if (newSkills.length > 0) {
                await db('usuario_skills').insert(newSkills);
            }

        }
        // Responder con estado actualizado
        const user = await db('usuarios').select('*').where({ id_usuario: id }).limit(1);
        const skills = await db('usuario_skills')
            .join('skills', 'usuario_skills.id_skill', 'skills.id_skill')
            .select('skills.id_skill', 'skills.nombre')
            .where({ 'usuario_skills.id_usuario': id });

        res.json({
            id_usuario: id,
            user: user?.[0] || null,
            skills
        });
    } catch (error) {
        res.status(500).json({ error: error.message || String(error) });
    }
});

module.exports = router;

