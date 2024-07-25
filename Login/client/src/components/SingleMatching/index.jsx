import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import styles from "./styles.module.css";
import { ChatState } from "../../Context/ChatProvider";
import { accessChat } from "../ChatBox"; // Import the accessChat function

const Matching = () => {
  const [gender, setGender] = useState("no-preference");
  const [match, setMatch] = useState(null);
  const [noMatchMessage, setNoMatchMessage] = useState("");
  const navigate = useNavigate();
  const toast = useToast();
  const { chats, setChats, setSelectedChat } = ChatState();
  const currentUserId = localStorage.getItem("userId");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!currentUserId) {
      console.error("No userId found in localStorage");
      return;
    }

    console.log("Submitting form with gender:", gender);

    const url = "http://localhost:8080/api/matching";
    const data = { gender, userId: currentUserId };

    try {
      const response = await axios.post(url, data, { withCredentials: true });
      if (response.data.message) {
        setNoMatchMessage(response.data.message);
        setMatch(null);
        setTimeout(() => {
          setNoMatchMessage("");
        }, 3000);
      } else {
        setMatch(response.data);
        setNoMatchMessage("");
        console.log("Best match user:", response.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setMatch(null);
    }
  };

  const handleChatRedirect = async () => {
    if (match) {
      console.log("Redirecting to chat with user:", match.userId);
      await accessChat(match.userId, chats, setChats, setSelectedChat, toast);
      navigate(`/chat?search=${encodeURIComponent(match.name)}`);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label className={styles.label}>
          Gender Preference:
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className={styles.select}
          >
            <option value="no-preference">No Preference</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </label>
        <button type="submit" className={`${styles.button} ${styles.blue}`}>
          Match
        </button>
      </form>
      {noMatchMessage && (
        <div className={styles.noMatchMessage}>
          <p>{noMatchMessage}</p>
        </div>
      )}
      {match && (
        <div className={styles.matchInfo}>
          <h2>Best Match:</h2>
          <p>Name: {match.nickname}</p>
          <p>Faculty: {match.faculty}</p>
          <p>Year: {match.year}</p>
          <p>Interests: {match.interests.join(", ")}</p>
          <button
            onClick={handleChatRedirect}
            className={`${styles.button} ${styles.black}`}
          >
            Click here to chat
          </button>{" "}
          {/* Redirect to chat */}
        </div>
      )}
    </div>
  );
};

export default Matching;
