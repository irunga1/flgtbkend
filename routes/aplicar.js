const router = require('express').Router();
const db = require("../db");
const Utilery = require("../libs/utilery");
const {
    authJwt
} = require("../middlewares/authJwt");

// router.get("/", authJwt, async (req, res) => {
router.get("/", authJwt, async (req, res) => {
// router.get("/", async (req, res) => {
    try {
        const ut = new Utilery("");
        let {
            id_usuario
        } = req.query;
        id_usuario = ut.sanitizeText(id_usuario);
        id_usuario = Number(id_usuario);

        if (!id_usuario || Number.isNaN(id_usuario)) {
            return res.status(400).json({
                error: 'id_usuario requerido (número)'
            });
        }
        let applications = [];
        applications = await db('freelancer_proyecto') // <-- nombre correcto
            .join('proyectos', 'freelancer_proyecto.id_proyecto', 'proyectos.id_proyecto')
            .select(
                'proyectos.id_proyecto',
                'proyectos.titulo',
                'proyectos.descripcion',
                'proyectos.id_cliente',
                'freelancer_proyecto.estado'
            )
            .where({
                'freelancer_proyecto.id_freelancer': id_usuario
            }); // <-- campo correcto
        console.log(applications);
        res.json(applications);
    } catch (error) {
        res.status(500).json({
            error: error.message || String(error)
        });
    }
});
router.post("/apply", authJwt, async (req, res) => {
// router.post("/apply", async (req, res) => {
    try {
        const ut = new Utilery("");
        let {
            id_usuario,
            id_proyecto,
            propuesta
        } = req.body;

        // Sanitizar
        id_usuario = ut.sanitizeText(id_usuario);
        id_proyecto = ut.sanitizeText(id_proyecto);
        propuesta = ut.sanitizeParagraph(propuesta);

        // Convertir a número
        id_usuario = Number(id_usuario);
        id_proyecto = Number(id_proyecto);

        if (id_usuario && id_proyecto && propuesta) {
            // 🔎 Verificar si ya existe aplicación
            const existing = await db("freelancer_proyecto")
                .where({
                    id_freelancer: id_usuario,
                    id_proyecto
                })
                .first();
            if (existing) {
                return res.json({
                    status: "error",
                    desc: "No puede aplicar más de una vez"
                });
            }
            // Insertar nueva aplicación
            const [newId] = await db("freelancer_proyecto").insert({
                id_freelancer: id_usuario,
                id_proyecto,
                propuesta,
                estado: "waiting"
            });
            res.json({
                status: "ok",
                id_freelancer_proyecto: newId,
                id_usuario,
                id_proyecto,
                propuesta
            });
        } else {
            res.json({
                status: "error",
                desc: "Campo o campos vacíos"
            });
        }
    } catch (error) {
        console.error(error);
        res.json({
            error: error.message || String(error)
        });
    }
});


module.exports = router;