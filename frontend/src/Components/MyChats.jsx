import { AddIcon } from "@chakra-ui/icons";
import { Avatar, Box, Button, Stack, Text, useToast } from "@chakra-ui/react";
import { Badge } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { getSender } from "../config/chatLogic";
import { ChatState } from "../context/ChatProvider";
import ChatLoading from "./ChatLoading";
import GroupChatModal from "./miscllaneous/GroupChatModal";
import "../myChats.css";
const MyChats = ({ fetchAgain }) => {
  const {
    user,
    selectedChat,
    setSelectedChat,
    chats,
    setChats,
    Cookies,
    notifications,
    setNotifications,
  } = ChatState();
  const [loggedUser, setLoggedUser] = useState();
  const toast = useToast();
  const history = useHistory();
  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get("https://chit-chat-dr4q.onrender.com/api/chat", config);
      let newData = data;
      setChats(newData);
    } catch (error) {
      if (error.response.data.message === "User is not authorized!") {
        Cookies.remove("userInfo");
        history.go("/");
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

  const changeTime = (str) => {
    let date = new Date(str);
    let offset = date.getTimezoneOffset();
    let indiaTime = new Date(
      date.getTime() + offset * 60 * 1000 + 330 * 60 * 1000
    );
    let hours = indiaTime.getHours();
    let minutes = indiaTime.getMinutes();

    let ampm = hours >= 12 ? "PM" : "AM";

    hours %= 12;
    hours = hours || 12; // the hour '0' should be '12'

    minutes = minutes < 10 ? "0" + minutes : minutes;

    return `${hours}:${minutes} ${ampm}`;
  };
  const updateNotifications = async (chatId) => {

    if (chatId) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.delete(
          `https://chit-chat-dr4q.onrender.com/api/notification?chatId=${chatId}`,
          config
        );
        let newData = data;
        setNotifications(newData);
      } catch (error) {
        if (error.message === "User is not authorized!") {
          Cookies.remove("userInfo");
          history.go("/");
        }
        toast({
          title: "Error!",
          variant: "subtle",
          position: "bottom-left",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };
  useEffect(() => {
    const cookieData = Cookies.get("userInfo");
    const userInfo = cookieData && JSON.parse(cookieData);
    setLoggedUser(userInfo);
    // console.log(userInfo);
    fetchChats();
  }, [fetchAgain]);

  return (
    <Box
      className="element"
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      w={{ base: "100%", md: "30%" }}
      alignItems={"center"}
      flexDirection={"column"}
      borderRadius={"md"}
      p={3}
      bg={"white"}
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
          <Button className="avatar" variant={"solid"} size={"xs"} leftIcon={<AddIcon />}>
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
      className="neumorphic--pressed"
        display={"flex"}
        alignItems={"center"}
        flexDirection={"column"}
        bg={"white"}
        // p={2}
        mt={"2"}
        w={"100%"}
        h={"100%"}
        borderRadius={"md"}
        overflowY={"hidden"}
      >
        {chats.length > 0 ? (
          <Stack m={0} p={2} alignItems="center" overflowY={"scroll"} width={"100%"}>
            {chats.map((chat) => {
              var count =
                notifications.length > 0 &&
                notifications.filter((item) => {
                  return item.chat._id === chat._id;
                }).length;
              console.log(count);
              var time = changeTime(chat.updatedAt);
              return (
                <Box
                  className="element element-1"
                  key={chat._id}
                  display={"flex"}
                  cursor={"pointer"}
                  alignItems={"center"}
                  justifyContent={"space-between"}
                  gap={"1"}
                  width={"95%"}
                  maxWidth={"100%"}
                  onClick={() => {
                    setSelectedChat(chat._id);
                    updateNotifications(chat._id);
                    // setNotifications(
                    //   notifications.filter((item) => {
                    //     console.log("Filter nitif");
                    //     return item.chat._id !== chat._id;
                    //   })
                    // );
                  }} //always pass arrow functions
                  py={count >= 1 ? 1 : 2}
                  px={3}
                  borderRadius={"md"}
                  bg={selectedChat === chat._id ? "#3182ce" : "white"}
                  color={selectedChat === chat._id ? "white" : "black"}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Avatar
                    className="avatar"
                      cursor={"pointer"}
                      marginRight={2}
                      size={{ base: "md", md: "xs" }}
                      name={
                        chat.isGroupChat
                          ? chat.chatName
                          : getSender(loggedUser, chat).name
                      }
                      src={
                        chat.isGroupChat
                          ? null
                          : getSender(loggedUser, chat).picture
                      }
                    />
                    <Text fontSize={""}>
                      {chat.isGroupChat
                        ? chat.chatName
                        : getSender(loggedUser, chat).name}
                    </Text>
                  </div>
                  <div>
                    {count >= 1 && (
                      <Badge
                        style={{ marginLeft: "30px" }}
                        size="small"
                        overflowCount={10}
                        color="#3182ce"
                        count={count}
                      />
                    )}
                    <div>
                      {" "}
                      {count >= 1 && <Text fontSize={"xs"}>{time}</Text>}
                    </div>
                  </div>
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
