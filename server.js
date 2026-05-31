const express = require('express');
const Utilery = require("./libs/utilery");
const user = require("./routes/user--")
const app = express();
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
app.get("/user",user);
app.listen(3001, () => {
    console.log('Server is running on port 3001');
});
