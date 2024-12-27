const mongoose=require("mongoose")
const VegeScheme=mongoose.Schema({
    VegePhoto:{
    type:String,
    require:true
    },
    VegeName:{
        type:String,
        require:true
    },
})
const vegeModel=mongoose.model("vegeModel",VegeScheme)
module.exports=vegeModel