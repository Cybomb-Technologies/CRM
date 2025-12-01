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
  PhoneIncoming,
  PhoneOutgoing,
  Edit,
  Trash2,
  MoreVertical,
  CheckCircle2,
  PlayCircle,
  PauseCircle,
  XCircle,
  Copy,
  Volume2,
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
  getCallTypeIcon,
  callAPI,
} from "./utils";

export function CallCard({
  call,
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

  const getCallIcon = (callType) => {
    return callType === "inbound" ? (
      <PhoneIncoming className="w-5 h-5 text-purple-600" />
    ) : (
      <PhoneOutgoing className="w-5 h-5 text-purple-600" />
    );
  };

  const handleComplete = async () => {
    try {
      setIsCompleting(true);
      await callAPI.completeCall(call._id);
      if (onComplete) onComplete(call);
    } catch (error) {
      console.error("Error completing call:", error);
    } finally {
      setIsCompleting(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await callAPI.updateCall(call._id, { status: newStatus });
      if (onStatusChange) onStatusChange(call, newStatus);
    } catch (error) {
      console.error("Error updating call status:", error);
    }
  };

  const handleDuplicate = async () => {
    try {
      const { _id, createdAt, updatedAt, ...callData } = call;
      const duplicatedCall = {
        ...callData,
        title: `${call.title} (Copy)`,
        status: "scheduled",
      };
      await callAPI.createCall(duplicatedCall);
      // Refresh will be handled by parent component
    } catch (error) {
      console.error("Error duplicating call:", error);
    }
  };

  const isOverdue =
    new Date(call.scheduledTime) < new Date() && call.status !== "completed";

  return (
    <Card
      className={`hover:shadow-md transition-shadow border-l-4 ${
        isOverdue
          ? "border-l-red-500"
          : call.priority === "high"
          ? "border-l-red-400"
          : call.priority === "medium"
          ? "border-l-orange-400"
          : "border-l-green-400"
      }`}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <div className="flex flex-col items-center mt-1">
              {getCallIcon(call.callType)}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="font-semibold text-lg flex items-center">
                  <span className="mr-2">{getStatusIcon(call.status)}</span>
                  {call.title}
                </h3>
                <Badge variant={getPriorityColor(call.priority)}>
                  {call.priority}
                </Badge>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                    call.status
                  )}`}
                >
                  {call.status}
                </span>
                <Badge variant="outline">
                  <span className="mr-1">{getCallTypeIcon(call.callType)}</span>
                  {call.callType}
                </Badge>
                {isOverdue && (
                  <Badge variant="destructive" className="animate-pulse">
                    Overdue
                  </Badge>
                )}
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

              {call.callRecording && (
                <div className="mt-2">
                  <Button variant="outline" size="sm">
                    <Volume2 className="w-4 h-4 mr-2" />
                    Play Recording
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit && onEdit(call)}
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
                  onClick={() => handleStatusChange("scheduled")}
                  disabled={call.status === "scheduled"}
                  className="flex items-center"
                >
                  <PauseCircle className="w-4 h-4 mr-2 text-orange-600" />
                  Reschedule
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={handleComplete}
                  disabled={call.status === "completed" || isCompleting}
                  className="flex items-center"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2 text-green-600" />
                  {isCompleting ? "Completing..." : "Mark Complete"}
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => handleStatusChange("missed")}
                  disabled={call.status === "missed"}
                  className="flex items-center"
                >
                  <XCircle className="w-4 h-4 mr-2 text-red-600" />
                  Mark as Missed
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => handleStatusChange("cancelled")}
                  disabled={call.status === "cancelled"}
                  className="flex items-center"
                >
                  <XCircle className="w-4 h-4 mr-2 text-gray-600" />
                  Cancel Call
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                {/* Other Actions */}
                <DropdownMenuItem
                  onClick={() => onEdit && onEdit(call)}
                  className="flex items-center"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Call
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={handleDuplicate}
                  className="flex items-center"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Duplicate Call
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() => onDelete && onDelete(call)}
                  className="flex items-center text-red-600 focus:text-red-600"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Call
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
