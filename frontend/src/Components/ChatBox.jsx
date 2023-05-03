import { Box } from '@chakra-ui/react';
import React from 'react'
import { ChatState } from '../context/ChatProvider'
import SingleChat from './SingleChat';
const ChatBox = ({fetchAgain,setFetchAgain}) => {
  const{selectedChat}=ChatState();
  return (
    <Box
    className="element"
    display={{base:selectedChat?"flex":"none",md:"flex"}}
    width={{base:"100%",md:"68%"}}
    flexDirection={"column"}
    alignItems={"center"}
    borderRadius={"md"}
    bg={"white"}
    p={3}    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
    </Box>
  )
}

export default ChatBox
