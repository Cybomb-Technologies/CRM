import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Filter,
  MapPin,
  User,
  Building2,
  Clock,
  Navigation,
  CheckCircle,
  PlayCircle,
  Calendar,
} from "lucide-react";

export function VisitsList({ onCheckIn, onUpdateStatus }) {
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const visits = [
    {
      id: 1,
      account: "TechCorp Inc",
      contact: "John Smith",
      purpose: "Product Demo",
      scheduledDate: "2024-01-15",
      scheduledTime: "10:00 AM",
      location: "123 Business Ave, City",
      status: "scheduled",
      duration: "60 mins",
      priority: "high",
      type: "demo",
    },
    {
      id: 2,
      account: "Startup Solutions",
      contact: "Sarah Johnson",
      purpose: "Contract Review",
      scheduledDate: "2024-01-15",
      scheduledTime: "2:30 PM",
      location: "456 Innovation St, City",
      status: "in_progress",
      duration: "45 mins",
      priority: "medium",
      type: "meeting",
    },
    {
      id: 3,
      account: "Global Enterprises",
      contact: "Mike Rodriguez",
      purpose: "Quarterly Review",
      scheduledDate: "2024-01-16",
      scheduledTime: "11:00 AM",
      location: "789 Corporate Blvd, City",
      status: "scheduled",
      duration: "90 mins",
      priority: "high",
      type: "review",
    },
    {
      id: 4,
      account: "Local Business Co",
      contact: "Emily Davis",
      purpose: "Follow-up Meeting",
      scheduledDate: "2024-01-14",
      scheduledTime: "3:00 PM",
      location: "321 Main Street, City",
      status: "completed",
      duration: "30 mins",
      priority: "low",
      type: "followup",
    },
  ];

  const filteredVisits = visits.filter((visit) => {
    if (filterStatus !== "all" && visit.status !== filterStatus) return false;
    if (
      searchQuery &&
      !visit.account.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !visit.contact.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "scheduled":
        return "bg-yellow-100 text-yellow-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "in_progress":
        return <PlayCircle className="w-4 h-4" />;
      case "scheduled":
        return <Clock className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search visits by account or contact..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="w-48">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Visits List */}
      <Card>
        <CardContent className="p-0">
          {/* List Header */}
          <div className="flex items-center p-4 border-b bg-gray-50">
            <Checkbox />
            <div className="grid grid-cols-12 gap-4 flex-1">
              <div className="col-span-3 font-semibold">Account & Contact</div>
              <div className="col-span-2 font-semibold">Purpose</div>
              <div className="col-span-2 font-semibold">Date & Time</div>
              <div className="col-span-2 font-semibold">Location</div>
              <div className="col-span-1 font-semibold">Status</div>
              <div className="col-span-2 font-semibold">Actions</div>
            </div>
          </div>

          {/* Visits */}
          <div className="divide-y">
            {filteredVisits.map((visit) => (
              <div
                key={visit.id}
                className="flex items-center p-4 hover:bg-gray-50 transition-colors"
              >
                <Checkbox className="mr-4" />
                <div className="grid grid-cols-12 gap-4 flex-1 items-center">
                  {/* Account & Contact */}
                  <div className="col-span-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Building2 className="w-4 h-4 text-gray-400" />
                      <span className="font-semibold">{visit.account}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <User className="w-4 h-4" />
                      <span>{visit.contact}</span>
                    </div>
                  </div>

                  {/* Purpose */}
                  <div className="col-span-2">
                    <span className="text-sm">{visit.purpose}</span>
                    <Badge
                      variant="outline"
                      className={getPriorityColor(visit.priority)}
                    >
                      {visit.priority}
                    </Badge>
                  </div>

                  {/* Date & Time */}
                  <div className="col-span-2">
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar className="w-4 h-4" />
                      {new Date(visit.scheduledDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      {visit.scheduledTime}
                    </div>
                  </div>

                  {/* Location */}
                  <div className="col-span-2">
                    <div className="flex items-center gap-1 text-sm">
                      <MapPin className="w-4 h-4" />
                      <span className="truncate">{visit.location}</span>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="col-span-1">
                    <Badge
                      className={`flex items-center gap-1 ${getStatusColor(
                        visit.status
                      )}`}
                    >
                      {getStatusIcon(visit.status)}
                      {visit.status.replace("_", " ")}
                    </Badge>
                  </div>

                  {/* Actions */}
                  <div className="col-span-2">
                    <div className="flex items-center gap-2">
                      {visit.status === "scheduled" && (
                        <Button
                          size="sm"
                          onClick={() => onCheckIn(visit.id, visit.location)}
                        >
                          <Navigation className="w-4 h-4 mr-1" />
                          Check In
                        </Button>
                      )}
                      {visit.status === "in_progress" && (
                        <Button
                          size="sm"
                          onClick={() => onUpdateStatus(visit.id, "completed")}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Complete
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        Directions
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredVisits.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <MapPin className="w-12 h-12 mx-auto mb-4" />
              <p>No visits found</p>
              <p className="text-sm">
                Try adjusting your filters or search criteria
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
