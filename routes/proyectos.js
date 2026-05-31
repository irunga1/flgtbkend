const Utilery = require("../libs/utilery");
const router  = require('express').Router();

// Obtener proyectos
router.get("/proyectos", (req, res) => {
    try {
        let ut = new Utilery();
        let {id, titulo, id_cliente} = req.query;

        id = ut.sanitizeText(id);
        titulo = ut.sanitizeText(titulo);
        id_cliente = ut.sanitizeText(id_cliente);

        res.json({id, titulo, id_cliente});
    } catch (error) {
        res.json({error});
    }
});

// Crear proyecto
router.post("/proyectos", (req, res) => {
    try {
        let ut = new Utilery();
        let {titulo, descripcion, presupuesto, id_cliente} = req.body;

        titulo = ut.sanitizeText(titulo);
        descripcion = ut.sanitizeText(descripcion);
        presupuesto = ut.sanitizeText(presupuesto);
        id_cliente = ut.sanitizeText(id_cliente);

        res.json({titulo, descripcion, presupuesto, id_cliente, estado: "activo"});
    } catch (error) {
        res.json({error});
    }
});

// Actualizar proyecto
router.put("/proyectos/:id", (req, res) => {
    try {
        let ut = new Utilery();
        let {id} = req.params;
        let {titulo, descripcion, presupuesto, estado} = req.body;

        id = ut.sanitizeText(id);
        titulo = ut.sanitizeText(titulo);
        descripcion = ut.sanitizeText(descripcion);
        presupuesto = ut.sanitizeText(presupuesto);
        estado = ut.sanitizeText(estado);

        res.json({id, titulo, descripcion, presupuesto, estado});
    } catch (error) {
        res.json({error});
    }
});

// Eliminar proyecto
router.delete("/proyectos/:id", (req, res) => {
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
