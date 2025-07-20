const express=require("express");
const requestRouter=express.Router();
const User=require("../models/user");  //get the user model
const ConnectionRequest=require("../models/connectionRequest.js");
const { userAuth } = require("../middlewares/auth");
const UserModel = require("../models/user.js"); 

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {

    try{
    const fromUserId=req.user._id;        // User sending the request comes from the auth middleware
    const toUserId=req.params.toUserId;  // User to whom the request is sent comes from the api URL
    const status=req.params.status;      // Status of the request comes from the api URL
    const allowedStatus=["ignored","interested"];
    if(!allowedStatus.includes(status)){
        return res.status(400).json("Invalid status: "+ status);
    }
// Check if the toUserId is valid
    const toUser= await User.findById(toUserId);
    if(!toUser){
        return res.status(404).json( {message: "User not found"});
    }
// Check if a connection request already exists between the two users i.e. saved on DB 
   const existingConnectionRequest = await ConnectionRequest.findOne({
  $or: [
    { fromUserId, toUserId },
    { fromUserId: toUserId, toUserId: fromUserId }
  ]
});
    if(existingConnectionRequest){
        return res.status(400).send("Connection request already exists");
    }
    const connectionRequest= new ConnectionRequest({
        fromUserId,
        toUserId,
        status
    });
    const data= await connectionRequest.save();
    res.json({
        message:"Connection Request Sent Successfully",
        data,
    })
    }catch(err){
        res.status(400).json({
            message:"Smoething went wrong",
            error: err.message
        })

    }
})
module.exports=requestRouter;