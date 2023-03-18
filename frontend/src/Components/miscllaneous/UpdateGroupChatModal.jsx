import { ViewIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  MenuIcon,
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

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain,fetchMessages }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);
  const [groupChatName, setGroupChatName] = useState("");
  const { user, setChats, chats, selectedChat, setSelectedChat } = ChatState();
  const toast = useToast();
  const getSelectedChat = (chatId) => {
    return chats.find((chat) => {
      return chat._id === chatId;
    });
  };
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
  const handleRename = async () => {
    if (!groupChatName) {
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
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.patch(
        "/api/chat/rename",
        { chatId: selectedChat, newChatName: groupChatName },
        config
      );
      setSelectedChat(data._id);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
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
      setRenameLoading(false);
    }
    setGroupChatName("");
  };

  const handleDelete = async (userToBeRemoved) => {
    if (
      user._id !== getSelectedChat(selectedChat).groupAdmin._id &&
      userToBeRemoved._id !== user._id
    ) {
      toast({
        title: "Only admins can remove someone!",
        variant: "subtle",
        position: "bottom-left",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    let text = "";
    userToBeRemoved._id === user._id
      ? (text = "Do you want to leave the group?")
      : (text = `Remove ${userToBeRemoved.name} from the group?`);
    if (window.confirm(text)) {
      try {
        setLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        var { data } = await axios.patch(
          "/api/chat/removeGroup",
          {
            chatId: getSelectedChat(selectedChat)._id,
            userId: userToBeRemoved._id,
          },
          config
        );
        //if admin leaves the group make the next person as the new group admin
        if (getSelectedChat(selectedChat).groupAdmin._id===userToBeRemoved._id) {
          data=await axios.patch("/api/chat/updateAdmin",{chatId: getSelectedChat(selectedChat)._id},config);
          if(data){
            toast({
              title: "Group admin updated!",
              variant: "subtle",
              position: "bottom-left",
              status: "success",
              duration: 5000,
              isClosable: true,
            });
          }
        }
        userToBeRemoved._id === user._id
          ? setSelectedChat("")
          : setSelectedChat(data._id);
        setFetchAgain(!fetchAgain);
        fetchMessages();
        setLoading(false);
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
        setLoading(false);
      }
    } else {
      return;
    }
  };
  const handleAdd = async (userToBeAdded) => {
    if (
      getSelectedChat(selectedChat).users.find(
        (u) => userToBeAdded._id === u._id
      )
    ) {
      toast({
        title: "User is already in the group!",
        variant: "subtle",
        position: "bottom-left",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    if (user._id !== getSelectedChat(selectedChat).groupAdmin._id) {
      toast({
        title: "Only admins can add someone!",
        variant: "subtle",
        position: "bottom-left",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    let text = `Add ${userToBeAdded.name} to the group?`;
    if (window.confirm(text)) {
      try {
        setLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.patch(
          "/api/chat/addGroup",
          {
            chatId: getSelectedChat(selectedChat)._id,
            userId: userToBeAdded._id,
          },
          config
        );
        setSelectedChat(data._id);
        setFetchAgain(!fetchAgain);
        setLoading(false);
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
    } else {
      return;
    }
  };
  return (
    <>
      <IconButton
      size={"xs"}
        variant={"unstyled"}
        d={{ base: "flex" }}
        icon={<ViewIcon fontSize={"sm"} />}
        onClick={onOpen}
      />
      <Modal
        size={"sm"}
        isCentered
        isOpen={isOpen}
        onClose={() => {
          onClose();
          setSearchResult([]);
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
            <Text fontSize={"xl"}>Update group</Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            fontSize={"30px"}
            display={"flex"}
            flexDirection={"column"}
            alignItems={"center"}
          >
            <FormControl display={"flex"}>
              <Input
                size={"sm"}
                placeholder="Group name"
                onChange={(e) => {
                  setGroupChatName(e.target.value);
                }}
              />
              <Button
                size={"sm"}
                variant={"solid"}
                ml={1}
                isLoading={renameLoading}
                colorScheme={"green"}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
            {getSelectedChat(selectedChat).groupAdmin._id === user._id ? (
              <>
                <FormControl>
                  <Input
                    size={"sm"}
                    placeholder="Add a users"
                    onChange={(e) => {
                      if (e.target.value) {
                        handleSearch(e.target.value);
                      } else {
                        setSearchResult([]);
                      }
                    }}
                  />
                </FormControl>

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
                            handleAdd(user);
                          }}
                        />
                      );
                    })
                  )}
                </Box>
              </>
            ) : (
              <></>
            )}
            <Box w={"100%"} mt={1} display={"flex"} flexWrap={"wrap"} p={1}>
              {getSelectedChat(selectedChat).users.map((u) => {
                let isAdmin=getSelectedChat(selectedChat).groupAdmin._id===u._id?true:false;
                let isHimself=user._id===u._id?true:false;
                return (
                  <UserTag
                    key={u._id}
                    user={u}
                    handleClick={() => {
                      handleDelete(u);
                    }}
                    isAdmin={isAdmin}
                    isHimself={isHimself}
                  />
                );
              })}
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button
              size={"sm"}
              colorScheme="red"
              mr={3}
              onClick={() => {
                handleDelete(user);
              }}
            >
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
