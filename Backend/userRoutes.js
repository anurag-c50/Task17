const {sign,GetUserInfo,login,EditProfile,EditAddress,AddMultipleAddress,AddVegeInfo
    ,FetchVegeInfo
} = require('./controller')
const router=require("express").Router();
router.post("/SiginUp",sign)
router.post("/logIn",login)
router.get("/getuserinfo",GetUserInfo)
router.patch('/Editprofile',EditProfile)
router.patch("/addmultipleaddress",AddMultipleAddress)
router.patch('/Editaddress',EditAddress)
router.post('/addvegeinfo',AddVegeInfo)
router.post('/fetchvegeinfo',FetchVegeInfo)


module.exports=router;