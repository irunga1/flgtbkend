const Utilery = require("../libs/utilery");
const DataValidator = require("../libs/datavalidator");
const router  = require('express').Router();
const db = require("../db"); // importa tu conexión knex
const { authJwt } = require("../middlewares/authJwt");



// Obtener skills
// router.get("/", authJwt, async (req, res) => {
router.get("/", async (req, res) => {

    try {
        let ut = new Utilery();
        let { id, nombre } = req.query;
        const dv = new DataValidator();

        if (id !== undefined && !dv.numValidator(String(id))) {
            return res.json({ status: "error", desc: "invalid Data" });
        }
        if (nombre !== undefined && !dv.textValidator(String(nombre))) {
            return res.json({ status: "error", desc: "invalid Data" });
        }

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
router.get("/search", authJwt, async (req, res) => {

    try {
        let ut = new Utilery();
        const dv = new DataValidator();
        let { id, nombre } = req.query;

        if (id !== undefined && !dv.numValidator(String(id))) {
            return res.json({ status: "error", desc: "invalid Data" });
        }
        if (nombre !== undefined && !dv.textValidator(String(nombre))) {
            return res.json({ status: "error", desc: "invalid Data" });
        }

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
router.post("/", authJwt, async (req, res) => {

    try {
        let ut = new Utilery();
        const dv = new DataValidator();
        let { nombre } = req.body;

        if (nombre !== undefined && !dv.textValidator(String(nombre))) {
            return res.json({ status: "error", desc: "invalid Data" });
        }

        nombre = ut.sanitizeText(nombre);

        let [id] = await db("skills").insert({ nombre });
        res.json({ id_skill: id, nombre });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Actualizar skill
router.put("/:id", authJwt, async (req, res) => {

    try {
        let ut = new Utilery();
        const dv = new DataValidator();
        let { id } = req.params;
        let { nombre } = req.body;

        if (id !== undefined && !dv.numValidator(String(id))) {
            return res.json({ status: "error", desc: "invalid Data" });
        }
        if (nombre !== undefined && !dv.textValidator(String(nombre))) {
            return res.json({ status: "error", desc: "invalid Data" });
        }

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
router.delete("/:id", authJwt, async (req, res) => {
    try {
        let ut = new Utilery();
        const dv = new DataValidator();
        let { id } = req.params;

        if (id !== undefined && !dv.numValidator(String(id))) {
            return res.json({ status: "error", desc: "invalid Data" });
        }

        id = ut.sanitizeText(id);

        await db("skills").where({ id_skill: id }).del();
        res.json({ id_skill: id, deleted: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;


