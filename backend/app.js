const express = require("express");
const path = require("path");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
const connectDB = require("./config/db");
connectDB();
const cookieParser = require("cookie-parser");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const bodyParser = require("body-parser");
const cors = require("cors");

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/notification", notificationRoutes);
// app.use(notFound);
app.use(function (req, res, next) {
  process.env.TZ = "Asia/Kolkata";
  next();
});
app.use(errorHandler);

// middleware
// app.use(function(req, res, next) {
//   res.setHeader('Access-Control-Allow-Origin', 'https://chitchat-frontend-byog.onrender.com');
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT,PATCH, DELETE');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//   next();
// });

// app.use(
//   cors({
//     origin:'https://chitchat-frontend-byog.onrender.com' ,
//   })
// );

// const corsOptions = {
//   origin: ['https://chitchat-frontend-byog.onrender.com/'],
//   allowedHeaders: ["Content-Type", "Authorization", "Access-Control-Allow-Methods","Access-Control-Allow-Origin", "Access-Control-Request-Headers"],
//   credentials: true,
//   enablePreflight: true
// }

// app.use(cors(corsOptions));
// app.options('*', cors(corsOptions));
app.use(cors());


// ***************************production********************************
const _dirname1 = path.resolve();

  app.get("/", (req, res) => {
    res.send("Server Started!");
  });
// ***************************production********************************

const server = app.listen(port, () =>
  console.log(`Example app listening on port ${port}!`)
);
const socketIo = require("socket.io");
const io = socketIo(server, {
  pingTimeout: 60000,
  cors: {
    origin: "https://chitchat-frontend-byog.onrender.com/",
  },
});

io.on("connection", (socket) => {
  console.log("connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    console.log(userData._id);
    socket.emit("connected");
  });
  socket.on("joinChat", (room) => {
    socket.join(room);
    console.log("user joined room:" + room);
  });
  socket.on("newMessage", (newReceivedMessage) => {
    const chat = newReceivedMessage.chat;
    if (!chat.users) return console.log("chat.user not defined");
    chat.users.forEach((user) => {
      if (user._id === newReceivedMessage.sender._id) return; //not for the logged in user himself
      socket.in(user._id).emit("messageReceived", newReceivedMessage);
    });
  });
  socket.on("typing", (room) => {
    socket.in(room).emit("typing");
    console.log("typing room" + room);
  });
  socket.on("stopTyping", (room) => {
    socket.in(room).emit("stopTyping");
  });
  socket.off("setup", () => {
    console.log("user disconnected!");
  });
});
