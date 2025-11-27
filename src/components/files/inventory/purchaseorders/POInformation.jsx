import React from 'react';

const POInformation = ({ formData, onInputChange }) => {
  const leftFields = [
    { key: 'subject', label: 'Subject', type: 'text' },
    { key: 'requisitionNumber', label: 'Requisition Number', type: 'text' },
    { key: 'contactName', label: 'Contact Name', type: 'text' },
    { key: 'dueDate', label: 'Due Date', type: 'date' },
    { key: 'exciseDuty', label: 'Excise Duty', type: 'currency' }
  ];

  const rightFields = [
    { key: 'status', label: 'Status', type: 'select', options: ['Created', 'Ordered', 'In Transit', 'Received', 'Cancelled'] },
    { key: 'poNumber', label: 'PO Number', type: 'text' },
    { key: 'vendorName', label: 'Vendor Name', type: 'text' },
    { key: 'trackingNumber', label: 'Tracking Number', type: 'text' },
    { key: 'poDate', label: 'PO Date', type: 'text', placeholder: 'DD/MM/YYYY' },
    { key: 'carrier', label: 'Carrier', type: 'select', options: ['FedEX', 'UPS', 'DHL', 'USPS', 'Blue Dart'] },
    { key: 'salesCommission', label: 'Sales Commission', type: 'currency' }
  ];

  const renderField = (field) => {
    switch (field.type) {
      case 'select':
        return (
          <select
            value={formData[field.key]}
            onChange={(e) => onInputChange('main', field.key, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {field.options.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );
      
      case 'currency':
        return (
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">Rs.</span>
            <input
              type="number"
              value={formData[field.key]}
              onChange={(e) => onInputChange('main', field.key, e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        );
      
      case 'date':
        return (
          <input
            type="date"
            value={formData[field.key]}
            onChange={(e) => onInputChange('main', field.key, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        );
      
      default:
        return (
          <input
            type="text"
            value={formData[field.key]}
            onChange={(e) => onInputChange('main', field.key, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder={field.placeholder}
          />
        );
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Purchase Order Information</h2>
      </div>
      <div className="p-6 grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Order Owner</label>
            <div className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded border">DEVASHREE SALUNKE</div>
          </div>
          {leftFields.map(field => (
            <div key={field.key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
              {renderField(field)}
            </div>
          ))}
        </div>
        
        <div className="space-y-4">
          {rightFields.map(field => (
            <div key={field.key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
              {renderField(field)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default POInformation;