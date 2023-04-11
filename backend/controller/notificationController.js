const Message = require("../model/messageModel");
const asyncHandler = require("express-async-handler");
const User = require("../model/userModel");
const Chat = require("../model/chatModel");

const setNotifications = asyncHandler(async (req, res) => {
  const { messageId, userId } = req.body;
  if (!messageId || !userId) {
    console.log("Invalid data passed into the request!");
    res.sendStatus(400);
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $push: { notifications: messageId },
      },
      { new: true }
    );
    if (updatedUser) {
      let msgIds = updatedUser.notifications;
    let notifications = [];
    for (let i = 0; i < msgIds.length; i++) {
      let message = await Message.find({ _id: msgIds[i] });
      notifications.push(...message);
    }

      res.status(200).send(notifications);
    }
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const getNotifications = asyncHandler(async (req, res) => {
  try {
    let foundUser = await User.findById(req.user._id);
    let msgIds = foundUser.notifications;
    let notifications = [];
    for (let i = 0; i < msgIds.length; i++) {
      let message = await Message.find({ _id: msgIds[i] });
      notifications.push(...message);
    }

      res.status(200).send(notifications);
  } catch (error) {
    res.sendStatus(400);
    throw new Error(error.message);
  }
});

const updateNotifications=asyncHandler(async(req,res)=>{
  const {messageId,userId}  = req.query;
  if (!messageId) {
    console.log("Invalid data passed into the request!");
    res.sendStatus(400);
  }
  try {
    let updatedUser=await User.findByIdAndUpdate(userId,{
      $pull: { notifications: messageId },
    },
    { new: true });
    if (updatedUser) {
      let msgIds = updatedUser.notifications;
    let notifications = [];
    for (let i = 0; i < msgIds.length; i++) {
      let message = await Message.find({ _id: msgIds[i] });
      notifications.push(...message);
    }

      res.status(200).send(notifications);
    }
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = { setNotifications, getNotifications,updateNotifications };
