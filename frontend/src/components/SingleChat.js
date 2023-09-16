import React, { useEffect, useState } from "react";
import { ChatState } from "../context/ChatProvider";
import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderFull } from "../config/ChatLogic";
import ProfileModal from "./miscellaneous/ProfileModal";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import axios from "axios";
import "./styles.css";
import ScrollableChats from "./ScrollableChats";
import io from "socket.io-client";
import Lottie from "react-lottie";
import animationData from "../animations/typing.json";

const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setfetchAgain }) => {
  const { user, selectedChat, setselectedChat,notification, setnotification } = ChatState();
  const [loading, setloading] = useState(false);
  const [messages, setmessages] = useState([]);
  const [newMessage, setnewMessage] = useState();
  const [connected, setconnected] = useState(false);
  const [typing, settyping] = useState(false);
  const [isTyping, setisTyping] = useState(false);
  const toast = useToast();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const fetchMessages = async () => {
    if (!selectedChat) {
      return;
    }

    setloading(true);

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      console.log(data);

      setmessages(data);
      setloading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Failed to fetch message",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => {
      setconnected(true);
    });
    socket.on("typing", () => setisTyping(true));
    socket.on("stop typing", () => setisTyping(false));
  }, []);

  const sendMessage = async (e) => {
    console.log("hiii");
    socket.emit("stop typing", selectedChat._id);
    if (e.key === "Enter" && newMessage) {
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };

        setnewMessage("");
        const { data } = await axios.post(
          "/api/message",
          { content: newMessage, chatId: selectedChat._id },
          config
        );
        console.log(data);

        socket.emit("new message", data);

        setmessages([...messages, data]);
      } catch (error) {
        toast({
          title: "Failed to send message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
      }
    }
  };

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);


  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        //notification
        console.log("i am here")
        if(!notification.includes(newMessageRecieved)){
          setnotification([newMessageRecieved,...notification]);
          setfetchAgain(!fetchAgain);
        }
      } else {
        setmessages([...messages, newMessageRecieved]);
      }
    });
  });

  const typingHandler = (e) => {
    setnewMessage(e.target.value);

    // typing indicator logic
    if (!connected) {
      return;
    }

    settyping(true);
    socket.emit("typing", selectedChat._id);

    setTimeout(() => {
      socket.emit("stop typing", selectedChat._id);
      settyping(false);
    }, 3000);

    // if (!typing) {
    //   settyping(true);
    //   socket.emit("typing", selectedChat._id);
    // }
    // let lastTypingTime = new Date().getTime();
    // var timerLength = 3000;
    // setTimeout(() => {
    //   var timeNow = new Date().getTime();
    //   var timeDiff = timeNow - lastTypingTime;
    //   if (timeDiff >= timerLength && typing) {
    //     socket.emit("stop typing", selectedChat._id);
    //     settyping(false);
    //   }
    //   console.log(isTyping);
    // }, timerLength);
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            fontWeight={500}
            display="flex"
            alignItems="center"
            justifyContent={{ base: "space-between" }}
            fontSize={{ base: "28px", md: "30px" }}
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setselectedChat("")}
            />
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setfetchAgain={setfetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
            bg="#E8E8E8"
            p={3}
          >
            {loading ? (
              <Spinner
                w={20}
                h={20}
                margin="auto"
                size="xl"
                alignSelf="center"
              />
            ) : (
              <div className="messages">
                <ScrollableChats messages={messages} />
              </div>
            )}

            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              {isTyping ? (
                <div>
                  <Lottie
                    width={70}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                    options={defaultOptions}
                  />
                </div>
              ) : (
                <></>
              )}
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message..."
                onChange={typingHandler}
                value={newMessage}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text pb={3} fontSize="3xl" fontFamily="Work sans" fontWeight={400}>
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
