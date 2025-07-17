const express = require('express');
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth"); // import the userAuth middleware
const User = require("../models/user"); // import the User model
const { validateEditProfileData } = require("../utils/validation.js"); // import validation function


profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user; // user is attached to req in the middleware
    res.send(user); // Send the full user data
  } catch (err) {
    res.status(400).send("ERROR: " + err.message); 
  }
});

profileRouter.patch("/profile/edit",userAuth,async (req,res)=>{
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
  }});

module.exports = profileRouter;
