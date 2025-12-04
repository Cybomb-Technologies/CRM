import React from 'react';
import { MapPin, Copy, Trash2 } from 'lucide-react';

const AddressInformation = ({ 
  formData, 
  onInputChange,
  onCopyBillingToShipping,
  onClearAddress 
}) => {
  const addressFields = [
    { id: 'street', label: 'Street Address', placeholder: 'Enter street address' },
    { id: 'city', label: 'City', placeholder: 'Enter city' },
    { id: 'state', label: 'State/Province', placeholder: 'Enter state or province' },
    { id: 'zipCode', label: 'ZIP/Postal Code', placeholder: 'Enter ZIP or postal code' },
    { id: 'country', label: 'Country', placeholder: 'Enter country' },
  ];

  const renderAddressSection = (type, title, description) => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
        {type === 'shipping' && (
          <button
            type="button"
            onClick={onCopyBillingToShipping}
            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            <Copy size={16} />
            Copy from Billing
          </button>
        )}
        <button
          type="button"
          onClick={() => onClearAddress(type)}
          className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 font-medium"
        >
          <Trash2 size={16} />
          Clear
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addressFields.map((field) => (
          <div key={field.id}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label}
            </label>
            <input
              type="text"
              value={formData[`${type}Address`][field.id]}
              onChange={(e) => onInputChange(type, field.id, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={field.placeholder}
            />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center gap-2 mb-6">
        <MapPin className="text-blue-600" size={20} />
        <h2 className="text-lg font-semibold text-gray-900">Address Information</h2>
      </div>
      
      <div className="space-y-8">
        {/* Billing Address */}
        <div className="border-b pb-6">
          {renderAddressSection(
            'billing',
            'Billing Address',
            'Primary address for invoicing and correspondence'
          )}
        </div>
        
        {/* Shipping Address */}
        <div>
          {renderAddressSection(
            'shipping',
            'Shipping Address',
            'Address for product deliveries and shipments'
          )}
        </div>
      </div>
    </div>
  );
};

export default AddressInformation;