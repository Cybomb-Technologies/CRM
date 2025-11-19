import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Navigation,
  CheckCircle,
  Building2,
  User,
  Clock,
  Filter,
} from "lucide-react";

export function VisitsMap({ onCheckIn }) {
  const [selectedVisit, setSelectedVisit] = useState(null);

  // Mock visits data with coordinates
  const visits = [
    {
      id: 1,
      account: "TechCorp Inc",
      contact: "John Smith",
      purpose: "Product Demo",
      scheduledTime: "2024-01-15T10:00:00",
      location: "123 Business Ave, City",
      coordinates: { lat: 40.7128, lng: -74.006 },
      status: "scheduled",
      duration: "60 mins",
    },
    {
      id: 2,
      account: "Startup Solutions",
      contact: "Sarah Johnson",
      purpose: "Contract Review",
      scheduledTime: "2024-01-15T14:30:00",
      location: "456 Innovation St, City",
      coordinates: { lat: 40.7218, lng: -74.016 },
      status: "scheduled",
      duration: "45 mins",
    },
    {
      id: 3,
      account: "Global Enterprises",
      contact: "Mike Rodriguez",
      purpose: "Quarterly Review",
      scheduledTime: "2024-01-16T11:00:00",
      location: "789 Corporate Blvd, City",
      coordinates: { lat: 40.7028, lng: -74.026 },
      status: "scheduled",
      duration: "90 mins",
    },
  ];

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

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // This would be replaced with an actual map component like Google Maps or Leaflet
  const MapPlaceholder = () => (
    <div className="w-full h-[500px] bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center text-white">
      <div className="text-center">
        <MapPin className="w-16 h-16 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Interactive Map View</h3>
        <p className="text-blue-100">
          Visits would be displayed on an interactive map
        </p>
        <p className="text-blue-100 text-sm mt-1">
          Integration with Google Maps/Mapbox
        </p>

        {/* Mock map markers */}
        <div className="relative w-full h-64 mt-6">
          {visits.map((visit, index) => (
            <div
              key={visit.id}
              className={`absolute w-6 h-6 bg-red-500 rounded-full border-2 border-white cursor-pointer transform -translate-x-1/2 -translate-y-1/2 ${
                selectedVisit?.id === visit.id
                  ? "ring-2 ring-blue-400 scale-125"
                  : ""
              }`}
              style={{
                left: `${20 + index * 30}%`,
                top: `${30 + index * 20}%`,
              }}
              onClick={() => setSelectedVisit(visit)}
            />
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-3 gap-6">
      {/* Map */}
      <div className="col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Visits Map View
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MapPlaceholder />
          </CardContent>
        </Card>
      </div>

      {/* Visits List */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Today's Visits</span>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-1" />
                Filter
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {visits.map((visit) => (
                <div
                  key={visit.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-all ${
                    selectedVisit?.id === visit.id
                      ? "border-blue-300 bg-blue-50"
                      : "hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedVisit(visit)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Building2 className="w-4 h-4 text-gray-400" />
                        <span className="font-semibold">{visit.account}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                        <User className="w-4 h-4" />
                        <span>{visit.contact}</span>
                      </div>
                    </div>
                    <Badge className={getStatusColor(visit.status)}>
                      {visit.status}
                    </Badge>
                  </div>

                  <p className="text-sm text-gray-700 mb-2">{visit.purpose}</p>

                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {formatTime(visit.scheduledTime)}
                    </div>
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onCheckIn(visit.id, visit.location);
                      }}
                    >
                      <Navigation className="w-4 h-4 mr-1" />
                      Check In
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Selected Visit Details */}
        {selectedVisit && (
          <Card>
            <CardHeader>
              <CardTitle>Visit Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Account
                  </label>
                  <p className="font-semibold">{selectedVisit.account}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Contact
                  </label>
                  <p>{selectedVisit.contact}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Purpose
                  </label>
                  <p>{selectedVisit.purpose}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Time
                  </label>
                  <p>
                    {formatTime(selectedVisit.scheduledTime)} (
                    {selectedVisit.duration})
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Location
                  </label>
                  <p className="text-sm">{selectedVisit.location}</p>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button className="flex-1">
                    <Navigation className="w-4 h-4 mr-1" />
                    Get Directions
                  </Button>
                  <Button variant="outline">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Complete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Route Optimization */}
        <Card>
          <CardHeader>
            <CardTitle>Route Optimization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Total Distance</span>
                <span className="font-semibold">18.5 km</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Estimated Time</span>
                <span className="font-semibold">45 min</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Fuel Cost</span>
                <span className="font-semibold">$12.50</span>
              </div>
              <Button className="w-full">
                <Navigation className="w-4 h-4 mr-2" />
                Optimize Route
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
