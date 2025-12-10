import React, { useState } from 'react';
import MyReportsHeader from './MyReportsHeader';
import MyReportsEmptyState from './MyReportsEmptyState';

const MyReportsContent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [reports, setReports] = useState([]); // Empty array for "No Reports found"

  const handleSearch = (term) => {
    setSearchTerm(term);
    console.log('Searching for:', term);
    // Add search logic here
  };

  const handleCreateReport = () => {
    console.log('Create report clicked');
    // Add create report logic here
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <MyReportsHeader 
        searchTerm={searchTerm}
        onSearch={handleSearch}
        onCreateReport={handleCreateReport}
      />

      <div className="p-6">
        <MyReportsEmptyState />
      </div>
    </div>
  );
};

export default MyReportsContent;