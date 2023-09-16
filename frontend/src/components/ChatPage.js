import { Box } from '@chakra-ui/react';
import { ChatState } from '../context/ChatProvider';
import SideDrawer from './miscellaneous/SideDrawer';
import MyChats from './MyChats';
import ChatBox from './ChatBox';
import { useState } from 'react';

const ChatPage = () => {
   const {user} =  ChatState();
   const [fetchAgain, setfetchAgain] = useState(false);
  return (
    <div style = {{width : "100%"}}>
        {user && <SideDrawer/>}
        <Box display = "flex" justifyContent="space-between" h="91.5vh" w="100%" p="10px" color="white">
            {user && <MyChats fetchAgain = {fetchAgain} setfetchAgain = {setfetchAgain}/>}
            {user && <ChatBox fetchAgain = {fetchAgain} setfetchAgain = {setfetchAgain}/>}
        </Box>
    </div>
  )
}
 
export default ChatPage
