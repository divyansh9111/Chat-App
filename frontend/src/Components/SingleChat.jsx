/* eslint-disable react-hooks/exhaustive-deps */
import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import {
  changeTime,
  getSender,
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/chatLogic";
import { ChatState } from "../context/ChatProvider";
import ProfileModal from "./miscllaneous/ProfileModal";
import UpdateGroupChatModal from "./miscllaneous/UpdateGroupChatModal";
import io from "socket.io-client";
const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
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
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const toast = useToast();
  const history = useHistory();
  const [socketConnected, setSocketConnected] = useState(false);
  const messageContainer = useRef(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typing, setTyping] = useState(false);
  const audio = new Audio(process.env.PUBLIC_URL + "./Sounds/notification.mp3");
  const getSelectedChat = (chatId) => {
    return chats.find((chat) => {
      return chat._id === chatId;
    });
  };
  const playAudio = () => {
    audio.play();
  };
  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    if (!socketConnected) return;
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChatCompare);
    }

    let lastTypingTime = new Date().getTime();
    setTimeout(() => {
      var now = new Date().getTime();
      var diff = now - lastTypingTime;
      if (diff >= 3000 && typing) {
        socket.emit("stopTyping", selectedChatCompare);
        setTyping(false);
      }
    }, 3000);
  };
  const sendMessage = async (e) => {
    if (e.key === "Enter" && newMessage) {
      socket.emit("stopTyping", selectedChatCompare);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };

        const { data } = await axios.post(
          "/api/message",
          { content: newMessage, chatId: selectedChat },
          config
        );
        setMessages([...messages, data]);
        setNewMessage("");
        console.log(data);
        socket.emit("newMessage", data);
        // console.log(typeof data);
        setTimeout(() => {
          messageContainer.current.scrollTop =
            messageContainer.current.scrollHeight;
        }, 50);
        // console.log(messages);
        // console.log(typeof messages);
        setFetchAgain(!fetchAgain);
      } catch (error) {
        if (error.response.data.message === "User is not authorized!") {
          Cookies.remove("userInfo");
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
    }
  };

  const fetchMessages = async () => {
    if (!selectedChat) {
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/message/${selectedChat}`, config);
      setMessages(data);
      // console.log(data);
      // console.log(typeof data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
      setTimeout(() => {
        messageContainer.current.scrollTop =
          messageContainer.current.scrollHeight;
      }, 50);
      socket.emit("joinChat", selectedChat);
    } catch (error) {
      setLoading(false);
      if (error.response.data.message === "User is not authorized!") {
        Cookies.remove("userInfo");
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
  const set_notifications = async (msgId) => {
    if (
      !notifications?.find((n) => {
        return n._id === msgId;
      })
    ) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.post(
          "/api/notification",
          { messageId: msgId, userId: user._id },
          config
        );
        // let newData = data;
        // setNotifications(newData);
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
    }
  };
  useEffect(() => {
    socket = io(ENDPOINT);
    if (!socketConnected) {
      socket.emit("setup", user);
    }
    socket.on("connected", () => {
      setSocketConnected(true);
    });
    socket.on("typing", () => {
      setIsTyping(true);
    });
    socket.on("stopTyping", () => {
      setIsTyping(false);
    });
  });
  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);
  // useEffect(() => {
  //   playAudio();
  // }, [notifications]);
  useEffect(() => {
    socket.on("messageReceived", (newReceivedMessage) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare !== newReceivedMessage.chat._id
      ) {
        console.log(notifications);
        console.log("before");
        // setNotifications([...notifications, newReceivedMessage]);
        setNotifications((prevArray) => [newReceivedMessage,...prevArray]);
        console.log("after");
        console.log(notifications);
        // set_notifications(newReceivedMessage._id);
        setFetchAgain(!fetchAgain);
      } else {
        
        setMessages((prevArray)=>[...prevArray, newReceivedMessage]);
        // fetchMessages();
        setTimeout(() => {
          if (messageContainer) {
            messageContainer.current.scrollTop =
              messageContainer.current.scrollHeight;
          }
        }, 10);
      }
    });
  }, []);
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
                setNewMessage("");
                socket.emit("stopTyping", selectedChatCompare);
              }}
            />
            {getSelectedChat(selectedChat).isGroupChat ? (
              <>
                {getSelectedChat(selectedChat).chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
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
            {loading ? (
              <Spinner
                thickness="2px"
                speed="0.65s"
                emptyColor="gray.200"
                color="green.500"
                size={"lg"}
                alignSelf={"center"}
                margin={"auto"}
              />
            ) : (
              <Box
                display={"flex"}
                overflowY={"scroll"}
                flexDirection={"column"}
                scrollBehavior={"smooth"}
              >
                <div
                  ref={messageContainer}
                  style={{
                    overflowX: "hidden",
                    overflowY: "scroll",
                    padding: "5px",
                    scrollBehavior: "smooth",
                  }}
                >
                  {messages &&
                    messages.map((m, i) => (
                      <div style={{ display: "flex" }} key={m._id}>
                        {(isSameSender(messages, m, i, user._id) ||
                          isLastMessage(messages, i, user._id)) && (
                          <Tooltip
                            label={m.sender.name}
                            placement="bottom-start"
                            hasArrow
                          >
                            <Avatar
                              mt="7px"
                              mr={1}
                              size="sm"
                              cursor="pointer"
                              name={m.sender.name}
                              src={m.sender.picture}
                            />
                          </Tooltip>
                        )}
                        <span
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            minWidth: "82px",
                            position: "relative",
                            backgroundColor: `${
                              m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                            }`,
                            borderRadius: "10px",
                            padding: "2px 10px",
                            maxWidth: "75%",
                            marginLeft: isSameSenderMargin(
                              messages,
                              m,
                              i,
                              user._id
                            ),
                            marginTop: isSameUser(messages, m, i) ? 5 : 10,
                          }}
                        >
                          <span>{m.content}</span>
                          <span style={{ fontSize: "8px" }}>
                            {changeTime(m.createdAt)}
                          </span>
                        </span>
                      </div>
                    ))}
                </div>
              </Box>
            )}
            <FormControl onKeyDown={sendMessage}>
              {isTyping && "Typing..."}
              <Input
                autoFocus
                autoComplete="off"
                placeholder="Type a message"
                background={"white"}
                size={"sm"}
                value={newMessage}
                onChange={(e) => {
                  typingHandler(e);
                }}
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
