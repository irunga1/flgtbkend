const Utilery = require("../libs/utilery");
const router  = require('express').Router();
router.get("/user",(req,res) => {
    try {
        console.log(req.query);
        let ut = new Utilery();
        let {user,pass,email,name} = req.query;
        name = ut.sanitizeText(name);
        user = ut.sanitizeText(user);
        pass = ut.sanitizePassword(pass);
        email = ut.sanitizeEmail(email);
        res.json({user,pass,email,name});  
    } catch (error) {
        res.json({error})
    }
});
module.exports = router;