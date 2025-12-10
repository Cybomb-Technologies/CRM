import React from 'react';

const MyReportsEmptyState = () => {
  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Table Header - Even when empty */}
      <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
        <div className="grid grid-cols-12 gap-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          <div className="col-span-4">Report Name</div>
          <div className="col-span-4">Description</div>
          <div className="col-span-2">Folder</div>
          <div className="col-span-2">Last Accessed Date</div>
        </div>
      </div>

      {/* Empty State Message */}
      <div className="px-6 py-16 text-center">
        <div className="mx-auto w-16 h-16 text-gray-400">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="mt-4 text-lg font-medium text-gray-900">No Reports found</h3>
        <p className="mt-2 text-sm text-gray-500">
          You haven't created any reports yet. Create your first report to get started.
        </p>
        <div className="mt-6">
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyReportsEmptyState;