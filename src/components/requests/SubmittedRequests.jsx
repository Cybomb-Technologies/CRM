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
  FileText,
  Edit,
  Trash2,
  Copy,
  AlertCircle,
  ChevronDown,
  User,
  Calendar,
  Building2,
  DollarSign
} from 'lucide-react';

// Utility function for class names
const cn = (...classes) => classes.filter(Boolean).join(' ');

// Request Card Component
const RequestCard = ({ request, onView, onEdit, onDuplicate, onWithdraw }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'submitted': return 'text-blue-600 bg-blue-100';
      case 'under_review': return 'text-yellow-600 bg-yellow-100';
      case 'approved': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'additional_info': return 'text-purple-600 bg-purple-100';
      case 'cancelled': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'deal_approval': return <DollarSign className="w-4 h-4 text-green-600" />;
      case 'expense': return <FileText className="w-4 h-4 text-blue-600" />;
      case 'leave': return <Calendar className="w-4 h-4 text-purple-600" />;
      case 'purchase': return <Building2 className="w-4 h-4 text-orange-600" />;
      case 'access': return <User className="w-4 h-4 text-indigo-600" />;
      default: return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTypeLabel = (type) => {
    const typeMap = {
      'deal_approval': 'Deal Approval',
      'expense': 'Expense',
      'leave': 'Leave Request',
      'purchase': 'Purchase Order',
      'access': 'Access Request'
    };
    return typeMap[type] || type;
  };

  const canEdit = request.status === 'submitted' || request.status === 'additional_info';
  const canWithdraw = request.status === 'submitted' || request.status === 'under_review';

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
            {request.status.replace('_', ' ').charAt(0).toUpperCase() + request.status.replace('_', ' ').slice(1)}
          </span>
          <span className={cn(
            "px-2 py-1 text-xs rounded-full font-medium",
            getPriorityColor(request.priority)
          )}>
            {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)}
          </span>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Type:</span>
          <span className="font-medium text-gray-900">{getTypeLabel(request.type)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Submitted To:</span>
          <span className="font-medium text-gray-900">{request.approver}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Department:</span>
          <span className="font-medium text-gray-900">{request.department}</span>
        </div>
        {request.amount && request.amount !== '-' && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Amount:</span>
            <span className="font-medium text-gray-900">{request.amount}</span>
          </div>
        )}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Submitted Date:</span>
          <span className="font-medium text-gray-900">{request.submittedDate}</span>
        </div>
        {request.lastUpdated && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Last Updated:</span>
            <span className="font-medium text-gray-900">{request.lastUpdated}</span>
          </div>
        )}
      </div>

      {request.description && (
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{request.description}</p>
      )}

      {request.notes && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-yellow-800">{request.notes}</p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Clock className="w-4 h-4" />
          <span>Submitted {request.daysAgo} days ago</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onView(request)}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>

          {canEdit && (
            <button
              onClick={() => onEdit(request.id)}
              className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
              title="Edit Request"
            >
              <Edit className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => onDuplicate(request.id)}
            className="p-2 text-gray-400 hover:text-green-600 transition-colors"
            title="Duplicate Request"
          >
            <Copy className="w-4 h-4" />
          </button>

          {canWithdraw && (
            <button
              onClick={() => onWithdraw(request.id)}
              className="p-2 text-gray-400 hover:text-red-600 transition-colors"
              title="Withdraw Request"
            >
              <Trash2 className="w-4 h-4" />
            </button>
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
    { value: 'submitted', label: 'Submitted' },
    { value: 'under_review', label: 'Under Review' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'additional_info', label: 'Additional Info Required' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const typeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'deal_approval', label: 'Deal Approval' },
    { value: 'expense', label: 'Expense' },
    { value: 'leave', label: 'Leave Request' },
    { value: 'purchase', label: 'Purchase Order' },
    { value: 'access', label: 'Access Request' }
  ];

  const priorityOptions = [
    { value: 'all', label: 'All Priorities' },
    { value: 'urgent', label: 'Urgent' },
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
            <select 
              value={filters.department}
              onChange={(e) => onFilterChange('department', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Departments</option>
              <option value="sales">Sales</option>
              <option value="marketing">Marketing</option>
              <option value="finance">Finance</option>
              <option value="operations">Operations</option>
              <option value="it">IT</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <select 
              value={filters.dateRange}
              onChange={(e) => onFilterChange('dateRange', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Time</option>
              <option value="7">Last 7 Days</option>
              <option value="30">Last 30 Days</option>
              <option value="90">Last 90 Days</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Approver</label>
            <select 
              value={filters.approver}
              onChange={(e) => onFilterChange('approver', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Approvers</option>
              <option value="manager">Department Manager</option>
              <option value="finance">Finance Head</option>
              <option value="hr">HR Manager</option>
              <option value="it">IT Director</option>
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
          <p className="text-sm font-medium text-gray-600">Total Submitted</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="p-3 bg-blue-100 rounded-lg">
          <FileText className="w-6 h-6 text-blue-600" />
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-2">All time requests</p>
    </div>

    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">Pending Review</p>
          <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
        </div>
        <div className="p-3 bg-yellow-100 rounded-lg">
          <Clock className="w-6 h-6 text-yellow-600" />
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-2">Awaiting approval</p>
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
      <p className="text-xs text-gray-500 mt-2">Successfully approved</p>
    </div>

    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">Approval Rate</p>
          <p className="text-2xl font-bold text-gray-900">{stats.approvalRate}%</p>
        </div>
        <div className="p-3 bg-purple-100 rounded-lg">
          <AlertCircle className="w-6 h-6 text-purple-600" />
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-2">Overall success rate</p>
    </div>
  </div>
);

// New Request Button Component
const NewRequestButton = () => (
  <div className="fixed bottom-6 right-6">
    <button className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-colors font-medium">
      <FileText className="w-5 h-5" />
      <span>New Request</span>
    </button>
  </div>
);

// Main SubmittedRequests Component
export default function SubmittedRequests() {
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    priority: 'all',
    department: 'all',
    approver: 'all',
    dateRange: 'all',
    search: ''
  });

  const [requests, setRequests] = useState([
    {
      id: 'REQ-2024-001',
      title: 'Deal Discount Request - ABC Corp',
      type: 'deal_approval',
      status: 'under_review',
      priority: 'high',
      approver: 'Sales Manager',
      department: 'Sales',
      amount: 'Rs. 35,000.00',
      submittedDate: '2024-01-15',
      lastUpdated: '2024-01-16',
      description: 'Request for 15% discount on enterprise software deal with ABC Corporation. Customer requires special pricing for bulk purchase.',
      daysAgo: 2
    },
    {
      id: 'REQ-2024-002',
      title: 'Q1 Marketing Campaign Budget',
      type: 'expense',
      status: 'approved',
      priority: 'medium',
      approver: 'Finance Head',
      department: 'Marketing',
      amount: 'Rs. 2,50,000.00',
      submittedDate: '2024-01-10',
      lastUpdated: '2024-01-12',
      description: 'Budget approval for Q1 digital marketing campaign including social media ads and content creation.',
      daysAgo: 7
    },
    {
      id: 'REQ-2024-003',
      title: 'Annual Leave Request - Family Vacation',
      type: 'leave',
      status: 'submitted',
      priority: 'low',
      approver: 'HR Manager',
      department: 'Sales',
      amount: '-',
      submittedDate: '2024-01-14',
      description: 'Request for 7 days annual leave for family vacation from February 1-7, 2024.',
      daysAgo: 3
    },
    {
      id: 'REQ-2024-004',
      title: 'CRM Software License Purchase',
      type: 'purchase',
      status: 'additional_info',
      priority: 'urgent',
      approver: 'IT Director',
      department: 'IT',
      amount: 'Rs. 1,85,000.00',
      submittedDate: '2024-01-08',
      lastUpdated: '2024-01-15',
      description: 'Purchase of additional CRM software licenses for new sales team members.',
      notes: 'Additional vendor quotes required for comparison.',
      daysAgo: 9
    },
    {
      id: 'REQ-2024-005',
      title: 'Database Access Request',
      type: 'access',
      status: 'rejected',
      priority: 'medium',
      approver: 'IT Director',
      department: 'Marketing',
      amount: '-',
      submittedDate: '2024-01-05',
      lastUpdated: '2024-01-10',
      description: 'Request for database access to analyze customer data for campaign targeting.',
      notes: 'Access denied due to data privacy concerns. Please contact data team for aggregated reports.',
      daysAgo: 12
    },
    {
      id: 'REQ-2024-006',
      title: 'Client Entertainment Expenses',
      type: 'expense',
      status: 'approved',
      priority: 'medium',
      approver: 'Finance Head',
      department: 'Sales',
      amount: 'Rs. 15,000.00',
      submittedDate: '2024-01-12',
      lastUpdated: '2024-01-13',
      description: 'Client dinner and entertainment expenses for key account meeting.',
      daysAgo: 5
    },
    {
      id: 'REQ-2024-007',
      title: 'Emergency Leave - Medical',
      type: 'leave',
      status: 'cancelled',
      priority: 'high',
      approver: 'HR Manager',
      department: 'Operations',
      amount: '-',
      submittedDate: '2024-01-16',
      lastUpdated: '2024-01-16',
      description: 'Emergency leave request for medical appointment.',
      notes: 'Cancelled - Rescheduled appointment',
      daysAgo: 1
    },
    {
      id: 'REQ-2024-008',
      title: 'Deal Exception - Extended Payment Terms',
      type: 'deal_approval',
      status: 'under_review',
      priority: 'urgent',
      approver: 'Sales Director',
      department: 'Sales',
      amount: 'Rs. 1,20,000.00',
      submittedDate: '2024-01-13',
      description: 'Exception request for 60-day payment terms on large enterprise deal with XYZ Corporation.',
      daysAgo: 4
    }
  ]);

  const stats = {
    total: requests.length,
    pending: requests.filter(req => req.status === 'submitted' || req.status === 'under_review').length,
    approved: requests.filter(req => req.status === 'approved').length,
    approvalRate: Math.round((requests.filter(req => req.status === 'approved').length / requests.length) * 100)
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleView = (request) => {
    console.log('View request:', request);
    alert(`Viewing details for: ${request.title}`);
  };

  const handleEdit = (requestId) => {
    console.log('Edit request:', requestId);
    alert(`Editing request: ${requestId}`);
  };

  const handleDuplicate = (requestId) => {
    console.log('Duplicate request:', requestId);
    alert(`Duplicating request: ${requestId}`);
  };

  const handleWithdraw = (requestId) => {
    setRequests(prev => 
      prev.map(req => 
        req.id === requestId 
          ? { ...req, status: 'cancelled', lastUpdated: new Date().toISOString().split('T')[0] }
          : req
      )
    );
    console.log('Withdrawn request:', requestId);
  };

  const filteredRequests = requests.filter(request => {
    if (filters.status !== 'all' && request.status !== filters.status) return false;
    if (filters.type !== 'all' && request.type !== filters.type) return false;
    if (filters.priority !== 'all' && request.priority !== filters.priority) return false;
    if (filters.department !== 'all' && request.department.toLowerCase() !== filters.department) return false;
    if (filters.approver !== 'all' && request.approver.toLowerCase() !== filters.approver) return false;
    if (filters.search && !request.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Submitted Requests</h1>
            <p className="text-gray-600 mt-2">Track and manage your submitted requests</p>
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
              placeholder="Search your requests..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <FilterSection filters={filters} onFilterChange={handleFilterChange} />
      </div>

      {/* Requests Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredRequests.map((request) => (
          <RequestCard
            key={request.id}
            request={request}
            onView={handleView}
            onEdit={handleEdit}
            onDuplicate={handleDuplicate}
            onWithdraw={handleWithdraw}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredRequests.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No requests found</h3>
          <p className="text-gray-600">No submitted requests match your current filters.</p>
        </div>
      )}

      {/* New Request Button */}
      <NewRequestButton />
    </div>
  );
}