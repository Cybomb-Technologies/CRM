// src/components/reports/ReportViewer.jsx
import React from 'react';

const ReportViewer = ({ 
  report, 
  filters, 
  showFilterPanel,
  onBack, 
  onFilterChange, 
  onClearFilters,
  onToggleFilterPanel,
  onAddField,
  onRemoveField,
  onApplyFilter,
  onToggleDetails
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={onBack}
              className="mr-4 p-1 hover:bg-gray-100 rounded"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{report?.name}</h1>
              <div className="flex items-center space-x-4 mt-1">
                <span className="text-sm text-gray-600">{report?.lastUpdated}</span>
                <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                  Edit
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button 
              onClick={onToggleFilterPanel}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              Filter
            </button>
            
            <button 
              onClick={onToggleDetails}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
            >
              Show Details
            </button>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-gray-700 font-medium">Filter By Date</span>
            
            <select
              value={filters.dateRange}
              onChange={(e) => onFilterChange('dateRange', e.target.value)}
              className="border border-gray-300 rounded px-3 py-1.5 text-sm"
            >
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="last7days">Last 7 days</option>
              <option value="last30days">Last 30 days</option>
              <option value="last6months">Current and Previous 6 months</option>
              <option value="custom">Custom</option>
            </select>

            <input
              type="text"
              value={filters.dateValue}
              onChange={(e) => onFilterChange('dateValue', e.target.value)}
              className="border border-gray-300 rounded px-3 py-1.5 text-sm w-48"
              placeholder="Date value"
            />

            <button
              onClick={onClearFilters}
              className="px-3 py-1.5 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 text-sm"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Filter Panel (Expandable) */}
      {showFilterPanel && (
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="mb-4">
            <h3 className="font-medium text-gray-900 mb-3">Filter By</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Date Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <div className="space-y-2">
                  <select
                    value={filters.dateRange}
                    onChange={(e) => onFilterChange('dateRange', e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  >
                    <option value="last6months">Current and Previous 6 months</option>
                    <option value="last12months">Last 12 months</option>
                    <option value="thisQuarter">This Quarter</option>
                    <option value="lastQuarter">Last Quarter</option>
                    <option value="thisYear">This Year</option>
                  </select>
                  <input
                    type="text"
                    value={filters.dateValue}
                    readOnly
                    className="w-full border border-gray-300 bg-gray-50 rounded px-3 py-2 text-sm"
                  />
                </div>
              </div>

              {/* Fields Section */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">Fields</label>
                  <button
                    onClick={onAddField}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    + Add Field
                  </button>
                </div>
                <div className="space-y-2">
                  {filters.fields.map((field, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <select className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm">
                        <option>Select field...</option>
                        <option>Template Name</option>
                        <option>Category</option>
                        <option>Status</option>
                        <option>Owner</option>
                      </select>
                      <button
                        onClick={() => onRemoveField(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  {filters.fields.length === 0 && (
                    <p className="text-sm text-gray-500 italic">No fields added</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={onClearFilters}
              className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 text-sm font-medium"
            >
              Clear Filter
            </button>
            <button
              onClick={onApplyFilter}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium"
            >
              Apply Filter
            </button>
          </div>
        </div>
      )}

      {/* Report Table */}
      <div className="p-6">
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* Table Header */}
          <div className="bg-gray-50 border-b border-gray-200">
            <div className="flex">
              {report?.columns.map((column, index) => (
                <div 
                  key={index} 
                  className={`px-4 py-3 text-xs font-medium text-gray-700 uppercase tracking-wider ${
                    index === 0 ? 'w-48' : 'flex-1'
                  }`}
                >
                  {column}
                </div>
              ))}
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-200">
            {report?.data.map((row) => (
              <div key={row.id} className="flex hover:bg-gray-50">
                <div className="px-4 py-3 w-48">
                  <div className="text-sm font-medium text-gray-900">{row.templateName}</div>
                </div>
                <div className="flex-1 px-4 py-3">
                  <div className="text-sm text-gray-900">{row.sent.toLocaleString()}</div>
                </div>
                <div className="flex-1 px-4 py-3">
                  <div className="text-sm text-gray-900">{row.bounced.toLocaleString()}</div>
                </div>
                <div className="flex-1 px-4 py-3">
                  <div className="text-sm text-gray-900">{row.tracked.toLocaleString()}</div>
                </div>
                <div className="flex-1 px-4 py-3">
                  <div className="text-sm text-gray-900">{row.bouncedAmongTracked.toLocaleString()}</div>
                </div>
                <div className="flex-1 px-4 py-3">
                  <div className="text-sm text-gray-900">{row.opened.toLocaleString()}</div>
                </div>
                <div className="flex-1 px-4 py-3">
                  <div className="text-sm text-gray-900">{row.clicked.toLocaleString()}</div>
                </div>
                <div className="flex-1 px-4 py-3">
                  <div className="text-sm text-gray-900">{row.replied.toLocaleString()}</div>
                </div>
                <div className="flex-1 px-4 py-3">
                  <div className="text-sm text-gray-900">{row.received.toLocaleString()}</div>
                </div>
                <div className="flex-1 px-4 py-3">
                  <div className="text-sm text-gray-900">{row.sent2.toLocaleString()}</div>
                </div>
                <div className="flex-1 px-4 py-3">
                  <div className="text-sm text-gray-900">{row.bounced2.toLocaleString()}</div>
                </div>
                <div className="flex-1 px-4 py-3">
                  <div className="text-sm text-gray-900">{row.tracked2.toLocaleString()}</div>
                </div>
                <div className="flex-1 px-4 py-3">
                  <div className="text-sm text-gray-900">{row.bouncedAmongTracked2.toLocaleString()}</div>
                </div>
                <div className="flex-1 px-4 py-3">
                  <div className="text-sm text-gray-900">{row.opened2.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Stats */}
        {filters.showDetails && (
          <div className="mt-6 bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-medium text-gray-900 mb-4">Report Details</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-sm text-blue-600">Total Sent</div>
                <div className="text-2xl font-bold text-gray-900">
                  {report?.data.reduce((sum, row) => sum + row.sent, 0).toLocaleString()}
                </div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-sm text-green-600">Total Opened</div>
                <div className="text-2xl font-bold text-gray-900">
                  {report?.data.reduce((sum, row) => sum + row.opened, 0).toLocaleString()}
                </div>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg">
                <div className="text-sm text-yellow-600">Total Clicked</div>
                <div className="text-2xl font-bold text-gray-900">
                  {report?.data.reduce((sum, row) => sum + row.clicked, 0).toLocaleString()}
                </div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="text-sm text-purple-600">Total Replied</div>
                <div className="text-2xl font-bold text-gray-900">
                  {report?.data.reduce((sum, row) => sum + row.replied, 0).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportViewer;