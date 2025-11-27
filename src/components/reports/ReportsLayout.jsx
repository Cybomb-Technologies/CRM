import React from 'react';
import ReportsSidebar from './ReportsSidebar';
import ReportsHeader from './ReportsHeader';

const ReportsLayout = ({ 
  children, 
  selectedFolder, 
  onFolderSelect, 
  onSearch,
  searchTerm 
}) => {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex-shrink-0 overflow-y-auto">
        <ReportsSidebar 
          selectedFolder={selectedFolder}
          onFolderSelect={onFolderSelect}
        />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <ReportsHeader 
          onSearch={onSearch}
          selectedFolder={selectedFolder}
          searchTerm={searchTerm}
        />
        <main className="flex-1 overflow-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default ReportsLayout;