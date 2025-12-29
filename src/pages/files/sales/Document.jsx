import React from "react";

import EmptyState from "../../../components/files/sales/documents/EmptyState";
import DocumentList from "../../../components/files/sales/documents/DocumentList";
import { documentsAPI } from "../../../components/files/sales/documents/documentsAPI";
const DocumentPage = () => {
  const [documents, setDocuments] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const fetchDocuments = async () => {
    try {
      setIsLoading(true);
      const data = await documentsAPI.getDocuments();
      setDocuments(data);
    } catch (error) {
      console.error("Failed to fetch documents:", error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchDocuments();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      try {
        await documentsAPI.deleteDocument(id);
        fetchDocuments(); // Refresh list
      } catch (error) {
        console.error("Failed to delete document:", error);
      }
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* HEADER */}
      <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between shadow-sm">
        <h1 className="text-xl font-semibold text-gray-800">Documents</h1>

        {/* Simple Upload Action */}
        <div>
          <input
            type="file"
            id="header-upload"
            className="hidden"
            onChange={async (e) => {
              const file = e.target.files[0];
              if (!file) return;
              try {
                setIsLoading(true);
                const formData = new FormData();
                formData.append("file", file);
                formData.append("name", file.name);
                formData.append("originalName", file.name);
                formData.append("size", file.size);
                formData.append("mimeType", file.type);
                await documentsAPI.createDocument(formData);
                fetchDocuments();
              } catch (err) {
                console.error(err);
                alert("Upload failed");
                setIsLoading(false);
                // Reset input
                e.target.value = "";
              }
            }}
          />
          <button
            onClick={() => document.getElementById('header-upload')?.click()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 8v8" /><path d="M8 12h8" /></svg>
            Upload File
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-6xl mx-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-64 text-gray-400">Loading documents...</div>
          ) : documents.length > 0 ? (
            <DocumentList documents={documents} onDelete={handleDelete} />
          ) : (
            <EmptyState onUploadSuccess={fetchDocuments} />
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentPage;
