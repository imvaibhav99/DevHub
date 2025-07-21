const express= require("express");
const connectDB=require("./config/database.js")  //imported the database.js
const app=express(); 
const User=require("./models/user");  //get the user model 
const { validateSignUpData } = require("./utils/validation.js");
const bcrypt=require('bcrypt');
const cookieParser=require("cookie-parser");
const jwt=require("jsonwebtoken"); 
const { userAuth } = require("./middlewares/auth"); 



app.use(express.json());//middleware which reads the json data
app.use(cookieParser()); //middleware to parse cookies from the request


const authRouter=require("./routes/auth.js"); //importing the auth router
const profileRouter=require("./routes/profile.js"); //importing the profile router
const requestRouter=require("./routes/request.js"); //importing the request router
const userRouter=require("./routes/user"); //importing the user router


app.use("/",authRouter); //using the auth router
app.use("/",profileRouter); //using the profile router                                       
app.use("/",requestRouter); //using the request router
app.use("/",userRouter); //using the user router

//deleting a user by userId:passing userId in postman api,then deletes from DB
app.delete("/user",async(req,res)=>{
    const userId= req.body.userId;
    try{
        const user=await User.findByIdAndDelete(userId);
        res.send("User deleted successfully");
    }catch(err){
        res.status(400).send("Something went wrong");
    }
});

//Updating data of a user->PATCH api
app.patch("/user/:userId",async(req,res)=>{  //passing the dynamic URL
    const userId=req.params?.userId;
    const data=req.body;
    try{
        const ALLOWED_UPDATES=["photoUrl","about","gender","age","skills"]; 
        const isUpdateAllowed=Object.keys(data).every((k)=>
        ALLOWED_UPDATES.includes(k)
    );
    if(!isUpdateAllowed){
        throw new Error("Update not allowed");  
    }
    if(data?.skills.length>10){
        throw new Error("Skills exceeds 10")
    }
         await User.findByIdAndUpdate({_id:userId},data,{
             returnDocument:"after",
             runValidators: true,   //now the gender will update for the existing ones also
         });
         res.send("User updated succesfully");
    }catch(err){
        res.status(400).send("UPDATE FAILED"+ err.message); 
    }
})
connectDB()
    .then(()=>{  //server runs only after the the Database is connected
        console.log("Datatbase Connection Established");
        app.listen(7777,()=>{
            console.log("Server is listening at port 7777");
            
        });
    })
    .catch((err)=>{
        console.error("Database cannot connect");
    })
