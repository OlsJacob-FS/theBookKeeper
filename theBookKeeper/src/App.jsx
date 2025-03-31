import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Login from "./pages/login";
import Dashboard from "./pages/dashBoard";
import NavBar from "./components/nav";
import Footer from "./components/Footer";
import Profile from "./pages/Profile";
import BookShelf from "./pages/BookShelf";
import BookInformation from "./pages/BookInformation";

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
function AppContent() {
  const location = useLocation();
  const isLoginPage =
    location.pathname === "/login" || location.pathname === "/";

  return (
    <div className="app">
      <NavBar showLinks={!isLoginPage} />
      <main className="pt-20">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/book/:id" element={<BookInformation />} />
          <Route path="/bookshelf" element={<BookShelf />} />
        </Routes>
      </main>
      <Footer showLinks={!isLoginPage} />
    </div>
  );
}

export default App;
