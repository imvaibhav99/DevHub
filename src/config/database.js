


const mongoose=require("mongoose");

const connectDB=async()=>{
    await mongoose.connect(process.env.DATABASE_SECRET_URL)
};
module.exports= connectDB;
//db password:wWDMsY0ODiXo88Aq