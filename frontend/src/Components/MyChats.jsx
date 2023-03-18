import { AddIcon } from "@chakra-ui/icons";
import { Avatar, Box, Button, Stack, Text, useToast } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { getSender } from "../config/chatLogic";
import { ChatState } from "../context/ChatProvider";
import ChatLoading from "./ChatLoading";
import GroupChatModal from "./miscllaneous/GroupChatModal";

const MyChats = ({fetchAgain}) => {
  const { user, selectedChat, setSelectedChat, chats, setChats,Cookies } = ChatState();
  const [loggedUser, setLoggedUser] = useState();
  const toast = useToast();
  const history=useHistory();
  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get("/api/chat", config);
      setChats(data);
    } catch (error) {
      if (error.response.data.message==="User is not authorized!") {
        Cookies.remove('userInfo');
      history.push("/");
      }
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
  };
  useEffect(() => {
    const cookieData=Cookies.get('userInfo');
    const userInfo=cookieData&&JSON.parse(cookieData); 
    setLoggedUser(userInfo);
    fetchChats();
  }, [fetchAgain]);
  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      w={{ base: "100%", md: "30%" }}
      alignItems={"center"}
      bg={"white"}
      flexDirection={"column"}
      borderRadius={"md"}
      p={3}
    >
      <Box
        display={"flex"}
        alignItems={"center"}
        justifyContent={"space-between"}
        w={"100%"}
        p={2}
      >
        All chats
        <GroupChatModal>
          <Button
            variant={"solid"}
            size={"xs"}
            leftIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        display={"flex"}
        alignItems={"center"}
        flexDirection={"column"}
        p={2}
        mt={"2"}
        w={"100%"}
        h={"100%"}
        borderRadius={"md"}
        bg={"#ebf0f4"}
        overflowY={"hidden"}
      >
        {chats ? (
          <Stack mt={1} overflowY={"scroll"}>
            {chats.map((chat) => {
              return (
                <Box
                  key={chat._id}
                  display={"flex"}
                  cursor={"pointer"}
                  onClick={() => setSelectedChat(chat._id)} //always pass arrow functions
                  py={2}
                  px={3}
                  borderRadius={"md"}
                  bg={selectedChat === chat._id ? "#3182ce" : "white"}
                  color={selectedChat === chat._id ? "white" : "black"}
                >
                  <Avatar
                    cursor={"pointer"}
                    marginRight={2}
                    size={"xs"}
                    name={chat.isGroupChat?chat.chatName:getSender(loggedUser, chat).name}
                    src={chat.isGroupChat?{}:getSender(loggedUser, chat).picture}
                  />
                  <Text fontSize={""}>
                    {chat.isGroupChat
                      ? chat.chatName
                      : getSender(loggedUser, chat).name}
                  </Text>
                </Box>
              );
            })}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
