import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { VisitsDashboard } from "@/components/files/integrations/visits/VisitsDashboard";
import { VisitsCalendar } from "@/components/files/integrations/visits/VisitsCalendar";
import { VisitsList } from "@/components/files/integrations/visits/VisitsList";
import { VisitsMap } from "@/components/files/integrations/visits/VisitsMap";
import { VisitsReports } from "@/components/files/integrations/visits/VisitsReports";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  RefreshCw,
  MapPin,
  Calendar,
  List,
  BarChart3,
  Navigation,
  Users,
  Clock,
  CheckCircle,
} from "lucide-react";

import { getVisitsStats, getVisits, createVisit, updateVisitStatus } from "@/services/visitsService";

export default function VisitsPage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [refreshing, setRefreshing] = useState(false);
  const [visitsStats, setVisitsStats] = useState({
    scheduled: 0,
    completed: 0,
    inProgress: 0,
    overdue: 0,
  });
  const [visits, setVisits] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [stats, visitsData] = await Promise.all([
        getVisitsStats(),
        getVisits()
      ]);
      setVisitsStats(stats);
      setVisits(visitsData);
    } catch (error) {
      console.error("Failed to load data:", error);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadData().finally(() => setRefreshing(false));
  };

  const handleCreateVisit = async (visitData) => {
    try {
      await createVisit(visitData);
      loadData();
    } catch (error) {
        console.error("Failed to create visit:", error);
    }
  };

  const handleUpdateVisitStatus = async (visitId, status) => {
    try {
        await updateVisitStatus(visitId, status);
        loadData();
    } catch (error) {
        console.error("Failed to update visit status:", error);
    }
  };

  const handleCheckIn = async (visitId, location) => {
    handleUpdateVisitStatus(visitId, 'in-progress');
  };

  return (
    <>
      <Helmet>
        <title>Visits - CloudCRM</title>
      </Helmet>

      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Visits</h1>
            <p className="text-gray-600">
              Manage field visits, track locations, and optimize routes
            </p>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Plan Visit
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Scheduled</p>
                <p className="text-2xl font-bold text-blue-600">
                  {visitsStats.scheduled}
                </p>
                <p className="text-xs text-gray-500">Today: {visits.filter(v => new Date(v.date).toDateString() === new Date().toDateString() && v.status === 'scheduled').length} visits</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">
                  {visitsStats.completed}
                </p>
                <p className="text-xs text-green-600">Total completed</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-orange-600">
                  {visitsStats.inProgress}
                </p>
                <p className="text-xs text-gray-500">Active now</p>
              </div>
              <Navigation className="w-8 h-8 text-orange-500" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-red-600">
                  {visitsStats.overdue}
                </p>
                <p className="text-xs text-red-600">Needs attention</p>
              </div>
              <Clock className="w-8 h-8 text-red-500" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Calendar
            </TabsTrigger>
            <TabsTrigger value="list" className="flex items-center gap-2">
              <List className="w-4 h-4" />
              List View
            </TabsTrigger>
            <TabsTrigger value="map" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Map View
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Reports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-4">
            <VisitsDashboard
              stats={visitsStats}
              visits={visits}
              onCheckIn={handleCheckIn}
              onUpdateStatus={handleUpdateVisitStatus}
            />
          </TabsContent>

          <TabsContent value="calendar" className="space-y-4">
            <VisitsCalendar
              visits={visits}
              onCreateVisit={handleCreateVisit}
              onUpdateStatus={handleUpdateVisitStatus}
            />
          </TabsContent>

          <TabsContent value="list" className="space-y-4">
            <VisitsList
              visits={visits}
              onCheckIn={handleCheckIn}
              onUpdateStatus={handleUpdateVisitStatus}
            />
          </TabsContent>

          <TabsContent value="map" className="space-y-4">
            <VisitsMap 
                visits={visits}
                onCheckIn={handleCheckIn} 
            />
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <VisitsReports />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
