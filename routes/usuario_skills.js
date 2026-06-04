const Utilery = require("../libs/utilery");
const router  = require('express').Router();
const db = require("../db"); // importa tu conexión knex


// Obtener usuario_skills
router.get("/", async (req, res) => {
    try {
        let ut = new Utilery();
        let { id, id_usuario, id_skill } = req.query;

        id = ut.sanitizeText(id);
        id_usuario = ut.sanitizeText(id_usuario);
        id_skill = ut.sanitizeText(id_skill);

        let query = db("usuario_skills").select("*");
        if (id) query = query.where({ id_usuario_skill: id });
        if (id_usuario) query = query.where({ id_usuario });
        if (id_skill) query = query.where({ id_skill });

        let rows = await query;
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Buscar usuario_skills
router.get("/search", async (req, res) => {
    try {
        let ut = new Utilery();
        let { id, id_usuario, id_skill } = req.query;

        id = ut.sanitizeText(id);
        id_usuario = ut.sanitizeText(id_usuario);
        id_skill = ut.sanitizeText(id_skill);

        let query = db("usuario_skills").select("*");
        if (id) query = query.where({ id_usuario_skill: id });
        if (id_usuario) query = query.where({ id_usuario });
        if (id_skill) query = query.where({ id_skill });

        const results = await query;
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Agregar skill a usuario
router.post("/", async (req, res) => {
    try {
        let ut = new Utilery();
        let { id_usuario, id_skill, nivel } = req.body;

        id_usuario = ut.sanitizeText(id_usuario);
        id_skill = ut.sanitizeText(id_skill);
        nivel = ut.sanitizeText(nivel);

        let [id] = await db("usuario_skills").insert({ id_usuario, id_skill, nivel });
        res.json({ id_usuario_skill: id, id_usuario, id_skill, nivel });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Actualizar nivel de skill de usuario
router.put("/:id", async (req, res) => {
    try {
        let ut = new Utilery();
        let { id } = req.params;
        let { nivel } = req.body;

        id = ut.sanitizeText(id);
        nivel = ut.sanitizeText(nivel);

        await db("usuario_skills")
            .where({ id_usuario_skill: id })
            .update({ nivel });

        res.json({ id_usuario_skill: id, nivel });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Eliminar skill de usuario
router.delete("/:id", async (req, res) => {
    try {
        let ut = new Utilery();
        let { id } = req.params;

        id = ut.sanitizeText(id);

        await db("usuario_skills").where({ id_usuario_skill: id }).del();
        res.json({ id_usuario_skill: id, deleted: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

