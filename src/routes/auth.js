//appRuter apis that are signup,login,logout are written here

const express=require('express');
const authRouter=express.Router();
const bcrypt=require("bcrypt")
const { validateSignUpData } = require("../utils/validation.js");
const jwt=require("jsonwebtoken");
const cookieParser=require('cookie-parser');
const userAuth=require("../middlewares/auth")
const User=require("../models/user");  //get the user model






//creating api directly from app.js using postman
authRouter.post("/signup", async (req, res) => {
  try {
     //now when made any req of json data->it will go through api validator
    validateSignUpData(req); //API level validation =>written inside try block so that its error can be catched from catch block

    const { firstName , lastName , emailId, password }=req.body;  //after validation,instantly extract the data,dont trust req.body
 
    const passwordHash = await bcrypt.hash(password,10);  //bcrypt for password hashing, password 10 times encrypting
    //console.log(passwordHash);
    const user = new User({
        firstName,
        lastName,
        emailId,
        password: passwordHash
    });  //->if passes the validation then only creating a new instance of user in DB,storing the password as encrypted thread
    await user.save();                //user will be saved to the database and the promise will be returned so we will use async await
    res.send("User added successfully");
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});


authRouter.post("/login", async (req,res)=>{
 try{
        const { emailId, password} = req.body;  //extract the necessary from the req.body
        const user= await User.findOne({emailId : emailId})  //find the emailId entered in the database
        if(!user){
            throw new Error("User not found in Database");
        }
        const isPasswordValid = await bcrypt.compare(password , user.password);  //convert the entered password to encrypted one nd match it in database
        if(isPasswordValid){
            const token=await user.getJwt();             //get the jwt token from the user model
            //add the token back to the server and send the cookie back to user
            res.cookie("token",token)     //set the cookie with the token
            res.send(user); 
          
        }else{
            throw new Error("Password is not correct ")
        }
    } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

authRouter.post("/logout", async (req,res)=>{
    res.cookie("token",null,{
        expires: new Date(Date.now())
    })
    res.send("Logout Successfull")
});

module.exports=authRouter;