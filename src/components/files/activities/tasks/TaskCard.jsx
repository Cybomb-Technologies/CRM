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
  Edit,
  Trash2,
  MoreVertical,
  CheckCircle2,
  PlayCircle,
  PauseCircle,
  XCircle,
  Copy,
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
  taskAPI,
} from "./utils";

export function TaskCard({
  task,
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

  const handleComplete = async () => {
    try {
      setIsCompleting(true);
      await taskAPI.completeTask(task._id);
      if (onComplete) onComplete(task);
    } catch (error) {
      console.error("Error completing task:", error);
    } finally {
      setIsCompleting(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await taskAPI.updateTask(task._id, { status: newStatus });
      if (onStatusChange) onStatusChange(task, newStatus);
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const handleDuplicate = async () => {
    try {
      const { _id, createdAt, updatedAt, ...taskData } = task;
      const duplicatedTask = {
        ...taskData,
        title: `${task.title} (Copy)`,
        status: "pending",
      };
      await taskAPI.createTask(duplicatedTask);
      // Refresh will be handled by parent component
    } catch (error) {
      console.error("Error duplicating task:", error);
    }
  };

  const isOverdue =
    new Date(task.dueDate) < new Date() && task.status !== "completed";

  return (
    <Card
      className={`hover:shadow-md transition-shadow border-l-4 ${
        isOverdue
          ? "border-l-red-500"
          : task.priority === "high"
          ? "border-l-red-400"
          : task.priority === "medium"
          ? "border-l-orange-400"
          : "border-l-green-400"
      }`}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <div className="flex flex-col items-center mt-1">
              <button
                onClick={handleComplete}
                disabled={isCompleting || task.status === "completed"}
                className={`p-1 rounded-full transition-colors ${
                  task.status === "completed"
                    ? "text-green-600 bg-green-100"
                    : "text-blue-600 hover:bg-blue-100"
                } ${isCompleting ? "opacity-50" : ""}`}
              >
                <CheckCircle2 className="w-5 h-5" />
              </button>
              {isCompleting && (
                <div className="mt-1 w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="font-semibold text-lg flex items-center">
                  <span className="mr-2">{getStatusIcon(task.status)}</span>
                  {task.title}
                </h3>
                <Badge variant={getPriorityColor(task.priority)}>
                  {task.priority}
                </Badge>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                    task.status
                  )}`}
                >
                  {task.status}
                </span>
                {isOverdue && (
                  <Badge variant="destructive" className="animate-pulse">
                    Overdue
                  </Badge>
                )}
              </div>

              <p className="text-gray-600 mb-3">{task.description}</p>

              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {formatDate(task.dueDate)}
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {formatTime(task.dueDate)}
                </div>
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-1" />
                  {task.assignedTo}
                </div>
                <div className="flex items-center">
                  {getRelatedToIcon(task.relatedTo.type)}
                  <span className="ml-1">{task.relatedTo.name}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit && onEdit(task)}
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
                  disabled={task.status === "in-progress"}
                  className="flex items-center"
                >
                  <PlayCircle className="w-4 h-4 mr-2 text-blue-600" />
                  Start Progress
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => handleStatusChange("pending")}
                  disabled={task.status === "pending"}
                  className="flex items-center"
                >
                  <PauseCircle className="w-4 h-4 mr-2 text-orange-600" />
                  Mark as Pending
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={handleComplete}
                  disabled={task.status === "completed" || isCompleting}
                  className="flex items-center"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2 text-green-600" />
                  {isCompleting ? "Completing..." : "Mark Complete"}
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => handleStatusChange("cancelled")}
                  disabled={task.status === "cancelled"}
                  className="flex items-center"
                >
                  <XCircle className="w-4 h-4 mr-2 text-red-600" />
                  Cancel Task
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                {/* Other Actions */}
                <DropdownMenuItem
                  onClick={() => onEdit && onEdit(task)}
                  className="flex items-center"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Task
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={handleDuplicate}
                  className="flex items-center"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Duplicate Task
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() => onDelete && onDelete(task)}
                  className="flex items-center text-red-600 focus:text-red-600"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Task
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
