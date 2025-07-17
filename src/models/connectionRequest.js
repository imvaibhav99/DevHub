const mongoose=require("mongoose");
const connectionRequestSchema=new mongoose.Schema({
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
    },
    status:{
        type:String,
        required:true,
        enum:{
        values:["ignored","interested","accepted","rejected"],
        message:'{VALUE} is not a valid status'
        } 
    }
},{timestamps:true});

//prevents the fromUserId to send connection request to himself
//this is a pre-save hook which runs before saving the connection request to the database
connectionRequestSchema.pre("save",function(next){
    const connectionRequest = this;
   if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
    throw new Error("Cannot send connection request to self");
   }
    next();
})

const ConnectionRequestModel= new mongoose.model("ConnectionRequest",connectionRequestSchema); //creating the model for connection request
module.exports=ConnectionRequestModel;
//This model will be used to create connection requests between users in the application