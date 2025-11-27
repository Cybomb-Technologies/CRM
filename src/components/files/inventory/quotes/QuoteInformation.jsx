import React from 'react';

const QuoteInformation = ({ formData, onInputChange }) => {
  const fields = [
    { key: 'subject', label: 'Subject *', type: 'text', required: true },
    { key: 'quoteStage', label: 'Quote Stage', type: 'select', options: ['Draft', 'Delivered', 'On Hold', 'Confirmed', 'Closed Won', 'Closed Lost'] },
    { key: 'team', label: 'Team', type: 'text' },
    { key: 'carrier', label: 'Carrier', type: 'select', options: ['FedEX', 'UPS', 'DHL', 'USPS'] },
    { key: 'dealName', label: 'Deal Name', type: 'text' },
    { key: 'validUntil', label: 'Valid Until', type: 'date' },
    { key: 'contactName', label: 'Contact Name', type: 'text' },
    { key: 'accountName', label: 'Account Name *', type: 'text', required: true }
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Quote Information</h2>
      </div>
      
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Quote Owner */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quote Owner *
          </label>
          <div className="p-3 border border-gray-300 rounded-lg bg-gray-50">
            <span className="text-gray-900 font-medium">{formData.owner}</span>
          </div>
        </div>

        {fields.map((field) => (
          <div key={field.key}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {field.label}
            </label>
            {field.type === 'select' ? (
              <select
                value={formData[field.key]}
                onChange={(e) => onInputChange(field.key, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {field.options.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            ) : field.type === 'date' ? (
              <input
                type="date"
                value={formData[field.key]}
                onChange={(e) => onInputChange(field.key, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <input
                type={field.type}
                required={field.required}
                value={formData[field.key]}
                onChange={(e) => onInputChange(field.key, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={`Enter ${field.label.toLowerCase().replace('*', '')}`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuoteInformation;