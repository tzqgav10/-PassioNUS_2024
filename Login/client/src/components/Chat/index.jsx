import { Box, Text } from "@chakra-ui/react";
import MyChats from "../MyChats";
import ChatBox from "../ChatBox";
import { ChatState } from "../../Context/ChatProvider";
import ChatMessages from "../ChatMessages";

const ChatPage = () => {
  const { selectedChat } = ChatState();

  return (
    <div style={{ width: "100%", height: "89.8vh" }}>
      <Box display="flex" height="100%">
        <Box
          width="30%"
          borderRight="1px solid #000"
          height="100%"
          display="flex"
          flexDirection="column"
        >
          <Box p={4} borderBottom="1px solid #000" flex="none">
            <ChatBox />
          </Box>
          <Box p={4} flex="1" overflowY="auto">
            <MyChats />
          </Box>
        </Box>
        <Box
          width="70%"
          p={4}
          display="flex"
          flexDirection="column"
          height="100%"
        >
          {selectedChat ? (
            <ChatMessages /> // Render the ChatMessages component
          ) : (
            <Text fontSize="xl" color="gray.500">
              Select a chat to start messaging
            </Text>
          )}
        </Box>
      </Box>
    </div>
  );
};

export default ChatPage;
