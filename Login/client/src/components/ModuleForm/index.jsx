import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./styles.module.css";

const ModulesForm = () => {
  const [modules, setModules] = useState([{ name: "" }]);
  const [message, setMessage] = useState("");
  const [hasModules, setHasModules] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchModules = async () => {
      const storedUserId = localStorage.getItem("userId");
      try {
        const response = await axios.get(
          `http://localhost:8080/api/moduleform/${storedUserId}`,
          { withCredentials: true }
        );
        if (response.data.modules && response.data.modules.length > 0) {
          setModules(response.data.modules);
          setHasModules(true);
        } else {
          setModules([{ name: "" }]); // Set default module if no modules are found
        }
      } catch (error) {
        console.error("Error fetching modules:", error);
        setModules([{ name: "" }]); // Set default module if there's an error
      }
    };

    fetchModules();
  }, []);

  const handleModuleChange = (index, event) => {
    const value = event.target.value.toUpperCase();
    const filteredValue = value.replace(/[^A-Z0-9]/g, ""); // Ensure only uppercase letters and numbers
    const values = [...modules];
    values[index].name = filteredValue;
    setModules(values);
  };

  const handleAddModule = () => {
    if (modules.length >= 9) {
      setMessage("You can only add up to 9 modules.");
      setTimeout(() => setMessage(""), 3000); // Clear message after 3 seconds
      return;
    }
    setModules([...modules, { name: "" }]);
  };

  const handleRemoveModule = (index) => {
    const values = [...modules];
    values.splice(index, 1);
    setModules(values);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (
      modules.length === 0 ||
      modules.every((module) => module.name.trim() === "")
    ) {
      setMessage("Please add at least one module before submitting.");
      setTimeout(() => setMessage(""), 3000); // Clear message after 3 seconds
      return;
    }

    const storedUserId = localStorage.getItem("userId");
    const url = "http://localhost:8080/api/moduleform";
    const data = {
      userId: storedUserId,
      modules,
    };

    try {
      await axios.post(url, data, { withCredentials: true });
      setMessage("Modules logged successfully!");
      setTimeout(() => {
        setMessage("");
        navigate("/study");
      }, 3000); // Clear message and redirect after 3 seconds
    } catch (error) {
      setMessage("Error saving modules.");
      setTimeout(() => setMessage(""), 3000); // Clear message after 3 seconds
    }
  };

  const handleBack = () => {
    navigate("/study");
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Edit Modules</h1>
      {message && <p className={styles.message}>{message}</p>}
      <form onSubmit={handleSubmit} className={styles.form}>
        {modules.map((module, index) => (
          <div key={index} className={styles.formRow}>
            <label htmlFor={`module-${index}`} className={styles.label}>
              Module {index + 1}:
            </label>
            <input
              type="text"
              id={`module-${index}`}
              placeholder={`Module ${index + 1}`}
              value={module.name}
              onChange={(event) => handleModuleChange(index, event)}
              required
              className={styles.input}
            />
            <button
              type="button"
              onClick={() => handleRemoveModule(index)}
              className={`${styles.button} ${styles.black}`}
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddModule}
          className={`${styles.button} ${styles.blue}`}
        >
          Add Module
        </button>
        <button type="submit" className={`${styles.button} ${styles.blue}`}>
          Submit
        </button>
      </form>
      {hasModules && (
        <button
          onClick={handleBack}
          className={`${styles.button} ${styles.blue}`}
        >
          Back
        </button>
      )}
    </div>
  );
};

export default ModulesForm;
