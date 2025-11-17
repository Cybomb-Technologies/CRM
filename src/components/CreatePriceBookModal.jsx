// src/pages/CreatePriceBook.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CreatePriceBook = () => {
  const [formData, setFormData] = useState({
    owner: '',
    priceBookName: '',
    pricingModel: 'None',
    description: '',
    active: true
  });
  const navigate = useNavigate();

  // Simulate getting current user from authentication context or localStorage
  useEffect(() => {
    // In a real app, you would get this from your auth context or API
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {
      name: 'John Doe',
      email: 'john.doe@company.com',
      role: 'Sales Manager'
    };
    
    setFormData(prev => ({
      ...prev,
      owner: currentUser.name
    }));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission logic here
    // After successful submission, navigate back to price books page
    navigate('/price-books');
  };

  const handleCancel = () => {
    navigate('/price-books');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-semibold text-gray-900">Create Price Book</h1>
            <button 
              type="button"
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Edit Page Layout
            </button>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-500">EMC</span>
            <span className="text-sm text-gray-500">1.3.36</span>
            <span className="text-sm text-gray-500">IN</span>
            <span className="text-sm text-gray-500">17-11-2025</span>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Price Book Information Section */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Price Book Information</h2>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Price Book Owner */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price Book Owner *
                    </label>
                    <div className="p-3 border border-gray-300 rounded-lg bg-gray-50">
                      <span className="text-gray-900 font-medium">{formData.owner}</span>
                      <p className="text-sm text-gray-500 mt-1">Automatically assigned to you</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 pt-2">
                    <div className="flex items-center h-5">
                      <input
                        type="checkbox"
                        id="active"
                        checked={formData.active}
                        onChange={(e) => setFormData({...formData, active: e.target.checked})}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label htmlFor="active" className="text-sm font-medium text-gray-700">
                        Active
                      </label>
                      <p className="text-sm text-gray-500">Make this price book available for use</p>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <hr className="border-gray-200" />

                {/* Price Book Name and Pricing Model */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price Book Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.priceBookName}
                      onChange={(e) => setFormData({...formData, priceBookName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="e.g., Standard Pricing, Enterprise Pricing"
                    />
                    <p className="text-sm text-gray-500 mt-1">Give your price book a descriptive name</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pricing Model
                    </label>
                    <select
                      value={formData.pricingModel}
                      onChange={(e) => setFormData({...formData, pricingModel: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                      <option value="None">None</option>
                      <option value="Tiered">Tiered Pricing</option>
                      <option value="Volume">Volume Based</option>
                      <option value="Contract">Contract Pricing</option>
                      <option value="Seasonal">Seasonal Pricing</option>
                      <option value="Promotional">Promotional Pricing</option>
                    </select>
                    <p className="text-sm text-gray-500 mt-1">Select the pricing strategy for this book</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description Information Section */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Description Information</h2>
              </div>
              
              <div className="p-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Describe the purpose and usage of this price book..."
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Provide details about when and how this price book should be used
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Settings Section */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Additional Settings</h2>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Currency
                    </label>
                    <p className="text-sm text-gray-500">Default currency for all prices in this book</p>
                  </div>
                  <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                    <option value="INR">INR - Indian Rupee</option>
                  </select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Effective Date
                    </label>
                    <p className="text-sm text-gray-500">When this price book becomes active</p>
                  </div>
                  <input
                    type="date"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-3 pt-6">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
              >
                Create Price Book
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePriceBook;