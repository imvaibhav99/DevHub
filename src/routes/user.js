const express=require("express");
const userRouter=express.Router();
const User=require("../models/user");  //get the user model
const { userAuth } = require("../middlewares/auth"); //importing the userAuth middleware
const ConnectionRequest=require("../models/connectionRequest.js");
const UserModel = require("../models/user.js"); //importing the user model
const { connection } = require("mongoose");


const USER_SAFE_DATA=["firstName", "lastName", "photoUrl", "age", "gender" ,"about" ];

userRouter.get("/user/requests/received", userAuth, async (req , res)=>{
    try{
        const loggedInUser=req.user; //get the logged in user from the middleware
         const connectionRequest=await ConnectionRequest.find({
            toUserId: loggedInUser._id, //find all the connection requests where the logged in user is the toUser
            status:"interested"
         }).populate("fromUserId", USER_SAFE_DATA)
        res.json({
            message:"Connection Requests Fetched Successfully",
            data: connectionRequest
        })

    }catch(err){
        res.status(400).send("ERROR: "+err.message);
    }
});


userRouter.get("/user/connections", userAuth, async (req,res)=>{
    try{
        const loggedInUser=req.user;
        const connectionRequest=await ConnectionRequest.find({
            $or: [
                { toUserId: loggedInUser._id, status: "accepted" }, 
                { fromUserId : loggedInUser._id, status: "accepted" } 
            ]
        }).populate("fromUserId" , USER_SAFE_DATA )  //populate the fromUserId field with the user data
          .populate("toUserId", USER_SAFE_DATA); //populate the toUserId field with the user data
       const data = connectionRequest.map((row) => {
  return row.fromUserId._id.toString() === loggedInUser._id.toString()
    ? row.toUserId
    : row.fromUserId;
});

        res.json({
            data
        })
    }catch(err){
        res.status(400).send("ERROR: "+err.message);
    }
})

userRouter.get("/feed",userAuth, async (req,res)=>{
    try{
        const loggedInUser=req.user;
        const page=parseInt(req.query.page)|| 1; //get the page number from the request params, default is 1
        let limit=parseInt(req.query.limit)|| 10; //get the limit from the request params, default is 10
        limit>50? limit=50: limit;  //limit the number of max documents to 50 to avoid DB overload and failure
        const skip=(page-1)*limit; //calculate the number of documents to skip


        const connectionRequests=await ConnectionRequest.find({     //find all the connection requests where the logged in user is either fromUser or toUser
            $or:[
                {fromUserId: loggedInUser._id},{toUserId: loggedInUser._id}]
        }).select("fromUserId toUserId");            //select only the fromUserId and toUserId fields

        const hideUsersFromFeed=new Set();
        connectionRequests.forEach((req)=>{
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString());
        })
        const users=await User.find({
            $and:[
                { _id: { $nin: Array.from(hideUsersFromFeed) } }, //exclude the users from the feed
                { _id: { $ne: loggedInUser._id } } //exclude the logged in user from the feed
            ],
        }).select(USER_SAFE_DATA) //select only the safe data fields
            .skip(skip) //skip the documents
            .limit(limit); //limit the number of documents
        res.send(users)
    }catch(err){
        res.status(400).send("ERROR: "+ err.message);
    }
})

module.exports = userRouter;