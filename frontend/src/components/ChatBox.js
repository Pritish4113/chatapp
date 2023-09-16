import React from "react";
import { ChatState } from "../context/ChatProvider";
import { Box } from "@chakra-ui/react";
import SingleChat from "./SingleChat";

const ChatBox = ({fetchAgain ,setfetchAgain}) => {
  const { selectedChat } = ChatState();
  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      p={3}
      flexDir="column"
      borderRadius="lg"
      borderWidth="1px"
      bg="white"
      w={{ base: "100%", md: "68%" }}
      color="black"
      fontWeight={600}
    >
      <SingleChat fetchAgain = {fetchAgain} setfetchAgain = {setfetchAgain}/>
    </Box>
  );
};

export default ChatBox;
