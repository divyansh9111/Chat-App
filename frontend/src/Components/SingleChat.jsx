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
import React, { useEffect, useState } from "react";
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

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat, chats, setChats, Cookies } =
    ChatState();
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const toast = useToast();
  const history = useHistory();
  const getSelectedChat = (chatId) => {
    return chats.find((chat) => {
      return chat._id === chatId;
    });
  };
  const sendMessage = async (e) => {
    if (e.key === "Enter" && newMessage) {
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage(""); //writing this here will not affect the api call
        const { data } = await axios.post(
          "/api/message",
          { content: newMessage, chatId: selectedChat },
          config
        );
        console.log(data);
        console.log(typeof data);
        setMessages([...messages, data]);
        console.log(messages);
        console.log(typeof messages);
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
          Authorization: `Bearer${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/message/${selectedChat}`, config);
      setMessages(data);
      // console.log(data);
      // console.log(typeof(data));
      setFetchAgain(!fetchAgain);
      setLoading(false);
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
  useEffect(() => {
    fetchMessages();
  }, [selectedChat]);
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
                  style={{
                    overflowX: "hidden",
                    overflowY: "auto",
                    padding: "5px",
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
                            flexDirection:"column",
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
                          <span
                            style={{ fontSize: "8px"}}
                          >
                            {changeTime(m.createdAt)}
                          </span>
                        </span>
                      </div>
                    ))}
                </div>
              </Box>
            )}
            <FormControl onKeyDown={sendMessage}>
              <Input
                autoFocus
                autoComplete="false"
                placeholder="Type a message"
                background={"white"}
                size={"sm"}
                value={newMessage}
                onChange={(e) => {
                  setNewMessage(e.target.value);
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
