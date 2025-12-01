// server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// CORS - allow Vite frontend
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

// Body parser
app.use(express.json());

// Routes
const insightRoutes = require("./routes/insightRoutes");
app.use("/api/insights", insightRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("Blackcoffer Backend API is running 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
