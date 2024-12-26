const express = require("express");
const cors = require("cors");
const http = require("http");
require("dotenv").config();
require("./src/config/db_connection");

const userRoute = require("./src/routes/User");
const textRoute = require("./src/routes/Text")

const app = express();
app.use(express.json());

const allowedOrigins = [process.env.FRONTEND_URL];

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
  res.send("API Working on port 5000");
});

app.use("/user", userRoute);
app.use("/text", textRoute);


const server = http.createServer(app);
const port = process.env.PORT || 5000;

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`Port ${port} is already in use. Please use a different port.`);
    process.exit(1);
  } else {
    console.error("Server error:", err);
  }
});

module.exports = app;
