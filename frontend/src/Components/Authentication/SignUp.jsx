import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Axios from 'axios';
import { useToast } from "@chakra-ui/react";
import { ChatState } from "../../context/ChatProvider";
const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [picture, setPicture] = useState("");
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [loading, setLoading] = useState(false);
  const history=useHistory();
  const toast = useToast();
  const{Cookies}=ChatState();
  const postDetails = async(pic) => {
    setLoading(true);

    if (pic === undefined) {
      toast({
        title: "Please select an image.",
        variant:"subtle",
        position:"bottom-left",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    if (
      pic.type === "image/jpeg" ||
      pic.type === "image/jpg" ||
      pic.type === "image/png"
    ) {
      console.log(pic);
      const data = new FormData();
      data.append("file", pic);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "mernproject1");
      // fetch("https://api.cloudinary.com/v1_1/mernproject1/image/upload", {
      //   method: "post",
      //   body: data,
      //   mode: "no-cors",
      // }).then((res) => res.json()).then((data) => {
      //     setPic(data.url.toString());
      //     setLoading(false);
      //   });
      let getData='';
      await Axios.post("https://api.cloudinary.com/v1_1/mernproject1/image/upload",data).then((response)=>{
        getData=response.data["secure_url"];
        setPicture(getData);
          setLoading(false);
          console.log(getData);
      });

    } else {
      toast({
        title: "Please select an image.",
        variant:"subtle",
        position:"bottom-left",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }
  };
  const handleSubmit=async()=>{
    setLoading(true);
    if (!name||!email||!password||!confirmPassword) {
      toast({
        title: "Please fill all the fields.",
        variant:"subtle",
        position:"bottom-left",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
      return;
    } 
    if(password!==confirmPassword){
      toast({
        title: "Passwords are not matching.",
        variant:"subtle",
        position:"bottom-left",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }
    try {
      const config={
        headers:{
          'Content-type':"application/json",
        }
      };
      const {data}=await Axios.post("/api/user",{name,email,password,confirmPassword,picture},config);
      toast({
        title: "Registration successful.",
        variant:"subtle",
        position:"bottom-left",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      Cookies.set('userInfo',JSON.stringify(data),{expires:new Date(Date.now() + 60*1000*60)});
      setLoading(false);
      history.go('/chats');
    } catch (error) {
         toast({
        title: "Error!",
        variant:"subtle",
        position:"bottom-left",
        description:error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
    }
  }

  return (
    <VStack spacing={"5px"}>
      <FormControl isRequired>
        <FormLabel id="name">Name</FormLabel>
        <Input
          variant="filled"
          size="sm"
          type={"text"}
          placeholder={"Enter Your Name"}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
      </FormControl>
      <FormControl isRequired>
        <FormLabel id="email">Email</FormLabel>
        <Input
          variant="filled"
          size="sm"
          type={"email"}
          placeholder={"Enter Your Email"}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
      </FormControl>
      <FormControl isRequired>
        <FormLabel id="password">Password</FormLabel>
        <InputGroup>
          <Input
            variant="filled"
            size="sm"
            type={show1 ? "text" : "password"}
            placeholder={"Enter Your Password"}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <InputRightElement>
            <Button
              pb={"2"}
              variant={"unstyled"}
              size={"sm"}
              onClick={() => {
                setShow1(!show1);
              }}
            >
              {show1 ? <ViewIcon /> : <ViewOffIcon />}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl isRequired>
        <FormLabel id="confirmPassword">Confirm Password</FormLabel>
        <InputGroup>
          <Input
            variant="filled"
            size="sm"
            type={show2 ? "text" : "password"}
            placeholder={"Confirm Password"}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
          />
          <InputRightElement>
            <Button
              pb={"2"}
              variant={"unstyled"}
              size={"sm"}
              onClick={() => {
                setShow2(!show2);
              }}
            >
              {show2 ? <ViewIcon /> : <ViewOffIcon />}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl>
        <FormLabel id="pic">Upload Profile Picture</FormLabel>
        <Input
          variant="filled"
          size="sm"
          type={"file"}
          accept="image/*"
          onChange={(e) => postDetails(e.target.files[0])}
        />
      </FormControl>
      <Button
        size={"sm"}
        colorScheme={"blue"}
        width="100%"
        style={{ marginTop: "25px" }}
        isLoading={loading}
        onClick={handleSubmit}
      >
        Sign Up
      </Button>
    </VStack>
  );
};

export default SignUp;
