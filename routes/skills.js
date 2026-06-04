const Utilery = require("../libs/utilery");
const router  = require('express').Router();
const db = require("../db"); // importa tu conexión knex


// Obtener skills
router.get("/", async (req, res) => {
    try {
        let ut = new Utilery();
        let { id, nombre } = req.query;

        id = ut.sanitizeText(id);
        nombre = ut.sanitizeText(nombre);

        let query = db("skills").select("*");
        if (id) query = query.where({ id_skill: id });
        if (nombre) query = query.where("nombre", "like", `%${nombre}%`);

        let skills = await query;
        res.json(skills);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Buscar skills
router.get("/search", async (req, res) => {
    try {
        let ut = new Utilery();
        let { id, nombre } = req.query;

        id = ut.sanitizeText(id);
        nombre = ut.sanitizeText(nombre);

        let query = db("skills").select("*");
        if (id) query = query.where({ id_skill: id });
        if (nombre) query = query.where("nombre", "like", `%${nombre}%`);

        const results = await query;
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Crear skill
router.post("/", async (req, res) => {
    try {
        let ut = new Utilery();
        let { nombre } = req.body;

        nombre = ut.sanitizeText(nombre);

        let [id] = await db("skills").insert({ nombre });
        res.json({ id_skill: id, nombre });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Actualizar skill
router.put("/:id", async (req, res) => {
    try {
        let ut = new Utilery();
        let { id } = req.params;
        let { nombre } = req.body;

        id = ut.sanitizeText(id);
        nombre = ut.sanitizeText(nombre);

        await db("skills")
            .where({ id_skill: id })
            .update({ nombre });

        res.json({ id_skill: id, nombre });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Eliminar skill
router.delete("/:id", async (req, res) => {
    try {
        let ut = new Utilery();
        let { id } = req.params;

        id = ut.sanitizeText(id);

        await db("skills").where({ id_skill: id }).del();
        res.json({ id_skill: id, deleted: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;


