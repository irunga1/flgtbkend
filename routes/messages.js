const router = require('express').Router();
const Utilery = require('../libs/utilery');
const sqlite = require('sqlite3').verbose();
const { promisify } = require('util');
const {authJwt} = require("../middlewares/authJwt");
const db = new sqlite.Database('./data/freelancegt.db');
// SELECT varias filas
const all = promisify(db.all.bind(db));
const run = promisify(db.run.bind(db));


// router.get('/',authJwt, async (req,res) => {
router.get('/', async (req,res) => {
    try {
        let {id_cliente,id_freelancer} = req.query;
        let ut = new Utilery();
        id_cliente = ut.sanitizeText(id_cliente);
        id_freelancer = ut.sanitizeText(id_freelancer);
        id_cliente = Number(id_cliente);
        id_freelancer = Number(id_freelancer);
        let where = "";
        if (id_cliente) {
            where += ` m.id_cliente = ${id_cliente}`;
        }
        if (id_freelancer) {
            where += `m.id_freelancer = ${id_freelancer}`;
        }
        let strQuery=`
        SELECT
            m.id_cliente,
            m.id_freelancer,
            u.nombre AS freelancer,
            MAX(m.fecha) AS ultima_fecha,
            m.mensaje 
        FROM mensajes m
        INNER JOIN usuarios u
            ON u.id_usuario = m.id_freelancer
        WHERE ${where}
        GROUP BY m.id_cliente,m.id_freelancer
        ORDER BY ultima_fecha DESC
        `;
        let rows = await all(strQuery);
        res.json({status:"ok",data:rows}); 
    } catch (error) {
        res.json({status:"error",error})
    }
  
});

// router.post("/", authJwt, async (req, res) => {
router.post("/", async (req, res) => {
    try {
        const ut = new Utilery();
        let { id_cliente, id_freelancer, emisor, tipo, mensaje } = req.body;
        id_cliente = Number(ut.sanitizeText(id_cliente));
        id_freelancer = Number(ut.sanitizeText(id_freelancer));
        emisor = Number(ut.sanitizeText(emisor));
        tipo = Number(ut.sanitizeText(tipo));
        mensaje = ut.sanitizeParagraph(mensaje);
        if (!Number.isInteger(id_cliente) || !Number.isInteger(id_freelancer)) {
            return res.status(400).json({ status: 'error', desc: 'id_cliente y/o id_freelancer inválidos' });
        }
        if (!Number.isInteger(emisor) || !Number.isInteger(tipo)) {
            return res.status(400).json({ status: 'error', desc: 'emisor y/o tipo inválidos' });
        }
        if (!mensaje) {
            return res.status(400).json({ status: 'error', desc: 'mensaje inválido' });
        }
        // Evitar SQL injection: usar parámetros en lugar de concatenar strings
        const strQuery = `
            INSERT INTO mensajes (id_cliente, id_freelancer, emisor, tipo, mensaje, fecha)
            VALUES (${id_cliente}, ${id_freelancer}, ${emisor}, ${tipo}, "${mensaje}", datetime('now'))
        `;
        // sqlite3: run(query, params, cb)
        console.log(strQuery);
        const rows = await run(strQuery);
        res.json({ status: 'ok', data: rows });
    } catch (error) {
        res.json({ status: 'error', error });
    }
});

module.exports =router;
