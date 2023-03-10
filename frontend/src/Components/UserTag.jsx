import { StarIcon } from "@chakra-ui/icons";
import { Box, CloseButton, Text } from "@chakra-ui/react";
import React from "react";

const UserTag = (props) => {
  return (
    <Box order={props.isAdmin?"-1":{}} display={"flex"} alignItems={"center"} bg={props.isAdmin?"purple":"#3182ce"} borderRadius={"lg"} px={1} py={.5} m={.5} >
      {props.isAdmin?<StarIcon color={"white"} boxSize={3} mr={1}/>:<></>}
      <Text color={"white"} fontSize={'xs'}>{props.user.name}</Text>
      {props.isAdmin||props.isHimself?<></>:<CloseButton color={"white"} size={"sm"} boxSize={3} ml={1} onClick={props.handleClick} />}
      
    </Box>
  );
};

export default UserTag;
