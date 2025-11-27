import React from 'react';

const TermsAndConditions = ({ value, onChange }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Terms and Conditions</h2>
      </div>
      <div className="p-6">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows="4"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter terms and conditions..."
        />
      </div>
    </div>
  );
};

export default TermsAndConditions;