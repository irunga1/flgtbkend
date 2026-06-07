const Utilery = require("../libs/utilery");
const Cripter = require("../libs/cripter");
const router = require("express").Router();
const db = require("../db");

// Obtener todos los usuarios
router.get("/", async (req, res) => {
    try {
        const users = await db("usuarios").select("*");
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Buscar usuarios
router.get("/search", async (req, res) => {
    try {
        let { nombre, email, rol } = req.query;
        const ut = new Utilery();

        if (nombre) nombre = ut.sanitizeText(nombre);
        if (email) email = ut.sanitizeEmail(email);
        if (rol) rol = ut.sanitizeText(rol);

        let query = db("usuarios").select("*");

        if (nombre) {
            query.where("nombre", "like", `%${nombre}%`);
        }

        if (email) {
            query.where("email", "like", `%${email}%`);
        }

        if (rol) {
            query.where("id_rol", rol);
        }

        const results = await query;
        res.json(results);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obtener usuario por ID
router.get("/:id", async (req, res) => {
    try {
        const ut = new Utilery();
        let { id } = req.params;

        id = ut.sanitizeText(id);

        const user = await db("usuarios")
            .where({ id_usuario: id })
            .first();

        res.json(user);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Crear usuario
router.post("/", async (req, res) => {
    try {

         console.log("Body recibido:", req.body);
        const ut = new Utilery();
        let { name, email, password, id_rol } = req.body;    

        name = ut.sanitizeText(name);
        email = ut.sanitizeEmail(email);
        password = ut.sanitizePassword(password);
        password = new Cripter().encript(password);
        id_rol = parseInt(id_rol);
        const [id] = await db("usuarios").insert({
            nombre: name,
            email,
            password,
            id_rol
        });

        res.json({ id, name, email, id_rol });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Actualizar usuario
router.put("/:id", async (req, res) => {
    try {
        const ut = new Utilery();
        const { id } = req.params;
        let { name, email, password, id_rol } = req.body;

        name = ut.sanitizeText(name);
        email = ut.sanitizeEmail(email);
        password = ut.sanitizePassword(password);
        id_rol = ut.sanitizeText(id_rol);

        await db("usuarios")
            .where({ id_usuario: id })
            .update({
                nombre: name,
                email,
                password,
                id_rol
            });

        res.json({ id, name, email, id_rol });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Eliminar usuario
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        await db("usuarios")
            .where({ id_usuario: id })
            .del();

        res.json({
            id,
            deleted: true
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;