const {sign,login} = require('./controller')
const router=require("express").Router();
router.post("/SiginUp",sign)
router.post("/logIn",login)

module.exports=router;