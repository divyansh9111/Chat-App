const asyncHandler = require("express-async-handler");
const Chat = require("../model/chatModel");
const Message = require("../model/messageModel");
const User = require("../model/userModel");
const sendMessage=asyncHandler(async(req,res)=>{
    const{content,chatId}=req.body;
    if (!content||!chatId) {
        console.log("Invalid data passed into the request!");
        res.sendStatus(400);
    }
    let newMessage={
        sender:req.user._id,
        content:content,
        chat:chatId
    }
    try {
        let message=await Message.create(newMessage);
        message=await message.populate("chat");
        message=await message.populate("sender","name picture email");
        // message=await User.populate(message,{
            //     path:"chat.users",
            //     select:"name picture email"
            // });
            message=await message.populate("chat.users","name email picture");//works fine
        await Chat.findByIdAndUpdate(chatId,{latestMessage:message});
        res.status(200).json(message);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }

});

const allMessages=asyncHandler(async(req,res)=>{
    const{chatId}=req.params;
    console.log(chatId);
    if (!chatId) {
        console.log("Invalid data passed into the request!");
        res.sendStatus(400);
    }
    try {
        let messages=await Message.find({chat:chatId}).populate("sender","name picture email").populate("chat");
        res.status(200).json(messages);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

module.exports={sendMessage,allMessages};