import React, { useState } from 'react';
import { 
  Clock, 
  AlertCircle, 
  Filter, 
  Download, 
  MoreVertical,
  Search,
  Eye,
  User,
  Calendar,
  MessageCircle,
  ChevronDown,
  FileText,
  DollarSign,
  Building2,
  TrendingUp,
  XCircle,
  CheckCircle
} from 'lucide-react';

// Utility function for class names
const cn = (...classes) => classes.filter(Boolean).join(' ');

// Pending Request Card Component
const PendingRequestCard = ({ request, onView, onRemind, onEscalate, onCancel }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-100 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-100 border-green-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
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

  const getDaysColor = (days) => {
    if (days >= 7) return 'text-red-600';
    if (days >= 3) return 'text-orange-600';
    return 'text-yellow-600';
  };

  const getEscalationLevel = (days) => {
    if (days >= 7) return 'Level 3 - Critical';
    if (days >= 5) return 'Level 2 - High';
    if (days >= 3) return 'Level 1 - Medium';
    return 'Normal';
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {getTypeIcon(request.type)}
          <div>
            <h3 className="font-semibold text-gray-900">{request.title}</h3>
            <p className="text-sm text-gray-600">Request #{request.id}</p>
          </div>
        </div>
        <div className="flex flex-col items-end space-y-2">
          <span className={cn(
            "px-2 py-1 text-xs rounded-full font-medium border",
            getPriorityColor(request.priority)
          )}>
            {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)}
          </span>
          <span className={cn(
            "px-2 py-1 text-xs rounded-full font-medium bg-blue-100 text-blue-700"
          )}>
            {getEscalationLevel(request.daysPending)}
          </span>
        </div>
      </div>

      {/* Request Details */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Approver:</span>
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4 text-gray-400" />
            <span className="font-medium text-gray-900">{request.approver}</span>
          </div>
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
          <span className="text-gray-600">Submitted:</span>
          <span className="font-medium text-gray-900">{request.submittedDate}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">SLA Deadline:</span>
          <span className="font-medium text-gray-900">{request.slaDeadline}</span>
        </div>
      </div>

      {/* Progress and Timing */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-gray-600">Time Pending:</span>
          <span className={cn("font-semibold", getDaysColor(request.daysPending))}>
            {request.daysPending} days
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={cn(
              "h-2 rounded-full transition-all duration-500",
              request.daysPending >= 7 ? 'bg-red-500' :
              request.daysPending >= 5 ? 'bg-orange-500' :
              request.daysPending >= 3 ? 'bg-yellow-500' : 'bg-blue-500'
            )}
            style={{ width: `${Math.min((request.daysPending / 10) * 100, 100)}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Submitted</span>
          <span>Due: {request.slaDeadline}</span>
        </div>
      </div>

      {request.notes && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-yellow-800">{request.notes}</p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>Pending {request.daysPending}d</span>
          </div>
          {request.reminderSent && (
            <div className="flex items-center space-x-1 text-blue-600">
              <MessageCircle className="w-4 h-4" />
              <span>Reminder sent</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onView(request)}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>

          <button
            onClick={() => onRemind(request.id)}
            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
            title="Send Reminder"
          >
            <MessageCircle className="w-4 h-4" />
          </button>

          {request.daysPending >= 3 && (
            <button
              onClick={() => onEscalate(request.id)}
              className="p-2 text-gray-400 hover:text-orange-600 transition-colors"
              title="Escalate Request"
            >
              <TrendingUp className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => onCancel(request.id)}
            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
            title="Cancel Request"
          >
            <XCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Filter Component
const FilterSection = ({ filters, onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const priorityOptions = [
    { value: 'all', label: 'All Priorities' },
    { value: 'urgent', label: 'Urgent' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' }
  ];

  const typeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'deal_approval', label: 'Deal Approval' },
    { value: 'expense', label: 'Expense' },
    { value: 'leave', label: 'Leave Request' },
    { value: 'purchase', label: 'Purchase Order' },
    { value: 'access', label: 'Access Request' }
  ];

  const durationOptions = [
    { value: 'all', label: 'Any Duration' },
    { value: '1', label: '1+ Days' },
    { value: '3', label: '3+ Days' },
    { value: '5', label: '5+ Days' },
    { value: '7', label: '7+ Days' }
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
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
              value={filters.duration}
              onChange={(e) => onFilterChange('duration', e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {durationOptions.map(option => (
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">SLA Status</label>
            <select 
              value={filters.slaStatus}
              onChange={(e) => onFilterChange('slaStatus', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All SLA Status</option>
              <option value="on_track">On Track</option>
              <option value="at_risk">At Risk</option>
              <option value="breached">Breached</option>
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
          <p className="text-sm font-medium text-gray-600">Total Pending</p>
          <p className="text-2xl font-bold text-gray-900">{stats.totalPending}</p>
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
          <p className="text-sm font-medium text-gray-600">At Risk</p>
          <p className="text-2xl font-bold text-orange-600">{stats.atRisk}</p>
        </div>
        <div className="p-3 bg-orange-100 rounded-lg">
          <AlertCircle className="w-6 h-6 text-orange-600" />
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-2">Near SLA deadline</p>
    </div>

    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">Avg. Wait Time</p>
          <p className="text-2xl font-bold text-gray-900">{stats.avgWaitTime}d</p>
        </div>
        <div className="p-3 bg-blue-100 rounded-lg">
          <Calendar className="w-6 h-6 text-blue-600" />
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-2">Average pending duration</p>
    </div>

    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">SLA Compliance</p>
          <p className="text-2xl font-bold text-gray-900">{stats.slaCompliance}%</p>
        </div>
        <div className="p-3 bg-green-100 rounded-lg">
          <CheckCircle className="w-6 h-6 text-green-600" />
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-2">Meeting deadlines</p>
    </div>
  </div>
);

// Urgent Alerts Component
const UrgentAlerts = ({ urgentRequests }) => {
  if (urgentRequests.length === 0) return null;

  return (
    <div className="mb-6">
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <h3 className="text-lg font-semibold text-red-800">Urgent Attention Required</h3>
          </div>
          <span className="px-2 py-1 bg-red-600 text-white text-xs rounded-full">
            {urgentRequests.length} urgent
          </span>
        </div>
        <div className="space-y-2">
          {urgentRequests.slice(0, 3).map(request => (
            <div key={request.id} className="flex items-center justify-between text-sm">
              <span className="text-red-700">{request.title}</span>
              <span className="text-red-600 font-medium">Due: {request.slaDeadline}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Main PendingRequests Component
export default function PendingRequests() {
  const [filters, setFilters] = useState({
    priority: 'all',
    type: 'all',
    duration: 'all',
    department: 'all',
    approver: 'all',
    slaStatus: 'all',
    search: ''
  });

  const [requests, setRequests] = useState([
    {
      id: 'REQ-2024-001',
      title: 'Deal Discount Request - ABC Corp',
      type: 'deal_approval',
      priority: 'urgent',
      approver: 'Sales Manager',
      department: 'Sales',
      amount: 'Rs. 35,000.00',
      submittedDate: '2024-01-10',
      slaDeadline: '2024-01-17',
      daysPending: 7,
      notes: 'Client awaiting response for deal closure',
      reminderSent: true
    },
    {
      id: 'REQ-2024-002',
      title: 'Q1 Marketing Campaign Budget',
      type: 'expense',
      priority: 'high',
      approver: 'Finance Head',
      department: 'Marketing',
      amount: 'Rs. 2,50,000.00',
      submittedDate: '2024-01-12',
      slaDeadline: '2024-01-19',
      daysPending: 5,
      notes: 'Campaign launch delayed due to pending approval',
      reminderSent: false
    },
    {
      id: 'REQ-2024-003',
      title: 'Annual Leave Request',
      type: 'leave',
      priority: 'medium',
      approver: 'HR Manager',
      department: 'Sales',
      amount: '-',
      submittedDate: '2024-01-14',
      slaDeadline: '2024-01-21',
      daysPending: 3,
      reminderSent: true
    },
    {
      id: 'REQ-2024-004',
      title: 'CRM Software License Purchase',
      type: 'purchase',
      priority: 'high',
      approver: 'IT Director',
      department: 'IT',
      amount: 'Rs. 1,85,000.00',
      submittedDate: '2024-01-13',
      slaDeadline: '2024-01-20',
      daysPending: 4,
      notes: 'Additional vendor quotes submitted',
      reminderSent: false
    },
    {
      id: 'REQ-2024-005',
      title: 'Database Access Request',
      type: 'access',
      priority: 'low',
      approver: 'IT Director',
      department: 'Marketing',
      amount: '-',
      submittedDate: '2024-01-15',
      slaDeadline: '2024-01-25',
      daysPending: 2,
      reminderSent: false
    },
    {
      id: 'REQ-2024-006',
      title: 'Client Entertainment Expenses',
      type: 'expense',
      priority: 'medium',
      approver: 'Finance Head',
      department: 'Sales',
      amount: 'Rs. 15,000.00',
      submittedDate: '2024-01-16',
      slaDeadline: '2024-01-23',
      daysPending: 1,
      reminderSent: false
    },
    {
      id: 'REQ-2024-007',
      title: 'Deal Exception - Extended Payment Terms',
      type: 'deal_approval',
      priority: 'urgent',
      approver: 'Sales Director',
      department: 'Sales',
      amount: 'Rs. 1,20,000.00',
      submittedDate: '2024-01-09',
      slaDeadline: '2024-01-16',
      daysPending: 8,
      notes: 'Critical deal - client considering competitors',
      reminderSent: true
    },
    {
      id: 'REQ-2024-008',
      title: 'Team Building Event Budget',
      type: 'expense',
      priority: 'medium',
      approver: 'Finance Head',
      department: 'Operations',
      amount: 'Rs. 75,000.00',
      submittedDate: '2024-01-11',
      slaDeadline: '2024-01-18',
      daysPending: 6,
      reminderSent: false
    }
  ]);

  const stats = {
    totalPending: requests.length,
    atRisk: requests.filter(req => req.daysPending >= 5).length,
    avgWaitTime: Math.round(requests.reduce((acc, req) => acc + req.daysPending, 0) / requests.length),
    slaCompliance: Math.round((requests.filter(req => req.daysPending <= 7).length / requests.length) * 100)
  };

  const urgentRequests = requests.filter(req => req.priority === 'urgent' || req.daysPending >= 7);

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

  const handleRemind = (requestId) => {
    setRequests(prev => 
      prev.map(req => 
        req.id === requestId 
          ? { ...req, reminderSent: true }
          : req
      )
    );
    console.log('Reminder sent for:', requestId);
    alert(`Reminder sent for request: ${requestId}`);
  };

  const handleEscalate = (requestId) => {
    console.log('Escalating request:', requestId);
    alert(`Request ${requestId} has been escalated to higher management`);
  };

  const handleCancel = (requestId) => {
    setRequests(prev => prev.filter(req => req.id !== requestId));
    console.log('Cancelled request:', requestId);
    alert(`Request ${requestId} has been cancelled`);
  };

  const filteredRequests = requests.filter(request => {
    if (filters.priority !== 'all' && request.priority !== filters.priority) return false;
    if (filters.type !== 'all' && request.type !== filters.type) return false;
    if (filters.duration !== 'all' && request.daysPending < parseInt(filters.duration)) return false;
    if (filters.department !== 'all' && request.department.toLowerCase() !== filters.department) return false;
    if (filters.approver !== 'all' && request.approver.toLowerCase() !== filters.approver) return false;
    if (filters.slaStatus !== 'all') {
      if (filters.slaStatus === 'on_track' && request.daysPending > 3) return false;
      if (filters.slaStatus === 'at_risk' && (request.daysPending < 3 || request.daysPending >= 7)) return false;
      if (filters.slaStatus === 'breached' && request.daysPending < 7) return false;
    }
    if (filters.search && !request.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Pending Requests</h1>
            <p className="text-gray-600 mt-2">Monitor and track your pending approval requests</p>
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

      {/* Urgent Alerts */}
      <UrgentAlerts urgentRequests={urgentRequests} />

      {/* Search and Filters */}
      <div className="mb-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search pending requests..."
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
          <PendingRequestCard
            key={request.id}
            request={request}
            onView={handleView}
            onRemind={handleRemind}
            onEscalate={handleEscalate}
            onCancel={handleCancel}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredRequests.length === 0 && (
        <div className="text-center py-12">
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No pending requests</h3>
          <p className="text-gray-600">All your requests have been processed or match your current filters.</p>
        </div>
      )}
    </div>
  );
}