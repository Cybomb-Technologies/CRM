import React, { useState } from 'react';

const LeadsFilterPanel = () => {
  const [expandedSections, setExpandedSections] = useState({
    systemFilters: true,
    fieldFilters: true
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Filter Leads by</h3>
      
      {/* Search */}
      <div className="mb-6">
        <input 
          type="text" 
          placeholder="Search" 
          className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* System Defined Filters */}
      <div className="mb-6">
        <button 
          onClick={() => toggleSection('systemFilters')}
          className="flex items-center justify-between w-full text-left text-sm font-semibold text-gray-700 mb-2"
        >
          <span>System Defined Filters</span>
          <svg 
            className={`h-4 w-4 transform transition-transform ${expandedSections.systemFilters ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {expandedSections.systemFilters && (
          <div className="ml-2 space-y-1">
            {['Touched Records', 'Untouched Records', 'Record Action', 'Related Records Action', 'Locked', 'Latest Email Status', 'Activities', 'Campaigns', 'Cadences'].map((filter) => (
              <label key={filter} className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800 cursor-pointer">
                <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span>{filter}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Filter by Fields */}
      <div>
        <button 
          onClick={() => toggleSection('fieldFilters')}
          className="flex items-center justify-between w-full text-left text-sm font-semibold text-gray-700 mb-2"
        >
          <span>Filter by Fields</span>
          <svg 
            className={`h-4 w-4 transform transition-transform ${expandedSections.fieldFilters ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {expandedSections.fieldFilters && (
          <div className="ml-2 space-y-1">
            {/* Address Section */}
            <div className="ml-2">
              <label className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800 cursor-pointer">
                <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span className="font-medium">Address</span>
              </label>
              
              <div className="ml-4 mt-1 space-y-1">
                {[
                  'Address: City',
                  'Address: Country / Region', 
                  'Address: Flat / House No. / Building / Apartment Name',
                  'Address: State / Province',
                  'Address: Street',
                  'Address: ZIP / Postal Code',
                  'Annual Revenue',
                  'Assistant',
                  'Assistant Phone',
                  'Blog',
                  'Call Status',
                  'Campaign Source',
                  'City',
                  'Company',
                  'Contact Name',
                  'Contact Owner',
                  'Country',
                  'Created By',
                  'Created Time',
                  'Currency',
                  'Date of Birth',
                  'Department',
                  'Description',
                  'Designation',
                  'Email',
                  'Email Opt Out',
                  'Fax',
                  'First Name',
                  'First Visited URL',
                  'Full Name',
                  'Google Plus',
                  'Home Phone',
                  'Industry',
                  'Last Activity Time',
                  'Last Name',
                  'Last Visited Time',
                  'Lead Conversion Time',
                  'Lead Name',
                  'Lead Owner',
                  'Lead Source',
                  'Lead Status',
                  'LinkedIn',
                  'Mobile',
                  'Modified By',
                  'Modified Time',
                  'No of Employees',
                  'Other Phone',
                  'Phone',
                  'Phone (Legacy)',
                  'Pinterest',
                  'Primary',
                  'Rating',
                  'Salutation',
                  'Secondary Email',
                  'Skype ID',
                  'State',
                  'Street',
                  'Twitter',
                  'Website',
                  'WeChat',
                  'WhatsApp',
                  'Yahoo Messenger',
                  'Zip Code'
                ].map((field) => (
                  <label key={field} className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800 cursor-pointer">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span>{field}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadsFilterPanel;