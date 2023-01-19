import React, { useState,useEffect } from 'react';
import axios from 'axios';

const ChatsPage = () => {
  const [chats, setChats] = useState([]);
  const fetchChats=async()=>{
    const {data}=await axios.get("/api/chat");//fetching data from api
    console.log(data);
    setChats(data);
  }
  useEffect(()=>{//runs when the component rendered for the first time
    fetchChats();
  }, []);
  
  return (
    <div>
      {chats.map((chat)=>{
        return(<div key={chat._id}>{chat.chatName}</div>)
      })}
    </div>
  )
}

export default ChatsPage
