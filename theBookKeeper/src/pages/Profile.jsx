import React, { useState, useEffect } from "react";
import axios from "axios";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const [favBook, setFavBook] = useState("");
  const [favGenre, setFavGenre] = useState("");
  const [favCharacter, setFavCharacter] = useState("");
  const [favAuthor, setFavAuthor] = useState("");
  const [bio, setBio] = useState("");
  const [saveStatus, setSaveStatus] = useState("");
  const navigate = useNavigate();
  const auth = getAuth();
  console.log("User", user);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Fetch profile
        try {
          setProfileLoading(true);

          const idToken = await currentUser.getIdToken();
          const profileUrl = `${API_URL}/profile/getProfile`;

          const response = await axios.get(profileUrl, {
            headers: {
              Authorization: `Bearer ${idToken}`,
            },
          });
          // If profile exists, populate the form fields
          if (response.data.success && response.data.profile) {
            const profile = response.data.profile;
            setFavBook(profile.favBook || "");
            setFavGenre(profile.favGenre || "");
            setFavCharacter(profile.favCharacter || "");
            setFavAuthor(profile.favAuthor || "");
            setBio(profile.bio || "");
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
        } finally {
          setProfileLoading(false);
          setLoading(false);
        }
      } else {
        setLoading(false);
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate, auth, API_URL]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("authToken");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaveStatus("Saving...");

    try {
      const idToken = await user.getIdToken();
      const response = await axios.post(
        `${API_URL}/profile/updateProfile`,
        {
          favBook,
          favGenre,
          favCharacter,
          favAuthor,
          bio,
        },
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setSaveStatus("Profile updated successfully!");
      } else {
        setSaveStatus("Error updating profile. Please try again.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setSaveStatus("Error updating profile. Please try again.");
    }
  };

  return (
    <>
      <Helmet>
        <meta
          name="description"
          content="Customize your reading profile. Add your favorite books, genres, and characters with The Bookkeeper."
        />
        <meta
          name="keywords"
          content="Personal reading profile, book preferences, favorite author, custom bookshelf, book discovery, reader profile setup"
        />
        <meta name="author" content="The Bookkeeper Team" />
        <meta
          property="title"
          content="Edit Profile | Personalize Your Reading Experience – The Bookkeeper"
        />
        <meta
          property="description"
          content="Add your favorite books, genres, and characters to personalize your reading experience with The Bookkeeper."
        />
        <meta property="type" content="website" />
      </Helmet>

      <div className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-800 w-screen min-h-screen">
        <div className="w-screen min-h-screen flex items-center justify-center p-4 bg-black/40">
          <div className="bg-black/40 p-8 rounded-xl w-full max-w-xl ">
            <div className="flex flex-col md:flex-row gap-6 mb-6">
              {/* Profile Image */}
              <div className="w-32 h-32 mx-auto md:mx-0">
                <img
                  src={user?.photoURL}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              {/* Basic Info */}
              <div className="flex-1">
                <input
                  type="text"
                  className="w-full p-3 mb-3 bg-gray-200 rounded text-black"
                  placeholder="Name"
                  value={user?.displayName}
                  disabled
                />
                <input
                  type="email"
                  className="w-full p-3 mb-3 bg-gray-200 rounded text-black"
                  placeholder="Email"
                  value={user?.email}
                  disabled
                />
                <input
                  type="text"
                  className="w-full p-3 mb-3 bg-gray-200 rounded text-gray-800"
                  placeholder="Favorite Book"
                  value={favBook}
                  onChange={(e) => setFavBook(e.target.value)}
                />
                <input
                  type="text"
                  className="w-full p-3 mb-3 bg-gray-200 rounded text-gray-800"
                  placeholder="Favorite Author"
                  value={favAuthor}
                  onChange={(e) => setFavAuthor(e.target.value)}
                />
                <input
                  type="email"
                  className="w-full p-3 mb-3 bg-gray-200 rounded text-black"
                  placeholder="Favorite Genre"
                  value={favGenre}
                  onChange={(e) => setFavGenre(e.target.value)}
                />
                <input
                  type="email"
                  className="w-full p-3 mb-3 bg-gray-200 rounded text-black"
                  placeholder="Favorite Character"
                  value={favCharacter}
                  onChange={(e) => setFavCharacter(e.target.value)}
                />
              </div>
            </div>
            {/* Bio */}
            <textarea
              className="w-full h-40 p-3 bg-gray-200 rounded text-gray-800 mb-4"
              placeholder="Bio..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            ></textarea>

            {/* Status Message */}
            {saveStatus && (
              <div
                className={`text-center py-2 mb-4 ${
                  saveStatus.includes("Error")
                    ? "text-red-500"
                    : "text-green-500"
                }`}
              >
                {saveStatus}
              </div>
            )}

            {/* Buttons */}
            <div className="flex justify-between mt-4">
              <button
                onClick={handleUpdateProfile}
                className="bg-blue-300 text-white py-2 px-6 rounded-full focus:outline-none "
              >
                Update Profile
              </button>
              <button
                onClick={handleLogout}
                className="bg-blue-300 text-white py-2 px-6 rounded-full focus:outline-none "
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
