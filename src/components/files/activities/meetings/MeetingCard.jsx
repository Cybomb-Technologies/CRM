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
  Edit,
  Trash2,
  MoreVertical,
} from "lucide-react";

export function MeetingCard({ meeting, onEdit, onComplete, onDelete }) {
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
      case "in-progress":
        return "bg-yellow-100 text-yellow-800";
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
              {meeting.isOnline ? (
                <MapPin className="w-5 h-5 text-green-600" />
              ) : (
                <Users className="w-5 h-5 text-green-600" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="font-semibold text-lg">{meeting.title}</h3>
                <Badge variant={getPriorityColor(meeting.priority)}>
                  {meeting.priority}
                </Badge>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    meeting.status
                  )}`}
                >
                  {meeting.status}
                </span>
              </div>

              <p className="text-gray-600 mb-3">{meeting.description}</p>

              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {formatDate(meeting.startTime)}
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {formatTime(meeting.startTime)}
                </div>
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-1" />
                  {meeting.assignedTo}
                </div>
                <div className="flex items-center">
                  {getRelatedToIcon(meeting.relatedTo.type)}
                  <span className="ml-1">{meeting.relatedTo.name}</span>
                </div>
              </div>

              {meeting.attendees && (
                <div className="mt-2 text-sm text-gray-500">
                  <strong>Attendees:</strong> {meeting.attendees.join(", ")}
                </div>
              )}

              {meeting.location && (
                <div className="mt-1 text-sm text-gray-500">
                  <strong>Location:</strong> {meeting.location}
                </div>
              )}

              {meeting.duration && (
                <div className="mt-1 text-sm text-gray-500">
                  <strong>Duration:</strong> {meeting.duration} minutes
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit && onEdit(meeting)}
            >
              <Edit className="w-4 h-4" />
            </Button>
            {meeting.status !== "completed" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onComplete && onComplete(meeting)}
              >
                Complete
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete && onDelete(meeting)}
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
