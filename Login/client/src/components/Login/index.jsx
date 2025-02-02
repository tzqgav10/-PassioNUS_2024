import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import styles from "./styles.module.css";

const Login = () => {
  const [data, setData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = `${import.meta.env.VITE_API_BASE_URL}api/auth`;
      const { data: res } = await axios.post(url, data);
      console.log("Login response:", res); // Log the response
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId); // Store userId in local storage

      // Redirect based on setup_profile and setup_interests
      if (!res.data.setup_profile) {
        navigate("/create_profile");
        window.location.reload(); // reload page
      } else if (!res.data.setup_interests) {
        navigate("/interests");
        window.location.reload(); // reload page
      } else {
        navigate("/home");
        window.location.reload(); // reload page
      }
    } catch (error) {
      if (error.response) {
        console.error("Login error response:", error.response); // Log the error response
        if (error.response.status >= 400 && error.response.status <= 500) {
          setError(error.response.data.message);
        }
      } else {
        console.error("Login error:", error); // Log the general error if there's no response
      }
    }
  };

  return (
    <div className={styles.login_container}>
      <div className={styles.login_form_container}>
        <div className={styles.left}>
          <form className={styles.form_container} onSubmit={handleSubmit}>
            <h1>Login to Your Account</h1>
            <input
              type="email"
              placeholder="Email"
              name="email"
              onChange={handleChange}
              value={data.email}
              required
              className={styles.input}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
              value={data.password}
              required
              className={styles.input}
            />
            {error && <div className={styles.error_msg}>{error}</div>}
            <button type="submit" className={styles.green_btn}>
              Sign In
            </button>
          </form>
        </div>
        <div className={styles.right}>
          <h1>New Here ?</h1>
          <Link to="/signup">
            <button type="button" className={styles.white_btn}>
              Sign Up
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
