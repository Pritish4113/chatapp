import { CloseIcon } from "@chakra-ui/icons";
import { Box } from "@chakra-ui/react";
import React from "react";

const UserBadgeItem = (user, handleFunction) => {
  return (
    <Box
      px={2}
      py={1}
      borderRadius="lg"
      m={1}
      mb={2}
      variant="solid"
      fontSize={12}
      backgroundColor="purple"
      fontWeight={600}
      color="white"
      cursor="pointer"
      p={2}
      onClick={user.handleFunction}
    >{user.user.name}
    <CloseIcon ml={2} mb = "1px" fontSize={9}/></Box>
  );
};

export default UserBadgeItem;
