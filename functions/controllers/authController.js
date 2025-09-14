const admin = require("firebase-admin");
const {db} = require("../firebase");

/**
 * Middleware to verify Firebase ID token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "No valid authorization header provided"
      });
    }

    const idToken = authHeader.split("Bearer ")[1];
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error("Token verification error:", error.message);
    return res.status(403).json({
      error: "Unauthorized",
      message: "Invalid or expired token"
    });
  }
};

/**
 * Save or update user in Firestore
 * @param {Object} req - Express request object with user data
 * @param {Object} res - Express response object
 */
const saveUser = async (req, res) => {
  try {
    const {uid, email, name, picture} = req.user;
    
    const userRef = db.collection("users").doc(uid);
    const userSnapshot = await userRef.get();
    
    const userData = {
      uid,
      email: email || "",
      name: name || "",
      picture: picture || "",
      lastLoginAt: new Date(),
      ...(userSnapshot.exists ? {} : { createdAt: new Date() })
    };

    // Upsert user data (create or update)
    await userRef.set(userData, { merge: true });

    res.json({
      success: true,
      user: {
        uid,
        email: userData.email,
        name: userData.name,
        picture: userData.picture
      }
    });
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to save user data"
    });
  }
};

module.exports = {verifyToken, saveUser};
