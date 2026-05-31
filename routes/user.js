const Utilery = require("../libs/utilery");
const router  = require('express').Router();

// Obtener usuarios
router.get("/users", (req, res) => {
    try {
        console.log(req.query);
        let ut = new Utilery();
        let {id, name, email} = req.query;
        id = ut.sanitizeText(id);
        name = ut.sanitizeText(name);
        email = ut.sanitizeEmail(email);
        res.json({id, name, email});
    } catch (error) {
        res.json({error});
    }
});

// Crear usuario
router.post("/users", (req, res) => {
    try {
        let ut = new Utilery();
        let {name, email, password, id_rol} = req.body;
        name = ut.sanitizeText(name);
        email = ut.sanitizeEmail(email);
        password = ut.sanitizePassword(password);
        id_rol = ut.sanitizeText(id_rol);

        res.json({name, email, password, id_rol});
    } catch (error) {
        res.json({error});
    }
});

// Actualizar usuario
router.put("/users/:id", (req, res) => {
    try {
        let ut = new Utilery();
        let {id} = req.params;
        let {name, email, password, id_rol} = req.body;

        id = ut.sanitizeText(id);
        name = ut.sanitizeText(name);
        email = ut.sanitizeEmail(email);
        password = ut.sanitizePassword(password);
        id_rol = ut.sanitizeText(id_rol);

        res.json({id, name, email, password, id_rol});
    } catch (error) {
        res.json({error});
    }
});

// Eliminar usuario
router.delete("/users/:id", (req, res) => {
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
