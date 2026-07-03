const Utilery = require("../libs/utilery");
const Cripter = require("../libs/cripter");
const router = require("express").Router();
const db = require("../db");
const { authJwt } = require("../middlewares/authJwt");

// Obtener todos los usuarios
router.get("/", authJwt, async (req, res) => {
    try {
        const users = await db("usuarios").select("*");
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Buscar usuarios
router.get("/search", authJwt, async (req, res) => {
// router.get("/search", async (req, res) => {
    try {
        let { nombre, email, id_rol } = req.query;
        const ut = new Utilery();

        if (nombre) nombre = ut.sanitizeText(nombre);
        if (email) email = ut.sanitizeEmail(email);
        if (id_rol) rol = ut.sanitizeText(id_rol);

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

// router("/latest20", authJwt, (req,res) => {
router.get("/latest20", authJwt, async(req,res) => {
// router.get("/latest20",async(req,res) => {
    try {
        const users = await db("usuarios")
        .where("id_rol", 2)
        .orderBy("fecha_registro", "desc")
        .limit(20);
        res.json({users});
        
    } catch (error) {
        console.log(error)
        return res.json({error:error.message})
    }  
});


// Obtener usuario por ID
router.get("/:id", authJwt, async (req, res) => {
// router.get("/:id", async (req, res) => {
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
//router.post("/", authJwt, async (req, res) => {
 router.post("/", async (req, res) => {
    try {

        console.log("Body recibido:", req.body);
        const ut = new Utilery();
        let { nombre, email, password, id_rol,descripcion } = req.body;         
        nombre = ut.sanitizeText(nombre);
        email = ut.sanitizeEmail(email);
        password = ut.sanitizePassword(password);
        password = new Cripter().encript(password);
        descripcion =ut.sanitizeParagraph(descripcion)
        id_rol = parseInt(id_rol);
        const [id] = await db("usuarios").insert({
            nombre: nombre,
            email,
            password,
            id_rol,
            descripcion
        });
        if(id > 0){
            let status = "ok";
            let desc = "user created successfully";
            res.json({ status, desc, id, nombre, email, id_rol });  
        }
        else{
            let status = "error";
            let desc = "failed to create user";
            res.json({ status, desc });  
        }

    } catch (error) {
        res.status(500).json({status:"error", desc: error.message });
    }
});

// Actualizar usuario
router.put("/:id", authJwt, async (req, res) => {
// router.put("/:id", async (req, res) => {
    try {
        const ut = new Utilery();
        const { id } = req.params;
        let { name, email, password, id_rol, descripcion } = req.body;
        console.log(req.body);
        console.log(email);
        name = ut.sanitizeText(name);
        email = ut.sanitizeEmail(email);
        descripcion = ut.sanitizeParagraph(descripcion);
        console.log(email);
        password = ut.sanitizePassword(password);
        id_rol = ut.sanitizeText(id_rol);

        await db("usuarios")
            .where({ id_usuario: id })
            .update({
                nombre: name,
                email,
                password,
                id_rol,
                descripcion
            });

        res.json({ id, name, email, id_rol });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Eliminar usuario
router.delete("/:id", authJwt, async (req, res) => {
// router.delete("/:id", async (req, res) => {
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
