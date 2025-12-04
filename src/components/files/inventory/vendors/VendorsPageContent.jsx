import React, { useState } from 'react';
import { Plus, Search, Filter, Download, Building, Phone, Mail, MapPin, Eye, Edit, Trash2, ChevronRight, DollarSign, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const VendorsPageContent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const navigate = useNavigate();

  const vendors = [
    {
      id: 'VDR-001',
      name: 'Acme Supplies Inc',
      contactPerson: 'John Smith',
      email: 'john@acmesupplies.com',
      phone: '(555) 123-4567',
      address: '123 Main St, New York, NY',
      category: 'Office Supplies',
      totalSpent: '$45,200',
      lastOrder: '2024-01-15',
      status: 'Active',
      statusColor: 'bg-green-100 text-green-800'
    },
    {
      id: 'VDR-002',
      name: 'Tech Hardware Co',
      contactPerson: 'Sarah Johnson',
      email: 'sarah@techhardware.com',
      phone: '(555) 234-5678',
      address: '456 Tech Ave, San Francisco, CA',
      category: 'IT Equipment',
      totalSpent: '$78,500',
      lastOrder: '2024-01-18',
      status: 'Active',
      statusColor: 'bg-green-100 text-green-800'
    },
    {
      id: 'VDR-003',
      name: 'Global Logistics',
      contactPerson: 'Mike Wilson',
      email: 'mike@globallogistics.com',
      phone: '(555) 345-6789',
      address: '789 Shipping Blvd, Chicago, IL',
      category: 'Logistics',
      totalSpent: '$32,100',
      lastOrder: '2024-01-10',
      status: 'Inactive',
      statusColor: 'bg-red-100 text-red-800'
    },
    {
      id: 'VDR-004',
      name: 'Quality Furniture Ltd',
      contactPerson: 'Emma Davis',
      email: 'emma@qualityfurniture.com',
      phone: '(555) 456-7890',
      address: '101 Design St, Miami, FL',
      category: 'Furniture',
      totalSpent: '$56,800',
      lastOrder: '2024-01-20',
      status: 'Active',
      statusColor: 'bg-green-100 text-green-800'
    },
    {
      id: 'VDR-005',
      name: 'Office Essentials',
      contactPerson: 'Robert Brown',
      email: 'robert@officeessentials.com',
      phone: '(555) 567-8901',
      address: '202 Business Rd, Austin, TX',
      category: 'Office Supplies',
      totalSpent: '$29,400',
      lastOrder: '2024-01-05',
      status: 'Pending',
      statusColor: 'bg-yellow-100 text-yellow-800'
    },
    {
      id: 'VDR-006',
      name: 'Digital Solutions',
      contactPerson: 'Lisa Chen',
      email: 'lisa@digitalsolutions.com',
      phone: '(555) 678-9012',
      address: '303 Innovation Dr, Seattle, WA',
      category: 'Software',
      totalSpent: '$112,300',
      lastOrder: '2024-01-22',
      status: 'Active',
      statusColor: 'bg-green-100 text-green-800'
    },
    {
      id: 'VDR-007',
      name: 'Print Masters',
      contactPerson: 'David Wilson',
      email: 'david@printmasters.com',
      phone: '(555) 789-0123',
      address: '404 Print Ave, Denver, CO',
      category: 'Printing',
      totalSpent: '$18,900',
      lastOrder: '2023-12-15',
      status: 'Inactive',
      statusColor: 'bg-red-100 text-red-800'
    },
  ];

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = 
      vendor.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === 'all' || 
      vendor.status.toLowerCase() === statusFilter.toLowerCase();
    
    const matchesCategory = 
      categoryFilter === 'all' || 
      vendor.category.toLowerCase() === categoryFilter.toLowerCase();
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const stats = [
    { 
      label: 'Total Vendors', 
      value: vendors.length, 
      color: 'bg-blue-500',
      icon: <Building className="text-white" size={24} />
    },
    { 
      label: 'Active Vendors', 
      value: vendors.filter(v => v.status === 'Active').length, 
      color: 'bg-green-500',
      icon: <CheckCircle className="text-white" size={24} />
    },
    { 
      label: 'Total Spending', 
      value: '$373,200', 
      color: 'bg-purple-500',
      icon: <DollarSign className="text-white" size={24} />
    },
    { 
      label: 'Inactive Vendors', 
      value: vendors.filter(v => v.status === 'Inactive').length, 
      color: 'bg-red-500',
      icon: <XCircle className="text-white" size={24} />
    },
  ];

  const categories = [...new Set(vendors.map(v => v.category))];

  // Navigation Functions
  const handleCreateVendor = () => {
    navigate('/create-vendor');
  };

  const handleViewVendor = (id) => {
    navigate(`/vendors/view/${id}`);
  };

  const handleEditVendor = (id) => {
    navigate(`/vendors/edit/${id}`);
  };

  const handleDeleteVendor = (id) => {
    if (window.confirm(`Are you sure you want to delete vendor ${id}?`)) {
      console.log('Deleting vendor:', id);
      // Add delete logic here
      // After deletion, you might want to refresh the list or show a success message
    }
  };

  // Also make the entire row clickable for viewing
  const handleRowClick = (id, e) => {
    // Don't trigger if clicking on action buttons
    if (!e.target.closest('button')) {
      handleViewVendor(id);
    }
  };

  const exportToCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Vendor ID,Name,Contact Person,Email,Phone,Address,Category,Total Spent,Last Order,Status"]
      .concat(vendors.map(vendor => 
        `${vendor.id},${vendor.name},${vendor.contactPerson},${vendor.email},${vendor.phone},${vendor.address},${vendor.category},${vendor.totalSpent},${vendor.lastOrder},${vendor.status}`
      ))
      .join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "vendors.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Vendors</h1>
              <p className="text-gray-600 mt-1">Manage your supplier and vendor relationships</p>
            </div>
            <button
              onClick={handleCreateVendor}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors"
            >
              <Plus size={20} />
              Add Vendor
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-full ${stat.color} flex items-center justify-center`}>
                    {stat.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search vendors by name, contact, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-4 w-full md:w-auto">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {categories.map((category, index) => (
                  <option key={index} value={category.toLowerCase()}>{category}</option>
                ))}
              </select>
              <button
                onClick={exportToCSV}
                className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Download size={20} />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Vendors Grid/Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Info</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Spent</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Order</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredVendors.map((vendor) => (
                  <tr 
                    key={vendor.id} 
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={(e) => handleRowClick(vendor.id, e)}
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Building className="text-blue-600" size={20} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{vendor.name}</p>
                          <p className="text-sm text-gray-500">{vendor.id}</p>
                          <p className="text-sm text-gray-600 mt-1">{vendor.contactPerson}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Mail size={14} className="text-gray-400" />
                          <span className="text-sm text-gray-700">{vendor.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone size={14} className="text-gray-400" />
                          <span className="text-sm text-gray-700">{vendor.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin size={14} className="text-gray-400" />
                          <span className="text-sm text-gray-700 truncate max-w-xs">{vendor.address}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        {vendor.category}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-semibold text-gray-900">{vendor.totalSpent}</div>
                      <div className="text-xs text-gray-500">Lifetime</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-gray-700">{vendor.lastOrder}</div>
                      <div className="text-xs text-gray-500">MM/DD/YYYY</div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${vendor.statusColor}`}>
                        {vendor.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleViewVendor(vendor.id)}
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleEditVendor(vendor.id)}
                          className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Edit Vendor"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteVendor(vendor.id)}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Vendor"
                        >
                          <Trash2 size={18} />
                        </button>
                        <ChevronRight className="text-gray-400" size={18} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredVendors.length === 0 && (
            <div className="text-center py-12">
              <Building className="mx-auto text-gray-400" size={48} />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No vendors found</h3>
              <p className="mt-2 text-gray-600">
                {searchTerm ? 'Try adjusting your search or filter' : 'Get started by adding your first vendor'}
              </p>
              {!searchTerm && (
                <button
                  onClick={handleCreateVendor}
                  className="mt-4 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors"
                >
                  <Plus size={20} />
                  Add Vendor
                </button>
              )}
            </div>
          )}

          {/* Pagination */}
          {filteredVendors.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredVendors.length}</span> of{' '}
                <span className="font-medium">{vendors.length}</span> results
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                  Previous
                </button>
                <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-blue-600 text-white">
                  1
                </button>
                <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorsPageContent;