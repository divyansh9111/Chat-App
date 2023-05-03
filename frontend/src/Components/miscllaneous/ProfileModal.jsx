import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Image,
  Text,
  Avatar,
  MenuButton,
  IconButton,
} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
const ProfileModal = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton
          size={"xs"}
          variant={"unstyled"}
          d={{ base: "flex" }}
          icon={<ViewIcon fontSize={"sm"} />}
          onClick={onOpen}
        />
      )}

      <Modal size={"xs"} isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize={"30px"}
            display={"flex"}
            justifyContent={"center"}
          >
            <Image
              className="avatar"
              borderRadius={"full"}
              src={user.picture}
              alt={user.name}
              boxSize={"150px"}
            />
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
            flexDirection={"column"}
          >
            <Text fontSize={"xl"}>{user.name}</Text>
            <Text fontSize={"md"}>Email: {user.email}</Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;
