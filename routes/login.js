const router = require('express').Router();
const db = require('../db');
const Cripter = require('../libs/cripter');
const Utilery = require('../libs/utilery');

router.post("/", async (req, res) => {
    try {
        const ut = new Utilery();
        const cripter = new Cripter();
        let { email, password } = req.body;
        // Sanitizar correctamente
        email = ut.sanitizeEmail(email);
        password = ut.sanitizePassword(password);    
        const encrypted = cripter.encript(password);
        const user = await db("usuarios")
            .where({ email, password: encrypted })
            .first();
        if (user) {
            let dt= new Date();
            return res.json({
                status: "ok",
                desc: "logged",
                user: { id: user.id_usuario, nombre: user.nombre, email: user.email },
                ref : cripter.encript(`freelancegt___${dt}`) // Aquí iría un token JWT real en una implementación completa

            });
        } else {
            return res.json({
                status: "error",
                desc: "not logged"
            });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;