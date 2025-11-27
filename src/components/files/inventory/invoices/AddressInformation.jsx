import React from 'react';
import { Copy } from 'lucide-react';

const AddressInformation = ({ 
  formData, 
  onInputChange, 
  onCopyBillingToShipping, 
  onClearAddress 
}) => {
  const addressFields = ['country', 'building', 'street', 'city', 'state', 'zipCode'];

  const AddressSection = ({ type, title }) => (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-md font-semibold text-gray-900">{title}</h3>
        <button
          onClick={() => onClearAddress(type)}
          className="text-sm text-red-600 hover:text-red-700"
        >
          Clear All
        </button>
      </div>
      <div className="space-y-4">
        {addressFields.map((field) => (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.split(/(?=[A-Z])/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </label>
            <input
              type="text"
              value={formData[type][field]}
              onChange={(e) => onInputChange(type, field, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder={field === 'country' || field === 'state' ? '-None-' : ''}
            />
          </div>
        ))}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
            <input
              type="text"
              value={formData[type].latitude}
              onChange={(e) => onInputChange(type, 'latitude', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
            <input
              type="text"
              value={formData[type].longitude}
              onChange={(e) => onInputChange(type, 'longitude', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Address Information</h2>
        <button
          onClick={onCopyBillingToShipping}
          className="flex items-center px-3 py-2 text-sm text-blue-600 hover:text-blue-700"
        >
          <Copy className="w-4 h-4 mr-1" />
          Copy Address
        </button>
      </div>
      <div className="p-6 grid grid-cols-2 gap-6">
        <AddressSection type="billingAddress" title="Billing Address" />
        <AddressSection type="shippingAddress" title="Shipping Address" />
      </div>
    </div>
  );
};

export default AddressInformation;