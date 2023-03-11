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
} from "@chakra-ui/react";
import axios from "axios";
import Cookies from "js-cookie";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { ChatState } from "../../context/ChatProvider";
import ChatLoading from "../ChatLoading";
import UserListItem from "../UserListItem";
import ProfileModal from "./ProfileModal";

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState({}); //used parenthesis bcs its an object.
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const { user, setSelectedChat, chats, setChats,Cookies } = ChatState();
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
      // console.log((searchResult));
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
      Cookies.remove('userInfo');
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
              <BellIcon w={"6"} h={"6"} m={1} />
            </MenuButton>
            {/* <MenuList></MenuList> */}
          </Menu>
          <Menu>
            <ProfileModal   user={user}>
              <MenuButton mt={"5px" } p={1} >
                <Avatar  size={"xs"} name={user.name} src={user.picture} />
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
                mr={"2"}
                size={"xs"}
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
