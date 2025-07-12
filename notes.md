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
    res.send("User Data Sent");
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

    ->Now create the user model named userModel
    <!-- const userModel = mongoose.model("User", userSchema) -->
    ->CREATING THE FIRST DATABASE: we want to upload data to the database,so we will use app.post.
    Always use async await and try catch for the best practices.

       -> create the new instance of the User model
<!-- 
app.post("/signup", async (req,res)=>{


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
}); -->

->The schema and the model are created for User which will hold the properties defined in the schema

->Now INSTEAD of hard coding each and every data in the database,we want to directly enter the data into the database,through the Postman into the api,and the api will push the database into the database.
Sending the json data through api into the database:
Through postman->we send data as key value pair as string in json..
<!-- {
        "firstname":"Virat",
        "lastname":"Kohli",
        "emailId":"vk@gmail.com",
        "password":"vk123",
    } -->

We will use a middleware provided by the express while sending the data in database
<!-- app.use(express.json()); --> 
for directly adding data  to database from postman
<!-- app.post("/signup", async (req,res)=>{
     
    //create the new instance of the User model
const user = new User(req.body); -->
->the req.body refers to the parsed body content (json)

//to find the user data by using emailId by using get
<!-- app.get("/user",async (req,res)=>{
    const userEmail=req.body.emailId; 
    try{
        const user=await User.find({emailId:userEmail}); //find emailId
        res.send(user); //sending the user from the database to the postman
    }catch(err){
        res.status(400).send("Something went wrong");
    }
}); -->

"/feed" for requesting the whole info from database
->const user=await User.find({emailId:userEmail});  to find one user with the email id when 2 emailid are same 
<DELETE user deleted by userId: <!-- findByIdAndDelete(userId) -->
PATCH->user info updated
<!--User.findOneAndUpdate({_id:userId},data);-->

-->DATA SANITIZATION AND SCHEMA VALIDATION:
  ->In models.js->user.js->whatever u want to make necessary while sign up,add required:true.for unique->unique:true.
  ->we can add custom validations in the schema for different user properties such as gender added as male,female and others.Apart from these 3 anything else will be error.
->to add the timestamp to keep track of the date nd time when user signed up,nd when it gets updated again ,we use //{timestamps:true} as the second argument for the schema.

->Controlling what fields can be updated after the user is signed up:
<!-- app.patch("/user/:userId",async(req,res)=>{
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
         await User.findByIdAndUpdate({_id:userId},data,{
             returnDocument:"after",
             runValidators: true,   //now the gender will update for the existing ones also
         });
         res.send("User updated succesfully");
    }catch(err){
        res.status(400).send("UPDATE FAILED"+ err.message); 
    }
}) -->