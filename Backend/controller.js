const User=require("./model/UserModel")
const {generateToken}=require('./auth')
const bcrypt=require("bcrypt")
const mongoose = require('mongoose');
module.exports.sign=async(req,res,next)=>{
    try{
    const {firstname,lastname,useremail,password,userType,UserPersonalDetails}=req.body;
    const UserCheck=await User.findOne({email:useremail})
    if(UserCheck){
        return res.send({msg:"Email already used",status:false})
    }
    const salt=await bcrypt.genSalt(10);
    const hashpassword = await bcrypt.hash(password,salt)
    const userdata= await User.create({
        FirstName:firstname,
        LastName:lastname,
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
module.exports.EditProfile=async(req,res,next)=>{
    try{
        const {}=req.body
    }catch(err){
        next(err)
    }
}
module.exports.EditAddress=async(req,res,next)=>{
    try{
        const {Id,Address1,Address2,City,State,ZipCode}=req.body
        console.log(Id,Address1,Address2,City,State,ZipCode)
        const CheckObj={}
        if(Address1){
            CheckObj.Address1=Address1
        } 
        if(Address2){
            CheckObj.Address2=Address2
        }
         if(State){
            CheckObj.State=State
        }
         if(City){
            CheckObj.City=City
        }
         if(ZipCode){
            CheckObj.ZipCode=ZipCode
        }
        const id = new mongoose.Types.ObjectId(Id);
        console.log(CheckObj)
        let data = await User.findOneAndUpdate({_id:id}, {
            $set: {"UserPersonalDetails.Address1": Address1,"UserPersonalDetails.Address2": Address2,"UserPersonalDetails.State": State,
                "UserPersonalDetails.City": City,"UserPersonalDetails.ZipCode": ZipCode,
            }
        }, {new: true})
        // const data = await User.findOneAndUpdate({_id:Id},CheckObj)


        console.log(data)
        if(data){
           return res.status(200).json({status:true,data})
    }else{
        return res.status(200).json({status:false})
    }
    }catch(err){
        next(err)
    }
}