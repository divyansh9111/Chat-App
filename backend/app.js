const  express = require('express');
require('dotenv').config();
const app = express();
const port =process.env.PORT ||5000;
const connectDB=require("./config/db");
connectDB();
const cookieParser=require("cookie-parser");
const userRoutes=require('./routes/userRoutes');
const chatRoutes=require('./routes/chatRoutes');
const messageRoutes=require('./routes/messageRoutes');
const {notFound,errorHandler}=require('./middleware/errorMiddleware');
const bodyParser = require("body-parser");

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api/user',userRoutes);
app.use('/api/chat',chatRoutes);
app.use('/api/message',messageRoutes);
app.use(notFound);
app.use(function(req, res, next) {
    process.env.TZ = 'Asia/Kolkata';
    next();
  });
app.use(errorHandler);

app.get("/",(req,res)=>{
    res.send("Server Started!");
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))