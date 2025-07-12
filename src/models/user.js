//creating a Schema 
const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required:true,
        minLength:4,   //min lenngth of name should be 4
        maxLength:50,
    },
    lastName:{
        type: String
    },
    emailId:{
        type: String,
        required:true,
        unique:true,
        lowercase:true, //always lowercase emailId
        trim:true  //to remove the whitespaces from front and back which can be considered as new emailId
    },
    password:{
        type: String,
        required:true,
    },
    age:{
        type: Number,
        min: 18,  //min age is 18 required
    },
    gender:{
        type: String,
        validate(value){  //by default it runs only on new user not on update users 
            if(!["male","female","others"].includes(value)){
                throw new Error("Gender data is not valid");
            }
        },
    },
    photourl:{
        type:String,
        default:"https://media.istockphoto.com/id/1726213993/vector/default-avatar-profile-placeholder-abstract-vector-silhouette-element.jpg?s=612x612&w=0&k=20&c=nYlk0j076CBZ5xGCCaVXtISYGK2SzXRwuQBXPkfmMX4="
    },about:{
        type:String,
        default:"This is default about of a User" //to store default behaviour in DB 
    },
    skills:{
        type:[String] //array of strings to have more than one skill
    },
    
},{timestamps:true});

//create a model of User named userModel which will export the userSchema for a User which will have these properties
const userModel = mongoose.model("User", userSchema);//(name,schema name)
module.exports = userModel;

 