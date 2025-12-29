import React from "react";

import { documentsAPI } from "./documentsAPI";

const EmptyState = ({ onUploadSuccess }) => {
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
      formData.append("file", file); // Assuming backend expects 'file' field
      // Add other metadata if needed by backend model
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
    <div className="w-full h-full flex flex-col items-center justify-center text-center">
      <p className="text-gray-600 text-sm mb-4">You have no documents.</p>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      <button
        onClick={handleUploadClick}
        disabled={isUploading}
        className="border border-gray-400 px-4 py-1 rounded text-sm bg-white hover:bg-gray-100 disabled:opacity-50"
      >
        {isUploading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
};

export default EmptyState;
