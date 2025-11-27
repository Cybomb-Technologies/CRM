import React from 'react';

const POHeader = ({ onBack, onSave, onSaveAndNew, onCancel }) => {
  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <button
              onClick={onBack}
              className="mr-4 p-2 text-gray-500 hover:text-gray-700"
            >
              ← Back
            </button>
            <h1 className="text-2xl font-bold text-gray-900">
              Create Purchase Order
            </h1>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={onSaveAndNew}
              className="px-4 py-2 border border-blue-300 rounded-md text-blue-700 hover:bg-blue-50"
            >
              Save & New
            </button>
            <button
              onClick={onSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Save Purchase Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default POHeader;