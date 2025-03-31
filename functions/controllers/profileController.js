const {db} = require("../firebase");

const updateProfile = async (req, res) => {
  const {uid} = req.user;
  const {favBook, favGenre, favCharacter, favAuthor, bio} = req.body;

  if (!uid) {
    return res
        .status(401)
        .json({error: "Unauthorized: User ID not provided"});
  }

  try {
    const profileRef = db.collection("profiles").doc(uid);
    await profileRef.set(
        {
          uid,
          favBook,
          favGenre,
          favCharacter,
          favAuthor,
          bio,
          updatedAt: new Date(),
        },
        {merge: true},
    );

    res.json({success: true, message: "Profile updated successfully"});
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({error: error.message});
  }
};

const getProfile = async (req, res) => {
  const {uid} = req.user;
  if (!uid) {
    return res
        .status(401)
        .json({error: "Unauthorized: User ID not provided"});
  }

  try {
    const profileRef = db.collection("profiles").doc(uid);
    const userProfile = await profileRef.get();

    if (userProfile.exists) {
      const profileData = userProfile.data();
      res.json({success: true, profile: profileData});
    } else {
      res.json({success: true, profile: null});
    }
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({error: error.message});
  }
};

module.exports = {updateProfile, getProfile};
