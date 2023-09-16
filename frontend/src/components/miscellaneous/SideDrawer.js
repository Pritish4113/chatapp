import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { BiSearch } from "react-icons/bi";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { ChatState } from "../../context/ChatProvider";
import { Avatar, AvatarBadge, AvatarGroup } from "@chakra-ui/react";
import ProfileModal from "./ProfileModal";
import { useHistory } from "react-router-dom";
import axios from "axios";
import ChatLoading from "../ChatLoading";
import UserListItem from "../UserAvatar/UserListItem";
import { Spinner } from "@chakra-ui/spinner";
import { getSender } from "../../config/ChatLogic";
import NotificationBadge from "react-notification-badge";
import {Effect} from "react-notification-badge";

const SideDrawer = () => {
  const {
    user,
    selectedChat,
    setselectedChat,
    chats,
    setchats,
    notification,
    setnotification,
  } = ChatState();
  const [search, setsearch] = useState();
  const [searchresult, setsearchresult] = useState([]);
  const [loading, setloading] = useState(false);
  const [loadingchat, setloadingchat] = useState();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const history = useHistory();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    history.push("/");
  };

  const toast = useToast();

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "please enter name or email in searchbar",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
    }

    try {
      setloading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/user/?search=${search}`, config);

      setloading(false);
      setsearchresult(data);
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

  const accessChat = async (userId) => {
    try {
      setloadingchat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post("api/chat", { userId }, config);

      if (!chats.find((c) => c._id === data._id)) setchats([data, ...chats]);

      setselectedChat(data);
      setloadingchat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error occured",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
    }
  };

  return (
    <>
      <Box
        display="flex"
        alignContent="center"
        justifyContent="space-between"
        w="100%"
        bg="white"
        p="5px 10px 5px 10px"
        borderWidth="5px"
      >
        <Tooltip label="Search users to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <BiSearch />
            <Text display={{ base: "none", md: "flex" }} px="4px">
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize="2xl" fontFamily="Work sans" fontWeight={800}>
          Chit-Chat
        </Text>
        <div>
          <Menu>
            <MenuButton p={1}>
              <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
              />
              <BellIcon fontSize="2xl" m={1}></BellIcon>
            </MenuButton>
            <MenuList p={3}>
              {!notification.length && "No new messages"}
              {notification.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setselectedChat(notif.chat);
                    setnotification(notification.filter((n) => n !== notif));
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New message from ${notif.chat.chatName}`
                    : `New message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar
                name={user.name}
                src={user.pic}
                size="sm"
                cursor="pointer"
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="Search by name or Email"
                mr={2}
                value={search}
                onChange={(e) => setsearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchresult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingchat && <Spinner display="flex" ml="auto" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
