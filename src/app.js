const express= require("express");
const connectDB=require("./config/database.js")  //imported the database.js
const app=express(); 
const User=require("./models/user");  //get the user model 
const { validateSignUpData } = require("./utils/validation.js");
const bcrypt=require('bcrypt');
const cookieParser=require("cookie-parser");
const jwt=require("jsonwebtoken"); 
const { userAuth } = require("./middlewares/auth"); 
 const cors= require("cors"); //importing cors to allow cross-origin requests

app.use(cors({
    origin:"http://localhost:5173",  //frontend URL
    credentials:true, //allow cookies to be sent with requests
}));
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
