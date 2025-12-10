// pages/ApprovalsPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Download, FileText } from "lucide-react";
import { ApprovalCard } from "@/components/requests/ApprovalCard";
import { ApprovalFilter } from "@/components/requests/ApprovalFilter";

const ApprovalsPage = () => {
  const navigate = useNavigate();
  
  // Sample data - replace with real data from API
  const [requests, setRequests] = useState([
    {
      id: "REQ-001",
      title: "Annual Leave Request",
      type: "leave",
      status: "pending",
      priority: "medium",
      requestedBy: "John Doe",
      department: "Engineering",
      amount: "$0",
      date: "2024-01-15",
      daysPending: 3,
    },
    {
      id: "REQ-002",
      title: "Software Purchase",
      type: "purchase",
      status: "pending",
      priority: "high",
      requestedBy: "Jane Smith",
      department: "IT",
      amount: "$1,250",
      date: "2024-01-14",
      daysPending: 4,
    },
    {
      id: "REQ-003",
      title: "Business Expense",
      type: "expense",
      status: "approved",
      priority: "low",
      requestedBy: "Mike Johnson",
      department: "Sales",
      amount: "$350",
      date: "2024-01-10",
      daysPending: 0,
    },
    {
      id: "REQ-004",
      title: "Client Deal Approval",
      type: "deal",
      status: "pending",
      priority: "high",
      requestedBy: "Sarah Wilson",
      department: "Sales",
      amount: "$25,000",
      date: "2024-01-13",
      daysPending: 5,
    },
    {
      id: "REQ-005",
      title: "Team Building Event",
      type: "expense",
      status: "rejected",
      priority: "medium",
      requestedBy: "Robert Chen",
      department: "HR",
      amount: "$5,000",
      date: "2024-01-09",
      daysPending: 0,
    },
    {
      id: "REQ-006",
      title: "Maternity Leave",
      type: "leave",
      status: "approved",
      priority: "low",
      requestedBy: "Emily Brown",
      department: "Marketing",
      amount: "$0",
      date: "2024-01-08",
      daysPending: 0,
    },
  ]);

  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    type: "all",
    priority: "all",
  });

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApprove = (id) => {
    setRequests((prev) =>
      prev.map((request) =>
        request.id === id ? { ...request, status: "approved" } : request
      )
    );
    console.log(`Approved request ${id}`);
    // Add API call here
  };

  const handleReject = (id) => {
    setRequests((prev) =>
      prev.map((request) =>
        request.id === id ? { ...request, status: "rejected" } : request
      )
    );
    console.log(`Rejected request ${id}`);
    // Add API call here
  };

  const handleView = (request) => {
    console.log("Viewing request:", request);
    // Navigate to request detail page
    navigate(`/approvals/${request.id}`);
  };

  const handleNewRequest = () => {
    navigate("/approvals/new");
  };

  const handleExport = () => {
    console.log("Exporting data...");
    // Add export logic here
  };

  const filteredRequests = requests.filter((request) => {
    if (filters.search && !request.title.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.status !== "all" && request.status !== filters.status) {
      return false;
    }
    if (filters.type !== "all" && request.type !== filters.type) {
      return false;
    }
    if (filters.priority !== "all" && request.priority !== filters.priority) {
      return false;
    }
    return true;
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Approvals</h1>
          <p className="text-gray-600">Review and manage approval requests</p>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={handleExport}
            className="px-4 py-2 border rounded-lg flex items-center space-x-2 hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          {/* <button 
            onClick={handleNewRequest}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            + New Request
          </button> */}
        </div>
      </div>

      <ApprovalFilter filters={filters} onFilterChange={handleFilterChange} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

      {filteredRequests.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg">No approval requests found</p>
          <p className="text-sm">Try adjusting your filters</p>
        </div>
      )}
    </div>
  );
};

export default ApprovalsPage;