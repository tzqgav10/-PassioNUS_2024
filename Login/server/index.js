require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const connection = require("./database");
const userRoutes = require("./routes/students");
const authRoutes = require("./routes/auth");
const create_profileRoutes = require("./routes/create_profile");
const interestsRoutes = require("./routes/interests");
const eventRoutes = require("./routes/events");
const profileRoutes = require("./routes/profile");
const changePasswordRoutes = require("./routes/changePassword");
const matchingRoutes = require("./routes/matching");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");

// Database connection
connection();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");

// Serve static files from the uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use("/api/students", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/create_profile", create_profileRoutes);
app.use("/api/interests", interestsRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/change-password", changePasswordRoutes);
app.use("/api/matching", matchingRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

const port = process.env.PORT || 8080;
app.listen(port, console.log(`Listening on port ${port}...`));



