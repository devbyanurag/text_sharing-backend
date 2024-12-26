const express = require("express");
const cors = require("cors");
const http = require("http");
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
const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app;
