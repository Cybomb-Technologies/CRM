import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  MapPin,
  User,
  Building2,
  Clock,
  Calendar as CalendarIcon,
} from "lucide-react";

export function VisitsCalendar({ onCreateVisit, onUpdateStatus }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Mock visits data
  const visits = [
    {
      id: 1,
      account: "TechCorp Inc",
      contact: "John Smith",
      purpose: "Product Demo",
      date: "2024-01-15",
      time: "10:00",
      duration: "60",
      status: "scheduled",
      type: "demo",
    },
    {
      id: 2,
      account: "Startup Solutions",
      contact: "Sarah Johnson",
      purpose: "Contract Review",
      date: "2024-01-15",
      time: "14:30",
      duration: "45",
      status: "scheduled",
      type: "meeting",
    },
    {
      id: 3,
      account: "Global Enterprises",
      contact: "Mike Rodriguez",
      purpose: "Quarterly Review",
      date: "2024-01-16",
      time: "11:00",
      duration: "90",
      status: "scheduled",
      type: "review",
    },
  ];

  const getVisitsForDate = (date) => {
    const dateStr = date.toISOString().split("T")[0];
    return visits.filter((visit) => visit.date === dateStr);
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];

    // Add previous month's days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    const firstDayOfWeek = firstDay.getDay();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthLastDay - i),
        isCurrentMonth: false,
        visits: [],
      });
    }

    // Add current month's days
    const daysInMonth = lastDay.getDate();
    for (let i = 1; i <= daysInMonth; i++) {
      const dayDate = new Date(year, month, i);
      days.push({
        date: dayDate,
        isCurrentMonth: true,
        visits: getVisitsForDate(dayDate),
      });
    }

    // Add next month's days
    const totalCells = 42; // 6 weeks
    const nextMonthDays = totalCells - days.length;
    for (let i = 1; i <= nextMonthDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
        visits: [],
      });
    }

    return days;
  };

  const days = getDaysInMonth(currentDate);
  const selectedDateVisits = getVisitsForDate(selectedDate);

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "scheduled":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getDayName = (date) => {
    return date.toLocaleDateString("en-US", { weekday: "short" });
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  return (
    <div className="grid grid-cols-3 gap-6">
      {/* Calendar */}
      <div className="col-span-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5" />
                {currentDate.toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateMonth(-1)}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentDate(new Date())}
                >
                  Today
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateMonth(1)}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Week days header */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div
                  key={day}
                  className="text-center text-sm font-medium text-gray-500 py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {days.map((day, index) => {
                const daySelected = isSelected(day.date);
                const dayToday = isToday(day.date);

                return (
                  <div
                    key={index}
                    className={`min-h-[100px] p-1 border rounded cursor-pointer transition-colors ${
                      daySelected
                        ? "bg-blue-50 border-blue-200"
                        : "hover:bg-gray-50"
                    } ${!day.isCurrentMonth ? "opacity-30" : ""}`}
                    onClick={() => setSelectedDate(day.date)}
                  >
                    <div
                      className={`text-sm font-medium p-1 rounded text-center ${
                        dayToday ? "bg-blue-600 text-white" : ""
                      }`}
                    >
                      {day.date.getDate()}
                    </div>
                    <div className="space-y-1 mt-1">
                      {day.visits.slice(0, 2).map((visit, visitIndex) => (
                        <div
                          key={visitIndex}
                          className="text-xs p-1 bg-blue-100 text-blue-800 rounded truncate"
                          title={`${visit.time} - ${visit.account}`}
                        >
                          {visit.time} {visit.account}
                        </div>
                      ))}
                      {day.visits.length > 2 && (
                        <div className="text-xs text-gray-500 text-center">
                          +{day.visits.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Selected Date Details */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5" />
              {selectedDate.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {selectedDateVisits.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <CalendarIcon className="w-12 h-12 mx-auto mb-4" />
                  <p>No visits scheduled</p>
                  <Button
                    className="mt-2"
                    size="sm"
                    onClick={() => setShowCreateForm(true)}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Plan Visit
                  </Button>
                </div>
              ) : (
                selectedDateVisits.map((visit) => (
                  <div key={visit.id} className="p-3 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-semibold flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-gray-400" />
                          {visit.account}
                        </div>
                        <div className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                          <User className="w-4 h-4" />
                          {visit.contact}
                        </div>
                      </div>
                      <Badge className={getStatusColor(visit.status)}>
                        {visit.status}
                      </Badge>
                    </div>

                    <p className="text-sm text-gray-700 mb-2">
                      {visit.purpose}
                    </p>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {visit.time} ({visit.duration}m)
                      </div>
                      <Button size="sm" variant="outline">
                        <MapPin className="w-4 h-4 mr-1" />
                        Directions
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Day Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm">Total Visits</span>
              <span className="font-semibold">{selectedDateVisits.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Total Duration</span>
              <span className="font-semibold">
                {selectedDateVisits.reduce(
                  (total, visit) => total + parseInt(visit.duration),
                  0
                )}{" "}
                min
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Travel Time</span>
              <span className="font-semibold">~45 min</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Priority Visits</span>
              <span className="font-semibold text-red-600">
                {selectedDateVisits.filter((v) => v.type === "demo").length}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Visit
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              size="sm"
            >
              <MapPin className="w-4 h-4 mr-2" />
              Optimize Route
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              size="sm"
            >
              <Clock className="w-4 h-4 mr-2" />
              Set Reminder
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
