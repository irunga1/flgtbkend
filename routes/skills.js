const Utilery = require("../libs/utilery");
const router  = require('express').Router();

// Obtener skills
router.get("/skills", (req, res) => {
    try {
        console.log(req.query);
        let ut = new Utilery();
        let {id, nombre} = req.query;

        id = ut.sanitizeText(id);
        nombre = ut.sanitizeText(nombre);

        res.json({id, nombre});
    } catch (error) {
        res.json({error});
    }
});

// Crear skill
router.post("/skills", (req, res) => {
    try {
        let ut = new Utilery();
        let {nombre} = req.body;

        nombre = ut.sanitizeText(nombre);

        res.json({nombre});
    } catch (error) {
        res.json({error});
    }
});

// Actualizar skill
router.put("/skills/:id", (req, res) => {
    try {
        let ut = new Utilery();
        let {id} = req.params;
        let {nombre} = req.body;

        id = ut.sanitizeText(id);
        nombre = ut.sanitizeText(nombre);

        res.json({id, nombre});
    } catch (error) {
        res.json({error});
    }
});

// Eliminar skill
router.delete("/skills/:id", (req, res) => {
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
