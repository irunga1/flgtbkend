const router = require('express').Router();
const Utilery = require('../libs/utilery');
const sqlite = require('sqlite3').verbose();
const { promisify } = require('util');
const db = new sqlite.Database('./data/freelancegt.db');
// SELECT varias filas
const all = promisify(db.all.bind(db));
const run = promisify(db.run.bind(db));


router.get('/getmessages', async (req,res) => {
    try {
        let {id_cliente} = req.query;
        let ut = new Utilery();
        id_cliente = ut.sanitizeText(id_cliente);
        id_cliente = Number(id_cliente);
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
        WHERE m.id_cliente = ${id_cliente}
        GROUP BY m.id_cliente,m.id_freelancer
        ORDER BY ultima_fecha DESC
        `;
        let rows = await all(strQuery);
        res.json({status:"ok",data:rows}); 
    } catch (error) {
        res.json({status:"error",error})
    }
  
});

module.exports =router;
