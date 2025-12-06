import React, { useState } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Filter, 
  Download, 
  MoreVertical,
  Search,
  Eye,
  User,
  FileText,
  DollarSign,
  Calendar,
  Building2,
  AlertCircle,
  ChevronDown
} from 'lucide-react';

// Utility function for class names
const cn = (...classes) => classes.filter(Boolean).join(' ');

// Approval Card Component
const ApprovalCard = ({ request, onApprove, onReject, onView }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'approved': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'escalated': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'deal': return <DollarSign className="w-4 h-4 text-green-600" />;
      case 'expense': return <FileText className="w-4 h-4 text-blue-600" />;
      case 'leave': return <Calendar className="w-4 h-4 text-purple-600" />;
      case 'purchase': return <Building2 className="w-4 h-4 text-orange-600" />;
      default: return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {getTypeIcon(request.type)}
          <div>
            <h3 className="font-semibold text-gray-900">{request.title}</h3>
            <p className="text-sm text-gray-600">Request #{request.id}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={cn(
            "px-2 py-1 text-xs rounded-full font-medium",
            getStatusColor(request.status)
          )}>
            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
          </span>
          <span className={cn(
            "px-2 py-1 text-xs rounded-full font-medium",
            getPriorityColor(request.priority)
          )}>
            {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)}
          </span>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Requested By:</span>
          <span className="font-medium text-gray-900">{request.requestedBy}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Department:</span>
          <span className="font-medium text-gray-900">{request.department}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Amount:</span>
          <span className="font-medium text-gray-900">{request.amount}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Date:</span>
          <span className="font-medium text-gray-900">{request.date}</span>
        </div>
        {request.dueDate && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Due Date:</span>
            <span className="font-medium text-gray-900">{request.dueDate}</span>
          </div>
        )}
      </div>

      {request.description && (
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{request.description}</p>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Clock className="w-4 h-4" />
          <span>{request.daysPending} days pending</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onView(request)}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          
          {request.status === 'pending' && (
            <>
              <button
                onClick={() => onApprove(request.id)}
                className="flex items-center space-x-1 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Approve</span>
              </button>
              <button
                onClick={() => onReject(request.id)}
                className="flex items-center space-x-1 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
              >
                <XCircle className="w-4 h-4" />
                <span>Reject</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Filter Component
const FilterSection = ({ filters, onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'escalated', label: 'Escalated' }
  ];

  const typeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'deal', label: 'Deal Approval' },
    { value: 'expense', label: 'Expense' },
    { value: 'leave', label: 'Leave Request' },
    { value: 'purchase', label: 'Purchase Order' }
  ];

  const priorityOptions = [
    { value: 'all', label: 'All Priorities' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' }
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <select
              value={filters.status}
              onChange={(e) => onFilterChange('status', e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={filters.type}
              onChange={(e) => onFilterChange('type', e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {typeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={filters.priority}
              onChange={(e) => onFilterChange('priority', e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {priorityOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <Filter className="w-4 h-4" />
          <span>More Filters</span>
        </button>
      </div>

      {isOpen && (
        <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>All Departments</option>
              <option>Sales</option>
              <option>Marketing</option>
              <option>Finance</option>
              <option>Operations</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>All Time</option>
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Last Quarter</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Amount Range</label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Any Amount</option>
              <option>Below Rs. 10,000</option>
              <option>Rs. 10,000 - 50,000</option>
              <option>Above Rs. 50,000</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

// Stats Overview Component
const StatsOverview = ({ stats }) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">Pending Approval</p>
          <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
        </div>
        <div className="p-3 bg-yellow-100 rounded-lg">
          <Clock className="w-6 h-6 text-yellow-600" />
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-2">Awaiting your review</p>
    </div>

    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">Approved</p>
          <p className="text-2xl font-bold text-gray-900">{stats.approved}</p>
        </div>
        <div className="p-3 bg-green-100 rounded-lg">
          <CheckCircle className="w-6 h-6 text-green-600" />
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-2">This month</p>
    </div>

    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">Rejected</p>
          <p className="text-2xl font-bold text-gray-900">{stats.rejected}</p>
        </div>
        <div className="p-3 bg-red-100 rounded-lg">
          <XCircle className="w-6 h-6 text-red-600" />
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-2">This month</p>
    </div>

    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">Avg. Response Time</p>
          <p className="text-2xl font-bold text-gray-900">{stats.avgResponseTime}</p>
        </div>
        <div className="p-3 bg-blue-100 rounded-lg">
          <AlertCircle className="w-6 h-6 text-blue-600" />
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-2">Days to respond</p>
    </div>
  </div>
);

// Main Approvals Component
export default function Approvals() {
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    priority: 'all',
    search: ''
  });

  const [approvalRequests, setApprovalRequests] = useState([
    {
      id: 'REQ-001',
      title: 'Deal Discount Approval',
      type: 'deal',
      status: 'pending',
      priority: 'high',
      requestedBy: 'DEVASHREE SALUNKE',
      department: 'Sales',
      amount: 'Rs. 35,000.00',
      date: '2024-01-15',
      dueDate: '2024-01-20',
      description: 'Request for 15% discount on enterprise deal with ABC Corporation',
      daysPending: 2
    },
    {
      id: 'REQ-002',
      title: 'Travel Expense Reimbursement',
      type: 'expense',
      status: 'pending',
      priority: 'medium',
      requestedBy: 'RAJESH KUMAR',
      department: 'Sales',
      amount: 'Rs. 12,500.00',
      date: '2024-01-14',
      description: 'Client meeting travel expenses including flight and accommodation',
      daysPending: 3
    },
    {
      id: 'REQ-003',
      title: 'Annual Leave Request',
      type: 'leave',
      status: 'pending',
      priority: 'low',
      requestedBy: 'PRIYA SHARMA',
      department: 'Marketing',
      amount: '-',
      date: '2024-01-13',
      dueDate: '2024-02-01',
      description: 'Request for 5 days annual leave for personal reasons',
      daysPending: 4
    },
    {
      id: 'REQ-004',
      title: 'Software Purchase',
      type: 'purchase',
      status: 'approved',
      priority: 'medium',
      requestedBy: 'AMIT PATEL',
      department: 'IT',
      amount: 'Rs. 85,000.00',
      date: '2024-01-10',
      description: 'Purchase of CRM software license for team of 10 users',
      daysPending: 0
    },
    {
      id: 'REQ-005',
      title: 'Deal Exception Approval',
      type: 'deal',
      status: 'rejected',
      priority: 'high',
      requestedBy: 'SNEHA VERMA',
      department: 'Sales',
      amount: 'Rs. 1,20,000.00',
      date: '2024-01-08',
      description: 'Exception request for extended payment terms on large enterprise deal',
      daysPending: 0
    },
    {
      id: 'REQ-006',
      title: 'Marketing Campaign Budget',
      type: 'expense',
      status: 'pending',
      priority: 'high',
      requestedBy: 'Marketing Team',
      department: 'Marketing',
      amount: 'Rs. 2,50,000.00',
      date: '2024-01-12',
      dueDate: '2024-01-25',
      description: 'Q1 digital marketing campaign budget approval for social media ads',
      daysPending: 5
    }
  ]);

  const stats = {
    pending: approvalRequests.filter(req => req.status === 'pending').length,
    approved: approvalRequests.filter(req => req.status === 'approved').length,
    rejected: approvalRequests.filter(req => req.status === 'rejected').length,
    avgResponseTime: '1.5'
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleApprove = (requestId) => {
    setApprovalRequests(prev => 
      prev.map(req => 
        req.id === requestId 
          ? { ...req, status: 'approved', daysPending: 0 }
          : req
      )
    );
    // Here you would typically make an API call
    console.log(`Approved request: ${requestId}`);
  };

  const handleReject = (requestId) => {
    setApprovalRequests(prev => 
      prev.map(req => 
        req.id === requestId 
          ? { ...req, status: 'rejected', daysPending: 0 }
          : req
      )
    );
    // Here you would typically make an API call
    console.log(`Rejected request: ${requestId}`);
  };

  const handleView = (request) => {
    // Here you would typically navigate to a detailed view or show a modal
    console.log('View request:', request);
    alert(`Viewing details for: ${request.title}`);
  };

  const filteredRequests = approvalRequests.filter(request => {
    if (filters.status !== 'all' && request.status !== filters.status) return false;
    if (filters.type !== 'all' && request.type !== filters.type) return false;
    if (filters.priority !== 'all' && request.priority !== filters.priority) return false;
    if (filters.search && !request.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Approvals</h1>
            <p className="text-gray-600 mt-2">Review and manage approval requests</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button className="p-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <StatsOverview stats={stats} />

      {/* Search and Filters */}
      <div className="mb-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search approvals..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <FilterSection filters={filters} onFilterChange={handleFilterChange} />
      </div>

      {/* Approval Requests Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredRequests.map((request) => (
          <ApprovalCard
            key={request.id}
            request={request}
            onApprove={handleApprove}
            onReject={handleReject}
            onView={handleView}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredRequests.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No approval requests found</h3>
          <p className="text-gray-600">No requests match your current filters.</p>
        </div>
      )}

      {/* Quick Actions Footer */}
      <div className="fixed bottom-6 right-6 flex space-x-3">
        <button className="flex items-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-colors">
          <CheckCircle className="w-5 h-5" />
          <span>Bulk Approve</span>
        </button>
        <button className="flex items-center space-x-2 px-4 py-3 bg-gray-600 text-white rounded-lg shadow-lg hover:bg-gray-700 transition-colors">
          <User className="w-5 h-5" />
          <span>Delegate</span>
        </button>
      </div>
    </div>
  );
}