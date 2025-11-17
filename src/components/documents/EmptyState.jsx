import React from "react";

const EmptyState = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-center">
      <p className="text-gray-600 text-sm mb-4">You have no documents.</p>

      <button className="border border-gray-400 px-4 py-1 rounded text-sm bg-white hover:bg-gray-100">
        Upload
      </button>
    </div>
  );
};

export default EmptyState;
