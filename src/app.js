const express= require("express");
const connectDB=require("./config/database.js")  //exported the database.js
const app=express();
const User=require("./models/user");  //get the user model 
const { validateSignUpData } = require("./utils/validation.js");
const bcrypt=require('bcrypt');

app.use(express.json());//middleware which reads the json data

//creating api directly from app.js using postman
app.post("/signup", async (req, res) => {
  try {
     //now when made any req of json data->it will go through api validator
    validateSignUpData(req); //API level validation =>written inside try block so that it can be catched from catch block

    const { firstName , lastName , emailId, password }=req.body;  //after validation,instantly extract the data,dont trust req.body
 
    const passwordHash = await bcrypt.hash(password,10);
    console.log(passwordHash);
    

    const user = new User({
        firstName,
        lastName,
        emailId,
        password: passwordHash
    });  //->if passes then a new instance of user will be created in DB
    await user.save();                //user will be saved to the database and the promise will be returned so we will use async await
    res.send("User added successfully");
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});


app.post("/login", async (req,res)=>{
 try{
        const { emailId, password} = req.body;
        const user= await User.findOne({emailId : emailId})
        if(!user){
            throw new Error("User not found in Database");
        }

        const isPasswordValid = await bcrypt.compare(password , user.password);
        if(isPasswordValid){
            res.send("Login Successfull")
        }else{
            throw new Error("Password is not correct ")
        }
    } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

//to find the user data by using emailId by using get
app.get("/user",async (req,res)=>{
    const userEmail=req.body.emailId; 
    try{
        const user=await User.find({emailId:userEmail}); //find emailId
        res.send(user); //sending the user from the database to the postman
    }catch(err){
        res.status(400).send("Something went wrong");
    }
});

app.get("/feed",async(req,res)=>{
    try{
        const users=await User.find({}); //to get the whole user data
        res.send(users); //sending the user from the database to the postman
    }catch(err){
        res.status(400).send("Something went wrong");
    }
})
//deleting a user by userId:passing userId in postman api,then deletes from DB
app.delete("/user",async(req,res)=>{
    const userId= req.body.userId;
    try{
        const user=await User.findByIdAndDelete(userId);
        res.send("User deleteed successfully");
    }catch(err){
        res.status(400).send("Something went wrong");
    }
});

//Updating data of a user->PATCH api
app.patch("/user/:userId",async(req,res)=>{
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
