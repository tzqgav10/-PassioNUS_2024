import React, { useState, useEffect } from "react";
import { Box, VStack, Text, Spinner } from "@chakra-ui/react";
import { ChatState } from "../../Context/ChatProvider";
import axios from "axios";
import io from "socket.io-client";

const ENDPOINT = "https://passionus-2024-test.onrender.com";
let socket;

const MyChats = () => {
  const { chats, setChats, selectedChat, setSelectedChat } = ChatState();
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}api/chat`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setChats(data);
      } catch (error) {
        console.error("Failed to load chats", error);
        setChats([]); // Ensure chats is set to an empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [setChats]);

  useEffect(() => {
    socket = io(ENDPOINT, {
      withCredentials: true,
      transports: ["websocket"], // Ensure using WebSocket transport
    });

    const userId = localStorage.getItem("userId");
    socket.emit("setup", userId);

    socket.on("message received", (newMessageReceived) => {
      updateLatestMessage(newMessageReceived);
    });

    // Listen for custom event
    const handleMessageSent = (event) => {
      updateLatestMessage(event.detail);
    };
    window.addEventListener("message-sent", handleMessageSent);

    return () => {
      socket.disconnect();
      window.removeEventListener("message-sent", handleMessageSent);
    };
  }, []);

  const updateLatestMessage = (newMessageReceived) => {
    setChats((prevChats) => {
      const updatedChats = prevChats.map((chat) => {
        if (chat._id === newMessageReceived.chat._id) {
          return { ...chat, latestMessage: newMessageReceived };
        }
        return chat;
      });
      return updatedChats;
    });
  };

  return (
    <Box mt={4}>
      <Text fontSize="2xl" mb={4}>
        My Chats
      </Text>
      <VStack spacing={4} align="stretch">
        {chats && chats.length > 0 ? (
          chats.map((chat) => (
            <Box
              key={chat._id}
              p={4}
              bg={
                selectedChat && selectedChat._id === chat._id
                  ? "blue.100"
                  : "gray.100"
              } // Highlight the selected chat
              borderRadius="md"
              onClick={() => setSelectedChat(chat)}
              cursor="pointer"
            >
              <Text fontWeight="bold">
                {chat.isGroupChat
                  ? chat.chatName
                  : chat.users.find((u) => u._id !== userId).nickname}
              </Text>
              {chat.latestMessage && (
                <Text mt={1} fontSize="sm" color="gray.500">
                  <strong>{chat.latestMessage.sender.nickname}: </strong>
                  {chat.latestMessage.content.length > 50
                    ? `${chat.latestMessage.content.substring(0, 50)}...`
                    : chat.latestMessage.content}
                </Text>
              )}
            </Box>
          ))
        ) : (
          <Text>No chats available</Text>
        )}
      </VStack>
    </Box>
  );
};

export default MyChats;
