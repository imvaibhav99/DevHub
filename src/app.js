//creating a new server using express->npm i express
const express= require("express");
const app=express();
// //server is running at localhost:7777
const {adminAuth}= require("./middlewares/auth");
//Handle Auth Middleware for all GET POST ..... requests->always use app.use
app.use("/admin",adminAuth)
app.get("/admin/getAllData",(req,res)=>{
    res.send("All data sent");
})
app.get("/admin/deleteUser",(req,res)=>{
    res.send("Delete a user");
})
app.listen(7777,()=>{
    console.log("Server is listening at port 7777");
    
});