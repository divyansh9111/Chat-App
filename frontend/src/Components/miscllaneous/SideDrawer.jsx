import { BellIcon, SearchIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Menu,
  MenuButton,
  MenuList,
  Text,
  Tooltip,
  useDisclosure,
  Image,
  Drawer,
  Input,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerCloseButton,
  useToast,
  Spinner,
  MenuItem,
} from "@chakra-ui/react";
import { Badge } from "antd";
import axios from "axios";
import Cookies from "js-cookie";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { getSender } from "../../config/chatLogic";
import { ChatState } from "../../context/ChatProvider";
import ChatLoading from "../ChatLoading";
import UserListItem from "../UserListItem";
import ProfileModal from "./ProfileModal";
const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState({}); //used parenthesis bcs its an object.
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const {
    user,
    setSelectedChat,
    chats,
    setChats,
    Cookies,
    notifications,
    setNotifications,
  } = ChatState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const history = useHistory();
  const toast = useToast();
  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${search}`, config);
      setLoading(false);
      setSearchResult(data);
      // console.log(typeof(searchResult));
      // console.log(searchResult);
      // console.log(data);
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
  };

  const logoutHandler = () => {
    let text = "Log out of the website?";
    if (window.confirm(text) === true) {
      Cookies.remove("userInfo");
      history.push("/");
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post("/api/chat", { userId }, config);
      setSelectedChat(data[0]._id);
      // console.log(data[0]);
      // console.log(typeof data);

      if (
        !chats.find((c) => {
          return c._id === data[0]._id;
        })
      ) {
        setChats([...data, ...chats]); //...data=>spreading the data
      }

      // console.log(data);
      // console.log(typeof(data));
      setLoadingChat(false);
      setSearchResult([]);
      setSearch("");
      onClose();
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
  };
  const getFullChat = (chatId) => {
    return chats.find((chat) => {
      return chat._id === chatId;
    });
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
    let msgId = notifications.find((n) => {
      return n.chat || n.chat._id === chatId;
    })._id;

    if (msgId) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.delete(
          `/api/notification?messageId=${msgId}&userId=${user._id}`,
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
  return (
    <>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        bg={"white"}
        alignItems={"center"}
        w={"100%"}
        p={" 6px"}
      >
        <Tooltip
          openDelay={1000}
          label="Search a user"
          hasArrow
          placement="bottom-end"
        >
          <Button onClick={onOpen} variant={"ghost"}>
            <SearchIcon />
          </Button>
        </Tooltip>
        <Text fontSize={"2xl"} fontFamily={"cursive"}>
          Chit-Chat
        </Text>
        <div style={{ display: "flex" }}>
          <Menu>
            <MenuButton p={1}>
              <Badge
                overflowCount={10}
                size="small"
                count={notifications?.length}
              >
                <BellIcon w={"6"} h={"6"} />
              </Badge>
            </MenuButton>
            <MenuList p={2}>
              {!notifications.length > 0 && "No new notifications"}
              {notifications.length > 0 &&
                [...new Set(notifications.map((item) => item.chat._id))].map(
                  (chatId) => {
                    var fullChat = getFullChat(chatId);
                    var count = notifications.filter((item) => {
                      return item.chat._id === chatId;
                    }).length;
                    var time = changeTime(fullChat?.updatedAt);
                    return (
                      <MenuItem
                        bg={"#ebf0f4"}
                        borderRadius={"lg"}
                        p={2}
                        display={"flex"}
                        justifyContent={"space-between"}
                        alignItems={"flex-start"}
                        m={1}
                        key={chatId}
                        onClick={() => {
                          setSelectedChat(chatId);
                          setNotifications(
                            notifications.filter((item) => {
                              return item.chat._id!== chatId;
                            })
                          );
                      console.log("Filter nitif")

                          // updateNotifications(chatId);
                        }}
                      >
                        <div>
                          {fullChat?.isGroupChat ? (
                            <div>
                              <span>
                                New message in <b>{fullChat.chatName}</b>
                              </span>
                            </div>
                          ) : (
                            <div>
                              <span>
                                <span>
                                  New message from
                                  <b> {getSender(user, fullChat).name} </b>
                                </span>
                              </span>
                            </div>
                          )}
                          <div> {<Text fontSize={"xs"}>{time}</Text>}</div>
                        </div>
                        <div>
                          {count >= 1 && (
                            <Badge
                              size="small"
                              overflowCount={10}
                              color="#3182ce"
                              count={count}
                            />
                          )}
                        </div>
                      </MenuItem>
                    );
                  }
                )}
            </MenuList>
          </Menu>
          <Menu>
            <ProfileModal user={user}>
              <MenuButton mt={"5px"} p={1}>
                <Avatar size={"xs"} name={user.name} src={user.picture} />
              </MenuButton>
            </ProfileModal>
          </Menu>
          <Menu>
            <MenuButton onClick={logoutHandler} p={1}>
              <i
                style={{ fontSize: "20px" }}
                className="fas fa-sign-out-alt"
              ></i>
            </MenuButton>
          </Menu>
        </div>
      </Box>
      <Drawer size={"xs"} placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            Search users{loadingChat && <Spinner size={"xs"} ml={"2"} />}
          </DrawerHeader>
          <DrawerBody>
            <Box display={"flex"} pb={"2"} mb={3}>
              <Input
                size={{ base: "xl", md: "xs" }}
                p={2}
                placeholder="Search by name or email"
                onChange={(e) => {
                  if (e.target.value) {
                    handleSearch(e.target.value);
                  } else {
                    setSearchResult([]);
                  }
                }}
              />
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult.users?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleClick={() => accessChat(user._id)}
                />
              ))
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
