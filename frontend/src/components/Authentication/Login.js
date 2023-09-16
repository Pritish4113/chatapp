import React, { useState } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { useHistory } from "react-router-dom";

const Login = () => {
  const [show, setshow] = useState(false);
  const [email, setemail] = useState();
  const [password, setpassword] = useState();
  const [loading, setloading] = useState(false);
  const toast = useToast();
  const history = useHistory();

  const handleClick = () => {
    setshow(!show);
  };

  const handleSubmit = async () => {
    setloading(true);
    if (!email || !password) {
      toast({
        title: "Please fill all the fields!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
      });
      setloading(false);
      return;
    }

    try {
      const { data } = await axios.post(
        "/api/user/login",
        {
          email,
          password,
        }
      );
      toast({
        title: "Login Succesfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "botton",
      });

      localStorage.setItem("userInfo", JSON.stringify(data));
      setloading(false);
      history.push("/chats");
      window.location.reload(true);
      
    } catch (err) {
      toast({
        title: "An Error Occured!",
        description: err.response.data.error,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "botton",
      });
      setloading(false);
    }
  };

  return (
    <VStack spacing="5px">
      <FormControl id="email" py="10px" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          value={email}
          placeholder="Enter Email"
          onChange={(e) => setemail(e.target.value)}
        ></Input>
      </FormControl>
      <FormControl id="password" py="10px" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            value={password}
            type={show ? "text" : "password"}
            placeholder="Enter Password"
            onChange={(e) => setpassword(e.target.value)}
          ></Input>
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Button
        colorScheme="blue"
        width="100%"
        color="white"
        onClick={handleSubmit}
        style={{ marginTop: "15px" }}
        isLoading={loading}
      >
        Login
      </Button>
      <Button
        variant="solid"
        colorScheme="red"
        width="100%"
        onClick={() => {
          setemail("guest@example.com");
          setpassword("123456");
        }}
      >
        Get Guest User Credentials
      </Button>
    </VStack>
  );
};

export default Login;
