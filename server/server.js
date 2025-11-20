const express = require("express");
const mongoose = require("mongoose");

const app = express();

// MongoDB connection
const MONGODB_URI = "mongodb://localhost:27017/cloudcrm";

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Simple origin check middleware
app.use((req, res, next) => {
  const allowedOrigin = "http://localhost:3000";
  const requestOrigin = req.headers.origin;
  console.log(requestOrigin);
  // Only set CORS headers if request comes from allowed origin
  if (requestOrigin === allowedOrigin) {
    res.header("Access-Control-Allow-Origin", allowedOrigin);
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
  }

  next();
});

app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/tasks", require("./routes/file/activities/taskRoutes"));

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Using MongoDB: ${MONGODB_URI}`);
  console.log(
    `🔑 JWT Secret: ${process.env.JWT_SECRET ? "Set" : "Using fallback"}`
  );
  console.log(`🌐 Allowing requests from: http://localhost:3000`);
});
