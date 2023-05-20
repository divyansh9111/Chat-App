import {
  Button,
  Code,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  PinInput,
  PinInputField,
  VStack,
} from "@chakra-ui/react";
import { CheckIcon, ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Axios from "axios";
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
  const history = useHistory();
  const toast = useToast();
  const { Cookies } = ChatState();
  const [message, setMessage] = useState(
    "We'll send a verification code to your email."
  );
  const [codeLoading, setCodeLoading] = useState(false);
  const [verificationCode, setVerificationCode] = useState();
  const [disabled, setDisabled] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [InputOtp, setInputOtp] = useState("");
  function isValidEmail(email) {
    // regular expression to check if email is valid
    const emailRegex = /\S+@\S+\.\S+/;
    setDisabled(!emailRegex.test(email));
  }
  const postDetails = async (pic) => {
    setLoading(true);

    if (pic === undefined) {
      toast({
        title: "Please select an image.",
        variant: "subtle",
        position: "bottom-left",
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
      let getData = "";
      await Axios.post(
        "https://api.cloudinary.com/v1_1/mernproject1/image/upload",
        data
      ).then((response) => {
        getData = response.data["secure_url"];
        setPicture(getData);
        setLoading(false);
        console.log(getData);
      });
    } else {
      toast({
        title: "Please select an image.",
        variant: "subtle",
        position: "bottom-left",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }
  };
  const handleSubmit = async () => {
    setLoading(true);
    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: "Please fill all the fields.",
        variant: "subtle",
        position: "bottom-left",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      toast({
        title: "Passwords are not matching.",
        variant: "subtle",
        position: "bottom-left",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await Axios.post(
        "https://chit-chat-dr4q.onrender.com/api/user",
        { name, email, password, confirmPassword, picture },
        config
      );
      toast({
        title: "Registration successful.",
        variant: "subtle",
        position: "bottom-left",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      Cookies.set("userInfo", JSON.stringify(data), {
        expires: new Date(Date.now() + 60 * 1000 * 60),
      });
      setLoading(false);
      history.go("/chats");
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
  };
  const sendCode = async () => {
    try {
      setDisabled(true);
      setCodeLoading(true);
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await Axios.post(
        "https://chit-chat-dr4q.onrender.com/api/user/send-verification-code",
        { email },
        config
      );
      if (data) {
        setVerificationCode(data);
        setMessage("An OTP has been sent to your email...");
        toast({
          title: "OTP sent!",
          variant: "subtle",
          position: "top-left",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      }
      setCodeLoading(false);
    } catch (error) {
      setCodeLoading(false);
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
  };
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
        <InputGroup>
          <Input
            variant="filled"
            size="sm"
            type={"email"}
            placeholder={"Enter Your Email"}
            onChange={(e) => {
              setEmail(e.target.value);
              isValidEmail(e.target.value);
            }}
          />
          {isVerified ? (
            <InputRightElement
              children={<CheckIcon mb={2} mr={1} color="green.500" />}
            />
          ) : (
            <InputRightElement width="4.5rem">
              <Button
                isDisabled={disabled}
                variant={"outline"}
                mb={2}
                mr={1}
                colorScheme="blue"
                isLoading={codeLoading}
                size="xs"
                onClick={() => {
                  sendCode();
                }}
              >
                Send Code
              </Button>
            </InputRightElement>
          )}
        </InputGroup>
        <FormHelperText fontSize={"smaller"}>{message}</FormHelperText>
      </FormControl>
      {verificationCode&&!isVerified && (
        <FormControl>
          <InputGroup>
            <HStack>
              <PinInput size={"xs"} otp >
                <PinInputField
                  maxLength={1}
                  onChange={(e) => {
                    if(e.keyCode==8){
                      setInputOtp("");
                    }else{
                    setInputOtp((prev) => prev + e.target.value);
                    }
                  }}
                />
                <PinInputField
                  maxLength={1}
                  onChange={(e) => {
                    if(e.keyCode==8){
                      setInputOtp("");
                    }else{
                    setInputOtp((prev) => prev + e.target.value);
                    }
                  }}
                />
                <PinInputField
                  maxLength={1}
                  onChange={(e) => {
                    if(e.keyCode==8){
                      setInputOtp("");
                    }else{
                    setInputOtp((prev) => prev + e.target.value);
                    }
                  }}
                />
                <PinInputField
                  maxLength={1}
                  onChange={(e) => {
                    if(e.keyCode==8){
                      setInputOtp("");
                    }else{
                    setInputOtp((prev) => prev + e.target.value);
                    }
                  }}
                />
              </PinInput>
            </HStack>
            {InputOtp.length >= 4 && (
              <InputRightElement width="4.5rem">
                <Button
                  variant={"solid"}
                  mb={2}
                  mr={1}
                  colorScheme="green"
                  isLoading={codeLoading}
                  size="xs"
                  onClick={() => {
                    if (InputOtp == verificationCode) {
                      setIsVerified(true);
                      setMessage("Congrats! your email has been verified.");
                      setInputOtp("");
                      toast({
                        title: "Verified!",
                        variant: "subtle",
                        position: "top-left",
                        status: "success",
                        duration: 5000,
                        isClosable: true,
                      });
                    } else {
                      toast({
                        title: "warning!",
                        variant: "subtle",
                        position: "top-left",
                        description: "please enter a valid OTP!",
                        status: "warning",
                        duration: 5000,
                        isClosable: true,
                      });
                      setInputOtp("");
                    }
                  }}
                >
                  Verify
                </Button>
              </InputRightElement>
            )}
          </InputGroup>
        </FormControl>
      )}

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
        isDisabled={!isVerified}
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
