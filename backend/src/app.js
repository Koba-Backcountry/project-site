const express = require("express");
const taskRoutes = require("./routes/taskRoutes");
const authRoutes = require("./routes/authRoutes");
const habitRoutes = require("./routes/habitRoutes");

const app = express();

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);
app.use("/habits", habitRoutes);

app.get("/", (req, res) => {
  res.send("API is running");
});

module.exports = app;
