const Utilery = require("../libs/utilery");
const DataValidator = require("../libs/datavalidator");
const router  = require('express').Router();
const { authJwt } = require("../middlewares/authJwt");
const db = require("../db"); // importa tu conexión knex


// Obtener usuario_skills
// router.get("/",authJwt, async (req, res) => {
router.get("/", authJwt, async (req, res) => {
// router.get("/", async (req, res) => {
    try {
        let ut = new Utilery();
        const dv = new DataValidator();
        let { id, id_usuario, id_skill } = req.query;

        if (id !== undefined && !dv.numValidator(String(id))) {
            return res.json({ status: "error", desc: "invalid Data" });
        }
        if (id_usuario !== undefined && !dv.numValidator(String(id_usuario))) {
            return res.json({ status: "error", desc: "invalid Data" });
        }
        if (id_skill !== undefined && !dv.numValidator(String(id_skill))) {
            return res.json({ status: "error", desc: "invalid Data" });
        }

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
// router.get("/search",authJwt,async (req, res) => {
router.get("/search", authJwt, async (req, res) => {
// router.get("/search", async (req, res) => {
    try {
        let ut = new Utilery();
        const dv = new DataValidator();
        let { id, id_usuario, id_skill } = req.query;

        if (id !== undefined && !dv.numValidator(String(id))) {
            return res.json({ status: "error", desc: "invalid Data" });
        }
        if (id_usuario !== undefined && !dv.numValidator(String(id_usuario))) {
            return res.json({ status: "error", desc: "invalid Data" });
        }
        if (id_skill !== undefined && !dv.numValidator(String(id_skill))) {
            return res.json({ status: "error", desc: "invalid Data" });
        }

        id = ut.sanitizeText(id);
        id = Number(id);
        id_usuario = ut.sanitizeText(id_usuario);
        id_usuario = Number(id_usuario);
        id_skill = ut.sanitizeText(id_skill);
        id_skill = Number(id_skill);
        let query = db("usuario_skills")
            .select("usuario_skills.*", "skills.nombre as nombre")
            .join("skills", "usuario_skills.id_skill", "skills.id_skill");

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
// router.post("/",authJwt,async (req, res) => {
router.post("/", authJwt, async (req, res) => {
// router.post("/", async (req, res) => {
    try {
        let ut = new Utilery();
        const dv = new DataValidator();
        let { id_usuario, id_skill } = req.body;

        if (id_usuario !== undefined && !dv.numValidator(String(id_usuario))) {
            return res.json({ status: "error", desc: "invalid Data" });
        }
        if (id_skill !== undefined && !dv.numValidator(String(id_skill))) {
            return res.json({ status: "error", desc: "invalid Data" });
        }

        id_usuario = ut.sanitizeText(id_usuario);
        id_skill = ut.sanitizeText(id_skill);

        let [id] = await db("usuario_skills").insert({ id_usuario, id_skill });
        res.json({ id_usuario_skill: id, id_usuario, id_skill });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



// router.put("/:id", ,async (req, res) => {
// router.put("/:id",authJwt,async (req, res) => {
// Actualizar usuario_skill (sin columna `nivel`)
router.put("/:id", authJwt, async (req, res) => {
// router.put("/:id", async (req, res) => {
    try {
        let ut = new Utilery();
        const dv = new DataValidator();
        let { id } = req.params;

        if (id !== undefined && !dv.numValidator(String(id))) {
            return res.json({ status: "error", desc: "invalid Data" });
        }

        id = ut.sanitizeText(id);
        id = Number(id);
        // Si en el futuro agregas otras columnas, aquí se actualizarían.
        // Por ahora, no hay campos a actualizar.
        res.json({ id_usuario_skill: id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Eliminar skill de usuario
router.delete("/:id", authJwt, async (req, res) => {
// router.delete("/:id", async (req, res) => {
    try {
        let ut = new Utilery();
        const dv = new DataValidator();
        let { id } = req.params;

        if (id !== undefined && !dv.numValidator(String(id))) {
            return res.json({ status: "error", desc: "invalid Data" });
        }

        id = ut.sanitizeText(id);
        id = Number(id);

        await db("usuario_skills").where({ id_usuario_skill: id }).del();
        res.json({ id_usuario_skill: id, deleted: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

