import React from 'react';

const MyReportsHeader = ({ searchTerm, onSearch, onCreateReport }) => {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Reports</h1>
          </div>

          {/* Right side */}
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
                className="block w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Q Search My Reports"
                value={searchTerm}
                onChange={(e) => onSearch(e.target.value)}
              />
            </div>

            {/* Zoho Analytics Badge */}
            <div className="flex items-center bg-blue-50 border border-blue-100 rounded-lg px-4 py-2">
              <span className="text-blue-700 text-sm font-medium">
                Advanced Analytics for CRM powered by CRM Analytics
              </span>
            </div>

            {/* Create Report Button */}
            <button
              onClick={onCreateReport}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyReportsHeader;