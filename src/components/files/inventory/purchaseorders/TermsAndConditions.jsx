import React, { useState } from 'react';
import { Edit2, Save, X } from 'lucide-react';

const TermsAndConditions = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [terms, setTerms] = useState({
    paymentTerms: 'Net 30 days',
    deliveryTerms: 'Standard delivery within 7-10 business days',
    warranty: '1 year limited warranty',
    cancellationPolicy: 'Cancellations must be made 48 hours prior to shipment',
    additionalTerms: 'Prices are subject to change without prior notice. All taxes included.'
  });

  const [tempTerms, setTempTerms] = useState(terms);

  const handleEdit = () => {
    setTempTerms(terms);
    setIsEditing(true);
  };

  const handleSave = () => {
    setTerms(tempTerms);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempTerms(terms);
    setIsEditing(false);
  };

  const handleChange = (field, value) => {
    setTempTerms(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Terms & Conditions</h3>
        {!isEditing ? (
          <button
            onClick={handleEdit}
            className="flex items-center px-3 py-2 text-sm text-blue-600 hover:text-blue-700"
          >
            <Edit2 className="w-4 h-4 mr-1" />
            Edit
          </button>
        ) : (
          <div className="flex items-center space-x-2">
            <button
              onClick={handleSave}
              className="flex items-center px-3 py-2 text-sm text-green-600 hover:text-green-700"
            >
              <Save className="w-4 h-4 mr-1" />
              Save
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-700"
            >
              <X className="w-4 h-4 mr-1" />
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Payment Terms
          </label>
          {isEditing ? (
            <input
              type="text"
              value={tempTerms.paymentTerms}
              onChange={(e) => handleChange('paymentTerms', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          ) : (
            <p className="text-gray-600">{terms.paymentTerms}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Delivery Terms
          </label>
          {isEditing ? (
            <input
              type="text"
              value={tempTerms.deliveryTerms}
              onChange={(e) => handleChange('deliveryTerms', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          ) : (
            <p className="text-gray-600">{terms.deliveryTerms}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Warranty
          </label>
          {isEditing ? (
            <input
              type="text"
              value={tempTerms.warranty}
              onChange={(e) => handleChange('warranty', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          ) : (
            <p className="text-gray-600">{terms.warranty}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cancellation Policy
          </label>
          {isEditing ? (
            <input
              type="text"
              value={tempTerms.cancellationPolicy}
              onChange={(e) => handleChange('cancellationPolicy', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          ) : (
            <p className="text-gray-600">{terms.cancellationPolicy}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Additional Terms
          </label>
          {isEditing ? (
            <textarea
              value={tempTerms.additionalTerms}
              onChange={(e) => handleChange('additionalTerms', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          ) : (
            <p className="text-gray-600">{terms.additionalTerms}</p>
          )}
        </div>
      </div>

      {/* Standard Terms Notice */}
      <div className="mt-4 p-3 bg-blue-50 rounded-md">
        <p className="text-sm text-blue-700">
          These terms will be automatically included in all quotes. You can customize them as needed.
        </p>
      </div>
    </div>
  );
};

export default TermsAndConditions;