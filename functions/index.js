const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");

// Initialize Firebase Admin
admin.initializeApp();

// Your existing Express app
const app = express();

// Middleware
app.use(cors({origin: true}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Import your controllers
const {verifyToken, saveUser} = require("./controllers/authController");
const profileRouter = require("./routes/profileRoute");

// Routes
app.post("/auth/verify", verifyToken, saveUser);
app.use("/profile", profileRouter);

app.get("/", (req, res) => {
  res.json({message: "Welcome to the backend API!"});
});

// Export the API as a Firebase Cloud Function
exports.api = functions.https.onRequest(app);
