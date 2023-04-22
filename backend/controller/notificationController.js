const Message = require("../model/messageModel");
const asyncHandler = require("express-async-handler");
const User = require("../model/userModel");
const Chat = require("../model/chatModel");

const setNotifications = asyncHandler(async (req, res) => {
  const message = req.body;
  const userId = req.user._id;
  console.log(userId);
  console.log(message);
  if (!message || !userId) {
    console.log("Invalid data passed into the request!");
    res.sendStatus(400);
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $push: { notifications: message },
      },
      { new: true }
    );
    if (updatedUser) {
      // let messages = updatedUser.notifications;
      // let notifications = [];
      // for (let i = 0; i < msgIds.length; i++) {
      //   let message = await Message.find({ _id: msgIds[i] });
      //   notifications.push(...message);
      // }

      res.status(200).send(updatedUser.notifications);
    }
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const getNotifications = asyncHandler(async (req, res) => {
  try {
    let foundUser = await User.findById(req.user._id);
    // let msgIds = foundUser.notifications;
    // let notifications = [];
    // for (let i = 0; i < msgIds.length; i++) {
    //   let message = await Message.find({ _id: msgIds[i] });
    //   notifications.push(...message);
    // }

    res.status(200).json(foundUser.notifications);
  } catch (error) {
    res.sendStatus(400);
    throw new Error(error.message);
  }
});

const updateNotifications = asyncHandler(async (req, res) => {
  const { chatId } = req.query;
  const userId = req.user._id;
  console.log(chatId);
  console.log(userId);
  if (!chatId || !userId) {
    console.log("Invalid data passed into the request!");
    res.sendStatus(400);
  }
  try {
    // let updatedUser = await User.findByIdAndUpdate(
    //   userId,
    //   {
    //     $pull: { notifications: { $elemMatch: { $eq: messageId } } },
    //   },
    //   { new: true }
    // );
    // if (updatedUser) {
    //   let msgIds = updatedUser.notifications;
    //   let notifications = [];
    //   for (let i = 0; i < msgIds.length; i++) {
    //     let message = await Message.find({ _id: msgIds[i] });
    //     notifications.push(...message);
    //   }

    //   res.status(200).send(updatedUser.notifications);
    // }
    const foundUser = await User.findById(userId);
    foundUser.notifications = foundUser.notifications.filter((elem) => {
      return elem.chat._id !== chatId;
    });

    // Save the updated document
    const savedUser = await foundUser.save();
    if (savedUser) {
      res.status(200).send(savedUser.notifications);
    }
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = { setNotifications, getNotifications, updateNotifications };
