import React,{useEffect} from "react";
import { Container, Tabs, TabList, TabPanels, Tab, TabPanel,Box,Text } from "@chakra-ui/react";
import Login from "../Components/Authentication/Login";
import SignUp from "../Components/Authentication/SignUp";
import { useHistory } from "react-router-dom";
import { ChatState } from "../context/ChatProvider";
const HomePage = () => {
  const{Cookies}=ChatState();
  const history=useHistory();
  useEffect(()=>{
      const cookieData=Cookies.get('userInfo');
      const user=cookieData&&JSON.parse(cookieData); 
      // console.log(user);
      if (user) {
          history.push("/chats");
      }
  },[history]);
  return (
    <Container  maxWidth={"xl"} centerContent>
      <Box
        display={"flex"}
        className=" element"
        justifyContent={"center"}
        p={1}
        m="40px 0 15px 0"
        bg={"white"}
        borderRadius="lg"
        borderWidth={"1px"}
        width={{base:"100%",md:"60%"}}
      >
        <Text fontFamily={"Montserrat"} color="black" fontSize="xl">
          Chit-Chat
        </Text>
      </Box>
      <Box className=" element" marginBottom={'15'} bg={"white"} p={3} w={{base:"100%",md:"60%"}}borderRadius="lg" borderWidth={"1px"}>
        <Tabs   size="sm" isFitted variant="soft-rounded" colorScheme='green'>
          <TabList mb='1em'>
            <Tab>Sign Up</Tab>
            <Tab>Login</Tab>
          </TabList>
          <TabPanels>
              <TabPanel>
              <SignUp/>
            </TabPanel>
            <TabPanel>
              <Login/>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default HomePage;
