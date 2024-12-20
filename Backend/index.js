const express = require('express')
const mongoose = require("mongoose")
const cors=require("cors")
const app=express()
const userRoutes = require("./userRoutes")

app.use(express.json())
app.use(express.urlencoded({extended: true }))

const url = 'mongodb://127.0.0.1:27017/HealthyPlaneat'

mongoose.connect(url).then(()=>{
    console.log("Connected to MongoDB")
}).catch((err)=>{
    console.log("Error to Connect MongoDB",err)
})
const corsOptions ={
    origin:['http://localhost:5173'], 
    credentials:true,     
    optionSuccessStatus:200
}
app.use(cors(corsOptions));
app.use('/api',userRoutes)


app.listen(80,()=>{
    console.log("Server is running")
})