const jwt = require("jsonwebtoken")
const jwtkey="mynameisanuragjhaandiamsoftwareen"

const verifyToken=(req,res,next)=>{
   const getToken = req?.header('Authorization')||req?.body?.token
   const token =getToken.slice(7,getToken.length)
    if (!token) {
        return res.json({ message: "No token provided",status:false });
    }
    const verifyToken = jwt.verify(token, jwtkey, (err, res) => {
        if (err) {
            console.log(err)
            return "token expired"
        } return res
    })
    if(verifyToken==="token expired"){
        return res.json({msg:"Server Error.Please try some time later",status:false})
    }else{
       return next()
}
}
const generateToken=(user)=>{
    const payload={id:user.id.toString()}
    return jwt.sign({payload},jwtkey,{expiresIn:"5h"})
}
module.exports={generateToken,verifyToken}