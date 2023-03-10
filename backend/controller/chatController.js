const asyncHandler = require("express-async-handler");
const Chat = require("../model/chatModel");
const User = require("../model/userModel");

//accessing one on one chat 
const accessChat=asyncHandler(async(req,res)=>{
    const {userId}=req.body;
    console.log(`req.user._id ${req.user._id}`);
    if (!userId) {
        console.log("userId params not sent with request");
        return res.sendStatus(400);
    }
    let isChat=await Chat.find({isGroupChat:false,$and:[
        {users:{$elemMatch:{$eq:req.user._id}}},
        {users:{$elemMatch:{$eq:userId}}},
    ]}).populate("users","-password").populate("latestMessage");

    isChat=await User.populate(isChat,{
        path:"latestMessage.sender",
        select:"name picture email"
    });
    if (isChat.length>0) {
        res.send(isChat);
    } else {
        let chatData={
            chatName:"sender",
            users:[userId,req.user._id],
            isGroupChat:false
        };
        try {
            const createdChat=await Chat.create(chatData);
            const fullChat=await Chat.find({_id:createdChat._id}).populate("users","-password");
            res.status(200).send(fullChat);
        } catch (error) {
            res.status(400);
            throw new Error(error.message);
        }
    }
});

const fetchChats=asyncHandler(async(req,res)=>{
    try {
        Chat.find({users:{$elemMatch:{$eq:req.user._id}}}).populate("users","-password").populate("groupAdmin","-password").populate("latestMessage").sort({updatedAt:-1}).then(async(results)=>{
            results=await User.populate(results,{
                path:"latestMessage.sender",
                select:"name picture email",
            });
            res.status(200).send(results);
        });
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

const createGroupChat=asyncHandler(async(req,res)=>{
    if (!req.body.users||!req.body.name) {
        return res.status(400).send({message:"please fill all the fields"});
    }

    let users=JSON.parse(req.body.users);
    users.unshift(req.user);

    try {
        const groupChat=await Chat.create({
            chatName:req.body.name,
            users:users,
            isGroupChat:true,
            groupAdmin:req.user,
        });
        const fullGroupChat=await Chat.findOne({_id:groupChat._id}).populate("users","-password").populate("groupAdmin","-password");
        res.status(200).send(fullGroupChat);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

const renameGroup=asyncHandler(async(req,res)=>{
    const {chatId,newChatName}=req.body;
    const updatedChat=await Chat.findByIdAndUpdate(chatId,{
        chatName:newChatName,
    },{new:true}).populate("users","-password").populate("groupAdmin","-password");
    if (!updatedChat) {
        res.status(400);
        throw new Error("Chat not found");
    }else{
        res.status(200).json(updatedChat);
    }
});
const addToGroup=asyncHandler(async(req,res)=>{
    const{chatId,userId}=req.body;
    const added=await Chat.findByIdAndUpdate(chatId,{
        $push:{users:userId}
    },{new:true}).populate("users","-password").populate("groupAdmin","-password");

    if (!added) {
        res.status(400);
        throw new Error("Chat not found");
    } else {
        res.status(200).json(added);
    }
});
const removeFromGroup=asyncHandler(async(req,res)=>{
    const{chatId,userId}=req.body;
    const removed=await Chat.findByIdAndUpdate(chatId,{
        $pull:{users:userId}
    },{new:true}).populate("users","-password").populate("groupAdmin","-password");

    if (!removed) {
        res.status(400);
        throw new Error("Chat not found");
    } else {
        res.status(200).json(removed);
    }
});
const updateAdmin=asyncHandler(async(req,res)=>{
    const{chatId}=req.body;
    console.log("updateAdmin");
    const foundChat=await Chat.findOne({_id:chatId});
    const newAdminId=foundChat.users[0]._id;
    const updatedChat=await Chat.findByIdAndUpdate(chatId,{groupAdmin:newAdminId},{new:true}).populate("users","-password").populate("groupAdmin","-password");
    if (!updatedChat) {
        res.status(400);
        throw new Error("Chat not found");
    } else {
        res.status(200).json(updatedChat);
    }
});
module.exports={accessChat,fetchChats,createGroupChat,renameGroup,addToGroup,removeFromGroup,updateAdmin};
