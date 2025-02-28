//creating a new server using express->npm i express
const express= require("express");
const app=express();
//server is running atr localhost:7777

//Giving routes along with req,res->localhost:7777/test
//Server will run at 7777 but o/p at /test

//get handles the GET api call 
app.get("/user",(req,res)=>{
    res.send({firstname:"Vaibhav",
        lastname:"Saini"
    });
})
 
//post handles POST api calls
app.post("/user",(req,res)=>{
    res.send("test get call");
})

//ues handles all api calls
app.use("/test",(req,res)=>{
    res.send("tested successfully");
})
// app.use("/",(req,res)=>{
//     res.send("Hello from the server!")
// })

app.listen(7777,()=>{
    console.log("Server is listening at port 7777");
    
});