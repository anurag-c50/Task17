const {sign,login,EditProfile,EditAddress} = require('./controller')
const router=require("express").Router();
router.post("/SiginUp",sign)
router.post("/logIn",login)
router.patch('/Editprofile',EditProfile)
router.patch('/Editaddress',EditAddress)


module.exports=router;