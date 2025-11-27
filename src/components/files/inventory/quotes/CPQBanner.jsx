import React from 'react';
import { Zap, ArrowRight } from 'lucide-react';

const CPQBanner = ({ onTryCPQ }) => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 mb-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <Zap className="w-5 h-5 text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Automate Quotes with CPQ</h3>
          </div>
          <p className="text-gray-700 mb-3">
            You can control and manage Products interplay, set conditional discounts & prices and suggest 
            Products based on a condition. <span className="text-blue-600 cursor-pointer hover:underline">Know more</span>
          </p>
          <button 
            onClick={onTryCPQ}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try CPQ now!
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center ml-6">
          <Zap className="w-8 h-8 text-blue-600" />
        </div>
      </div>
    </div>
  );
};

export default CPQBanner;