import { ArrowBackIcon } from "@chakra-ui/icons";
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import { getSender } from "../config/chatLogic";
import { ChatState } from "../context/ChatProvider";
import ProfileModal from "./miscllaneous/ProfileModal";
import UpdateGroupChatModal from "./miscllaneous/UpdateGroupChatModal";

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();
  const[loading,setLoading]=useState(false);
  const[newMessage,setNewMessage]=useState("");
  const[messages,setMessages]=useState([]);
  const toast=useToast();
  const getSelectedChat = (chatId) => {
    return chats.find((chat) => {
      return chat._id === chatId;
    });
  };
  const sendMessage=async(e)=>{
    if (e.key==="Enter"&&newMessage) {
      try {
        const config={
          headers:{
            "Content-type":"Application/json",
            Authorization:`Bearer ${user.token}`
          }
        };
        setNewMessage("");//writing this here will not affect the api call 
        const{data}=await axios.post("/api/message",{content:newMessage,chatId:getSelectedChat(selectedChat)._id},config);
        console.log(data);
        setMessages(...messages,data);
        setFetchAgain(!fetchAgain);
      } catch (error) {
        toast({
          title: "Error!",
          variant: "subtle",
          position: "bottom-left",
          description: error.response.data.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };
 
  const fetchMessages=async()=>{
    if (!selectedChat) {
      return;
    }
    try {
      setLoading(true);
      const config={
        headers:{
          Authorization:`Bearer${user.token}`
        }
      };
      const{data}=await axios.get(`/api/message/${getSelectedChat(selectedChat)._id}`,config);

    } catch (error) {
      toast({
        title: "Error!",
        variant: "subtle",
        position: "bottom-left",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }
  return (
    <>
      {selectedChat ? (
        <>
          <Text
            display={"flex"}
            justifyContent={"space-between"}
            p={2}
            w={"100%"}
            alignItems={"center"}
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => {
                setSelectedChat("");
              }}
            />
            {getSelectedChat(selectedChat).isGroupChat ? (
              <>
                {getSelectedChat(selectedChat).chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                />
              </>
            ) : (
              <>
                {getSender(user, getSelectedChat(selectedChat)).name}
                <ProfileModal
                  user={getSender(user, getSelectedChat(selectedChat))}
                />
              </>
            )}
          </Text>
          <Box
            display={"flex"}
            flexDirection={"column"}
            height={"100%"}
            width={"100%"}
            p={2}
            borderRadius={"md"}
            bg={"#ebf0f4"}
            overflowY={"hidden"}
            mt={"2"}
            justifyContent={"flex-end"}
          >
            {loading?<Spinner size={'lg'} alignSelf={"center"} margin={"auto"}/>:<Box>{/*messages*/}</Box>}
            <FormControl onKeyDown={sendMessage}>
              <Input
              autoFocus
                placeholder="Type a message"
                background={"white"}
                size={"sm"}
                value={newMessage}
                onChange={(e)=>{setNewMessage(e.target.value)}}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          height={"100%"}
          width={"100%"}
          alignItems={"center"}
          justifyContent={"center"}
          display={"flex"}
        >
          <Text fontSize={"2xl"} color={"black"}>
            Click a user to start a chat
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
