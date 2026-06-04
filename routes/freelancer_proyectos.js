const Utilery = require("../libs/utilery");
const router  = require('express').Router();
const db = require("../db"); // importa tu conexión knex


// Obtener freelancer_proyectos
router.get("/", async (req, res) => {
    try {
        let ut = new Utilery();
        let { id, id_proyecto, id_freelancer, estado } = req.query;

        id = ut.sanitizeText(id);
        id_proyecto = ut.sanitizeText(id_proyecto);
        id_freelancer = ut.sanitizeText(id_freelancer);
        estado = ut.sanitizeText(estado);

        let query = db("freelancer_proyecto").select("*");
        if (id) query = query.where({ id_freelancer_proyecto: id });
        if (id_proyecto) query = query.where({ id_proyecto });
        if (id_freelancer) query = query.where({ id_freelancer });
        if (estado) query = query.where({ estado });

        let rows = await query;
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Buscar freelancer_proyectos
router.get("/search", async (req, res) => {
    try {
        let ut = new Utilery();
        let { id, id_proyecto, id_freelancer, estado } = req.query;

        id = ut.sanitizeText(id);
        id_proyecto = ut.sanitizeText(id_proyecto);
        id_freelancer = ut.sanitizeText(id_freelancer);
        estado = ut.sanitizeText(estado);

        let query = db("freelancer_proyecto").select("*");
        if (id) query = query.where({ id_freelancer_proyecto: id });
        if (id_proyecto) query = query.where({ id_proyecto });
        if (id_freelancer) query = query.where({ id_freelancer });
        if (estado) query = query.where({ estado });

        const results = await query;
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Crear freelancer_proyecto
router.post("/", async (req, res) => {
    try {
        let ut = new Utilery();
        let { id_proyecto, id_freelancer, propuesta, estado } = req.body;

        id_proyecto = ut.sanitizeText(id_proyecto);
        id_freelancer = ut.sanitizeText(id_freelancer);
        propuesta = ut.sanitizeText(propuesta);
        estado = ut.sanitizeText(estado);

        let [id] = await db("freelancer_proyecto").insert({
            id_proyecto,
            id_freelancer,
            propuesta,
            estado,
        });

        res.json({ id_freelancer_proyecto: id, id_proyecto, id_freelancer, propuesta, estado });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Actualizar freelancer_proyecto
router.put("/:id", async (req, res) => {
    try {
        let ut = new Utilery();
        let { id } = req.params;
        let { id_proyecto, id_freelancer, propuesta, estado } = req.body;

        id = ut.sanitizeText(id);
        id_proyecto = ut.sanitizeText(id_proyecto);
        id_freelancer = ut.sanitizeText(id_freelancer);
        propuesta = ut.sanitizeText(propuesta);
        estado = ut.sanitizeText(estado);

        let patch = {};
        if (id_proyecto !== undefined) patch.id_proyecto = id_proyecto;
        if (id_freelancer !== undefined) patch.id_freelancer = id_freelancer;
        if (propuesta !== undefined) patch.propuesta = propuesta;
        if (estado !== undefined) patch.estado = estado;

        await db("freelancer_proyecto")
            .where({ id_freelancer_proyecto: id })
            .update(patch);

        res.json({ id_freelancer_proyecto: id, ...patch });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Eliminar freelancer_proyecto
router.delete("/:id", async (req, res) => {
    try {
        let ut = new Utilery();
        let { id } = req.params;

        id = ut.sanitizeText(id);

        await db("freelancer_proyecto").where({ id_freelancer_proyecto: id }).del();
        res.json({ id_freelancer_proyecto: id, deleted: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

