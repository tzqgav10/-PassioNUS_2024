import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./styles.module.css";

const SingleMatch = () => {
  const [bestMatch, setBestMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchBestMatch = async () => {
      const url = `${import.meta.env.VITE_API_BASE_URL}api/matching/best-match`;
      try {
        const { data: res } = await axios.get(url);
        if (res.message) {
          setMessage(res.message);
        } else {
          setBestMatch(res);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBestMatch();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className={styles.errorMessage}>Error: {error}</p>;
  }

  if (message) {
    return <p className={styles.message}>{message}</p>;
  }

  if (!bestMatch) {
    return <p className={styles.message}>No match found.</p>;
  }

  return (
    <div className={styles.bestMatchContainer}>
      <h2>Best Match</h2>
      <p>User 1: {bestMatch.user1}</p>
      <p>User 2: {bestMatch.user2}</p>
      <p>Number of Matching Interests: {bestMatch.matches}</p>
    </div>
  );
};

export default SingleMatch;
