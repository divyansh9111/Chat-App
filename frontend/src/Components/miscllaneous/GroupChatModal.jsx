import { AddIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  FormControl,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import UserListItem from "../UserListItem";
import UserTag from "../UserTag";
const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const { user, setChats, chats, setSelectedChat } = ChatState();
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
      const { data } = await axios.get(`https://chit-chat-dr4q.onrender.com/api/user?search=${search}`, config);
      setLoading(false);
      setSearchResult(data);
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
  const handleGroup = (user) => {
    if (selectedUsers.includes(user)) {
      toast({
        title: "User already added",
        variant: "subtle",
        position: "bottom-left",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    setSelectedUsers([...selectedUsers, user]);
  };
  const handleDelete = (user) => {
    setSelectedUsers(selectedUsers.filter((u) => u._id !== user._id));
  };
  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      toast({
        title: "Please fill all the fields!",
        variant: "subtle",
        position: "bottom-left",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        "https://chit-chat-dr4q.onrender.com/api/chat/group",
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((user) => user._id)),
        },
        config
      );

      // console.log(data);
      // console.log(typeof(data));
      if (
        !chats.find((c) => {
          return c._id === data._id;
        })
      ) {
        setChats([data, ...chats]); //...data=>spreading the data
      }
      setSelectedChat(data._id);
      toast({
        title: "New group chat has been created!",
        variant: "subtle",
        position: "bottom-left",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      onClose();
      setSearchResult([]);
      setSelectedUsers([]);
      setGroupChatName("");
    } catch (error) {
      toast({
        title: "Error creating the chat!",
        variant: "subtle",
        position: "bottom-left",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };
  return (
    <>
      <span onClick={()=>{onOpen();setSelectedUsers([])}}>{children}</span>
      <Modal
        size={"sm"}
        isCentered
        isOpen={isOpen}
        onClose={() => {
          onClose();
          setSearchResult([]);
          setSelectedUsers([]);
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize={"30px"}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
          >
            <Text fontSize={"xl"}>Create a new group</Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            fontSize={"30px"}
            display={"flex"}
            flexDirection={"column"}
            alignItems={"center"}
          >
            <FormControl>
              <Input
                size={"sm"}
                placeholder="Group name"
                onChange={(e) => {
                  setGroupChatName(e.target.value);
                }}
              />
            </FormControl>
            <FormControl>
              <Input
                size={"sm"}
                placeholder="Add users"
                onChange={(e) => {
                  if (e.target.value) {
                    handleSearch(e.target.value);
                  } else {
                    setSearchResult([]);
                  }
                }}
              />
            </FormControl>
            <Box w={"100%"} mt={1} display={"flex"} flexWrap={"wrap"} p={1}>
              {selectedUsers?.map((user) => {
                return (
                  <UserTag
                    key={user._id}
                    user={user}
                    handleClick={() => {
                      handleDelete(user);
                    }}
                  />
                );
              })}
            </Box>
            <Box maxH={"100px"} mt={2} overflowY={"scroll"}>
              {loading ? (
                <Spinner mt={2} size={"sm"} ml={"2"} />
              ) : (
                searchResult.users?.map((user) => {
                  return (
                    <UserListItem
                      user={user}
                      key={user._id}
                      handleClick={() => {
                        handleGroup(user);
                      }}
                    />
                  );
                })
              )}
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button
              size={"sm"}
              colorScheme="blue"
              mr={3}
              onClick={handleSubmit}
              isDisabled={!selectedUsers||!groupChatName}
            >
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
