import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  User,
  Building,
  Target,
  Phone,
  PhoneIncoming,
  PhoneOutgoing,
  Edit,
  Trash2,
  MoreVertical,
} from "lucide-react";

export function CallCard({ call, onEdit, onComplete, onDelete }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "destructive";
      case "medium":
        return "default";
      case "low":
        return "secondary";
      default:
        return "default";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "missed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRelatedToIcon = (type) => {
    switch (type) {
      case "deal":
        return <Target className="w-4 h-4" />;
      case "account":
        return <Building className="w-4 h-4" />;
      case "contact":
        return <User className="w-4 h-4" />;
      case "lead":
        return <User className="w-4 h-4" />;
      default:
        return <Building className="w-4 h-4" />;
    }
  };

  const getCallIcon = (callType) => {
    return callType === "inbound" ? (
      <PhoneIncoming className="w-5 h-5 text-purple-600" />
    ) : (
      <PhoneOutgoing className="w-5 h-5 text-purple-600" />
    );
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <div className="flex flex-col items-center mt-1">
              {getCallIcon(call.callType)}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="font-semibold text-lg">{call.title}</h3>
                <Badge variant={getPriorityColor(call.priority)}>
                  {call.priority}
                </Badge>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    call.status
                  )}`}
                >
                  {call.status}
                </span>
                <Badge variant="outline">{call.callType}</Badge>
              </div>

              <p className="text-gray-600 mb-3">{call.description}</p>

              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {formatDate(call.scheduledTime)}
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {formatTime(call.scheduledTime)}
                </div>
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-1" />
                  {call.assignedTo}
                </div>
                <div className="flex items-center">
                  {getRelatedToIcon(call.relatedTo.type)}
                  <span className="ml-1">{call.relatedTo.name}</span>
                </div>
              </div>

              {call.duration && (
                <div className="mt-1 text-sm text-gray-500">
                  <strong>Duration:</strong> {call.duration} minutes
                </div>
              )}

              {call.phoneNumber && (
                <div className="mt-1 text-sm text-gray-500">
                  <strong>Phone:</strong> {call.phoneNumber}
                </div>
              )}

              {call.outcome && (
                <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                  <strong>Outcome:</strong> {call.outcome}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit && onEdit(call)}
            >
              <Edit className="w-4 h-4" />
            </Button>
            {call.status !== "completed" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onComplete && onComplete(call)}
              >
                Complete
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete && onDelete(call)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
