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
const Login = () => {
  const [show1, setShow1] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
          <Button variant={'unstyled'} size={'sm'} onClick={()=>{setShow1(!show1)}}>
            {show1?<ViewIcon />:<ViewOffIcon/>}
          </Button>
        </InputRightElement>
      </InputGroup>
    </FormControl>
    <Button size={'sm'} colorScheme={'blue'} width='100%' style={{marginTop:'25px'}} >
      Login
    </Button>
  </VStack>
  )
}

export default Login
