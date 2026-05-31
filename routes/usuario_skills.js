const Utilery = require("../libs/utilery");
const router  = require('express').Router();

// Obtener skills de un usuario
router.get("/usuario_skills", (req, res) => {
    try {
        console.log(req.query);
        let ut = new Utilery();
        let {id_usuario} = req.query;

        id_usuario = ut.sanitizeText(id_usuario);

        res.json({id_usuario});
    } catch (error) {
        res.json({error});
    }
});

// Agregar skill a usuario
router.post("/usuario_skills", (req, res) => {
    try {
        let ut = new Utilery();
        let {id_usuario, id_skill, nivel} = req.body;

        id_usuario = ut.sanitizeText(id_usuario);
        id_skill = ut.sanitizeText(id_skill);
        nivel = ut.sanitizeText(nivel);

        res.json({id_usuario, id_skill, nivel});
    } catch (error) {
        res.json({error});
    }
});

// Actualizar nivel de skill de usuario
router.put("/usuario_skills/:id", (req, res) => {
    try {
        let ut = new Utilery();
        let {id} = req.params;
        let {nivel} = req.body;

        id = ut.sanitizeText(id);
        nivel = ut.sanitizeText(nivel);

        res.json({id, nivel});
    } catch (error) {
        res.json({error});
    }
});

// Eliminar skill de usuario
router.delete("/usuario_skills/:id", (req, res) => {
    try {
        let ut = new Utilery();
        let {id} = req.params;

        id = ut.sanitizeText(id);

        res.json({id, deleted: true});
    } catch (error) {
        res.json({error});
    }
});

module.exports = router;
