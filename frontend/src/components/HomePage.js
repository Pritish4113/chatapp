import { Box, Container, Tab, TabList, TabPanels, TabPanel, Tabs, Text } from "@chakra-ui/react";
import React, { useEffect } from "react";
import Login from "./Authentication/Login";
import SignUp from "./Authentication/SignUp";
import { useHistory } from "react-router-dom";

const HomePage = () => {

  const history = useHistory();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if(userInfo){
      history.push("/chats");
    }
  },[history])

  return (
    <Container maxW="xl" centerContent>
      <Box
        d="flex"
        p={3}
        bg={"white"}
        justifyContent="center"
        borderRadius="lg"
        w="100%"
        borderWidth="1px"
        m="40px 0 15px 0"
      >
        <Text
          fontWeight="bold"
          fontSize="4xl"
          fontFamily="Work sans"
          color="black"
          justifyContent="center"
          textAlign="center"
          bg="white"
        >
          ChatBase
        </Text>
      </Box>
      <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px" color="black">
        <Tabs variant="soft-rounded" bg="white">
          <TabList bg="white">
            <Tab width="50%">Sign Up</Tab>
            <Tab width="50%">Login</Tab>
          </TabList>
          <TabPanels bg="white">
            <TabPanel bg="white">
              <SignUp/>
            </TabPanel>
            <TabPanel bg="white">
              <Login/>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default HomePage;
