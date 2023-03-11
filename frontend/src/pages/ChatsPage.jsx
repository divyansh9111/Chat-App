import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { ChatState } from '../context/ChatProvider';
import { Box } from '@chakra-ui/react';
import SideDrawer from '../Components/miscllaneous/SideDrawer';
import MyChats from '../Components/MyChats';
import ChatBox from '../Components/ChatBox';
import { useHistory } from 'react-router-dom';

const ChatsPage = () => {
  const {user}=ChatState();
  const[fetchAgain,setFetchAgain]=useState(false);
  const history = useHistory();
  const{Cookies}=ChatState();
  useEffect(() => {
    const cookieData=Cookies.get('userInfo');
      const user=cookieData&&JSON.parse(cookieData); 
    // console.log(user);
    // console.log("history"+history);
    if (!user&&history ) {
      history.push("/");
      
    }
  }, [history]);
  
  return (
    <div style={{width:"100%"}}>
      {user&&<SideDrawer/>}
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        w={"100%"}
        h={"90vh"}
        p={"10px"} 
      >
        {user&&<MyChats fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
        {user&&<ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
      </Box>
    </div>
  )
}

export default ChatsPage;
