// src/pages/Invoices.jsx
import React, { useState } from 'react';
import { Plus, Search, Filter, Download, FileText, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Invoices = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Mock data for invoices
  const invoices = [
    { 
      id: 1, 
      invoiceNumber: 'INV-001', 
      subject: 'Website Development Project', 
      account: 'Tech Solutions Inc.', 
      total: 15000, 
      status: 'Paid',
      invoiceDate: '2024-01-15',
      dueDate: '2024-02-15',
      contact: 'John Smith'
    },
    { 
      id: 2, 
      invoiceNumber: 'INV-002', 
      subject: 'CRM Implementation', 
      account: 'Global Enterprises', 
      total: 25000, 
      status: 'Sent',
      invoiceDate: '2024-01-10',
      dueDate: '2024-02-10',
      contact: 'Sarah Johnson'
    },
    { 
      id: 3, 
      invoiceNumber: 'INV-003', 
      subject: 'Mobile App Development', 
      account: 'StartUp Innovations', 
      total: 18000, 
      status: 'Overdue',
      invoiceDate: '2024-01-05',
      dueDate: '2024-02-05',
      contact: 'Mike Chen'
    },
    { 
      id: 4, 
      invoiceNumber: 'INV-004', 
      subject: 'Cloud Migration Services', 
      account: 'Data Systems Corp', 
      total: 32000, 
      status: 'Draft',
      invoiceDate: '2024-01-02',
      dueDate: '2024-02-02',
      contact: 'Emily Davis'
    },
  ];

  const statusColors = {
    'Draft': 'bg-gray-100 text-gray-800',
    'Sent': 'bg-blue-100 text-blue-800',
    'Paid': 'bg-green-100 text-green-800',
    'Overdue': 'bg-red-100 text-red-800',
    'Cancelled': 'bg-orange-100 text-orange-800'
  };

  const handleCreateInvoice = () => {
    navigate('/create-invoice');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-2xl font-semibold text-gray-900">Invoices</h1>
              <p className="text-gray-600 mt-1 max-w-3xl">
                Invoices are commercial documents that itemize and record transactions between a buyer and seller.
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={handleCreateInvoice}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Invoice
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
                  <h3 className="text-lg font-semibold text-gray-900">Manage Invoices</h3>
                </div>
                <p className="text-gray-700 mb-3">
                  Create, send, and track invoices. Monitor payment status and manage your accounts receivable efficiently.
                </p>
                <button className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors">
                  Learn more about Invoices
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
                    placeholder="Search invoices..."
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
                  <option value="draft">Draft</option>
                  <option value="sent">Sent</option>
                  <option value="paid">Paid</option>
                  <option value="overdue">Overdue</option>
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

          {/* Invoices Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Invoice Number
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Account
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
                      Invoice Date
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
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-blue-600">{invoice.invoiceNumber}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{invoice.subject}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{invoice.account}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{invoice.contact}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          Rs. {invoice.total.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[invoice.status]}`}>
                          {invoice.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{invoice.invoiceDate}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{invoice.dueDate}</div>
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
            {invoices.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Invoices Found</h3>
                <p className="text-gray-600 mb-6">Get started by creating your first invoice.</p>
                <button 
                  onClick={handleCreateInvoice}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Invoice
                </button>
              </div>
            )}

            {/* Pagination */}
            <div className="bg-white px-6 py-3 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">1</span> to <span className="font-medium">{invoices.length}</span> of{' '}
                  <span className="font-medium">{invoices.length}</span> results
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

export default Invoices;