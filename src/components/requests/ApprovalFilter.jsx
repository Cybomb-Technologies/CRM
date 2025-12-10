// components/ApprovalFilter.jsx
import React from "react";

export const ApprovalFilter = ({ filters, onFilterChange }) => (
  <div className="bg-white rounded-lg border p-4 mb-6">
    <div className="flex items-center space-x-4">
      <input
        type="text"
        placeholder="Search requests..."
        value={filters.search}
        onChange={(e) => onFilterChange("search", e.target.value)}
        className="w-full p-2 border rounded-lg"
      />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
      <select
        value={filters.status}
        onChange={(e) => onFilterChange("status", e.target.value)}
        className="border p-2 rounded-lg"
      >
        <option value="all">All Status</option>
        <option value="pending">Pending</option>
        <option value="approved">Approved</option>
        <option value="rejected">Rejected</option>
      </select>

      <select
        value={filters.type}
        onChange={(e) => onFilterChange("type", e.target.value)}
        className="border p-2 rounded-lg"
      >
        <option value="all">All Types</option>
        <option value="deal">Deal</option>
        <option value="expense">Expense</option>
        <option value="leave">Leave</option>
        <option value="purchase">Purchase</option>
      </select>

      <select
        value={filters.priority}
        onChange={(e) => onFilterChange("priority", e.target.value)}
        className="border p-2 rounded-lg"
      >
        <option value="all">All Priorities</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>
    </div>
  </div>
);