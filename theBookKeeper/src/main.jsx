import React from "react";
import ReactDOM from "react-dom/client";
import "./firebase"; // Import Firebase initialization first
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
