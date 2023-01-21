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
import React, { useState } from "react";
const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pic, setPic] = useState("");
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);

  const postDetails=(pic)=>{}
  return (
    <VStack spacing={"5px"}>
      <FormControl isRequired>
        <FormLabel id="name">Name</FormLabel>
        <Input
          variant='filled'
          size='sm'
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
            <Button pb={'2'} variant={'unstyled'} size={'sm'} onClick={()=>{setShow1(!show1)}}>
              {show1?<ViewIcon />:<ViewOffIcon/>}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl isRequired>
        <FormLabel id="confirmPassword">Confirm Password</FormLabel>
        <InputGroup>
          <Input
            variant='filled'
            size='sm'
            type={show2 ? "text" : "password"}
            placeholder={"Confirm Password"}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
          />
          <InputRightElement>
            <Button pb={'2'} variant={'unstyled'} size={'sm'} onClick={()=>{setShow2(!show2)}}>
              {show2?<ViewIcon />:<ViewOffIcon/>}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl >
        <FormLabel  id="pic">Upload Profile Picture</FormLabel>
        <Input
          variant='filled'
          size='sm'
          
          type={"file"}
          accept="image/*"
          onChange={(e)=>postDetails(e.target.files[0])}
        />
      </FormControl>
      <Button size={'sm'} colorScheme={'blue'} width='100%' style={{marginTop:'25px'}} >
        Sign Up
      </Button>
    </VStack>
  );
};

export default SignUp;
