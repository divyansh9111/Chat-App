const mongoose=require("mongoose");
const messageSchema=mongoose.Schema({
    sender:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
    content:{type:String,trim:true},
    chat:{type:mongoose.Schema.Types.ObjectId,ref:"Chat"},
},{timeStamps:true});

const Message=new mongoose.model("Message",messageSchema);
module.exports=Message;