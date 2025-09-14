import React from "react";
import { FiBookOpen } from "react-icons/fi";

function LoadScreen({ message = "Loading..." }) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="text-center">
        <div className="relative mb-8">
          <div className="animate-spin rounded-full h-24 w-24 border-4 border-slate-300 dark:border-white/20 border-t-blue-600 dark:border-t-white mx-auto"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <FiBookOpen className="w-8 h-8 text-blue-600 dark:text-white animate-pulse" />
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-slate-700 dark:text-white text-xl font-medium">{message}</p>
          <div className="flex justify-center space-x-1">
            <div className="w-2 h-2 bg-blue-600 dark:bg-white/60 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-600 dark:bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-blue-600 dark:bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoadScreen;
