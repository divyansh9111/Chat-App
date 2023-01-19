const mongoose=require("mongoose");
const chatSchema=mongoose.Schema({
    chatName:{type:String,trim:true},
    isGroupChat:{type:Boolean,default:false},
    users:[
        {
            type:mongoose.Schema.Types.ObjectId,//storing ids of users for a chat
            ref:"User",
        }
    ],
    latestMessage:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Message",
    },
    groupAdmin:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
},{timeStamps:true});//timeStamps for the time when the chat is created.

//Chat model
const Chat=new mongoose.model("Chat",chatSchema);
module.exports=Chat;