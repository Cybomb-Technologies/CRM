import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Building, User, Mail, Phone, Globe, FileText, MapPin, Tag, Clock, DollarSign, CheckCircle, Calendar, CreditCard } from 'lucide-react';

const ViewVendorContent = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data - in real app, fetch from API using id
  const vendor = {
    id: id || 'VDR-001',
    name: 'Acme Supplies Inc',
    contactPerson: 'John Smith',
    email: 'john@acmesupplies.com',
    phone: '(555) 123-4567',
    website: 'https://acmesupplies.com',
    taxId: 'TAX-123456789',
    billingAddress: {
      street: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'United States'
    },
    shippingAddress: {
      street: '456 Warehouse Ave',
      city: 'New York',
      state: 'NY',
      zipCode: '10002',
      country: 'United States'
    },
    bankName: 'First National Bank',
    accountNumber: '****1234',
    routingNumber: '123000789',
    accountType: 'Business Checking',
    category: 'Office Supplies',
    paymentTerms: 'Net 30',
    creditLimit: '$50,000',
    notes: 'Preferred vendor for office supplies. Always on time with deliveries. Excellent customer service.',
    status: 'Active',
    totalSpent: '$45,200',
    lastOrder: '2024-01-15',
    dateAdded: '2023-06-10',
    totalOrders: 24,
    avgOrderValue: '$1,883'
  };

  const handleBack = () => {
    navigate('/vendors');
  };

  const handleEdit = () => {
    navigate(`/vendors/edit/${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} className="text-gray-600" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Building className="text-blue-600" size={28} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{vendor.name}</h1>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-sm text-gray-600">ID: {vendor.id}</span>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${vendor.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {vendor.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={handleEdit}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                Edit Vendor
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Spending</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{vendor.totalSpent}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center">
                <DollarSign className="text-white" size={24} />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{vendor.totalOrders}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center">
                <Building className="text-white" size={24} />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Average Order Value</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{vendor.avgOrderValue}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                <CheckCircle className="text-white" size={24} />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Last Order</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{vendor.lastOrder}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center">
                <Calendar className="text-white" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-2 mb-6">
                <User className="text-blue-600" size={20} />
                <h2 className="text-lg font-semibold text-gray-900">Contact Information</h2>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Vendor Name</label>
                    <p className="text-gray-900 font-medium">{vendor.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Contact Person</label>
                    <p className="text-gray-900 font-medium">{vendor.contactPerson}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Email Address</label>
                    <div className="flex items-center gap-2">
                      <Mail size={16} className="text-gray-400" />
                      <a href={`mailto:${vendor.email}`} className="text-blue-600 hover:underline">
                        {vendor.email}
                      </a>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Phone Number</label>
                    <div className="flex items-center gap-2">
                      <Phone size={16} className="text-gray-400" />
                      <a href={`tel:${vendor.phone.replace(/[^\d+]/g, '')}`} className="text-gray-900">
                        {vendor.phone}
                      </a>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Website</label>
                    <div className="flex items-center gap-2">
                      <Globe size={16} className="text-gray-400" />
                      <a 
                        href={vendor.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {vendor.website.replace('https://', '')}
                      </a>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Tax ID</label>
                    <div className="flex items-center gap-2">
                      <FileText size={16} className="text-gray-400" />
                      <span className="text-gray-900">{vendor.taxId}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-2 mb-6">
                <MapPin className="text-blue-600" size={20} />
                <h2 className="text-lg font-semibold text-gray-900">Address Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-4">Billing Address</h3>
                  <div className="space-y-2">
                    <p className="text-gray-700">{vendor.billingAddress.street}</p>
                    <p className="text-gray-700">
                      {vendor.billingAddress.city}, {vendor.billingAddress.state} {vendor.billingAddress.zipCode}
                    </p>
                    <p className="text-gray-700">{vendor.billingAddress.country}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900 mb-4">Shipping Address</h3>
                  <div className="space-y-2">
                    <p className="text-gray-700">{vendor.shippingAddress.street}</p>
                    <p className="text-gray-700">
                      {vendor.shippingAddress.city}, {vendor.shippingAddress.state} {vendor.shippingAddress.zipCode}
                    </p>
                    <p className="text-gray-700">{vendor.shippingAddress.country}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Vendor Details */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-2 mb-6">
                <FileText className="text-blue-600" size={20} />
                <h2 className="text-lg font-semibold text-gray-900">Vendor Details</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Category</label>
                  <div className="flex items-center gap-2">
                    <Tag size={16} className="text-gray-400" />
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {vendor.category}
                    </span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Payment Terms</label>
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-gray-400" />
                    <span className="text-gray-900">{vendor.paymentTerms}</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Credit Limit</label>
                  <div className="flex items-center gap-2">
                    <DollarSign size={16} className="text-gray-400" />
                    <span className="text-gray-900 font-medium">{vendor.creditLimit}</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Date Added</label>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-gray-400" />
                    <span className="text-gray-900">{vendor.dateAdded}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Banking Information */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-2 mb-6">
                <CreditCard className="text-blue-600" size={20} />
                <h2 className="text-lg font-semibold text-gray-900">Banking Information</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Bank Name</label>
                  <p className="text-gray-900">{vendor.bankName}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Account Type</label>
                  <p className="text-gray-900">{vendor.accountType}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Account Number</label>
                  <p className="text-gray-900 font-mono">{vendor.accountNumber}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Routing Number</label>
                  <p className="text-gray-900 font-mono">{vendor.routingNumber}</p>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Notes</h2>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-gray-700 whitespace-pre-line">{vendor.notes}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewVendorContent;