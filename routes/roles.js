const Utilery = require("../libs/utilery");
const DataValidator = require("../libs/datavalidator");
const router  = require('express').Router();
const db = require("../db"); // importa tu conexión knex
const { authJwt } = require("../middlewares/authJwt");


// Obtener roles
router.get("/", authJwt, async (req, res) => {
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
        const dv = new DataValidator();

        if (id !== undefined && !dv.numValidator(String(id))) {
            return res.json({ status: "error", desc: "invalid Data" });
        }
        if (nombre !== undefined && !dv.textValidator(String(nombre))) {
            return res.json({ status: "error", desc: "invalid Data" });
        }

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
        const dv = new DataValidator();
        let {id} = req.params;

        if (id !== undefined && !dv.numValidator(String(id))) {
            return res.json({ status: "error", desc: "invalid Data" });
        }

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
        const dv = new DataValidator();
        let { nombre } = req.body;

        if (nombre !== undefined && !dv.textValidator(String(nombre))) {
            return res.json({ status: "error", desc: "invalid Data" });
        }

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
        const dv = new DataValidator();
        let { id } = req.params;

        if (id !== undefined && !dv.numValidator(String(id))) {
            return res.json({ status: "error", desc: "invalid Data" });
        }

        id = ut.sanitizeText(id);

        await db("roles").where({ id_rol: id }).del();
        res.json({ id_rol: id, deleted: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

