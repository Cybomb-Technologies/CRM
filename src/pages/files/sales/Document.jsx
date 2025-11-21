import React from "react";
import Sidebar from "../../../components/files/sales/documents/Sidebar";
import TopBar from "../../../components/files/sales/documents/TopBar";
import EmptyState from "../../../components/files/sales/documents/EmptyState";
const DocumentPage = () => {
  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* LEFT SIDEBAR */}
      <Sidebar />

      {/* RIGHT MAIN AREA */}
      <div className="flex-1 flex flex-col border-l border-gray-300">
        {/* TOP BAR */}
        <TopBar />

        {/* MAIN CONTENT */}
        <div className="flex-1 bg-white overflow-auto">
          <EmptyState />
        </div>
      </div>
    </div>
  );
};

export default DocumentPage;
