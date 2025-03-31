// BookShelf/ErrorMessage.jsx
import React from "react";

const ErrorMessage = ({ message }) => {
  return (
    <div className="bg-red-500/20 text-white p-4 rounded mb-4 text-center">
      {message}
    </div>
  );
};

export default ErrorMessage;
