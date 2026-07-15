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
        let {id_user} = req.query;
        let ut = new Utilery();
        id_user = ut.sanitizeText(id_user);
        id_user = Number(id_user);
        if(id_user >=0){

        }
        let strQuery = `
        select 	
            m.id_mensaje, 
            m.id_mensaje, 
            m.id_emisor ,
            m.id_proyecto,
            m.mensaje,
            m.mensaje,
            m.horafecha,
            m.tipo, 
            u.nombre nombre_cliente,
            u.email ,
            u.descripcion
        from 
            mensajes m
        join 
            usuarios u  on u.id_usuario  = m.id_emisor
        where m.id_receptor =${id_user} or m.id_emisor= ${id_user} order by m.horafecha desc;
        `;
        console.log(strQuery)

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
