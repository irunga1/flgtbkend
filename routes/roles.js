const Utilery = require("../libs/utilery");
const router  = require('express').Router();
const db = require("../db"); // importa tu conexión knex
const { authJwt } = require("../middlewares/authJwt");


// Obtener roles
router.get("/", authJwt, async (req, res) => {
    try {
        let ut = new Utilery();
        let { id, nombre } = req.query;

        id = ut.sanitizeText(id);
        nombre = ut.sanitizeText(nombre);

        let query = db("roles").select("*");
        if (id) query = query.where({ id_rol: id });
        if (nombre) query = query.where("nombre", "like", `%${nombre}%`);

        let roles = await query;
        res.json(roles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.get("/search", authJwt, async (req, res) => {
    try {
        let ut = new Utilery();
        let { id, nombre } = req.query;

        id = ut.sanitizeText(id);
        nombre = ut.sanitizeText(nombre);

        let query = db("roles").select("*");
        if (id) query = query.where({ id_rol: id });
        if (nombre) query = query.where("nombre", "like", `%${nombre}%`);

        const results = await query;
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.get("/:id", authJwt, async (req,res) => {
    try {
        let ut = new Utilery();
        let {id} = req.params;
        let query = db("roles").select("*");
        if (id){
            query = query.where({ id_rol: id });
        }
        let rol = await query;
        res.json({rol});
    } catch (error) {
        console.log(error);
        res.json({error});
    }
})



// Crear rol
router.post("/", authJwt, async (req, res) => {
    try {
        let ut = new Utilery();
        let { nombre } = req.body;

        nombre = ut.sanitizeText(nombre);

        let [id] = await db("roles").insert({ nombre });
        res.json({ id_rol: id, nombre });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Actualizar rol
router.put("/:id", authJwt, async (req, res) => {
    try {
        let ut = new Utilery();
        let { id } = req.params;
        let { nombre } = req.body;

        id = ut.sanitizeText(id);
        nombre = ut.sanitizeText(nombre);

        await db("roles")
            .where({ id_rol: id })
            .update({ nombre });

        res.json({ id_rol: id, nombre });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Eliminar rol
router.delete("/:id", authJwt, async (req, res) => {
    try {
        let ut = new Utilery();
        let { id } = req.params;

        id = ut.sanitizeText(id);

        await db("roles").where({ id_rol: id }).del();
        res.json({ id_rol: id, deleted: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

