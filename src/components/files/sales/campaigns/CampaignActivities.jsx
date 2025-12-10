import React, { useState, useEffect } from "react";
import { campaignsService } from "./campaignsService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Calendar,
  User,
  Mail,
  Phone,
  MessageSquare,
  CheckCircle,
  Clock,
  Search,
  Filter,
  Edit,
  Trash2,
  Loader2,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const CampaignActivities = ({ campaign, onUpdate }) => {
  const { toast } = useToast();
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [activities, setActivities] = useState(campaign.activities || []);

  const [activityData, setActivityData] = useState({
    title: "",
    type: "Email",
    dueDate: "",
    assignedTo: "",
    description: "",
    priority: "Medium",
    relatedTo: `Campaign: ${campaign.campaignName}`,
  });

  const activityTypes = [
    {
      value: "Email",
      label: "Email",
      icon: Mail,
      color: "bg-blue-100 text-blue-800",
    },
    {
      value: "Call",
      label: "Call",
      icon: Phone,
      color: "bg-green-100 text-green-800",
    },
    {
      value: "Meeting",
      label: "Meeting",
      icon: Calendar,
      color: "bg-purple-100 text-purple-800",
    },
    {
      value: "Task",
      label: "Task",
      icon: CheckCircle,
      color: "bg-orange-100 text-orange-800",
    },
    {
      value: "Note",
      label: "Note",
      icon: MessageSquare,
      color: "bg-gray-100 text-gray-800",
    },
  ];

  const priorities = [
    { value: "Low", label: "Low", color: "bg-gray-100 text-gray-800" },
    {
      value: "Medium",
      label: "Medium",
      color: "bg-yellow-100 text-yellow-800",
    },
    { value: "High", label: "High", color: "bg-red-100 text-red-800" },
  ];

  const statuses = [
    {
      value: "Pending",
      label: "Pending",
      color: "bg-yellow-100 text-yellow-800",
    },
    {
      value: "In Progress",
      label: "In Progress",
      color: "bg-blue-100 text-blue-800",
    },
    {
      value: "Completed",
      label: "Completed",
      color: "bg-green-100 text-green-800",
    },
    {
      value: "Cancelled",
      label: "Cancelled",
      color: "bg-red-100 text-red-800",
    },
  ];

  const filteredActivities = activities.filter((activity) => {
    const matchesSearch =
      activity.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || activity.status === statusFilter;
    const matchesType = typeFilter === "all" || activity.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const handleAddActivity = async () => {
    if (!activityData.title) {
      toast({
        title: "Validation Error",
        description: "Activity title is required.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const campaignIdToUse = campaign._id || campaign.id;

      if (!campaignIdToUse) {
        throw new Error("No valid campaign ID found.");
      }

      const activityDataForBackend = {
        ...activityData,
        dueDate: activityData.dueDate
          ? new Date(activityData.dueDate).toISOString()
          : null,
      };

      const result = await campaignsService.addActivityToCampaign(
        campaignIdToUse,
        activityDataForBackend
      );

      if (result.success) {
        toast({
          title: "Activity Added",
          description: "New activity has been created successfully.",
        });

        setShowAddActivity(false);
        setActivityData({
          title: "",
          type: "Email",
          dueDate: "",
          assignedTo: "",
          description: "",
          priority: "Medium",
          relatedTo: `Campaign: ${campaign.campaignName}`,
        });

        if (result.data && result.data.activities) {
          setActivities(result.data.activities);
        } else if (
          result.data &&
          result.data.data &&
          result.data.data.activities
        ) {
          setActivities(result.data.data.activities || []);
        } else if (result.data) {
          setActivities(result.data.activities || []);
        }

        if (onUpdate) {
          onUpdate();
        }
      } else {
        throw new Error(result.message || "Failed to add activity");
      }
    } catch (error) {
      if (error.message.includes("Campaign not found")) {
        toast({
          title: "Error",
          description: "Could not save activity. Please try again.",
          variant: "destructive",
        });
      } else if (
        error.message.includes("Failed to fetch") ||
        error.message.includes("NetworkError")
      ) {
        toast({
          title: "Network Error",
          description:
            "Unable to connect to the server. Please check your connection.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: error.message || "Failed to add activity",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateActivityStatus = async (activityId, newStatus) => {
    try {
      const campaignIdToUse = campaign._id || campaign.id;

      if (!campaignIdToUse) {
        throw new Error("Campaign ID is missing");
      }

      const result = await campaignsService.updateActivityInCampaign(
        campaignIdToUse,
        activityId,
        { status: newStatus }
      );

      if (result.success) {
        toast({
          title: "Status Updated",
          description: "Activity status has been updated.",
        });

        if (result.data && result.data.activities) {
          setActivities(result.data.activities);
        }

        if (onUpdate) {
          onUpdate();
        }
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to update activity status",
        variant: "destructive",
      });
    }
  };

  const handleDeleteActivity = async (activityId) => {
    if (!confirm("Are you sure you want to delete this activity?")) return;

    try {
      const campaignIdToUse = campaign._id || campaign.id;

      if (!campaignIdToUse) {
        throw new Error("Campaign ID is missing");
      }

      const result = await campaignsService.deleteActivityFromCampaign(
        campaignIdToUse,
        activityId
      );

      if (result.success) {
        toast({
          title: "Activity Deleted",
          description: "Activity has been removed from the campaign.",
        });

        setActivities(activities.filter((a) => a.id !== activityId));

        if (onUpdate) {
          onUpdate();
        }
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete activity",
        variant: "destructive",
      });
    }
  };

  const getActivityTypeIcon = (type) => {
    const activityType = activityTypes.find((t) => t.value === type);
    const IconComponent = activityType?.icon || MessageSquare;
    return <IconComponent className="w-4 h-4" />;
  };

  const getStatusColor = (status) => {
    const statusObj = statuses.find((s) => s.value === status);
    return statusObj?.color || "bg-gray-100 text-gray-800";
  };

  const getPriorityColor = (priority) => {
    const priorityObj = priorities.find((p) => p.value === priority);
    return priorityObj?.color || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Campaign Activities</h3>
          <p className="text-gray-600">
            Track emails, calls, meetings, and tasks related to this campaign
          </p>
        </div>
        <Button onClick={() => setShowAddActivity(true)} disabled={loading}>
          <Plus className="w-4 h-4 mr-2" />
          Add Activity
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search activities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            disabled={loading}
          />
        </div>
        <Select
          value={typeFilter}
          onValueChange={setTypeFilter}
          disabled={loading}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {activityTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={statusFilter}
          onValueChange={setStatusFilter}
          disabled={loading}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {statuses.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Activities List */}
      <div className="space-y-4">
        {filteredActivities.length > 0 ? (
          filteredActivities.map((activity) => (
            <div
              key={activity.id}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-start gap-3 flex-1">
                  <div
                    className={`p-2 rounded-full ${getPriorityColor(
                      activity.priority
                    )}`}
                  >
                    {getActivityTypeIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg">{activity.title}</h4>
                    <p className="text-gray-600 text-sm mt-1">
                      {activity.description}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>{activity.assignedTo || "Unassigned"}</span>
                      </div>
                      {activity.dueDate && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {new Date(activity.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      <Badge className={getStatusColor(activity.status)}>
                        {activity.status}
                      </Badge>
                      <Badge className={getPriorityColor(activity.priority)}>
                        {activity.priority}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Select
                    value={activity.status}
                    onValueChange={(value) =>
                      handleUpdateActivityStatus(activity.id, value)
                    }
                    disabled={loading}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteActivity(activity.id)}
                    className="text-red-600"
                    disabled={loading}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="text-xs text-gray-400 mt-2">
                Created:{" "}
                {activity.createdAt
                  ? new Date(activity.createdAt).toLocaleString()
                  : "Unknown"}
                {activity.updatedAt !== activity.createdAt &&
                  ` • Updated: ${
                    activity.updatedAt
                      ? new Date(activity.updatedAt).toLocaleString()
                      : "Unknown"
                  }`}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">
              No activities found for this campaign.
            </p>
            <Button
              onClick={() => setShowAddActivity(true)}
              variant="outline"
              className="mt-4"
              disabled={loading}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create First Activity
            </Button>
          </div>
        )}
      </div>

      {/* Add Activity Dialog */}
      <Dialog open={showAddActivity} onOpenChange={setShowAddActivity}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Activity</DialogTitle>
            <DialogDescription>
              Add a new activity to track for this campaign.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Title *</label>
              <Input
                value={activityData.title}
                onChange={(e) =>
                  setActivityData((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
                placeholder="Enter activity title"
                disabled={loading}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Type</label>
                <Select
                  value={activityData.type}
                  onValueChange={(value) =>
                    setActivityData((prev) => ({ ...prev, type: value }))
                  }
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {activityTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          {getActivityTypeIcon(type.value)}
                          {type.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Priority</label>
                <Select
                  value={activityData.priority}
                  onValueChange={(value) =>
                    setActivityData((prev) => ({ ...prev, priority: value }))
                  }
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {priorities.map((priority) => (
                      <SelectItem key={priority.value} value={priority.value}>
                        {priority.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Due Date</label>
                <Input
                  type="date"
                  value={activityData.dueDate}
                  onChange={(e) =>
                    setActivityData((prev) => ({
                      ...prev,
                      dueDate: e.target.value,
                    }))
                  }
                  disabled={loading}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Assigned To</label>
                <Input
                  value={activityData.assignedTo}
                  onChange={(e) =>
                    setActivityData((prev) => ({
                      ...prev,
                      assignedTo: e.target.value,
                    }))
                  }
                  placeholder="Assign to team member"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={activityData.description}
                onChange={(e) =>
                  setActivityData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Enter activity description"
                rows={4}
                disabled={loading}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Related To</label>
              <Input
                value={activityData.relatedTo}
                readOnly
                className="bg-gray-50"
                disabled={loading}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAddActivity(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button onClick={handleAddActivity} disabled={loading}>
              {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Plus className="w-4 h-4 mr-2" />
              )}
              Create Activity
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CampaignActivities;
