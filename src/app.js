//creating a new server using express->npm i express
const express= require("express");
const app=express();
//server is running atr localhost:7777
app.use("/",(req,res)=>{
    res.send("Hello from the server!")
})

//Giving routes along with req,res->localhost:7777/test
//Server will run at 7777 but o/p at /test
app.use("/test",(req,res)=>{
    res.send("test Route ")
})
app.listen(7777,()=>{
    console.log("Server is listening at port 7777");
    
});