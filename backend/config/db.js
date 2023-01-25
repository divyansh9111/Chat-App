const mongoose =require("mongoose");
require('dotenv').config({path: '../.env'});

const connectDB=async ()=>{
    try {
        mongoose.set('strictQuery', true);//IMP
        const conn=await mongoose.connect(process.env.MONGO_URI,{
            useNewUrlParser:true,
            useUnifiedTopology:true,
            // useFindAndModify:true, =>Not supported
        });
        console.log(`MongoDB database connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(`Error: ${error.message}`);
        process.exit();
    }
}
module.exports=connectDB;