// src/pages/CreateVendor.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Camera, Trash2 } from 'lucide-react';

const CreateVendor = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    phone: '',
    website: '',
    category: '',
    vendorName: '',
    email: '',
    glAccount: 'Sales-Software',
    emailOptOut: false,
    description: '',
    address: {
      country: '',
      building: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      latitude: '',
      longitude: ''
    }
  });

  const [vendorImage, setVendorImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleInputChange = (section, field, value) => {
    if (section === 'address') {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setVendorImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setVendorImage(null);
    setImagePreview(null);
  };

  const clearAddress = () => {
    setFormData(prev => ({
      ...prev,
      address: {
        country: '',
        building: '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        latitude: '',
        longitude: ''
      }
    }));
  };

  const categories = [
    'IT Equipment',
    'Office Supplies',
    'Software',
    'Hardware',
    'Services',
    'Consulting',
    'Manufacturing',
    'Distribution'
  ];

  const glAccounts = [
    'Sales-Software',
    'Sales-Hardware',
    'Sales-Services',
    'Cost of Goods Sold',
    'Operating Expenses',
    'Administrative Expenses'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => navigate('/vendors')}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Vendors
              </button>
              <h1 className="text-2xl font-semibold text-gray-900">Create Vendor</h1>
            </div>
            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                Edit Page Layout
              </button>
              <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                Save
              </button>
              <button className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700">
                Save and New
              </button>
              <button 
                onClick={() => navigate('/vendors')}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Vendor Image */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Vendor Image</h2>
                
                <div className="flex flex-col items-center">
                  {imagePreview ? (
                    <div className="relative">
                      <img 
                        src={imagePreview} 
                        alt="Vendor preview" 
                        className="w-48 h-48 rounded-lg object-cover border border-gray-300"
                      />
                      <button
                        onClick={handleRemoveImage}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-48 h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center bg-gray-50">
                      <Camera className="w-12 h-12 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500 text-center mb-2">
                        Upload Vendor Image
                      </span>
                    </div>
                  )}
                  
                  <div className="mt-4 flex flex-col space-y-2 w-full max-w-xs">
                    <input
                      type="file"
                      id="vendor-image"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <label
                      htmlFor="vendor-image"
                      className="flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {imagePreview ? 'Change Image' : 'Upload Image'}
                    </label>
                    
                    {!imagePreview && (
                      <button className="flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                        <Camera className="w-4 h-4 mr-2" />
                        Take Photo
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* Vendor Information */}
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Vendor Information</h2>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Vendor Owner</label>
                      <div className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded border">DEVASHREE SALUNKE</div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Vendor Name *</label>
                      <input
                        type="text"
                        value={formData.vendorName}
                        onChange={(e) => handleInputChange('main', 'vendorName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter vendor name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('main', 'phone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter phone number"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('main', 'email', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter email address"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                      <input
                        type="url"
                        value={formData.website}
                        onChange={(e) => handleInputChange('main', 'website', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter website URL"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => handleInputChange('main', 'category', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">GL Account</label>
                      <select
                        value={formData.glAccount}
                        onChange={(e) => handleInputChange('main', 'glAccount', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        {glAccounts.map((account) => (
                          <option key={account} value={account}>{account}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="emailOptOut"
                        checked={formData.emailOptOut}
                        onChange={(e) => handleInputChange('main', 'emailOptOut', e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="emailOptOut" className="ml-2 text-sm font-medium text-gray-700">
                        Email Opt Out
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Address Information</h2>
                  <button
                    onClick={clearAddress}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Clear All
                  </button>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {['country', 'building', 'street', 'city', 'state', 'zipCode'].map((field) => (
                      <div key={field}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {field.split(/(?=[A-Z])/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </label>
                        <input
                          type="text"
                          value={formData.address[field]}
                          onChange={(e) => handleInputChange('address', field, e.target.value)}
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
                          value={formData.address.latitude}
                          onChange={(e) => handleInputChange('address', 'latitude', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                        <input
                          type="text"
                          value={formData.address.longitude}
                          onChange={(e) => handleInputChange('address', 'longitude', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description Information */}
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Description Information</h2>
                </div>
                <div className="p-6">
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('main', 'description', e.target.value)}
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter vendor description..."
                  />
                </div>
              </div>

              {/* Form Views */}
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Create Form Views</h2>
                </div>
                <div className="p-6">
                  <div className="flex items-center space-x-4">
                    <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                      Standard View
                    </button>
                    <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                      Create a custom form page
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateVendor;