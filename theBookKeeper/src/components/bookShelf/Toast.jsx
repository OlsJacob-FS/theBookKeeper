import React from "react";

const ToastNotification = ({ message }) => {
  return (
    <div
      className={`fixed top-4 right-4 p-3 rounded-lg z-50 ${
        message.type === "success" ? "bg-green-600" : "bg-red-600"
      } text-white`}
    >
      {message.text}
    </div>
  );
};

export default ToastNotification;
