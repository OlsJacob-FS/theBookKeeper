const admin = require("firebase-admin");
const {db} = require("../firebase");

// Middleware to Verify Firebase ID Token
const verifyToken = async (req, res, next) => {
  const idToken =
    req.headers.authorization && req.headers.authorization.split("Bearer ")[1];
  if (!idToken) {
    return res.status(401).json({error: "Unauthorized: No token provided"});
  }
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(403).json({error: "Unauthorized: Invalid token"});
  }
};

// Save User to users database
const saveUser = async (req, res) => {
  console.log("Starting saveUser function with user:", req.user.uid);
  const {uid, email} = req.user;

  try {
    const userRef = db.collection("users").doc(uid);
    const userSnapshot = await userRef.get();
    if (!userSnapshot.exists) {
      const userData = {
        uid,
        email: email || "",
        createdAt: new Date(),
      };

      console.log("User data to be saved:", userData);

      // Save the new user to Firestore
      await userRef.set(userData);
    } else {
      console.log("User already exists in Firestore");
    }

    res.json({
      success: true,
      uid,
      email: email || "",
    });
  } catch (error) {
    console.error("Error in saveUser function:", error);
    res.status(500).json({error: error.message, stack: error.stack});
  }
};

module.exports = {verifyToken, saveUser};
