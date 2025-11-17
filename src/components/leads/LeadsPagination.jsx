import React from 'react';

const LeadsPagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="bg-white px-6 py-3 border-t border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-sm text-gray-700">
          <span>Showing 1 to 10 of {10} entries</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button 
            className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={currentPage === 1}
          >
            Previous
          </button>
          
          <button 
            className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeadsPagination;