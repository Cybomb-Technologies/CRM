// src/pages/PurchaseOrders.jsx
import React, { useState } from 'react';
import { Plus, Search, Filter, Download, FileText, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PurchaseOrders = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Mock data for purchase orders
  const purchaseOrders = [
    { 
      id: 1, 
      orderNumber: 'PO-001', 
      subject: 'Laptop Procurement', 
      vendor: 'Tech Suppliers Inc.', 
      total: 45000, 
      status: 'Ordered',
      orderDate: '2024-01-15',
      contact: 'Robert Wilson',
      dueDate: '2024-02-01'
    },
    { 
      id: 2, 
      orderNumber: 'PO-002', 
      subject: 'Office Furniture', 
      vendor: 'Furniture World', 
      total: 120000, 
      status: 'Received',
      orderDate: '2024-01-10',
      contact: 'Maria Garcia',
      dueDate: '2024-01-25'
    },
    { 
      id: 3, 
      orderNumber: 'PO-003', 
      subject: 'Software Licenses', 
      vendor: 'Software Solutions Ltd.', 
      total: 75000, 
      status: 'In Transit',
      orderDate: '2024-01-05',
      contact: 'David Brown',
      dueDate: '2024-01-20'
    },
    { 
      id: 4, 
      orderNumber: 'PO-004', 
      subject: 'Network Equipment', 
      vendor: 'Networking Pros', 
      total: 89000, 
      status: 'Pending',
      orderDate: '2024-01-02',
      contact: 'Lisa Chen',
      dueDate: '2024-01-18'
    },
  ];

  const statusColors = {
    'Pending': 'bg-yellow-100 text-yellow-800',
    'Ordered': 'bg-blue-100 text-blue-800',
    'In Transit': 'bg-purple-100 text-purple-800',
    'Received': 'bg-green-100 text-green-800',
    'Cancelled': 'bg-red-100 text-red-800'
  };

  const handleCreatePurchaseOrder = () => {
    navigate('/create-purchase-order');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-2xl font-semibold text-gray-900">Purchase Orders</h1>
              <p className="text-gray-600 mt-1 max-w-3xl">
                Purchase Orders are legal documents for placing orders to secure products and services from vendors.
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={handleCreatePurchaseOrder}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Purchase Order
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
                  <FileText className="w-5 h-5 text-gray-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Manage Purchase Orders</h3>
                </div>
                <p className="text-gray-700 mb-3">
                  Track your procurement process efficiently. Monitor order status, delivery timelines, and vendor communications.
                </p>
                <button className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors">
                  Learn more about Purchase Orders
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center ml-6">
                <FileText className="w-8 h-8 text-blue-600" />
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
                    placeholder="Search purchase orders..."
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
                  <option value="pending">Pending</option>
                  <option value="ordered">Ordered</option>
                  <option value="in-transit">In Transit</option>
                  <option value="received">Received</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              
              {/* Export Button */}
              <button className="flex items-center px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
            </div>
          </div>

          {/* Purchase Orders Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order Number
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vendor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Due Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {purchaseOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-blue-600">{order.orderNumber}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{order.subject}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{order.vendor}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{order.contact}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          Rs. {order.total.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[order.status]}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{order.orderDate}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{order.dueDate}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">
                          Edit
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Empty State */}
            {purchaseOrders.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Purchase Orders Found</h3>
                <p className="text-gray-600 mb-6">Get started by creating your first purchase order.</p>
                <button 
                  onClick={handleCreatePurchaseOrder}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Purchase Order
                </button>
              </div>
            )}

            {/* Pagination */}
            <div className="bg-white px-6 py-3 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">1</span> to <span className="font-medium">{purchaseOrders.length}</span> of{' '}
                  <span className="font-medium">{purchaseOrders.length}</span> results
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
    </div>
  );
};

export default PurchaseOrders;