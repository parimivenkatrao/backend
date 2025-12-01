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
// CORS - allow origins from env or default to Vite localhost
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "http://localhost:5173").split(",").map(s => s.trim()).filter(Boolean);
app.use(
  cors({
    origin: function (origin, callback) {
      // allow non-browser requests like curl/postman (no origin)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
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

// Minimal API index to avoid 404 on GET /api
app.get("/api", (req, res) => {
  res.json({
    message: "Blackcoffer Backend API",
    endpoints: ["/api/insights", "/api/insights/stats"],
    cors: { allowedOrigins }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
