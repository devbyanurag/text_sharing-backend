const express = require("express");
const cors = require("cors");
const http = require("http");
const jwt = require("jsonwebtoken");
const socketIo = require("socket.io");
require("dotenv").config();
require("./src/config/db_connection");

const userRoute = require("./src/routes/User");

const app = express();
app.use(express.json());

const allowedOrigins = [
    process.env.FRONTEND_URL,
    "*",
];

app.use(
  cors({
    credentials: true,
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

app.get("/", (req, res) => {
  res.send("API Working on port 5000 ");
});

app.use("/user", userRoute);

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Store clients by user ID (particular ID)
let clients = {};

io.on('connection', (socket) => {
  const token = socket.handshake.query.token;

  if (!token) {
    console.error('No token provided');
    socket.disconnect();
    return;
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);

    // Store socket by user ID
    clients[user.id] = socket;

    // Send a message to a specific user based on their user ID
    socket.on('sendToUser', (targetUserId, message) => {
      if (clients[targetUserId]) {
        clients[targetUserId].emit('message', message); // Send message to the specific user
      } else {
        socket.emit('message', 'User not found or not connected');
      }
    });

    // Broadcast message to all clients
    socket.on('message', (message) => {
      Object.values(clients).forEach(client => {
        if (client.connected) {
          client.emit('message', message);
        }
      });
    });

    socket.on('disconnect', () => {
      // Remove the client from the clients list when they disconnect
      delete clients[user.id];
      console.log(`User ${user.id} disconnected`);
    });
  } catch (err) {
    console.error('Token verification failed:', err);
    socket.disconnect();
  }
});

const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app;
