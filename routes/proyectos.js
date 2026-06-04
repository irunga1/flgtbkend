const Utilery = require("../libs/utilery");
const router  = require('express').Router();
const db = require("../db"); // importa tu conexión knex


// Obtener proyectos
router.get("/", async (req, res) => {
    try {
        let ut = new Utilery();
        let { id, titulo, id_cliente, estado } = req.query;

        id = ut.sanitizeText(id);
        titulo = ut.sanitizeText(titulo);
        id_cliente = ut.sanitizeText(id_cliente);
        estado = ut.sanitizeText(estado);

        let query = db("proyectos").select("*");
        if (id) query = query.where({ id_proyecto: id });
        if (titulo) query = query.where("titulo", "like", `%${titulo}%`);
        if (id_cliente) query = query.where({ id_cliente: id_cliente });
        if (estado) query = query.where({ estado: estado });

        let proyectos = await query;
        res.json(proyectos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Buscar proyectos
router.get("/search", async (req, res) => {
    try {
        let ut = new Utilery();
        let { id, titulo, id_cliente, estado } = req.query;

        id = ut.sanitizeText(id);
        titulo = ut.sanitizeText(titulo);
        id_cliente = ut.sanitizeText(id_cliente);
        estado = ut.sanitizeText(estado);

        let query = db("proyectos").select("*");
        if (id) query = query.where({ id_proyecto: id });
        if (titulo) query = query.where("titulo", "like", `%${titulo}%`);
        if (id_cliente) query = query.where({ id_cliente: id_cliente });
        if (estado) query = query.where({ estado: estado });

        const results = await query;
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Crear proyecto
router.post("/", async (req, res) => {
    try {
        let ut = new Utilery();
        let { titulo, descripcion, presupuesto, id_cliente, estado } = req.body;

        titulo = ut.sanitizeText(titulo);
        descripcion = ut.sanitizeText(descripcion);
        presupuesto = ut.sanitizeText(presupuesto);
        id_cliente = ut.sanitizeText(id_cliente);
        estado = ut.sanitizeText(estado) || "activo";

        let [id] = await db("proyectos").insert({
            titulo,
            descripcion,
            presupuesto,
            id_cliente,
            estado,
        });

        res.json({ id_proyecto: id, titulo, descripcion, presupuesto, id_cliente, estado });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Actualizar proyecto
router.put("/:id", async (req, res) => {
    try {
        let ut = new Utilery();
        let { id } = req.params;
        let { titulo, descripcion, presupuesto, estado, id_cliente } = req.body;

        id = ut.sanitizeText(id);
        titulo = ut.sanitizeText(titulo);
        descripcion = ut.sanitizeText(descripcion);
        presupuesto = ut.sanitizeText(presupuesto);
        estado = ut.sanitizeText(estado);
        id_cliente = ut.sanitizeText(id_cliente);

        let patch = {};
        if (titulo !== undefined) patch.titulo = titulo;
        if (descripcion !== undefined) patch.descripcion = descripcion;
        if (presupuesto !== undefined) patch.presupuesto = presupuesto;
        if (estado !== undefined) patch.estado = estado;
        if (id_cliente !== undefined) patch.id_cliente = id_cliente;

        await db("proyectos")
            .where({ id_proyecto: id })
            .update(patch);

        res.json({ id_proyecto: id, ...patch });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Eliminar proyecto
router.delete("/:id", async (req, res) => {
    try {
        let ut = new Utilery();
        let { id } = req.params;

        id = ut.sanitizeText(id);

        await db("proyectos").where({ id_proyecto: id }).del();
        res.json({ id_proyecto: id, deleted: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

