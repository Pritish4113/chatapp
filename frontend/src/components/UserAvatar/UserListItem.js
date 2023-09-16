import { Avatar, Box, Text } from "@chakra-ui/react";
import React from "react";

const UserListItem = (user, handleFunction) => {
  return (
    <Box
      onClick={user.handleFunction}
      bg="#E8E8E8"
      cursor="pointer"
      w="100%"
      display="flex"
      color="black"
      alignItems="center"
      px={3}
      py={2}
      mb={2}
      borderRadius="lg"
      _hover={{ background: "#38B2AC", color: "white" }}
    >
      <Avatar
        mr={2}
        size="sm"
        cursor="pointer"
        name={user.user.name}
        src={user.user.pic}
      />
      <Box>
        <Text fontWeight="600">{user.user.name}</Text>
        <Text fontSize="xs">
          <b>Email : </b>
          {user.user.email}
        </Text>
      </Box>
    </Box>
  );
};

export default UserListItem;
