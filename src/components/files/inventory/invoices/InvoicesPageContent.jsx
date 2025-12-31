import React, { useState } from 'react';
import { Plus, Search, Filter, Download, FileText, Eye, Edit, Trash2, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
// import { invoicesAPI } from './invoicesAPI';

const InvoicesPageContent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const navigate = useNavigate();

  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchInvoices = async () => {
      try {
        console.log(`📡 Fetching Invoices...`);

        const response = await invoicesAPI.getAllInvoices();

        // Transform data to match UI expected format if needed
        const transformedInvoices = response.data.map(invoice => ({
          _id: invoice._id, // Real DB ID for actions
          id: invoice.invoiceNumber, // Display ID
          customer: invoice.accountName,
          email: invoice.customerEmail || 'N/A',
          date: new Date(invoice.invoiceDate).toLocaleDateString(),
          dueDate: invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : 'N/A',
          amount: new Intl.NumberFormat('en-US', { style: 'currency', currency: invoice.currency || 'USD' }).format(invoice.grandTotal),
          status: invoice.status,
          statusColor: getStatusColor(invoice.status)
        }));

        setInvoices(transformedInvoices);
      } catch (error) {
        console.error('Error fetching invoices:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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
    // Navigate using the DB ID if needed, or Invoice Number.
    // Usually URLs use IDs, but here user might prefer Invoice Number.
    // But backend routes usually use DB ID.
    // Let's assume view/edit routes use DB ID for consistency.
    navigate(`/invoices/view/${id}`);
  };

  const handleEditInvoice = (id) => {
    navigate(`/invoices/edit/${id}`);
  };

  const handleDeleteInvoice = async (id) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      try {
        await invoicesAPI.deleteInvoice(id);
        setInvoices(prev => prev.filter(inv => inv._id !== id));
        console.log('Deleted invoice:', id);
      } catch (error) {
        console.error('Error deleting invoice:', error);
        alert('Failed to delete invoice');
      }
    }
  };

  const exportToCSV = () => {
    if (!invoices.length) return;

    const headers = [
      'Invoice ID',
      'Customer',
      'Email',
      'Date',
      'Due Date',
      'Amount',
      'Status'
    ];

    const rows = invoices.map(inv => [
      inv.id,
      inv.customer,
      inv.email,
      inv.date,
      inv.dueDate,
      inv.amount,
      inv.status
    ]);

    const csvContent =
      [headers, ...rows]
        .map(row => row.map(value => `"${value}"`).join(','))
        .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `invoices_${new Date().toISOString().slice(0, 10)}.csv`);

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
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