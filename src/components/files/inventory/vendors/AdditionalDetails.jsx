import React from 'react';
import { Tag, Clock, DollarSign, FileText, CheckCircle } from 'lucide-react';

const AdditionalDetails = ({ formData, onInputChange }) => {
  const categories = [
    'Office Supplies',
    'IT Equipment',
    'Software',
    'Hardware',
    'Logistics',
    'Furniture',
    'Printing',
    'Marketing',
    'Consulting',
    'Other'
  ];

  const paymentTerms = [
    'Net 15',
    'Net 30',
    'Net 45',
    'Net 60',
    'Due on Receipt',
    '50% Advance, 50% on Delivery'
  ];

  const statuses = [
    { value: 'Active', label: 'Active', color: 'text-green-600' },
    { value: 'Inactive', label: 'Inactive', color: 'text-red-600' },
    { value: 'Pending', label: 'Pending', color: 'text-yellow-600' }
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center gap-2 mb-6">
        <FileText className="text-blue-600" size={20} />
        <h2 className="text-lg font-semibold text-gray-900">Additional Details</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <div className="relative">
            <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <select
              value={formData.category}
              onChange={(e) => onInputChange('main', 'category', e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              <option value="">Select Category</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Payment Terms
          </label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <select
              value={formData.paymentTerms}
              onChange={(e) => onInputChange('main', 'paymentTerms', e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              {paymentTerms.map((term, index) => (
                <option key={index} value={term}>{term}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Credit Limit
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="number"
              value={formData.creditLimit}
              onChange={(e) => onInputChange('main', 'creditLimit', e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter credit limit"
              min="0"
              step="100"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <div className="relative">
            <CheckCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <select
              value={formData.status}
              onChange={(e) => onInputChange('main', 'status', e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              {statuses.map((status, index) => (
                <option key={index} value={status.value}>{status.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Notes & Additional Information
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => onInputChange('main', 'notes', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          placeholder="Enter any additional notes, special instructions, or vendor preferences..."
          rows="4"
        />
        <p className="mt-2 text-sm text-gray-500">
          Add any important information about this vendor that your team should know.
        </p>
      </div>
    </div>
  );
};

export default AdditionalDetails;