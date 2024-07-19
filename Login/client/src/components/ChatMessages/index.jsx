import React, { useEffect, useState, useRef } from "react";
import { Box, Text, Input, Button, VStack, HStack } from "@chakra-ui/react";
import axios from "axios";
import { ChatState } from "../../Context/ChatProvider";
import io from "socket.io-client";

const ENDPOINT = "http://localhost:8080";
var socket, selectedChatCompare;

const ChatMessages = () => {
  const { selectedChat } = ChatState();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  /*const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);*/

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", userId);
    socket.on("connected", () => setSocketConnected(true));
    /*socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));*/
  }, []);

  useEffect(() => {
    fetchMessages();

    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        // give notification
      } else {
        setMessages([...messages, newMessageReceived]);
        updateChatList(newMessageReceived);
      }
    });
  });

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:8080/api/message/${selectedChat._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessages(data);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  };

  const sendMessage = async (event) => {
    event.preventDefault();
    if (newMessage.trim()) {
      try {
        const { data } = await axios.post(
          "http://localhost:8080/api/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setNewMessage("");
        socket.emit("new message", data);
        // Append the message immediately to the sender's view
        setMessages((prevMessages) => [...prevMessages, data]);
        scrollToBottom(); // Ensure scroll to bottom after sending a message

        // Emit custom event
        window.dispatchEvent(new CustomEvent("message-sent", { detail: data }));
      } catch (error) {
        console.error("Failed to send message:", error);
      }
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
  };

  const updateChatList = (newMessageReceived) => {
    const event = new CustomEvent("message-sent", {
      detail: newMessageReceived,
    });
    window.dispatchEvent(event);
  };

  return (
    <Box display="flex" flexDirection="column" height="100%" width="100%">
      <Box flex="1" overflowY="auto" p={4} bg="gray.50">
        <VStack spacing={4} align="stretch">
          {messages.map((message) => (
            <HStack
              key={message._id}
              alignSelf={
                message.sender._id === userId ? "flex-end" : "flex-start"
              }
              bg={message.sender._id === userId ? "blue.100" : "green.100"}
              borderRadius="lg"
              p={3}
              maxWidth="70%"
            >
              <Text>{message.content}</Text>
            </HStack>
          ))}
          <div ref={messagesEndRef} />
        </VStack>
      </Box>
      <Box mt={2} p={4} bg="white">
        <form onSubmit={sendMessage}>
          <HStack>
            <Input
              value={newMessage}
              onChange={typingHandler}
              placeholder="Type a message..."
            />
            <Button type="submit" colorScheme="blue">
              Send
            </Button>
          </HStack>
        </form>
      </Box>
    </Box>
  );
};

export default ChatMessages;
