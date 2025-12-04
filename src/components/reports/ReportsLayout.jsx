// src/components/reports/ReportsLayout.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ReportsLayout = ({ children, folder }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCreateReport = () => {
    console.log('Create new report');
  };

  return (
    <div className="h-screen bg-gray-50">
      {/* Header with Create Report button and Search */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
            <p className="text-gray-600 mt-1">Manage and view your reports</p>
          </div>
          
          {/* Right side with Search and Create Report button */}
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search reports..."
                value={searchTerm}
                onChange={handleSearch}
                className="block w-80 pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            
            {/* Create Report Button */}
            <button 
              onClick={handleCreateReport}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Report
            </button>
          </div>
        </div>
      </div>

      {/* Reports Content Area */}
      <div className="p-6">
        {React.Children.map(children, child => {
          return React.cloneElement(child, { 
            searchTerm, 
            onSearch: setSearchTerm 
          });
        })}
      </div>
    </div>
  );
};

export default ReportsLayout;