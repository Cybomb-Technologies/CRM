import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Clock,
  User,
  Building2,
  Navigation,
  CheckCircle,
  PlayCircle,
  AlertTriangle,
  Calendar,
  Plus, // ADD THIS IMPORT
} from "lucide-react";

// Custom Progress Bar component since Progress doesn't exist
const ProgressBar = ({ value, className = "" }) => {
  return (
    <div className={`w-full bg-gray-200 rounded-full h-2 ${className}`}>
      <div
        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
        style={{ width: `${value}%` }}
      />
    </div>
  );
};

export function VisitsDashboard({ stats, onCheckIn, onUpdateStatus }) {
  const [todaysVisits] = useState([
    {
      id: 1,
      account: "TechCorp Inc",
      contact: "John Smith",
      purpose: "Product Demo",
      scheduledTime: "2024-01-15T10:00:00",
      location: "123 Business Ave, City",
      status: "scheduled",
      duration: "60 mins",
      priority: "high",
    },
    {
      id: 2,
      account: "Startup Solutions",
      contact: "Sarah Johnson",
      purpose: "Contract Review",
      scheduledTime: "2024-01-15T14:30:00",
      location: "456 Innovation St, City",
      status: "in_progress",
      duration: "45 mins",
      priority: "medium",
    },
    {
      id: 3,
      account: "Global Enterprises",
      contact: "Mike Rodriguez",
      purpose: "Quarterly Review",
      scheduledTime: "2024-01-15T16:00:00",
      location: "789 Corporate Blvd, City",
      status: "scheduled",
      duration: "90 mins",
      priority: "high",
    },
  ]);

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
      case "overdue":
        return <AlertTriangle className="w-4 h-4" />;
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

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="grid grid-cols-3 gap-6">
      {/* Today's Visits */}
      <div className="col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Today's Visits ({todaysVisits.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todaysVisits.map((visit) => (
                <div
                  key={visit.id}
                  className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Building2 className="w-4 h-4 text-gray-400" />
                        <span className="font-semibold">{visit.account}</span>
                        <Badge
                          variant="outline"
                          className={getPriorityColor(visit.priority)}
                        >
                          {visit.priority}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <User className="w-4 h-4" />
                        <span>{visit.contact}</span>
                      </div>
                      <p className="text-sm text-gray-700">{visit.purpose}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        className={`flex items-center gap-1 ${getStatusColor(
                          visit.status
                        )}`}
                      >
                        {getStatusIcon(visit.status)}
                        {visit.status.replace("_", " ")}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4 text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatTime(visit.scheduledTime)}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{visit.duration}</span>
                      </div>
                    </div>

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
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Visit Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Visit Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Completion Rate</span>
                  <span>85%</span>
                </div>
                <ProgressBar value={85} className="w-full" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>On-time Arrival</span>
                  <span>78%</span>
                </div>
                <ProgressBar value={78} className="w-full" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Customer Satisfaction</span>
                  <span>92%</span>
                </div>
                <ProgressBar value={92} className="w-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Sidebar */}
      <div className="space-y-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start">
              <Plus className="w-4 h-4 mr-2" />
              Plan New Visit
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <MapPin className="w-4 h-4 mr-2" />
              Optimize Route
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Clock className="w-4 h-4 mr-2" />
              Reschedule Visits
            </Button>
          </CardContent>
        </Card>

        {/* Upcoming Visits */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="flex items-center justify-between p-2 border rounded"
                >
                  <div>
                    <div className="font-medium">Client Meeting {item}</div>
                    <div className="text-sm text-gray-500">
                      Tomorrow, 2:00 PM
                    </div>
                  </div>
                  <Badge variant="outline">Scheduled</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Stats */}
        <Card>
          <CardHeader>
            <CardTitle>This Month</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm">Visits Completed</span>
              <span className="font-semibold">18</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Distance Traveled</span>
              <span className="font-semibold">245 km</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Avg. Visit Duration</span>
              <span className="font-semibold">48 min</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Deals Influenced</span>
              <span className="font-semibold">6</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
