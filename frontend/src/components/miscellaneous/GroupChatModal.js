import {
  Box,
  Button,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import axios from "axios";
import UserListItem from "../UserAvatar/UserListItem";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";

const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [loading, setloading] = useState(false);
  const [groupChatName, setgroupChatName] = useState();
  const [selectedUsers, setselectedUsers] = useState([]);
  const [search, setsearch] = useState();
  const [searchResult, setsearchResult] = useState([]);

  const toast = useToast();

  const { user, chats, setchats } = ChatState();

  const handleSearch = async (query) => {
    setsearch(query);

    if (!query) {
      return;
    }

    try {
      setloading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/user/?search=${search}`, config);

      console.log(data);

      setloading(false);
      setsearchResult(data);
    } catch (error) {
      toast({
        title: "Failed to get search items",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast({
        title: "User already in the group",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }

    setselectedUsers([...selectedUsers, userToAdd]);
  };

  const handleSubmit = async() => {
    if(!groupChatName || !selectedUsers){
        toast({
            title: "Enter all the details",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "top-left",
          });
          return;
    }

    try {
        const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          };

          const {data} = await axios.post(`/api/chat/group`,{
            name : groupChatName,
            users : JSON.stringify(selectedUsers.map((u) => u._id))
          }, config)

          setchats([data,...chats]);
          onClose();
          toast({
            title: "Group created",
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "top-left",
          });

    } catch (error) {
        toast({
            title: "Unable to create the group",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "top-left",
          });
    }
  };

  const handleDelete = (user) => {
    console.log("user");
    setselectedUsers(selectedUsers.filter((sel) => sel._id !== user._id));
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontFamily="Work sans"
            fontSize="35px"
            display="flex"
            justifyContent="center"
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center">
            <FormControl>
              <Input
                placeholder="Chat Name"
                mb={3}
                onChange={(e) => setgroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add Users"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>

            {/* displaying selected users */}
            <Box w="100%" display="flex" flexWrap="wrap">
              {selectedUsers.map((user) => (
                <UserBadgeItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleDelete(user)}
                />
              ))}
            </Box>

            {/* displaying searched users */}
            {loading ? (
              <div>loading...</div>
            ) : (
              searchResult
                ?.slice(0, 4)
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" onClick={handleSubmit}>
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
