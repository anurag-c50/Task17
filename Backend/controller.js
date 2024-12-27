const User=require("./model/UserModel")
const VegeDB=require('./model/VegeModel')
const {generateToken}=require('./auth')
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
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
    return res.status(200).json({token,status:true})
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
    return res.status(200).json({token,status:true})
    }catch(err){
        next(err)
    }
}
module.exports.GetUserInfo=async(req,res,next)=>{
    try{
        const getToken = req?.header('Authorization')
        const decode=jwt.decode(getToken)
        const id=decode.payload.id
        const data = await User.findById({_id:id})
        if(data){
            return res.status(200).json({status:true,data:data})
        }else{
            return res.json({status:false})
        }
    }catch(err){
        next(err)
    }
}
module.exports.EditProfile=async(req,res,next)=>{
    try{
        const {Id,FirstName,LastName,Phoneno,UserPic}=req.body
        const updateFields={}
        console.log(Id)
        if (FirstName){
             updateFields.FirstName= FirstName;
        }
        if (LastName){ 
            updateFields.LastName = LastName;
        }
        if (Phoneno){
             updateFields.Phoneno = Phoneno;
        }
        if (UserPic){ 
            updateFields.UserPic = UserPic;
        }
        const data= await User.findByIdAndUpdate({_id:Id},updateFields,{new:true})
        if(data){
            return res.status(200).json({status:true,data})
     }else{
         return res.status(200).json({status:false})
     }
    }catch(err){
        next(err)
    }
}
module.exports.EditAddress=async(req,res,next)=>{
    try{
        const {Id,AddressID,Address1,Address2,City,State,ZipCode}=req.body
        console.log(Id,Address1,Address2,City,State,ZipCode)
        const updateFields={}
        if (Address1){
            updateFields.Address1=Address1
       }
       if (Address2){ 
           updateFields.Address2=Address2
       }
       if (City){
            updateFields.City=City
       }
       if (State){ 
           updateFields.State=State
       }if (ZipCode){ 
           updateFields.ZipCode=ZipCode
       }
        const id = new mongoose.Types.ObjectId(Id);
        const data =await User.updateOne({_id:Id},
            {$set:{'UserPersonalDetails.$[u]':updateFields}},
            {arrayFilters:[{'u._id':AddressID}]}
        )
        if(data){
           return res.status(200).json({status:true,data})
    }else{
        return res.status(200).json({status:false})
    }
    }catch(err){
        next(err)
    }
}

module.exports.AddMultipleAddress=async(req,res,next)=>{
    try{
        const {Id,Address1,Address2,City,State,ZipCode}=req.body
        console.log(Id,Address1,Address2,City,State,ZipCode)
        const updateFields={}
        if (Address1){
             updateFields.Address1=Address1
        }
        if (Address2){ 
            updateFields.Address2=Address2
        }
        if (City){
             updateFields.City=City
        }
        if (State){ 
            updateFields.State=State
        }if (ZipCode){ 
            updateFields.ZipCode=ZipCode
        }
        const id = new mongoose.Types.ObjectId(Id);
        let data = await User.findOneAndUpdate({_id:id}, {
            $push:{UserPersonalDetails:updateFields}
        }, {new: true})
        if(data){
           return res.status(200).json({status:true,data})
    }else{
        return res.status(200).json({status:false})
    }
    }catch(err){
        next(err)
    }
}
module.exports.AddVegeInfo=async(req,res,next)=>{
    try{
        const {VegePic,VegeName}=req.body
        const VegeInfo=await VegeDB.create({
            VegeName:VegeName,
            VegePhoto:VegePic
        })
        if(VegeInfo){
        return res.status(200).json({VegeInfo:VegeInfo,status:true})
        }
        return res.json({status:false})
    }catch(err){
        next(err)
    }
}
module.exports.FetchVegeInfo=async(req,res,next)=>{
    try{
        const {page,pageSize}=req.body
        const TotalDocument=9
        const ShowNoOfButtons=Math.ceil(TotalDocument/pageSize)
        let arrayShowNoOfButtons=[];
        for(let i=0;i<ShowNoOfButtons;i++){
            arrayShowNoOfButtons.push(i+1)
        }
        const VegeInfo=await VegeDB.find().skip((page-1)*pageSize).limit(pageSize)
        if(VegeInfo){
        return res.status(200).json({VegeInfo:VegeInfo,status:true,arrayShowNoOfButtons})
        }
        return res.json({status:false})
    }catch(err){
        next(err)
    }
}