import React, { useState } from 'react';
import { Plus, Search, Filter, Download, FileText, Eye, Edit, Trash2, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const InvoicesPageContent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const navigate = useNavigate();

  const invoices = [
    {
      id: 'INV-001',
      customer: 'Acme Corporation',
      email: 'billing@acme.com',
      date: '2024-01-15',
      dueDate: '2024-02-15',
      amount: '$5,250.00',
      status: 'Paid',
      statusColor: 'bg-green-100 text-green-800'
    },
    {
      id: 'INV-002',
      customer: 'Tech Solutions Inc',
      email: 'finance@techsolutions.com',
      date: '2024-01-18',
      dueDate: '2024-02-18',
      amount: '$3,450.00',
      status: 'Pending',
      statusColor: 'bg-yellow-100 text-yellow-800'
    },
    {
      id: 'INV-003',
      customer: 'Global Retail',
      email: 'accounts@globalretail.com',
      date: '2024-01-20',
      dueDate: '2024-02-20',
      amount: '$8,750.00',
      status: 'Overdue',
      statusColor: 'bg-red-100 text-red-800'
    },
    {
      id: 'INV-004',
      customer: 'Startup Labs',
      email: 'payable@startuplabs.com',
      date: '2024-01-22',
      dueDate: '2024-02-22',
      amount: '$2,150.00',
      status: 'Draft',
      statusColor: 'bg-gray-100 text-gray-800'
    },
    {
      id: 'INV-005',
      customer: 'Enterprise Solutions',
      email: 'billing@enterprise.com',
      date: '2024-01-25',
      dueDate: '2024-02-25',
      amount: '$12,500.00',
      status: 'Paid',
      statusColor: 'bg-green-100 text-green-800'
    },
  ];

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = 
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      statusFilter === 'all' || 
      invoice.status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesFilter;
  });

  const stats = [
    { label: 'Total Invoices', value: invoices.length, color: 'bg-blue-500' },
    { label: 'Total Amount', value: '$31,100.00', color: 'bg-green-500' },
    { label: 'Pending', value: '$3,450.00', color: 'bg-yellow-500' },
    { label: 'Overdue', value: '$8,750.00', color: 'bg-red-500' },
  ];

  const handleCreateInvoice = () => {
    navigate('/create-invoice');
  };

  const handleViewInvoice = (id) => {
    navigate(`/invoices/view/${id}`);
  };

  const handleEditInvoice = (id) => {
    navigate(`/invoices/edit/${id}`);
  };

  const handleDeleteInvoice = (id) => {
    if (window.confirm(`Are you sure you want to delete invoice ${id}?`)) {
      console.log('Deleting invoice:', id);
      // Add delete logic here
    }
  };

  const exportToCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Invoice ID,Customer,Email,Date,Due Date,Amount,Status"]
      .concat(invoices.map(inv => 
        `${inv.id},${inv.customer},${inv.email},${inv.date},${inv.dueDate},${inv.amount},${inv.status}`
      ))
      .join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "invoices.csv");
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
              <h1 className="text-3xl font-bold text-gray-900">Invoices</h1>
              <p className="text-gray-600 mt-1">Manage and track all your invoices</p>
            </div>
            <button
              onClick={handleCreateInvoice}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors"
            >
              <Plus size={20} />
              Create Invoice
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
                    <FileText className="text-white" size={24} />
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
                  placeholder="Search invoices by ID, customer, or email..."
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
                <option value="draft">Draft</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
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

        {/* Invoices Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice ID</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <FileText className="text-gray-400" size={18} />
                        <span className="font-medium text-gray-900">{invoice.id}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-medium text-gray-900">{invoice.customer}</p>
                        <p className="text-sm text-gray-500">{invoice.email}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-700">{invoice.date}</td>
                    <td className="py-4 px-6 text-gray-700">{invoice.dueDate}</td>
                    <td className="py-4 px-6 font-semibold text-gray-900">{invoice.amount}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${invoice.statusColor}`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewInvoice(invoice.id)}
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleEditInvoice(invoice.id)}
                          className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteInvoice(invoice.id)}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
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

          {filteredInvoices.length === 0 && (
            <div className="text-center py-12">
              <FileText className="mx-auto text-gray-400" size={48} />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No invoices found</h3>
              <p className="mt-2 text-gray-600">
                {searchTerm ? 'Try adjusting your search or filter' : 'Get started by creating your first invoice'}
              </p>
              {!searchTerm && (
                <button
                  onClick={handleCreateInvoice}
                  className="mt-4 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors"
                >
                  <Plus size={20} />
                  Create Invoice
                </button>
              )}
            </div>
          )}

          {/* Pagination (if needed) */}
          {filteredInvoices.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredInvoices.length}</span> of{' '}
                <span className="font-medium">{invoices.length}</span> results
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

export default InvoicesPageContent;