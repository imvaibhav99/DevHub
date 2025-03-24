->multiple route handlers and wrapping in an array
->next()
->middlewares
->how express js handles requests behind scene 
<!-- app.post("/user",(req,res,next)=>{
    //  res.send("test get call");
    next();     next pr jaayega hi nhi,res.send se send ho jaayega
   // res.send("test get call");
},(req,res)=>{
    res.send("second response");
}) -->

->creating an authorising middleware for admin ->always use app.use for middlewares

<!-- app.use("/admin",(req,res,next)=>{
    console.log("Admin auth is getting checked");
    const token="xyz";
    const isAdminAuthorised=token==="xyz";
    if(!isAdminAuthorised){
        res.status(401).send("Unauthorised request")
    }else{
        next();
    }
})
app.get("/admin/getAllData",(req,res)=>{
    res.send("All data sent");
})
app.get("/admin/deleteUser",(req,res)=>{
    res.send("Delete a user");
}) -->

->create middlewares/auth.js in src
->write the adminAuth logic and export it,import it to app.js
 <!-- const adminAuth=(req,res,next)=>{
    console.log("Admin auth is getting checked");
    const token="xyz";
    const isAdminAuthorised=token==="xyz";
    if(!isAdminAuthorised){
        res.status(401).send("Unauthorised request")
    }else{
        next();
    }
}
module.exports={
    adminAuth,
}; -->

->in app.js===><!--const {adminAuth}= require("./middlewares/auth"); 
<!-- app.use("/admin",adminAuth)--> -->

->Error handlers===> app.use("/",(err,req,res,next)=>{})
<!-- app.get("/getUserData",(req,res)=>{
    throw new Error("dnkjsn");
    res.send("User Data Sent");
})

app.use("/",(err,req,res,next)=>{
    if(err){
        res.status(500).send("something went wrong");
    }
}) -->
in app.js
<!-- app.get("/getUserData",(req,res)=>{
    throw new Error("dnkjsn");
    res.semd("User Data Sent");
})

app.use("/",(err,req,res,next)=>{
    if(err){
        res.status(500).send("something went wrong");
    }
}) -->

->npm i mongoose -> copy connection string from mongodb atlas
 <!-- await mongoose.connect("mongodb+srv://improfessional983:wWDMsY0ODiXo88Aq@cluster0.5susj.mongodb.net/DevHub") -->DevHub is database name,without that it will be a cluster
 ->always write db as async await

 ->the best way to connect to the database is to export the database.js and import it in the app.js,and firstly connect the database then run the server


 ->After connecting server and database,we will create the Database schema and create the objects for the schema.And refer the docs..
  ->src->models->user.js-> create the user schema with the help of documents...

  Schema tells us what information will the database hold,it is kind of a blueprint.

  <!-- firstName: {
        type: String //best practice while witing the schema
    },
    lastName:{
        type: String
    }, -->

    ->Now create the user model
    <!-- const userModel = mongoose.model("User", userSchema) -->