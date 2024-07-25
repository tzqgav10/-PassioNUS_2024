import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
import { useToast } from "@chakra-ui/react";
import { ChatState } from "../../Context/ChatProvider";
import { accessChat } from "../ChatBox"; // Import the accessChat function

const StudyMatch = () => {
  const [modules, setModules] = useState([]);
  const [match, setMatch] = useState(null);
  const [noMatchMessage, setNoMatchMessage] = useState("");
  const navigate = useNavigate();
  const toast = useToast();
  const { chats, setChats, setSelectedChat } = ChatState();

  useEffect(() => {
    const fetchModules = async () => {
      const storedUserId = localStorage.getItem("userId");
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}api/moduleform/${storedUserId}`,
          { withCredentials: true }
        );
        if (response.data.modules) {
          setModules(response.data.modules);
          if (response.data.modules.length === 0) {
            navigate("/module_form");
          }
        }
      } catch (error) {
        navigate("/module_form"); // If there is no api endpoint, redirect user to add modules first
        console.error("Error fetching modules:", error);
      }
    };

    fetchModules();
  }, [navigate]);

  const handleMatch = async () => {
    const storedUserId = localStorage.getItem("userId");
    const url = `${import.meta.env.VITE_API_BASE_URL}api/studybuddy`;
    const data = {
      userId: storedUserId,
      modules,
    };

    try {
      const response = await axios.post(url, data, { withCredentials: true });
      console.log("Server response:", response.data);
      if (response.data.match) {
        setMatch(response.data);
        setNoMatchMessage("");
      } else {
        setMatch(null);
        setNoMatchMessage("No matches found.");
        setTimeout(() => setNoMatchMessage(""), 3000); // Clear message after 3 seconds
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setMatch(null);
      setNoMatchMessage("No matches found.");
      setTimeout(() => setNoMatchMessage(""), 3000); // Clear message after 3 seconds
    }
  };

  const handleChatRedirect = async () => {
    if (match && match.match.userId) {
      console.log("Redirecting to chat with user:", match.match.userId);
      await accessChat(
        match.match.userId,
        chats,
        setChats,
        setSelectedChat,
        toast
      );
      navigate(`/chat?search=${encodeURIComponent(match.match.name)}`);
    } else {
      console.error("No userId found in match object");
    }
  };

  const handleEditModules = () => {
    navigate("/module_form");
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>My Modules</h1>
      <div className={styles.modulesList}>
        <ul>
          {modules.map((module, index) => (
            <li key={index}>{module.name}</li>
          ))}
        </ul>
      </div>
      <div className={styles.buttonContainer}>
        <button
          onClick={handleEditModules}
          className={`${styles.button} ${styles.blue}`}
        >
          Edit Modules
        </button>
        <button
          onClick={handleMatch}
          className={`${styles.button} ${styles.blue}`}
        >
          Find Study Buddy
        </button>
      </div>

      {noMatchMessage && (
        <div className={styles.noMatchMessage}>
          <p>{noMatchMessage}</p>
        </div>
      )}

      {match && (
        <div className={styles.matchInfo}>
          <h2>Matched User Details</h2>
          <p>
            <strong>Name:</strong> {match.match.nickname}
          </p>
          <p>
            <strong>Year of Study:</strong> {match.match.yearOfStudy}
          </p>
          <p>
            <strong>Faculty:</strong> {match.match.faculty}
          </p>
          <p>
            <strong>Common Modules:</strong> {match.commonModules.join(", ")}
          </p>
          <button
            onClick={handleChatRedirect}
            className={`${styles.button} ${styles.black}`}
          >
            Click here to chat
          </button>
        </div>
      )}
    </div>
  );
};

export default StudyMatch;
