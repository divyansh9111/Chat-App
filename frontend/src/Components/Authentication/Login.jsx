import React, { useState } from "react";
import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  PinInput,
  PinInputField,
  VStack,
} from "@chakra-ui/react";
import {
  ArrowBackIcon,
  CheckIcon,
  ViewIcon,
  ViewOffIcon,
} from "@chakra-ui/icons";
import { useToast } from "@chakra-ui/react";
import Axios from "axios";
import { useHistory } from "react-router-dom";
import { ChatState } from "../../context/ChatProvider";
const Login = () => {
  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const { Cookies } = ChatState();
  const [isForget, setIsForget] = useState(false);
  const [message, setMessage] = useState(
    "We'll send a verification code to your email."
  );
  const [codeLoading, setCodeLoading] = useState(false);
  const [verificationCode, setVerificationCode] = useState();
  const [disabled, setDisabled] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [InputOtp, setInputOtp] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  function isValidEmail(email) {
    // regular expression to check if email is valid
    const emailRegex = /\S+@\S+\.\S+/;
    setDisabled(!emailRegex.test(email));
  }
  const handleSubmit = async () => {
    setLoading(true);
    if (!email || !password) {
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
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await Axios.post(
        "/api/user/login",
        { email, password },
        config
      );
      console.log(data);
      toast({
        title: "Login successful.",
        variant: "subtle",
        position: "bottom-left",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      Cookies.set("userInfo", JSON.stringify(data), {
        expires: new Date(Date.now() + 60 * 1000 * 60 * 12),
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
        "/api/user/send-verification-code",
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
  const handleResetPassword = async () => {
    setResetLoading(true);
    if (!email||!password || !confirmPassword) {
      toast({
        title: "Please fill all the fields.",
        variant: "subtle",
        position: "bottom-left",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      setResetLoading(false);
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
      setResetLoading(false);
      return;
    }
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await Axios.patch("/api/user/reset", {email, password }, config);
      if (data) {
        toast({
          title: "Password changed successfully.",
          variant: "subtle",
          position: "bottom-left",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        setResetLoading(false);
        setIsForget(false);
        setIsVerified(false);
        setMessage("");
        setInputOtp("");
        setVerificationCode("");
      }
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
      setResetLoading(false);
    }
  };
  return (
    <>
      {isForget ? (
        <>
          <IconButton
            variant={"ghost"}
            icon={<ArrowBackIcon p={0} />}
            onClick={() => {
              setIsForget(false);
            }}
          />
          <VStack spacing={"5px"}>
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
            {verificationCode && !isVerified && (
              <FormControl>
                <InputGroup>
                  <HStack>
                    <PinInput autoFocus size={"xs"} otp>
                      <PinInputField
                        maxLength={1}
                        onChange={(e) => {
                          if (e.keyCode == 8) {
                            setInputOtp("");
                          } else {
                            setInputOtp((prev) => prev + e.target.value);
                          }
                        }}
                      />
                      <PinInputField
                        maxLength={1}
                        onChange={(e) => {
                          if (e.keyCode == 8) {
                            setInputOtp("");
                          } else {
                            setInputOtp((prev) => prev + e.target.value);
                          }
                        }}
                      />
                      <PinInputField
                        maxLength={1}
                        onChange={(e) => {
                          if (e.keyCode == 8) {
                            setInputOtp("");
                          } else {
                            setInputOtp((prev) => prev + e.target.value);
                          }
                        }}
                      />
                      <PinInputField
                        maxLength={1}
                        onChange={(e) => {
                          if (e.keyCode == 8) {
                            setInputOtp("");
                          } else {
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
                            setInputOtp("");
                            toast({
                              title: "Verified!",
                              variant: "subtle",
                              position: "top-left",
                              status: "success",
                              duration: 5000,
                              isClosable: true,
                            });
                            setMessage("Verified!");
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
            {isVerified && (
              <>
                <FormControl isRequired>
                  <FormLabel id="password">New Password</FormLabel>
                  <InputGroup>
                    <Input
                      variant="filled"
                      size="sm"
                      type={show1 ? "text" : "password"}
                      placeholder={"Enter New Password"}
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
                  <FormLabel id="confirmPassword">
                    Confirm New Password
                  </FormLabel>
                  <InputGroup>
                    <Input
                      variant="filled"
                      size="sm"
                      type={show2 ? "text" : "password"}
                      placeholder={"Confirm New Password"}
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
                <Button
                  isLoading={resetLoading}
                  onClick={handleResetPassword}
                  size={"sm"}
                  colorScheme={"blue"}
                  width="100%"
                  style={{ marginTop: "25px" }}
                >
                  Reset Password
                </Button>
              </>
            )}
          </VStack>
        </>
      ) : (
        <VStack spacing={"5px"}>
          <FormControl isRequired>
            <FormLabel id="email">Email</FormLabel>
            <Input
              autoFocus
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
                type={show ? "text" : "password"}
                placeholder={"Enter Your Password"}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
              <InputRightElement>
                <Button
                  variant={"unstyled"}
                  size={"sm"}
                  onClick={() => {
                    setShow(!show);
                  }}
                >
                  {show ? <ViewIcon /> : <ViewOffIcon />}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>
          <Button
            isLoading={loading}
            onClick={handleSubmit}
            size={"sm"}
            colorScheme={"blue"}
            width="100%"
            style={{ marginTop: "25px" }}
          >
            Login
          </Button>
          <Button
            onClick={() => {
              setIsForget(true);
            }}
            size={"sm"}
            colorScheme={"blue"}
            variant={"link"}
            style={{ marginTop: "25px" }}
          >
            Forget password?
          </Button>
        </VStack>
      )}
    </>
  );
};

export default Login;
