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
  Users,
  MapPin,
  Phone,
  PhoneIncoming,
  PhoneOutgoing,
  Edit,
  Trash2,
  MoreVertical,
} from "lucide-react";
import { getPriorityColor } from "./utils";

export function ActivityCard({ activity, onEdit, onComplete, onDelete }) {
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

  const getTypeIcon = (type, isOnline = false, callType = "") => {
    switch (type) {
      case "task":
        return <Calendar className="w-5 h-5 text-blue-600" />;
      case "meeting":
        return isOnline ? (
          <MapPin className="w-5 h-5 text-green-600" />
        ) : (
          <Users className="w-5 h-5 text-green-600" />
        );
      case "call":
        return callType === "inbound" ? (
          <PhoneIncoming className="w-5 h-5 text-purple-600" />
        ) : (
          <PhoneOutgoing className="w-5 h-5 text-purple-600" />
        );
      default:
        return <Calendar className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "in-progress":
        return "bg-yellow-100 text-yellow-800";
      case "pending":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
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

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <div className="flex flex-col items-center mt-1">
              {getTypeIcon(activity.type, activity.isOnline, activity.callType)}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="font-semibold text-lg">{activity.title}</h3>
                <Badge variant={getPriorityColor(activity.priority)}>
                  {activity.priority}
                </Badge>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    activity.status
                  )}`}
                >
                  {activity.status}
                </span>
                {activity.type === "call" && activity.callType && (
                  <Badge variant="outline">{activity.callType}</Badge>
                )}
              </div>

              <p className="text-gray-600 mb-3">{activity.description}</p>

              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {formatDate(
                    activity.dueDate ||
                      activity.startTime ||
                      activity.scheduledTime
                  )}
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {formatTime(
                    activity.dueDate ||
                      activity.startTime ||
                      activity.scheduledTime
                  )}
                </div>
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-1" />
                  {activity.assignedTo}
                </div>
                <div className="flex items-center">
                  {getRelatedToIcon(activity.relatedTo.type)}
                  <span className="ml-1">{activity.relatedTo.name}</span>
                </div>
              </div>

              {/* Type-specific details */}
              {activity.type === "meeting" && activity.attendees && (
                <div className="mt-2 text-sm text-gray-500">
                  <strong>Attendees:</strong> {activity.attendees.join(", ")}
                </div>
              )}

              {activity.type === "meeting" && activity.location && (
                <div className="mt-1 text-sm text-gray-500">
                  <strong>Location:</strong> {activity.location}
                </div>
              )}

              {activity.type === "call" && activity.duration && (
                <div className="mt-1 text-sm text-gray-500">
                  <strong>Duration:</strong> {activity.duration} minutes
                </div>
              )}

              {activity.type === "call" && activity.outcome && (
                <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                  <strong>Outcome:</strong> {activity.outcome}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit && onEdit(activity)}
            >
              <Edit className="w-4 h-4" />
            </Button>
            {activity.status !== "completed" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onComplete && onComplete(activity)}
              >
                Complete
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete && onDelete(activity)}
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
