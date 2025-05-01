import React from "react";

interface LoadingProps {
  message?: string;
  fullScreen?: boolean;
}

export default function Loading({
  message = "Loading...",
  fullScreen = true,
}: LoadingProps) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-gray-300 rounded-full"></div>
        <div className="absolute top-0 left-0 w-12 h-12 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
      </div>
      {message && (
        <p className="text-gray-300 text-lg font-medium">{message}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-gray-900/90 backdrop-blur-sm flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  return <div className="flex items-center justify-center p-8">{content}</div>;
}
