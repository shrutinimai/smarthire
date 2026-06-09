const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");

dotenv.config();

const { connectMySQL } = require("./config/mysqlDB");
const connectMongoDB = require("./config/mongoDB");
const { initSocket } = require("./config/socket");

require("./models/User");
require("./models/Job");
require("./models/Application");
require("./models/Resume");

const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const resumeRoutes = require("./routes/resumeRoutes");

const app = express();
const server = http.createServer(app);

initSocket(server);

app.use(cors());
app.use(express.json());

connectMySQL();
connectMongoDB();

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/resume", resumeRoutes);

app.get("/", (req, res) => {
  res.json({ message: "SmartHire API is running " });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});