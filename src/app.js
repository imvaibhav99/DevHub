//creating a new server using express->npm i express
const express= require("express");
const connectDB=require("./config/database.js")  //exported the database.js
const app=express();
const User=require("./models/user");  //get the user model 

app.use(express.json());//middleware which reads the json data

//creating api directly from app.js using postman
app.post("/signup", async (req,res)=>{
    //create the new instance of the User model
const user = new User(req.body);
    try{
        await user.save();  //user will be saved to the database and the promise will be returned so we will use async await
        res.send("User added successfully")
    } catch(err){
        res.status(400).send("Error saving the user" + err.message);
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
