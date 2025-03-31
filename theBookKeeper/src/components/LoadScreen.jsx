import React from "react";

function LoadScreen({ message = "Loading..." }) {
  return (
    <div className="text-center text-white text-xl">
      <div className="animate-pulse flex justify-center">
        <div className="h-6 w-24 bg-gray-400 rounded"></div>
      </div>
      <p className="mt-4">{message}</p>
    </div>
  );
}

export default LoadScreen;
