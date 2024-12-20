const User=require("./model/UserModel")
const {generateToken}=require('./auth')
const bcrypt=require("bcrypt")
module.exports.sign=async(req,res,next)=>{
    try{
    const {username,useremail,password,userType,UserPersonalDetails}=req.body;
    const UserCheck=await User.findOne({email:useremail})
    if(UserCheck){
        return res.send({msg:"Email already used",status:false})
    }
    const salt=await bcrypt.genSalt(10);
    const hashpassword = await bcrypt.hash(password,salt)
    const userdata= await User.create({
        name:username,
        email:useremail,
        password:hashpassword,
        userType:userType,
        UserPersonalDetails:UserPersonalDetails,
    })
    const token=generateToken(userdata)
    await User.updateOne({_id:userdata._id},{tokens:[{token:token}]})    
    return res.status(200).json({userdata,token,status:true})
    }catch(err){
        next(err)
    }
}
module.exports.login=async(req,res,next)=>{
    try{
    const{useremail,password}=req.body;
    const userdata = await User.findOne({email:useremail})
    console.log(useremail)
    if(!userdata){
        return res.send({msg:"Invalid Useremail and Password",status:false})
    }
    const isMatch = await bcrypt.compare(password,userdata.password)
    if(!isMatch){
        return res.send({msg:"Invalid Useremail and Password",status:false})
    }
    const token=generateToken(userdata)
    await User.updateOne({_id:userdata._id},{tokens:[{token:token}]})    
    return res.status(200).json({userdata,token,status:true})
    }catch(err){
        next(err)
    }
}