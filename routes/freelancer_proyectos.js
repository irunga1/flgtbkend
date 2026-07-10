const Utilery = require("../libs/utilery");
const DataValidator = require("../libs/datavalidator");
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
        const dv = new DataValidator();

        if (id !== undefined) {
            const boolId = dv.numValidator(String(id));
            if (!boolId) {
                return res.json({ status: "error", desc: "invalid Data" });
            }
        }

        if (id_proyecto !== undefined) {
            const boolProyecto = dv.numValidator(String(id_proyecto));
            if (!boolProyecto) {
                return res.json({ status: "error", desc: "invalid Data" });
            }
        }

        if (id_freelancer !== undefined) {
            const boolFreelancer = dv.numValidator(String(id_freelancer));
            if (!boolFreelancer) {
                return res.json({ status: "error", desc: "invalid Data" });
            }
        }

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
// router.get("/myprojectsfl", authJwt ,async (req, res) => {
// router.get("/myprojectsfl", authJwt, async (req, res) => {
router.get("/myprojectsfl",async (req, res) => {
    try {
        let ut = new Utilery();
        let { idfreelancer } = req.query;
        idfreelancer = ut.sanitizeText(idfreelancer);
        idfreelancer = Number(idfreelancer);
        // console.log("aaaa"+authJwt);

        let strQuery = `
            SELECT 
                fp.id_proyecto,
                p.id_cliente, 
                p.titulo,  
                p.descripcion,
                s1.nombre AS skill1,
                s2.nombre AS skill2,
                s3.nombre AS skill3,
                s4.nombre AS skill4,
                s5.nombre AS skill5,
                p.presupuesto,
                u.nombre, 
                u.descripcion AS bio,
                fp.estado 
            FROM freelancer_proyecto fp
            JOIN proyectos p ON p.id_proyecto = fp.id_proyecto 
            JOIN usuarios u ON u.id_usuario = p.id_cliente
            JOIN skills s1 ON p.skill1 = s1.id_skill
            JOIN skills s2 ON p.skill2 = s2.id_skill
            JOIN skills s3 ON p.skill3 = s3.id_skill
            JOIN skills s4 ON p.skill4 = s4.id_skill
            JOIN skills s5 ON p.skill5 = s5.id_skill
            WHERE fp.id_freelancer = ${idfreelancer}`

        const rows = await db.raw(strQuery);
        


        res.json({ status: "success", rows });

    } catch (error) {
        console.log(error)
        res.status(500).json({ status: "error", error: error.message })
    }
});
 router.get("/selected/:id", async (req, res) => {
//router.put("/selected/:id", authJwt, async (req, res) => {
    try {
        let ut = new Utilery();
        let { id } = req.params;
        id = ut.sanitizeText(id);
        id = Number(id);
        console.log(id);
        // Actualizar estado a "selected"
        if(id >0){
            let row = await db("freelancer_proyecto")
            .where({ id_freelancer_proyecto: id })
            .update({ estado: "selected" });
            console.log(row);
        }
        else{
            res.json({status:"error",desc:"id invalido"});
        }


        res.json({ id_freelancer_proyecto: id, estado: "selected" });
    } catch (error) {
        res.status(500).json({ status: "error", error: error.message });
    }
});



// Obtener proyectos a los que el fl aplico
// router.get("/myprojectscl", authJwt, async (req, res) => {
router.get("/myprojectscl", async (req, res) => {
    try {
        let ut = new Utilery();
        let { idclient } = req.query;
        idclient = ut.sanitizeText(idclient);
        idclient = Number(idclient);
        // console.log("aaaa"+authJwt);

        let strQuery = `
            SELECT
                p.estado,
                p.id_proyecto,
                p.presupuesto,
                p.descripcion,
                p.id_cliente,
                p.titulo,
                fp.id_freelancer,
                fp.id_freelancer_proyecto,
                fp.fecha_aplicacion,
                fp.propuesta,
                u.nombre,
                u.fecha_registro,
                u.email,
                s1.nombre AS skill1,
                s2.nombre AS skill2,
                s3.nombre AS skill3,
                s4.nombre AS skill4,
                s5.nombre AS skill5
            FROM proyectos p
            LEFT JOIN freelancer_proyecto fp ON fp.id_proyecto = p.id_proyecto
            LEFT JOIN usuarios u ON fp.id_freelancer = u.id_usuario
            JOIN skills s1 ON p.skill1 = s1.id_skill
            JOIN skills s2 ON p.skill2 = s2.id_skill
            JOIN skills s3 ON p.skill3 = s3.id_skill
            JOIN skills s4 ON p.skill4 = s4.id_skill
            JOIN skills s5 ON p.skill5 = s5.id_skill
            WHERE p.id_cliente = ${idclient}
            ORDER BY p.id_proyecto`

        const rows = await db.raw(strQuery);
        const proyectos = {};

        for (const row of rows) {
            const id = row.id_proyecto;

            // Si el proyecto no existe aún, lo creo con sus datos base
            if (!proyectos[id]) {
                proyectos[id] = {
                    id_proyecto: row.id_proyecto,
                    estado: row.estado,
                    presupuesto: row.presupuesto,
                    propuesta:row.propuesta,
                    descripcion: row.descripcion,
                    id_cliente: row.id_cliente,
                    titulo: row.titulo,
                    skill1: row.skill1,
                    skill2: row.skill2,
                    skill3: row.skill3,
                    skill4: row.skill4,
                    skill5: row.skill5,
                    freelancers: [] // array para meter los freelancers
                };
            }

            // Agrego el freelancer a ese proyecto
            proyectos[id].freelancers.push({
                id_freelancer: row.id_freelancer,
                fecha_aplicacion: row.fecha_aplicacion,
                propuesta: row.propuesta,
                nombre: row.nombre,
                email: row.email,
                fecha_registro: row.fecha_registro,
                id_freelancer_proyecto: row.id_freelancer_proyecto

            });
        }

        res.json({ status: "success", data: proyectos });

    } catch (error) {
        console.log(error)
        res.status(500).json({ status: "error", error: error.message })
    }
});

router.get("/search", authJwt, async (req, res) => {
// router.get("/search", async (req, res) => {
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
router.post("/", authJwt, async (req, res) => {
// router.post("/", async (req, res) => {
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
router.put("/:id", authJwt, async (req, res) => {
// router.put("/:id", async (req, res) => {
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
router.delete("/:id", authJwt, async (req, res) => {
// router.delete("/:id", async (req, res) => {
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

