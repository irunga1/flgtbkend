const router  = require('express').Router();
const db = require("../db");
const Utilery = require("../libs/utilery"); 

router.get("/", async (req, res) => {
    try {
        const ut = new Utilery("");
        let { id_usuario } = req.query;
        id_usuario = ut.sanitizeText(id_usuario);
        id_usuario = Number(id_usuario);
        if (!id_usuario || Number.isNaN(id_usuario)) {
            return res.status(400).json({ error: 'id_usuario requerido (número)' });
        }
        const applications = await db('freelancer_proyectos')
            .join('proyectos', 'freelancer_proyectos.id_proyecto', 'proyectos.id_proyecto')
            .select(
                'proyectos.id_proyecto',
                'proyectos.titulo',
                'proyectos.descripcion',
                'proyectos.id_cliente',
                'freelancer_proyectos.estado'
            )
            .where({ 'freelancer_proyectos.id_usuario': id_usuario });

        res.json(applications);
    } catch (error) {
        res.status(500).json({ error: error.message || String(error) });
    }
});

module.exports = router;