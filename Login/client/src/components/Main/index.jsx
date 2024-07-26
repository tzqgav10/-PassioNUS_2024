import React, { useEffect } from "react";
import axios from "axios";
import styles from "./styles.module.css";
import { useNavigate } from "react-router-dom";

const Main = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserSetup = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");
        const url = `${
          import.meta.env.VITE_API_BASE_URL
        }api/auth/setup-status?userId=${userId}`;

        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = response.data;

        if (!data.setup_profile) {
          navigate("/create_profile");
        } else if (!data.setup_interests) {
          navigate("/interests");
        }
      } catch (error) {
        console.error("Error checking user setup:", error);
      }
    };

    checkUserSetup();
  }, [navigate]);

  return (
    <div className={styles.main_container}>
      <div className={styles.main_content}>
        <section id="about" className={styles.section}>
          <h2>About Us</h2>
          <p>
            Welcome to our website! We are PassioNUS, and this is our Orbital 24
            project.
            <br />
            With the goal of being a one-stop website for all the things you
            need to explore your interests in the campus to help you find your
            exciting university life!
          </p>
        </section>
      </div>
    </div>
  );
};

export default Main;
