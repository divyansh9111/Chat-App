import { Avatar, Box, Spinner, Text } from "@chakra-ui/react";
import React from "react";

const UserListItem = (props) => {
  return (
    <Box
      cursor={"pointer"}
      display={"flex"}
      w={"100%"}
      bg={"#ebf0f4"}
      _hover={{bg:"#dbe4ec"}}
      alignItems={"center"}
      px={3}
      py={2}
      mb={2}
      borderRadius={"md"}
      onClick={props.handleClick}
    >
      <Avatar
        cursor={"pointer"}
        marginRight={2}
        size={"xs"}
        name={props.user.name}
        src={props.user.picture}
      />
      <Box>
        <Text fontSize={"xs"}>{props.user.name}</Text>
        <Text fontSize={"xs"}>
          <b>Email: </b>
          {props.user.email}
        </Text>
      </Box>
    </Box>
  );
};

export default UserListItem;
