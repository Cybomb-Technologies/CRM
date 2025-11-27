import React from 'react';
import { Copy } from 'lucide-react';

const AddressInformation = ({ 
  formData, 
  onInputChange, 
  onCopyBillingToShipping, 
  onClearAddress 
}) => {
  const addressFields = [
    { key: 'Country', type: 'select', options: ['', 'US', 'IN', 'UK'] },
    { key: 'Building', type: 'text' },
    { key: 'Street', type: 'text' },
    { key: 'City', type: 'text' },
    { key: 'State', type: 'select', options: ['', 'CA', 'NY'] },
    { key: 'Zip', type: 'text' },
    { key: 'Latitude', type: 'text' },
    { key: 'Longitude', type: 'text' }
  ];

  const AddressSection = ({ type, title }) => (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-md font-semibold text-gray-900">{title}</h3>
        <button
          type="button"
          onClick={() => onClearAddress(type)}
          className="text-sm text-red-600 hover:text-red-800 font-medium"
        >
          Clear All
        </button>
      </div>
      <div className="space-y-4">
        {addressFields.map((field) => {
          const formKey = `${type}${field.key}`;
          return (
            <div key={formKey}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {field.key === 'Country' ? 'Country / Region' : 
                 field.key === 'Building' ? 'Flat / House No. / Building / Apartment Name' :
                 field.key === 'Street' ? 'Street Address' :
                 field.key === 'State' ? 'State / Province' :
                 field.key === 'Zip' ? 'Zip / Postal Code' : field.key}
              </label>
              {field.type === 'select' ? (
                <select
                  value={formData[formKey]}
                  onChange={(e) => onInputChange(formKey, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {field.options.map(option => (
                    <option key={option} value={option}>
                      {option === '' ? '-None-' : 
                       option === 'US' ? 'United States' :
                       option === 'IN' ? 'India' :
                       option === 'UK' ? 'United Kingdom' :
                       option === 'CA' ? 'California' :
                       option === 'NY' ? 'New York' : option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={formData[formKey]}
                  onChange={(e) => onInputChange(formKey, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Address Information</h2>
          <button
            type="button"
            onClick={onCopyBillingToShipping}
            className="flex items-center px-3 py-1 text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            <Copy className="w-4 h-4 mr-1" />
            Copy Billing to Shipping
          </button>
        </div>
      </div>
      
      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <AddressSection type="billing" title="Billing Address" />
        <AddressSection type="shipping" title="Shipping Address" />
      </div>
    </div>
  );
};

export default AddressInformation;