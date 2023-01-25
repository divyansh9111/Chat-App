const  express = require('express');
require('dotenv').config();
const chats=require("./data/data");
const app = express();
const port =process.env.PORT ||5000;
const connectDB=require("./config/db");
connectDB();
const cookieParser=require("cookie-parser");
const userRoutes=require('./routes/userRoutes');
const {notFound,errorHandler}=require('./middleware/errorMiddleware');
app.use(express.json());
app.use(cookieParser());
app.use('/api/user',userRoutes);
app.use(notFound);
app.use(errorHandler);

app.get('/', (req, res) => res.send('Hello World!'));



app.listen(port, () => console.log(`Example app listening on port ${port}!`))