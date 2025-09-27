import React, { useState, useEffect } from "react";
import axios from "axios";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { 
  FiUser, 
  FiMail, 
  FiBook, 
  FiPenTool, 
  FiHeart,
  FiEdit3,
  FiLogOut,
  FiSave,
  FiArrowLeft
} from "react-icons/fi";

// ProfileImage component with error handling and fallbacks
const ProfileImage = ({ user, className }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // Reset states when user or photo URL changes
  useEffect(() => {
    setImageError(false);
    setImageLoading(true);
  }, [user?.photoURL, user?.uid]);

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  // Process Google photo URL to ensure it's the right size and format
  const processGooglePhotoUrl = (photoURL) => {
    if (!photoURL) return null;
    
    // Google Photos URL processing
    if (photoURL.includes('googleusercontent.com')) {
      // Remove existing size parameters and add our preferred size
      const baseUrl = photoURL.split('=')[0];
      return `${baseUrl}=s128-c`;
    }
    
    // For other URLs, return as-is
    return photoURL;
  };

  // Generate fallback avatar URL
  const getFallbackAvatar = () => {
    const name = user?.displayName || user?.email?.split('@')[0] || 'User';
    
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3b82f6&color=ffffff&size=128&bold=true&font-size=0.5`;
  };

  // Use Google photo URL if available and no error, otherwise use fallback
  const processedPhotoURL = processGooglePhotoUrl(user?.photoURL);
  const imageSrc = processedPhotoURL && !imageError 
    ? processedPhotoURL 
    : getFallbackAvatar();

  return (
    <div className="relative">
      <img
        src={imageSrc}
        alt="Profile"
        className={className}
        onError={handleImageError}
        onLoad={handleImageLoad}
        style={{ 
          display: imageLoading ? 'none' : 'block' 
        }}
      />
      {imageLoading && (
        <div className={`${className} bg-gray-200 dark:bg-gray-700 flex items-center justify-center`}>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}
    </div>
  );
};

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

  if (loading || profileLoading) {
    return (
      <div className="w-screen min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Profile | The Bookkeeper</title>
        <meta name="description" content="Manage your profile information and reading preferences." />
      </Helmet>
      
      <div className="w-screen min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="flex items-center px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <FiArrowLeft className="w-5 h-5 mr-2" />
                  Back to Dashboard
                </button>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                My Profile
              </h1>
              <div className="w-24"></div> {/* Spacer for centering */}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="text-center">
                  <div className="w-32 h-32 mx-auto mb-4">
                    <ProfileImage 
                      user={user}
                      className="w-full h-full object-cover rounded-full border-4 border-gray-200 dark:border-gray-700"
                    />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                    {user?.displayName || 'User'}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {user?.email}
                  </p>
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center w-full text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200 px-4 py-2"
           >
                    <FiLogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </button>
                </div>
              </div>
            </div>

            {/* Profile Form */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center mb-6">
                  <FiEdit3 className="w-5 h-5 text-blue-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Reading Preferences
                  </h3>
                </div>

                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  
                  {/* Favorite Book */}
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <FiBook className="w-4 h-4 mr-2 text-blue-600" />
                      Favorite Book
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="What's your all-time favorite book?"
                      value={favBook}
                      onChange={(e) => setFavBook(e.target.value)}
                    />
                  </div>

                  {/* Favorite Author */}
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <FiPenTool className="w-4 h-4 mr-2 text-blue-600" />
                      Favorite Author
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="Who's your favorite author?"
                      value={favAuthor}
                      onChange={(e) => setFavAuthor(e.target.value)}
                    />
                  </div>

                  {/* Favorite Genre */}
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <FiHeart className="w-4 h-4 mr-2 text-blue-600" />
                      Favorite Genre
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="What genre do you love most?"
                      value={favGenre}
                      onChange={(e) => setFavGenre(e.target.value)}
                    />
                  </div>

                  {/* Favorite Character */}
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <FiUser className="w-4 h-4 mr-2 text-blue-600" />
                      Favorite Character
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="Who's your favorite literary character?"
                      value={favCharacter}
                      onChange={(e) => setFavCharacter(e.target.value)}
                    />
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <FiEdit3 className="w-4 h-4 mr-2 text-blue-600" />
                      About You
                    </label>
                    <textarea
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                      rows={4}
                      placeholder="Tell us about yourself and your reading journey..."
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                    />
                  </div>

                  {/* Status Message */}
                  {saveStatus && (
                    <div className={`p-4 rounded-lg ${
                      saveStatus.includes("Error") 
                        ? "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300" 
                        : "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300"
                    }`}>
                      {saveStatus}
                    </div>
                  )}

                  {/* Save Button */}
                  <button
                    type="submit"
                    className="flex items-center justify-center w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm"
                  >
                    <FiSave className="w-4 h-4 mr-2" />
                    Save Profile
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
