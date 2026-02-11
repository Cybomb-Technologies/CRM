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

export function VisitsDashboard({ stats, visits = [], onCheckIn, onUpdateStatus }) {
  const todaysVisits = visits.filter(visit => {
    const visitDate = new Date(visit.date).toDateString();
    const today = new Date().toDateString();
    return visitDate === today;
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
              {todaysVisits.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    <p>No visits scheduled for today.</p>
                </div>
              ) : (
                todaysVisits.map((visit) => (
                <div
                  key={visit._id}
                  className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Building2 className="w-4 h-4 text-gray-400" />
                        <span className="font-semibold">{visit.title}</span>
                        {/* Priority is not in model yet, default to medium or use type */}
                        <Badge
                          variant="outline"
                          className="bg-blue-50 text-blue-700"
                        >
                          {visit.type}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <User className="w-4 h-4" />
                        <span>{visit.description || "No description"}</span>
                      </div>
                      <p className="text-sm text-gray-700">{visit.location}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        className={`flex items-center gap-1 ${getStatusColor(
                          visit.status
                        )}`}
                      >
                        {getStatusIcon(visit.status)}
                        {visit.status.replace(/-/g, " ")}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4 text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {visit.startTime} - {visit.endTime}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {visit.status === "scheduled" && (
                        <Button
                          size="sm"
                          onClick={() => onCheckIn(visit._id, visit.location)}
                        >
                          <Navigation className="w-4 h-4 mr-1" />
                          Check In
                        </Button>
                      )}
                      {visit.status === "in-progress" && (
                        <Button
                          size="sm"
                          onClick={() => onUpdateStatus(visit._id, "completed")}
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
              )))}
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
              {visits
                .filter(v => {
                    const d = new Date(v.date);
                    const now = new Date();
                    const nextWeek = new Date();
                    nextWeek.setDate(now.getDate() + 7);
                    return d > now && d <= nextWeek && v.status === 'scheduled';
                })
                .slice(0, 3)
                .map((visit) => (
                <div
                  key={visit._id}
                  className="flex items-center justify-between p-2 border rounded"
                >
                  <div>
                    <div className="font-medium">{visit.title}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(visit.date).toLocaleDateString()} {visit.startTime}
                    </div>
                  </div>
                  <Badge variant="outline">Scheduled</Badge>
                </div>
              ))}
              {visits.filter(v => v.status === 'scheduled').length === 0 && <p className="text-sm text-gray-500">No upcoming visits</p>}
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
              <span className="font-semibold">{visits.filter(v => v.status === 'completed').length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Distance Traveled</span>
              <span className="font-semibold">-- km</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Avg. Visit Duration</span>
              <span className="font-semibold">-- min</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Deals Influenced</span>
              <span className="font-semibold">--</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
