import React from 'react';
import { ArrowLeft, Building } from 'lucide-react';

const VendorHeader = ({ 
  onBack, 
  onSave, 
  onSaveAndNew, 
  onCancel,
  title = "Vendor"
}) => {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building className="text-blue-600" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                <p className="text-sm text-gray-600">Manage vendor information and details</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={onCancel}
              className="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Save Vendor
            </button>
            <button
              onClick={onSaveAndNew}
              className="px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
            >
              Save & New
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorHeader;