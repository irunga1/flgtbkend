const Utilery = require("../libs/utilery");
const router  = require('express').Router();
const db = require("../db"); // importa tu conexión knex
const { authJwt } = require("../middlewares/authJwt");
const sqlite3 = require('sqlite3').verbose();
const db2 = '../data/freelancegt.db'; // Ruta a tu base de datos SQLite 


// Obtener freelancer_proyectos
router.get("/", authJwt, async (req, res) => {
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

// Obtener proyectos  publicados con personsas que aplicaron y skills
router.get("/myprojectscl",async(req,res) => {
    try {
        let ut = new Utilery();
        let {idclient} = req.query;
        idclient =  ut.sanitizeText(idclient);
        idclient = Number(idclient);
        console.log(idclient);
        let strQuery = `
                    SELECT
                p.id_cliente,
                p.titulo,
                fp.id_freelancer,
                fp.fecha_aplicacion,
                u.nombre,
                u.fecha_registro,
                u.email,
                s1.nombre AS skill1,
                s2.nombre AS skill2,
                s3.nombre AS skill3,
                s4.nombre AS skill4,
                s5.nombre AS skill5
            FROM proyectos p
            JOIN freelancer_proyecto fp ON fp.id_proyecto = p.id_proyecto
            JOIN usuarios u ON fp.id_freelancer = u.id_usuario
            JOIN skills s1 ON p.skill1 = s1.id_skill
            JOIN skills s2 ON p.skill2 = s2.id_skill
            JOIN skills s3 ON p.skill3 = s3.id_skill
            JOIN skills s4 ON p.skill4 = s4.id_skill
            JOIN skills s5 ON p.skill5 = s5.id_skill
            WHERE p.id_cliente = ${idclient}`;
        
        const rows = await db.raw(strQuery);
        res.json({ status: "success", data: rows });

        
    } catch (error) {
        console.log(error)
        res.json(error)
    }
});
// Obtener proyectos a los que el fl aplico
router.get("/myprojectscl",async(req,res) => {
    try {
        let ut = new Utilery();
        let {idclient} = req.query;
        idclient =  ut.sanitizeText(idclient);
        idclient = Number(idclient);
        console.log(idclient);
        let strQuery = `
                    SELECT
                p.id_cliente,
                p.titulo,
                fp.id_freelancer,
                fp.fecha_aplicacion,
                u.nombre,
                u.fecha_registro,
                u.email,
                s1.nombre AS skill1,
                s2.nombre AS skill2,
                s3.nombre AS skill3,
                s4.nombre AS skill4,
                s5.nombre AS skill5
            FROM proyectos p
            JOIN freelancer_proyecto fp ON fp.id_proyecto = p.id_proyecto
            JOIN usuarios u ON fp.id_freelancer = u.id_usuario
            JOIN skills s1 ON p.skill1 = s1.id_skill
            JOIN skills s2 ON p.skill2 = s2.id_skill
            JOIN skills s3 ON p.skill3 = s3.id_skill
            JOIN skills s4 ON p.skill4 = s4.id_skill
            JOIN skills s5 ON p.skill5 = s5.id_skill
            WHERE p.id_cliente = ${idclient}` // Asegúrate de que el rol del freelancer sea 2
        // res.json({idclient});
        const rows = await db.raw(strQuery);
        res.json({ status: "success", data: rows });        
    } catch (error) {
        console.log(error)
        res.json(error)
    }
});

router.get("/search", async (req, res) => {
    try {
        let ut = new Utilery();
        let { id, id_proyecto, id_freelancer, estado } = req.query;
        id = ut.sanitizeText(id);
        id_proyecto = ut.sanitizeText(id_proyecto);
        console.log(req.query);
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

