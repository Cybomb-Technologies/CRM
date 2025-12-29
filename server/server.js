const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/database");
const path = require("path");
const fs = require("fs");

// Load environment variables
dotenv.config();

console.log("\n🔐 ===== SERVER STARTUP =====");
console.log("📁 Current directory:", __dirname);
console.log(
  "🔑 JWT_SECRET from .env:",
  process.env.JWT_SECRET ? "SET" : "NOT SET"
);
if (process.env.JWT_SECRET) {
  console.log("🔑 JWT_SECRET length:", process.env.JWT_SECRET.length);
  console.log(
    "🔑 JWT_SECRET preview:",
    process.env.JWT_SECRET.substring(0, 10) + "..."
  );
} else {
  console.log("⚠️ Using fallback JWT_SECRET");
}
console.log("============================\n");

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "public", "uploads", "profiles");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("✅ Created uploads directory:", uploadsDir);
}

// Serve static files from 'public' directory
app.use("/uploads", express.static(path.join(__dirname, "public", "uploads")));

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/profile", require("./routes/profileRoutes"));

// Health check route
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    database: "Connected",
    jwtSecret: process.env.JWT_SECRET ? "Configured" : "Not configured",
  });
});
app.use("/api/auth", require("./routes/auth"));
app.use("/api/tasks", require("./routes/file/activities/taskRoutes"));
app.use("/api/meetings", require("./routes/file/activities/meetingRoutes"));
app.use("/api/calls", require("./routes/file/activities/callRoutes"));
app.use("/api/leads", require("./routes/file/sales/leadRoutes"));
app.use("/api/contacts", require("./routes/file/sales/contactRoutes"));
app.use("/api/accounts", require("./routes/file/sales/accountRoutes"));
app.use("/api/deals", require("./routes/file/sales/dealRoutes"));
app.use("/api/campaigns", require("./routes/file/sales/campaignRoutes"));
app.use("/api/sales/forecasts", require("./routes/file/sales/forecastRoutes"));
app.use("/api/file/sales/documents", require("./routes/file/sales/documentRoutes"));

// Test route
app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "API is working!",
    version: "1.0.0",
  });
});

// 404 handler for undefined routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("❌ Server error:", err.stack);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message: message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
});
