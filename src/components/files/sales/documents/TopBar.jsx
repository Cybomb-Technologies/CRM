import React from "react";
import { ChevronDown } from "lucide-react";

const TopBar = () => {
  return (
    <div className="h-14 bg-[#f0f0f0] border-b border-gray-300 flex items-center px-6">
      {/* CREATE BUTTON */}
      <button className="flex items-center bg-white border border-gray-300 px-3 py-1 rounded text-sm mr-3 hover:bg-gray-100">
        Create
        <ChevronDown className="w-4 h-4 ml-1 text-gray-600" />
      </button>

      {/* UPLOAD BUTTON */}
      <button className="flex items-center bg-white border border-gray-300 px-3 py-1 rounded text-sm hover:bg-gray-100">
        Upload
        <ChevronDown className="w-4 h-4 ml-1 text-gray-600" />
      </button>
    </div>
  );
};

export default TopBar;
