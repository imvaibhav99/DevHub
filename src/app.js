//creating a new server using express->npm i express
const express= require("express");
const connectDB=require("./config/database.js")  //exported the database.js
const app=express();
const User=require("./models/user");  //get the user model 

app.post("/signup", async (req,res)=>{

    //create the new instance of the User model
    const user =new User ({
        firstname:"Vaibhav",
        lastname:"Pandey",
        emailId:"vp@gmail.com",
        password:"vp123",
    });
    try{
        await user.save();  //user will be saved to the database and the promise will be returned so we will use async await
        res.send("User added successfully")
    } catch(err){
        res.status(400).send("Error saving the user" + err.message);
    }
});


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
