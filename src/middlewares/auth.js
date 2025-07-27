 //the middleware for authentication,which will be passed on in to the app.js
 const jwt=require("jsonwebtoken")
 const User=require("../models/user.js")
 const userAuth=async (req,res,next)=>{
    try{
        const {token}=req.cookies;  //asking token from the cookies
        if(!token){
           return res.status(401).send("Please Login")  //if token is not present in the cookies
        }
        const decodeObj=  await jwt.verify(token ,"DEVHUB@99") //verify the token with the secret key
        const {_id}= decodeObj;                               //extract the userId from the decoded object
        const user= await User.findById(_id);                //find the user in the database with the userId
        if(!user){
            throw new Error("User not found")
        }
        req.user=user;                                       //attach the user to the request object
        next();
    }catch(err){
        res.status(400).send("ERROR: "+ err.message);
    }
}
module.exports={
    userAuth,
};