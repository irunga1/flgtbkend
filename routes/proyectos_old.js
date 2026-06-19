const Utilery = require("../libs/utilery");
const router  = require('express').Router();
const db = require("../db"); // importa tu conexión knex
const { authJwt } = require("../middlewares/authJwt");

// function getPermissions(req) {
//     const id_usuario = req?.user?.id_usuario;
//     const id_rol = req?.user?.id_rol;
//     return { id_usuario, id_rol };
// }


// Obtener proyectos
router.get("/", authJwt, async (req, res) => {
    try {
        console.log(req.user);
        let ut = new Utilery();
        let { id, titulo, id_cliente, estado } = req.query;
        let dias = 30;

        id = ut.sanitizeText(id);
        titulo = ut.sanitizeText(titulo);
        id_cliente = ut.sanitizeText(id_cliente);
        estado = ut.sanitizeText(estado);

        let query = db("proyectos")
        .select(
            "proyectos.id_proyecto",
            "proyectos.titulo",
            "proyectos.descripcion",
            "proyectos.presupuesto",
            "proyectos.fecha_publicacion",
            "proyectos.id_cliente",
            "proyectos.estado",
            "s1.nombre as skill1",
            "s2.nombre as skill2",
            "s3.nombre as skill3",
            "s4.nombre as skill4",
            "s5.nombre as skill5",
            "usuarios.nombre as cliente_nombre",
            "usuarios.email as cliente_email"
        )
        .join("usuarios", "proyectos.id_cliente", "usuarios.id_usuario")
        .leftJoin("skills as s1", "proyectos.skill1", "s1.id_skill")
        .leftJoin("skills as s2", "proyectos.skill2", "s2.id_skill")
        .leftJoin("skills as s3", "proyectos.skill3", "s3.id_skill")
        .leftJoin("skills as s4", "proyectos.skill4", "s4.id_skill")
        .leftJoin("skills as s5", "proyectos.skill5", "s5.id_skill")
        .where("usuarios.id_rol", 3); // filtro por rol

        if (id) query = query.where({ "proyectos.id_proyecto": id });
        if (titulo) query = query.where("proyectos.titulo", "like", `%${titulo}%`);
        if (id_cliente) query = query.where({ "proyectos.id_cliente": id_cliente });
        if (estado) query = query.where({ "proyectos.estado": estado });

        // filtro de rango de fecha (últimos 30 días)
        if (dias) {
        const fechaLimite = new Date();
        fechaLimite.setDate(fechaLimite.getDate() - Number(dias));
        const fechaISO = fechaLimite.toISOString().slice(0, 19).replace("T", " ");
        query = query.andWhere("proyectos.fecha_publicacion", ">=", fechaISO);
        }

        let proyectos = await query.orderBy("proyectos.fecha_publicacion", "desc");
        res.json(proyectos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/latest20", authJwt, async (req, res) => {
    try {
        const limit = 20;
        const proyectos = await db("proyectos")
        .select(
            "proyectos.id_proyecto",
            "proyectos.titulo",
            "proyectos.descripcion",
            "proyectos.presupuesto",
            "proyectos.fecha_publicacion",
            "proyectos.id_cliente",
            "proyectos.estado",
            "s1.nombre as skill1",
            "s2.nombre as skill2",
            "s3.nombre as skill3",
            "s4.nombre as skill4",
            "s5.nombre as skill5",
            "usuarios.nombre as cliente_nombre",
            "usuarios.email as cliente_email"
        )
        .join("usuarios", "proyectos.id_cliente", "usuarios.id_usuario")
        .leftJoin("skills as s1", "proyectos.skill1", "s1.id_skill")
        .leftJoin("skills as s2", "proyectos.skill2", "s2.id_skill")
        .leftJoin("skills as s3", "proyectos.skill3", "s3.id_skill")
        .leftJoin("skills as s4", "proyectos.skill4", "s4.id_skill")
        .leftJoin("skills as s5", "proyectos.skill5", "s5.id_skill")
        .where("proyectos.estado", "abierto")          // filtro por estado
        .andWhere("usuarios.id_rol", 3)                // filtro por rol del cliente
        .orderBy("proyectos.fecha_publicacion", "desc") // ordenados por fecha
        .limit(limit);

        res.json(proyectos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// Buscar proyectos
// router.get("/search", authJwt, async (req, res) => {
router.get("/search", async (req, res) => {
    try {
        let ut = new Utilery();
        let { id, titulo, id_cliente, estado } = req.query;
        id = ut.sanitizeText(id);
        titulo = ut.sanitizeText(titulo);
        id_cliente = ut.sanitizeText(id_cliente);
        estado = ut.sanitizeText(estado);
        let query = db("proyectos")
        .select(
            "proyectos.id_proyecto",
            "proyectos.titulo",
            "proyectos.descripcion",
            "proyectos.presupuesto",
            "proyectos.fecha_publicacion",
            "proyectos.id_cliente",
            "proyectos.estado",
            "s1.nombre as skill1",
            "s2.nombre as skill2",
            "s3.nombre as skill3",
            "s4.nombre as skill4",
            "s5.nombre as skill5",
            "usuarios.nombre as cliente_nombre",
            "usuarios.email as cliente_email"
        )
        .join("usuarios", "proyectos.id_cliente", "usuarios.id_usuario")
        .leftJoin("skills as s1", "proyectos.skill1", "s1.id_skill")
        .leftJoin("skills as s2", "proyectos.skill2", "s2.id_skill")
        .leftJoin("skills as s3", "proyectos.skill3", "s3.id_skill")
        .leftJoin("skills as s4", "proyectos.skill4", "s4.id_skill")
        .leftJoin("skills as s5", "proyectos.skill5", "s5.id_skill")
        .where("usuarios.id_rol", 3); // filtro por rol del cliente

        if (id) query = query.where({ "proyectos.id_proyecto": id });
        if (titulo) query = query.where("proyectos.titulo", "like", `%${titulo}%`);
        if (id_cliente) query = query.where({ "proyectos.id_cliente": id_cliente });
        if (estado) query = query.where({ "proyectos.estado": estado });

        const results = await query.orderBy("proyectos.fecha_publicacion", "desc");
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Crear proyecto
router.post("/", authJwt, async (req, res) => {
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
router.put("/:id", authJwt, async (req, res) => {
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
router.delete("/:id", authJwt, async (req, res) => {
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

