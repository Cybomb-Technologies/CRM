// src/pages/Vendors.jsx
import React, { useState } from 'react';
import { Plus, Search, Filter, Download, Building, ArrowRight, Phone, Mail, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Vendors = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Mock data for vendors
  const vendors = [
    { 
      id: 1, 
      vendorNumber: 'VDR-001', 
      vendorName: 'Tech Suppliers Inc.', 
      email: 'contact@techsuppliers.com',
      phone: '+1 (555) 123-4567',
      category: 'IT Equipment',
      status: 'Active',
      address: '123 Tech Street, San Francisco, CA 94105',
      contactPerson: 'John Smith',
      website: 'www.techsuppliers.com',
      rating: 4.5
    },
    { 
      id: 2, 
      vendorNumber: 'VDR-002', 
      vendorName: 'Office Furniture World', 
      email: 'sales@furnitureworld.com',
      phone: '+1 (555) 234-5678',
      category: 'Office Supplies',
      status: 'Active',
      address: '456 Office Ave, New York, NY 10001',
      contactPerson: 'Maria Garcia',
      website: 'www.furnitureworld.com',
      rating: 4.2
    },
    { 
      id: 3, 
      vendorNumber: 'VDR-003', 
      vendorName: 'Software Solutions Ltd.', 
      email: 'info@softwaresolutions.com',
      phone: '+1 (555) 345-6789',
      category: 'Software',
      status: 'Inactive',
      address: '789 Software Blvd, Austin, TX 73301',
      contactPerson: 'David Brown',
      website: 'www.softwaresolutions.com',
      rating: 4.7
    },
    { 
      id: 4, 
      vendorNumber: 'VDR-004', 
      vendorName: 'Networking Pros', 
      email: 'support@networkingpros.com',
      phone: '+1 (555) 456-7890',
      category: 'Networking',
      status: 'Active',
      address: '321 Network Lane, Seattle, WA 98101',
      contactPerson: 'Lisa Chen',
      website: 'www.networkingpros.com',
      rating: 4.3
    },
    { 
      id: 5, 
      vendorNumber: 'VDR-005', 
      vendorName: 'Cloud Services Co.', 
      email: 'hello@cloudservices.com',
      phone: '+1 (555) 567-8901',
      category: 'Cloud Services',
      status: 'Pending',
      address: '654 Cloud Drive, Denver, CO 80202',
      contactPerson: 'Robert Wilson',
      website: 'www.cloudservices.com',
      rating: 4.0
    },
  ];

  const statusColors = {
    'Active': 'bg-green-100 text-green-800',
    'Inactive': 'bg-gray-100 text-gray-800',
    'Pending': 'bg-yellow-100 text-yellow-800',
    'Suspended': 'bg-red-100 text-red-800'
  };

  const categoryColors = {
    'IT Equipment': 'bg-blue-100 text-blue-800',
    'Office Supplies': 'bg-purple-100 text-purple-800',
    'Software': 'bg-indigo-100 text-indigo-800',
    'Networking': 'bg-cyan-100 text-cyan-800',
    'Cloud Services': 'bg-orange-100 text-orange-800'
  };

  const handleCreateVendor = () => {
    navigate('/create-vendor');
  };

  const handleViewVendor = (vendorId) => {
    navigate(`/vendors/${vendorId}`);
  };

  const handleEditVendor = (vendorId) => {
    navigate(`/edit-vendor/${vendorId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-2xl font-semibold text-gray-900">Vendors</h1>
              <p className="text-gray-600 mt-1 max-w-3xl">
                Manage your vendor relationships, track performance, and maintain supplier information in one place.
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={handleCreateVendor}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Vendor
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Information Banner */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-lg p-6 mb-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <Building className="w-5 h-5 text-gray-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Vendor Management</h3>
                </div>
                <p className="text-gray-700 mb-3">
                  Centralize all your vendor information, track performance metrics, and manage supplier relationships efficiently.
                </p>
                <button className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors">
                  Learn more about Vendor Management
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center ml-6">
                <Building className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Vendors</p>
                  <p className="text-2xl font-semibold text-gray-900">{vendors.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Building className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Vendors</p>
                  <p className="text-2xl font-semibold text-green-600">
                    {vendors.filter(v => v.status === 'Active').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg. Rating</p>
                  <p className="text-2xl font-semibold text-yellow-600">
                    {(vendors.reduce((acc, vendor) => acc + vendor.rating, 0) / vendors.length).toFixed(1)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <span className="text-yellow-600 font-semibold">★</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Categories</p>
                  <p className="text-2xl font-semibold text-purple-600">
                    {new Set(vendors.map(v => v.category)).size}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-semibold">📊</span>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 flex-1">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search vendors by name, email, or contact..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                {/* Filter Button */}
                <button className="flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </button>

                {/* Status Filter */}
                <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                </select>

                {/* Category Filter */}
                <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="">All Categories</option>
                  <option value="it">IT Equipment</option>
                  <option value="office">Office Supplies</option>
                  <option value="software">Software</option>
                  <option value="networking">Networking</option>
                  <option value="cloud">Cloud Services</option>
                </select>
              </div>
              
              {/* Export Button */}
              <button className="flex items-center px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
            </div>
          </div>

          {/* Vendors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vendors.map((vendor) => (
              <div key={vendor.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{vendor.vendorName}</h3>
                      <p className="text-sm text-gray-500">{vendor.vendorNumber}</p>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[vendor.status]}`}>
                        {vendor.status}
                      </span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${categoryColors[vendor.category]}`}>
                        {vendor.category}
                      </span>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="w-4 h-4 mr-2" />
                      {vendor.email}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="w-4 h-4 mr-2" />
                      {vendor.phone}
                    </div>
                    <div className="flex items-start text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="truncate">{vendor.address}</span>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between items-center text-sm text-gray-600">
                      <div>
                        <p className="font-medium">Contact Person</p>
                        <p>{vendor.contactPerson}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">Rating</p>
                        <div className="flex items-center">
                          <span className="text-yellow-500">★</span>
                          <span className="ml-1">{vendor.rating}</span>
                        </div>
                      </div>
                    </div>
                    {vendor.website && (
                      <div className="mt-2">
                        <a 
                          href={`https://${vendor.website}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-700"
                        >
                          {vendor.website}
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <div className="flex space-x-3">
                      <button 
                        onClick={() => handleViewVendor(vendor.id)}
                        className="flex-1 px-3 py-2 text-sm text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                      >
                        View
                      </button>
                      <button 
                        onClick={() => handleEditVendor(vendor.id)}
                        className="flex-1 px-3 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {vendors.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Vendors Found</h3>
              <p className="text-gray-600 mb-6">Get started by adding your first vendor.</p>
              <button 
                onClick={handleCreateVendor}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Vendor
              </button>
            </div>
          )}

          {/* Pagination */}
          <div className="bg-white px-6 py-4 border border-gray-200 rounded-lg mt-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">{vendors.length}</span> of{' '}
                <span className="font-medium">{vendors.length}</span> results
              </div>
              <div className="flex items-center space-x-2">
                <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                  Previous
                </button>
                <button className="px-3 py-1 border border-gray-300 rounded text-sm bg-blue-600 text-white">
                  1
                </button>
                <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                  2
                </button>
                <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Vendors;