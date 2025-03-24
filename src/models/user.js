//creating a Schema 
const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    firstName: {
        type: String
    },
    lastName:{
        type: String
    },
    emailId:{
        type: String
    },
    password:{
        type: String
    },
    age:{
        type: Number
    },
    gender:{
        type: String
    }
});

//create a model of User 
const userModel = mongoose.model("User", userSchema);//(name,schema name)
module.exports = userModel;