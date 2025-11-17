import React from 'react';

const FilterSection = () => {
  const mainFilters = [
    'Search',
    'System Defined Filters',
    'Touched Records', 
    'Untouched Records',
    'Record Action',
    'Related Records Action',
    'Locked'
  ];

  const addressFilters = [
    'Address - Country / Region',
    'Address - Flat / House No. /',
    'Address - Range / Number',
    'Address - State / Province'
  ];

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Filter Leads by</h3>
        <div className="flex flex-wrap gap-2">
          {mainFilters.map((filter, index) => (
            <button
              key={index}
              className="px-3 py-2 text-xs text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              {filter}
            </button>
          ))}
        </div>
      </div>
      
      <div className="border-t border-gray-200 pt-4">
        <div className="flex flex-wrap gap-2">
          {addressFilters.map((filter, index) => (
            <button
              key={index}
              className="px-3 py-2 text-xs text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              {filter}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterSection;