const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");

// Initialize Firebase Admin
admin.initializeApp();

// Create Express app
const app = express();

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Import controllers and routes
const { verifyToken, saveUser } = require("./controllers/authController");
const profileRouter = require("./routes/profileRoute");
const reviewRouter = require("./routes/reviewRoutes");

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: "1.0.0"
  });
});

// API routes
app.post("/auth/verify", verifyToken, saveUser);
app.use("/profile", profileRouter);
app.use("/reviews", reviewRouter);

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to The BookKeeper API",
    version: "1.0.0",
    endpoints: {
      health: "/health",
      auth: "/auth/verify",
      profile: "/profile",
      reviews: "/reviews"
    }
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error("Unhandled error:", error);
  res.status(500).json({
    error: "Internal Server Error",
    message: "An unexpected error occurred"
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: `Route ${req.method} ${req.originalUrl} not found`
  });
});

// Export the API as a Firebase Cloud Function
exports.api = functions.https.onRequest(app);
