const express=require("express");
const requestRouter=express.Router();
const User=require("../models/user");  //get the user model


requestRouter.get("/feed",async(req,res)=>{
    try{
        const users=await User.find({}); //to get the whole user data
        res.send(users); //sending the user from the database to the postman
    }catch(err){
        res.status(400).send("Something went wrong");
    }
})

module.exports=requestRouter;