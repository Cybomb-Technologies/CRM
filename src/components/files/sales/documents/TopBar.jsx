import React from "react";
import { ChevronDown } from "lucide-react";

import { documentsAPI } from "./documentsAPI";

const TopBar = ({ onUploadSuccess }) => {
  const fileInputRef = React.useRef(null);
  const [isUploading, setIsUploading] = React.useState(false);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("name", file.name);
      formData.append("originalName", file.name);
      formData.append("size", file.size);
      formData.append("mimeType", file.type);

      await documentsAPI.createDocument(formData);
      if (onUploadSuccess) onUploadSuccess();
    } catch (error) {
      console.error("Upload failed", error);
      alert("Failed to upload document");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="h-14 bg-[#f0f0f0] border-b border-gray-300 flex items-center px-6">
      {/* CREATE BUTTON - Placeholder */}
      <button className="flex items-center bg-white border border-gray-300 px-3 py-1 rounded text-sm mr-3 hover:bg-gray-100">
        Create
        <ChevronDown className="w-4 h-4 ml-1 text-gray-600" />
      </button>

      {/* UPLOAD BUTTON */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      <button
        onClick={handleUploadClick}
        disabled={isUploading}
        className="flex items-center bg-white border border-gray-300 px-3 py-1 rounded text-sm hover:bg-gray-100 disabled:opacity-50"
      >
        {isUploading ? "Uploading..." : "Upload"}
        <ChevronDown className="w-4 h-4 ml-1 text-gray-600" />
      </button>
    </div>
  );
};

export default TopBar;
