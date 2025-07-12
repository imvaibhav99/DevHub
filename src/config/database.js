


const mongoose=require("mongoose");

const connectDB=async()=>{
    await mongoose.connect("mongodb+srv://improfessional983:wWDMsY0ODiXo88Aq@cluster0.5susj.mongodb.net/Devhub")
};
module.exports= connectDB;
//db password:wWDMsY0ODiXo88Aq