import React, { useState } from "react";
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
  CheckCircle2,
  PlayCircle,
  PauseCircle,
  XCircle,
  Copy,
  Video,
  Monitor,
  Home,
  Briefcase,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  getPriorityColor,
  getStatusColor,
  getStatusIcon,
  meetingAPI,
} from "./utils";

export function MeetingCard({
  meeting,
  onEdit,
  onComplete,
  onDelete,
  onStatusChange,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

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

  const getVenueIcon = (venueType) => {
    switch (venueType) {
      case "online":
        return <Monitor className="w-4 h-4 text-blue-600" />;
      case "in-office":
        return <Home className="w-4 h-4 text-green-600" />;
      case "client-location":
        return <Briefcase className="w-4 h-4 text-purple-600" />;
      default:
        return <MapPin className="w-4 h-4 text-gray-600" />;
    }
  };

  const getVenueText = (venueType) => {
    switch (venueType) {
      case "online":
        return "Online Meeting";
      case "in-office":
        return "In-office";
      case "client-location":
        return "Client Location";
      default:
        return venueType || "Not specified";
    }
  };

  const handleComplete = async () => {
    try {
      setIsCompleting(true);
      await meetingAPI.completeMeeting(meeting._id);
      if (onComplete) onComplete(meeting);
    } catch (error) {
      console.error("Error completing meeting:", error);
    } finally {
      setIsCompleting(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await meetingAPI.updateMeeting(meeting._id, { status: newStatus });
      if (onStatusChange) onStatusChange(meeting, newStatus);
    } catch (error) {
      console.error("Error updating meeting status:", error);
    }
  };

  const handleDuplicate = async () => {
    try {
      const { _id, createdAt, updatedAt, ...meetingData } = meeting;
      const duplicatedMeeting = {
        ...meetingData,
        title: `${meeting.title} (Copy)`,
        status: "scheduled",
      };
      await meetingAPI.createMeeting(duplicatedMeeting);
      // Refresh will be handled by parent component
    } catch (error) {
      console.error("Error duplicating meeting:", error);
    }
  };

  const isOverdue =
    new Date(meeting.endTime) < new Date() && meeting.status !== "completed";

  return (
    <Card
      className={`hover:shadow-md transition-shadow border-l-4 ${
        isOverdue
          ? "border-l-red-500"
          : meeting.priority === "high"
          ? "border-l-red-400"
          : meeting.priority === "medium"
          ? "border-l-orange-400"
          : "border-l-green-400"
      }`}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <div className="flex flex-col items-center mt-1">
              {getVenueIcon(meeting.venueType)}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="font-semibold text-lg flex items-center">
                  <span className="mr-2">{getStatusIcon(meeting.status)}</span>
                  {meeting.title}
                </h3>
                <Badge variant={getPriorityColor(meeting.priority)}>
                  {meeting.priority}
                </Badge>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                    meeting.status
                  )}`}
                >
                  {meeting.status}
                </span>
                {isOverdue && (
                  <Badge variant="destructive" className="animate-pulse">
                    Overdue
                  </Badge>
                )}
              </div>

              <p className="text-gray-600 mb-3">{meeting.description}</p>

              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {formatDate(meeting.startTime)}
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {formatTime(meeting.startTime)} -{" "}
                  {formatTime(meeting.endTime)}
                </div>
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-1" />
                  {meeting.hostName} {/* Changed from assignedTo to hostName */}
                </div>
                <div className="flex items-center">
                  {getVenueIcon(meeting.venueType)}
                  <span className="ml-1">
                    {getVenueText(meeting.venueType)}
                  </span>
                </div>
              </div>

              {meeting.attendees && meeting.attendees.length > 0 && (
                <div className="mt-2 text-sm text-gray-500">
                  <strong>Attendees:</strong>{" "}
                  {meeting.attendees.map((a) => a.name || a.email).join(", ")}
                </div>
              )}

              {meeting.location && (
                <div className="mt-1 text-sm text-gray-500">
                  <strong>Location:</strong> {meeting.location}
                </div>
              )}

              {meeting.venueType === "online" && meeting.meetingLink && (
                <div className="mt-1 text-sm text-blue-600">
                  <strong>Meeting Link:</strong>{" "}
                  <a
                    href={meeting.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-blue-800"
                  >
                    Join Meeting
                  </a>
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
              className="hover:bg-blue-50 hover:text-blue-600"
            >
              <Edit className="w-4 h-4" />
            </Button>

            <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {/* Status Actions */}
                <DropdownMenuItem
                  onClick={() => handleStatusChange("in-progress")}
                  disabled={meeting.status === "in-progress"}
                  className="flex items-center"
                >
                  <PlayCircle className="w-4 h-4 mr-2 text-blue-600" />
                  Start Meeting
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => handleStatusChange("scheduled")}
                  disabled={meeting.status === "scheduled"}
                  className="flex items-center"
                >
                  <PauseCircle className="w-4 h-4 mr-2 text-orange-600" />
                  Reschedule
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={handleComplete}
                  disabled={meeting.status === "completed" || isCompleting}
                  className="flex items-center"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2 text-green-600" />
                  {isCompleting ? "Completing..." : "Mark Complete"}
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => handleStatusChange("cancelled")}
                  disabled={meeting.status === "cancelled"}
                  className="flex items-center"
                >
                  <XCircle className="w-4 h-4 mr-2 text-red-600" />
                  Cancel Meeting
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                {/* Other Actions */}
                <DropdownMenuItem
                  onClick={() => onEdit && onEdit(meeting)}
                  className="flex items-center"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Meeting
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={handleDuplicate}
                  className="flex items-center"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Duplicate Meeting
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() => onDelete && onDelete(meeting)}
                  className="flex items-center text-red-600 focus:text-red-600"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Meeting
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
