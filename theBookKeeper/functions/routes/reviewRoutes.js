const express = require("express");
const router = express.Router();
const { db } = require("../firebase");
const { verifyToken } = require("../controllers/authController");

// Get reviews for a specific book
router.get("/:bookId", async (req, res) => {
  try {
    const { bookId } = req.params;
    
    const reviewsRef = db.collection("reviews");
    const snapshot = await reviewsRef
      .where("bookId", "==", bookId)
      .orderBy("createdAt", "desc")
      .get();
    
    const reviews = [];
    for (const doc of snapshot.docs) {
      const reviewData = doc.data();
      
      // Fetch user data to get the full name
      let firstName = reviewData.userName || "Anonymous";
      try {
        if (reviewData.userId) {
          const userDoc = await db.collection("users").doc(reviewData.userId).get();
          if (userDoc.exists) {
            const userData = userDoc.data();
            const fullName = userData.name || reviewData.userName || "";
            // Extract first name from full name
            firstName = fullName.split(" ")[0] || fullName || "Anonymous";
          }
        }
      } catch (userError) {
        console.error("Error fetching user data:", userError);
        // Fallback to existing userName
        firstName = reviewData.userName || "Anonymous";
      }
      
      reviews.push({
        id: doc.id,
        ...reviewData,
        firstName,
        createdAt: reviewData.createdAt?.toDate?.() || reviewData.createdAt
      });
    }
    
    res.json({
      success: true,
      reviews
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch reviews"
    });
  }
});

// Submit a new review
router.post("/", verifyToken, async (req, res) => {
  try {
    const { bookId, bookTitle, rating, title, text } = req.body;
    const { uid, email, name } = req.user;
    
    // Validate input
    if (!bookId || !rating || !text) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: bookId, rating, and text are required"
      });
    }
    
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        error: "Rating must be between 1 and 5"
      });
    }
    
    // Allow users to write multiple reviews for the same book
    // Removed duplicate review check
    
    // Extract first name from full name
    const fullName = name || email || "Anonymous User";
    const firstName = fullName.split(" ")[0] || fullName;

    // Create new review
    const reviewData = {
      bookId,
      bookTitle: bookTitle || "",
      userId: uid,
      userName: name || email || "Anonymous User",
      firstName: firstName,
      userEmail: email || "",
      rating: parseInt(rating),
      title: title || "",
      text: text.trim(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const docRef = await db.collection("reviews").add(reviewData);
    
    res.json({
      success: true,
      reviewId: docRef.id,
      message: "Review submitted successfully"
    });
  } catch (error) {
    console.error("Error submitting review:", error);
    res.status(500).json({
      success: false,
      error: "Failed to submit review"
    });
  }
});

// Update an existing review
router.put("/:reviewId", verifyToken, async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, title, text } = req.body;
    const { uid } = req.user;
    
    // Validate input
    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({
        success: false,
        error: "Rating must be between 1 and 5"
      });
    }
    
    // Check if review exists and belongs to user
    const reviewRef = db.collection("reviews").doc(reviewId);
    const reviewDoc = await reviewRef.get();
    
    if (!reviewDoc.exists) {
      return res.status(404).json({
        success: false,
        error: "Review not found"
      });
    }
    
    const reviewData = reviewDoc.data();
    if (reviewData.userId !== uid) {
      return res.status(403).json({
        success: false,
        error: "You can only edit your own reviews"
      });
    }
    
    // Update review
    const updateData = {
      updatedAt: new Date()
    };
    
    if (rating !== undefined) updateData.rating = parseInt(rating);
    if (title !== undefined) updateData.title = title;
    if (text !== undefined) updateData.text = text.trim();
    
    await reviewRef.update(updateData);
    
    res.json({
      success: true,
      message: "Review updated successfully"
    });
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update review"
    });
  }
});

// Delete a review
router.delete("/:reviewId", verifyToken, async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { uid } = req.user;
    
    // Check if review exists and belongs to user
    const reviewRef = db.collection("reviews").doc(reviewId);
    const reviewDoc = await reviewRef.get();
    
    if (!reviewDoc.exists) {
      return res.status(404).json({
        success: false,
        error: "Review not found"
      });
    }
    
    const reviewData = reviewDoc.data();
    if (reviewData.userId !== uid) {
      return res.status(403).json({
        success: false,
        error: "You can only delete your own reviews"
      });
    }
    
    // Delete review
    await reviewRef.delete();
    
    res.json({
      success: true,
      message: "Review deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete review"
    });
  }
});

module.exports = router;
