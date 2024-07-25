import React, { useEffect, useState, useRef } from "react";
import { Box, Text, Input, Button, VStack, HStack } from "@chakra-ui/react";
import axios from "axios";
import { ChatState } from "../../Context/ChatProvider";
import io from "socket.io-client";

const ENDPOINT = "https://passionus-2024-test.onrender.com";
let socket, selectedChatCompare;

const ChatMessages = () => {
  const { selectedChat } = ChatState();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const messagesEndRef = useRef(null);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    socket = io(ENDPOINT, {
      withCredentials: true,
      transports: ["websocket"], // Ensure using WebSocket transport
    });

    socket.emit("setup", userId);
    socket.on("connected", () => setSocketConnected(true));

    return () => {
      socket.off("connected");
      socket.disconnect();
    };
  }, [userId]);

  useEffect(() => {
    if (selectedChat) {
      fetchMessages();
      selectedChatCompare = selectedChat;
      socket.emit("join chat", selectedChat._id);
    }
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        // give notification
      } else {
        setMessages((prevMessages) => [...prevMessages, newMessageReceived]);
        updateChatList(newMessageReceived);
      }
    });

    return () => {
      socket.off("message received");
    };
  }, [messages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}api/message/${selectedChat._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessages(data);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  };

  const sendMessage = async (event) => {
    event.preventDefault();
    if (newMessage.trim()) {
      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/message`,
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
        setMessages((prevMessages) => [...prevMessages, data]);
        scrollToBottom();
      } catch (error) {
        console.error("Failed to send message:", error);
      }
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
