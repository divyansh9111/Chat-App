import React, { useState, useEffect } from "react";
import axios from "axios";
import { ChatState } from "../context/ChatProvider";
import { Box, useToast } from "@chakra-ui/react";
import SideDrawer from "../Components/miscllaneous/SideDrawer";
import MyChats from "../Components/MyChats";
import ChatBox from "../Components/ChatBox";
import { useHistory } from "react-router-dom";
import { notification } from "antd";

const ChatsPage = () => {
  const { user, setNotifications,notifications } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);
  const history = useHistory();
  const { Cookies } = ChatState();
  const toast = useToast();

  const fetchNotifications = async () => {
    if (user) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.get("https://chit-chat-dr4q.onrender.com/api/notification", config);
        let newData = data;
        console.log(data);
        data && setNotifications(newData);
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
    } else {
      return;
    }
  };
  console.log(notifications);
  useEffect(() => {
    const cookieData = Cookies.get("userInfo");
    const user = cookieData && JSON.parse(cookieData);
    // console.log(user);
    // console.log("history"+history);
    if (!user && history) {
      history.push("/");
    }
  }, [history, Cookies]);
  useEffect(() => {
    fetchNotifications();
  }, [user]);
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        margin: "0px 20px",
        alignItems: "center",
      }}
    >
      {user && <SideDrawer />}
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        w={"100%"}
        h={"88vh"}
        p={"10px"}
      >
        {user && (
          <MyChats fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
};

export default ChatsPage;
