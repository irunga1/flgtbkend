const Utilery = require("../libs/utilery");
const router  = require('express').Router();

// Obtener roles (ejemplo con query)
router.get("/roles", (req, res) => {
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

// Crear rol
router.post("/roles", (req, res) => {
    try {
        let ut = new Utilery();
        let {nombre} = req.body;

        nombre = ut.sanitizeText(nombre);

        res.json({nombre});
    } catch (error) {
        res.json({error});
    }
});

// Actualizar rol
router.put("/roles/:id", (req, res) => {
    try {
        let ut = new Utilery();
        let {nombre} = req.body;
        let {id} = req.params;

        id = ut.sanitizeText(id);
        nombre = ut.sanitizeText(nombre);

        res.json({id, nombre});
    } catch (error) {
        res.json({error});
    }
});

// Eliminar rol
router.delete("/roles/:id", (req, res) => {
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
