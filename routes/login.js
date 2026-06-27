require('dotenv').config();
const router = require('express').Router();
const db = require('../db');
const Cripter = require('../libs/cripter');
const Utilery = require('../libs/utilery');
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});
transporter.verify((err, success) => {
    if (err) {
        console.log(err);
    } else {
        console.log("SMTP OK");
    }
});


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
            // const token = jwt.sign({email},SECRET_KEY,{expiresIn:"1h"});
            const token = jwt.sign(
                { id_usuario: user.id_usuario, email: user.email, id_rol: user.id_rol },
                SECRET_KEY,
                { expiresIn: "1h" }
            );
            return res.json({
                status: "ok",
                desc: "logged",
                user: { id: user.id_usuario, nombre: user.nombre, email: user.email, id_rol:user.id_rol },
                ref : cripter.encript(`freelancegt___${dt}`),
                token// Aquí iría un token JWT real en una implementación completa

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

router.post("/forgot", async (req, res) => {
    try {
        console.log({
            EMAIL_USER: process.env.EMAIL_USER,
            EMAIL_PASS_EXISTS: !!process.env.EMAIL_PASS,
            EMAIL_PASS_LENGTH: process.env.EMAIL_PASS?.length
        });
        const ut = new Utilery();
        const cripter = new Cripter();
        let { email } = req.body;
        email = ut.sanitizeEmail(email);
        const user = await db("usuarios")
            .where({ email })
            .first();
        if (user) {
            let dt= new Date();
            let nPassword = cripter.encript(`newpass___${dt}`).substring(0, 7); // Generar una contraseña temporal
            // Aquí iría la lógica para enviar un correo de recuperación con nPassword
            nPassword = ut.sanitizePassword(nPassword);
            const encrypted = cripter.encript(nPassword);
            await db("usuarios")    
                .where({ email })
                .update({ password: encrypted });

            const mailOptions = {
                from:"jiredpront@gmail.com",
                to: email,
                subject: "Reinicio de contraseña",
                text: `Hola ${user.nombre},\n\nSe ha solicitado un reinicio de contraseña para tu cuenta. Tu nueva contraseña temporal es: ${nPassword}\n\nPor favor, inicia sesión y cambia tu contraseña lo antes posible.\n\nGracias,\nEl equipo de soporte.`
            };
    

            transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log("Error:", error);
            } else {
                console.log("Correo enviado:", info.response);
            }
            });
            return res.json({
                status: "ok",
                desc: "recovery email sent"
            });
        } else {
            return res.json({
                status: "error",
                desc: "email not found"
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});

router.post("/reset", async (req, res) => {
    try {
        const ut = new Utilery();
        const cripter = new Cripter();
        let { email, newPassword } = req.body;
        email = ut.sanitizeEmail(email);
        newPassword = ut.sanitizePassword(newPassword);
        const encrypted = cripter.encript(newPassword);
        const updated = await db("usuarios")
            .where({ email })
            .update({ password: encrypted });
        if (updated) {
            return res.json({
                status: "ok",
                desc: "password reset successful"
            });
        } else {
            return res.json({
                status: "error",
                desc: "email not found"
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;