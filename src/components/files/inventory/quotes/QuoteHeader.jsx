import React from 'react';
import { ArrowLeft, Save, Send } from 'lucide-react';

const QuoteHeader = () => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create Quote</h1>
            <p className="text-gray-600">Create a new quote for your customer</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
            <Save className="w-4 h-4 mr-2" />
            Save Draft
          </button>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
            <Send className="w-4 h-4 mr-2" />
            Send Quote
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuoteHeader;