const express = require("express");
const mongoose = require("mongoose");

const app = express();

// MongoDB connection
const MONGODB_URI = "mongodb://localhost:27017/cloudcrm";

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ FIXED CORS middleware with OPTIONS handling
app.use((req, res, next) => {
  const allowedOrigin = "http://localhost:3000";
  const requestOrigin = req.headers.origin;

  console.log(`📨 ${req.method} request from:`, requestOrigin);

  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    console.log("🔄 Handling OPTIONS preflight request");
    res.header("Access-Control-Allow-Origin", allowedOrigin);
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, PATCH, DELETE, OPTIONS"
    );
    return res.status(200).send(); // ✅ Return 200 for OPTIONS
  }

  // Set CORS headers for actual requests
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
app.use("/api/meetings", require("./routes/file/activities/meetingRoutes"));
app.use("/api/calls", require("./routes/file/activities/callRoutes"));
app.use("/api/leads", require("./routes/file/sales/leadRoutes"));

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
  console.log(`🌐 Allowing requests from: http://localhost:3000`);
});
