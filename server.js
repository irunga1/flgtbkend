const express = require('express');
// const cors = require('cors');
// local libs
const Utilery = require("./libs/utilery");
const cors = require("cors");
// routes
const user = require("./routes/user");
const roles = require("./routes/roles");
const skills = require("./routes/skills");
const proyectos = require("./routes/proyectos");
const freelancer_proyectos = require("./routes/freelancer_proyectos");
const usuario_skills = require("./routes/usuario_skills");
const perfil = require("./routes/profile");
const aplicar = require("./routes/aplicar");
const login = require("./routes/login");

// server routes
const app = express();
app.use(cors());

app.use(express.json()); // <-- Esto es clave
app.use(express.urlencoded({ extended: true }));

app.get('/test', (req, res) => {
    res.json({ status: 'ok', desc: 'Server is running' });
});
app.get("/name/:name", (req, res) => {
    let name = req.params.name||"";
    let ut = new Utilery("");
    if(name !==""){
        let nname = ut.sanitizeText(name);
        res.json({
            cleanName: nname
        });
    }
});
app.use("/users",user);
// app.use("/user2",user2);

app.use("/roles", roles);
app.use("/skills", skills);
app.use("/proyectos", proyectos);
app.use("/freelancer_proyectos", freelancer_proyectos);
app.use("/usuario_skills", usuario_skills);
app.use("/login", login);
app.use("/perfil", perfil);
app.use("/aplicar",aplicar)

app.listen(3001, () => {
    console.log('Server is running on port 3001');
});

