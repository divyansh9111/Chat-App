import React ,{useState} from 'react'
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
} from "@chakra-ui/react";
import {ViewIcon, ViewOffIcon} from "@chakra-ui/icons";
import { useToast } from "@chakra-ui/react";
import Axios from 'axios';
import { useHistory } from "react-router-dom";
const Login = () => {
  const [show1, setShow1] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const toast=useToast();
  const [loading,setLoading]=useState(false);
  const history=useHistory();

  const handleSubmit=async()=>{
    setLoading(true);
    if (!email||!password) {
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
    try {
      const config={
        headers:{
          "Content-type":"application/json",
        },
      };
      const {data}= await Axios.post("/api/user/login",{email,password},config);
      console.log(data);
      toast({
        title: "Login successful.",
        variant:"subtle",
        position:"bottom-left",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      localStorage.setItem("userInfo",JSON.stringify(data));
      setLoading(false);
      history.push('/chats');
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
      <FormLabel id="email">Email</FormLabel>
      <Input
        variant='filled'
        size='sm'
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
          variant='filled'
          size='sm'
          type={show1 ? "text" : "password"}
          placeholder={"Enter Your Password"}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <InputRightElement>
          <Button  variant={'unstyled'} size={'sm'} onClick={()=>{setShow1(!show1)}}>
            {show1?<ViewIcon />:<ViewOffIcon/>}
          </Button>
        </InputRightElement>
      </InputGroup>
    </FormControl>
    <Button isLoading={loading} onClick={handleSubmit} size={'sm'} colorScheme={'blue'} width='100%' style={{marginTop:'25px'}} >
      Login
    </Button>
  </VStack>
  )
}

export default Login
