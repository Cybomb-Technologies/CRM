// components/ApprovalCard.jsx
import React from "react";
import { Clock, Eye, FileText, DollarSign, Calendar, Building2 } from "lucide-react";

const cn = (...classes) => classes.filter(Boolean).join(" ");

export const ApprovalCard = ({ request, onApprove, onReject, onView }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "approved":
        return "text-green-600 bg-green-100";
      case "rejected":
        return "text-red-600 bg-red-100";
      case "escalated":
        return "text-purple-600 bg-purple-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-100";
      case "medium":
        return "text-yellow-600 bg-yellow-100";
      case "low":
        return "text-green-600 bg-green-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "deal":
        return <DollarSign className="w-4 h-4 text-green-600" />;
      case "expense":
        return <FileText className="w-4 h-4 text-blue-600" />;
      case "leave":
        return <Calendar className="w-4 h-4 text-purple-600" />;
      case "purchase":
        return <Building2 className="w-4 h-4 text-orange-600" />;
      default:
        return <FileText className="w-4 h-4 text-gray-600" />;
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
          <span
            className={cn(
              "px-2 py-1 text-xs rounded-full font-medium",
              getStatusColor(request.status)
            )}
          >
            {request.status[0].toUpperCase() + request.status.slice(1)}
          </span>
          <span
            className={cn(
              "px-2 py-1 text-xs rounded-full font-medium",
              getPriorityColor(request.priority)
            )}
          >
            {request.priority[0].toUpperCase() + request.priority.slice(1)}
          </span>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Requested By:</span>
          <span className="font-medium text-gray-900">
            {request.requestedBy}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Department:</span>
          <span className="font-medium text-gray-900">
            {request.department}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Amount:</span>
          <span className="font-medium text-gray-900">{request.amount}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Date:</span>
          <span className="font-medium text-gray-900">{request.date}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Clock className="w-4 h-4" />
          <span>{request.daysPending} days pending</span>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => onView(request)}
            className="p-2 text-gray-400 hover:text-gray-700"
          >
            <Eye className="w-4 h-4" />
          </button>

          {request.status === "pending" && (
            <>
              <button
                onClick={() => onApprove(request.id)}
                className="px-3 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600"
              >
                Approve
              </button>

              <button
                onClick={() => onReject(request.id)}
                className="px-3 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600"
              >
                Reject
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};