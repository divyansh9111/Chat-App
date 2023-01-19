const  express = require('express');
require("dotenv").config();
const chats=require("./data/data");
const app = express();
const port =process.env.PORT ||5000;

app.use(express.json());

app.get('/', (req, res) => res.send('Hello World!'));

app.get("/api/chat",(req,res)=>{
    res.status(200).send(chats);
});

app.get("/api/chat/:id",(req,res)=>{
    const foundChat=chats.find((c)=>c._id===req.params.id);
    res.status(200).send(foundChat);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))