require("dotenv").config();
const express = require("express");
const http = require("http");
const path = require("path");
const app = express();
const cors = require("cors");
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
const studyRoutes = require("./routes/studybuddy");
const moduleRoutes = require("./routes/moduleLogging");

const server = http.createServer(app);
const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
        origin: ["https://passionus-2024-frontend.onrender.com"],
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true
    }
});

// database connection
connection();

// middlewares
app.use(express.json());
app.use(cors({
  origin: ["https://passionus-2024-frontend.onrender.com"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");

// Serve static files from the uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve static files from the Vite build
const clientBuildPath = path.join(__dirname, '../client/dist'); // Adjusted path
app.use(express.static(clientBuildPath));

// API routes
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
app.use("/api/studybuddy",studyRoutes);
app.use("/api/moduleform",moduleRoutes);

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.resolve(clientBuildPath, 'index.html'));
});

const port = process.env.PORT || 8080;

server.listen(port, () => console.log(`Listening on port ${port}...`));

io.on("connection", (socket) => {

    socket.on("setup", (user) => {
        socket.join(user);  
        socket.emit("connected");
    });

    socket.on("join chat", (room) => {
        socket.join(room);
        console.log("User Joined Room: " + room);
    });

    /*socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));*/

    socket.on("new message", (newMessageReceived) => {
        var chat = newMessageReceived.chat;

        if(!chat.users) return console.log('chat.users not defined');

        chat.users.forEach(user => {
            if(user._id == newMessageReceived.sender._id) return;

            socket.in(user._id).emit("message received", newMessageReceived);
        });
    });

    socket.off("setup", () => {
        console.log("User Disconnected");
        socket.leave(user); 
    });
});
