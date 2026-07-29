const router = require('express').Router();
const Utilery = require('../libs/utilery');
const DataValidator = require("../libs/datavalidator");
const sqlite = require('sqlite3').verbose();
const {
	promisify
} = require('util');
const {
	authJwt
} = require("../middlewares/authJwt");
const db = new sqlite.Database('./data/freelancegt.db');
const db2 = require("../db"); // importa tu conexión knex

// SELECT varias filas
const all = promisify(db.all.bind(db));
const run = promisify(db.run.bind(db));

// router.get('/',authJwt, async (req,res) => {
router.get("/test", async (req, res) => {
	try {
		const dv = new DataValidator();
		let {
			id_user
		} = req.query;
		let ut = new Utilery();

		if (id_user !== undefined && !dv.numValidator(String(id_user))) {
			return res.json({ status: "error", desc: "invalid Data" });
		}

		id_user = ut.sanitizeText(id_user);
		id_user = Number(id_user);

		if (id_user > 0) {
			let strQuery = `
        select  
            m.id_mensaje, 
            m.id_emisor,
            m.id_receptor,
            m.id_proyecto,
            m.mensaje,
            m.horafecha,
            m.tipo, 
            ue.nombre as nombre_emisor,
            ue.email as email_emisor,
            ue.descripcion as descripcion_emisor,
            ur.nombre as nombre_receptor,
            ur.email as email_receptor,
            ur.descripcion as descripcion_receptor
        from 
            mensajes m
        join 
            usuarios ue on ue.id_usuario = m.id_emisor
        join 
            usuarios ur on ur.id_usuario = m.id_receptor
        where (m.id_receptor = ${id_user} or m.id_emisor = ${id_user})
          and m.horafecha >= DATE('now','-2 months')
        order by m.horafecha desc;
      `;

			console.log(strQuery);
			let rows = await all(strQuery);

			// Agrupar por id_receptor
			let grouped = rows.reduce((acc, it) => {
				if (!acc[it.id_emisor]) {
					acc[it.id_emisor] = [];
				}
				acc[it.id_emisor].push(it);
				return acc;
			}, {});

			res.json({
				status: "ok",
				data: grouped
			});
		} else {
			res.json({
				status: "error",
				desc: "Parametro Invalido"
			});
		}
	} catch (error) {
		console.log(error);
		res.json({
			status: "error",
			error
		});
	}
});

router.get("/", async (req, res) => {

    try {
        const dv = new DataValidator();
        let ut  = new Utilery()
        let {id_user} = req.query;

        if (id_user !== undefined && !dv.numValidator(String(id_user))) {
            return res.json({ status: "error", desc: "invalid Data" });
        }

        id_user = ut.sanitizeText(id_user);
        id_user = Number(id_user);
        if(id_user > 0){
            let strQuery =`
                    select  
                        m.id_mensaje, 
                        m.id_emisor,
                        m.id_receptor,
                        m.id_proyecto,
                        m.mensaje,
                        m.horafecha,
                        m.tipo, 
                        ue.nombre as nombre_emisor,
                        ue.email as email_emisor,
                        ue.descripcion as descripcion_emisor,
                        ur.nombre as nombre_receptor,
                        ur.email as email_receptor,
                        ur.descripcion as descripcion_receptor
                    from 
                        mensajes m
                    join 
                        usuarios ue on ue.id_usuario = m.id_emisor
                    join 
                        usuarios ur on ur.id_usuario = m.id_receptor
                    where (m.id_receptor = ${id_user} or m.id_emisor = ${id_user})
                    and m.horafecha >= DATE('now','-2 months')
                    order by m.horafecha desc;
            `;
            console.log(strQuery);
            let rows = await all(strQuery);

            // Agrupamos las conversaciones bajo el id del otro participante
            let conversaciones = {};
            rows.forEach((it2) => {
                let ide = it2.id_emisor;
                let idr = it2.id_receptor;
                console.log(`emisor${ide}`);
                console.log(`receptor${idr}`);

                let otro = ide != id_user ? ide : idr;
                if(!conversaciones[otro]){
                    conversaciones[otro] = [];
                }
                conversaciones[otro].push(it2);
            });

            res.json({status:"ok", data: conversaciones});
            
        }
        else{
            res.json({status:"error",desc:"Invalid Params"})
        }

    } catch (error) {
        console.log(error);
        res.json({status:"error", desc:error})
    }

});




// router.get('/',authJwt, async (req,res) => {
// router.get('/', async (req,res) => {
//     try {
//         let {id_user} = req.query;
//         let ut = new Utilery();
//         id_user = ut.sanitizeText(id_user);
//         id_user = Number(id_user);
//         if(id_user >=0){
//             // validación simple, no se cambia nada
//         }

//         let strQuery = `
//         select  
//             m.id_mensaje, 
//             m.id_emisor,
//             m.id_receptor,
//             m.id_proyecto,
//             m.mensaje,
//             m.horafecha,
//             m.tipo, 
//             ue.nombre as nombre_emisor,
//             ue.email as email_emisor,
//             ue.descripcion as descripcion_emisor,
//             ur.nombre as nombre_receptor,
//             ur.email as email_receptor,
//             ur.descripcion as descripcion_receptor
//         from 
//             mensajes m
//         join 
//             usuarios ue on ue.id_usuario = m.id_emisor
//         join 
//             usuarios ur on ur.id_usuario = m.id_receptor
//         where (m.id_receptor = ${id_user} or m.id_emisor = ${id_user})
//           and m.horafecha >= DATE('now','-2 months')
//         order by m.horafecha desc;
//         `;

//         console.log(strQuery);

//         let rows = await all(strQuery);
//         res.json({status:"ok",data:rows}); 
//     } catch (error) {
//         res.json({status:"error",error})
//     }
// });


// router.post("/", authJwt, async (req, res) => {
router.post("/", async (req, res) => {
	try {
		let ut = new Utilery();
		let dv = new DataValidator();

		let {
			id_emisor,
			id_receptor,
			tipo,
			id_proyecto,
			mensaje
		} = req.body;
		let boolE = dv.numValidator(id_emisor);
		let boolR = dv.numValidator(id_receptor);
		let boolP = dv.numValidator(id_proyecto);
		let boolM = dv.textValidator(mensaje);
		if (!boolE || !boolR || !boolP || !boolM) {
			res.json({
				status: "error",
				desc: "Datos incorrectos"
			});
			return;
		}
		id_emisor = ut.sanitizeText(id_emisor);
		id_emisor = Number(id_emisor);
		id_receptor = ut.sanitizeText(id_receptor);
		id_receptor = Number(id_receptor);
		tipo = ut.sanitizeText(tipo);
		id_proyecto = ut.sanitizeText(id_proyecto);
		id_proyecto = Number(id_proyecto);
		mensaje = ut.sanitizeText(mensaje);
		mensaje = String(mensaje).trim();
		// Inserción
		let [id] = await db2("mensajes").insert({
			id_emisor,
			id_receptor,
			tipo,
			id_proyecto,
			mensaje
		});

		res.json({
			status: "ok",
			id_mensaje: id,
			id_emisor,
			id_receptor,
			tipo,
			id_proyecto,
			mensaje
		});

	} catch (error) {
		res.json({
			status: "error",
			error
		})
		console.log(error);
	}
});

module.exports = router;