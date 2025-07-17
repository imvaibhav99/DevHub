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
->NOW to add DB level validation on emailId:
    npm i validator
  in user.js add validator:
  <!-- const validator=require('validator') -->
<!-- 
   emailId:{
        type: String,
        required:true,
        unique:true,
        lowercase:true, //always lowercase emailId
        trim:true , //to remove the whitespaces from front and back which can be considered as new emailId
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("email invalid "+ value);
            }
        }
    } -->

    Similarly validate isStrongPassword(value) in password
    ->After DB validation,we should also validate apis.It become more safer ...
       create a folder:src->utils->validation.js (Write all the required api validations here)

       in validation.js:add the validateSignUp function,then update app.js:
       <!-- app.post("/signup", async (req,res)=>{
           //now when made any req of json data->it will go through api validator
    try{
        validateSignUpData(req); 
        const user= new User(req.body);  //->if passes then a new instance of user will be created in DB
        await user.save();       //user will be saved to the database and the promise will be returned so we will use async await
        res.send("User added successfully")
    } catch(err){
        res.status(400).send("ERROR: " + err.message);
    }
}); -->

->Encrypting password: npm i bcrypt 
  const bcrypt=require('bcrypt'); in app.js,
 THis is the best way to write the signup api,with not depending completely on the req.body,
  <!-- app.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);
    const { firstName , lastName , emailId, password }=req.body;  //after validation,instantly extract the data,dont trust req.body
    const passwordHash = await bcrypt.hash(password,10);  encrypting the password by 10 rounds
    const user = new User({
        firstName,
        lastName,
        emailId,
        password: passwordHash ->sesnding the encrypted password hash to the database
    });  //->if passes then a new instance of user will be created in DB,with storing the necessary inputs directly
    await user.save();              
    res.send("User added successfully");
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
}); -->

->create the login api,to send email nd password to server:
<!-- app.post("/login", async (req,res)=>{
 try{
        const { emailId, password} = req.body;  //extract the necessary from the req.body
        const user= await User.findOne({emailId : emailId})  //find the emailId entered in the database
        if(!user){
            throw new Error("User not found in Database");
        }
        const isPasswordValid = await bcrypt.compare(password , user.password);  //convert the entered password to encrypted one nd match it in database
        if(isPasswordValid){

            res.cookie("token","jnjdnckjdnjcknwjkdnwcn")
            res.send("Login Successfull")
        }else{
            throw new Error("Password is not correct ")
        }
    } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
}); -->

-->Cookies and jwt Authentication:
 npm i cookie-parser:cookie-parser is a middleware that helps you read cookies sent by the client (usually the browser) in requests.After the login req is made nd cookie is sent back to the user,then while calling the other apis,cookie is passed along with api from the user,cookie-parser is used to read it.
 in app.js:
    const cookieParser=require("cookie-parser");
    app.use(cookieParser()); //middleware

 npm i jsonwebtoken->for jwt token creation
 const jwt=require("jsonwebtoken");  
 ->Final LOGIN API:
 <!-- app.post("/login", async (req,res)=>{
 try{
        const { emailId, password} = req.body;  //extract the necessary from the req.body
        const user= await User.findOne({emailId : emailId})  //find the emailId entered in the database
        if(!user){
            throw new Error("User not found in Database");
        }
        const isPasswordValid = await bcrypt.compare(password , user.password);  //convert the entered password to encrypted one nd match it in database
        if(isPasswordValid){

            const token=await jwt.sign({_id:user._id},"DEVHUB@99"); //hiding the user id into the cookies along with the secret code
            console.log(token);
            //add the token back to the server and send the cookie back to user
            res.cookie("token",token)
            res.send("Login Successfull");
         
        }else{
            throw new Error("Password is not correct ")
        }
    } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
}); -->

The Profile api created to view the profile of logged in user:
<!-- app.get("/profile", async (req, res) => {
  try {
    const cookies = req.cookies; // Ask the user to send their cookies (contains token)
    const { token } = cookies;   // Extract the JWT token from cookies

    // Validate the token
    const decodedMessage = await jwt.verify(token, "DEVHUB@99"); 
    const { _id } = decodedMessage; // 🎯 Extract user ID from decoded token
    console.log("Logged in user is: " + _id); // Debug log
    // 🧾 Fetch user details from database
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User does not exist");
    }
    res.send(user); // Send full user data (excluding password by default)
  } catch (err) {
    res.status(400).send("ERROR: " + err.message); 
  }
}); -->
the verify and sign functions are used,refer the documentation

Since there are too many apis,it is not a good way to write all of them in single app.js file.So similar apis will be grouped togetherand written in same file.We will create express routers and use them in place of app.use.
->create src->routes->auth.js,profile.js,request.js.
move all the apis grouped together in that file.
 <!-- const authRouter=express.Router(); //call express Router -->
put all essential imports in each api file.

->create a logout api in auth.js:
<!-- authRouter.post("/logout", async (req,res)=>{
    res.cookie("token",null,{  //set token to null 
        expires: new Date(Date.now()) //expire the cookie now
    })
    res.send("Logout Successfull")
}) -->

->Create the profile apis:
 ("/profile/view") && ("profile/edit") apis.
 <!-- profileRouter.patch("/profile/edit",userAuth,async (req,res)=>{
  try{
 if(!validateEditProfileData(req)){     // Validate the data before processing
    throw new Error("Invalid data for edit");
 }
 const loggedInUser=req.user;       
 //console.log(loggedInUser);
              //get the logged in user from the middleware
 Object.keys(req.body).forEach((key) => {        //req.body contains the fields of database that we want to update
      loggedInUser[key] = req.body[key];          // Update the user object with the new data     
    });
 //console.log(loggedInUser);
  await loggedInUser.save();             // Save the updated user object to the database
  res.json({
    message:`${loggedInUser.firstName}, your profile was updated successfully!!`,
    data: loggedInUser
  });

}catch(err){
    res.status(400).send("ERROR: " + err.message);
  }}); -->

  in validation.js:
  <!-- const validateEditProfileData = (req) => {
  const allowedEditFields=["firstName","lastName","photoUrl","about","gender","age","skills"];
  const isEditAllowed=Object.keys(req.body).every((k)=>{
    return allowedEditFields.includes(k);
  })
    return isEditAllowed;
} -->
