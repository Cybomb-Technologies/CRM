import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import {
  Download,
  Filter,
  Users,
  MapPin,
  Clock,
  CheckCircle,
  TrendingUp,
} from "lucide-react";

export function VisitsReports() {
  // Mock data for charts
  const visitsByDay = [
    { day: "Mon", visits: 4, completed: 3 },
    { day: "Tue", visits: 6, completed: 5 },
    { day: "Wed", visits: 5, completed: 4 },
    { day: "Thu", visits: 7, completed: 6 },
    { day: "Fri", visits: 3, completed: 2 },
    { day: "Sat", visits: 2, completed: 1 },
    { day: "Sun", visits: 1, completed: 1 },
  ];

  const visitsByType = [
    { name: "Product Demo", value: 35 },
    { name: "Sales Meeting", value: 25 },
    { name: "Support Visit", value: 20 },
    { name: "Follow-up", value: 15 },
    { name: "Other", value: 5 },
  ];

  const performanceData = [
    { month: "Jan", completion: 78, satisfaction: 85 },
    { month: "Feb", completion: 82, satisfaction: 88 },
    { month: "Mar", completion: 85, satisfaction: 90 },
    { month: "Apr", completion: 88, satisfaction: 92 },
    { month: "May", completion: 90, satisfaction: 94 },
    { month: "Jun", completion: 92, satisfaction: 95 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  const topPerformers = [
    { name: "John Smith", visits: 24, completion: 92, satisfaction: 96 },
    { name: "Sarah Johnson", visits: 22, completion: 88, satisfaction: 94 },
    { name: "Mike Rodriguez", visits: 20, completion: 85, satisfaction: 92 },
    { name: "Emily Davis", visits: 18, completion: 90, satisfaction: 95 },
  ];

  return (
    <div className="space-y-6">
      {/* Report Header */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">
                Visits Performance Report
              </h3>
              <p className="text-gray-600">
                Last 30 days • Generated on {new Date().toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filter Report
              </Button>
              <Button>
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-6">
        {/* Weekly Visits Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Weekly Visits Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={visitsByDay}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="visits" fill="#3B82F6" name="Scheduled Visits" />
                <Bar
                  dataKey="completed"
                  fill="#10B981"
                  name="Completed Visits"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Visits by Type */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Visits by Type
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={visitsByType}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {visitsByType.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Performance Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="completion"
                  stroke="#3B82F6"
                  name="Completion Rate %"
                />
                <Line
                  type="monotone"
                  dataKey="satisfaction"
                  stroke="#10B981"
                  name="Satisfaction %"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Performers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Top Performers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPerformers.map((performer, index) => (
                <div
                  key={performer.name}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      {performer.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <div className="font-semibold">{performer.name}</div>
                      <div className="text-sm text-gray-500">
                        {performer.visits} visits
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700"
                      >
                        {performer.completion}% Complete
                      </Badge>
                      <Badge
                        variant="outline"
                        className="bg-blue-50 text-blue-700"
                      >
                        {performer.satisfaction}% Sat
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">156</div>
            <div className="text-sm text-gray-600">Total Visits</div>
            <div className="text-xs text-green-600 mt-1">
              +12% from last month
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">88%</div>
            <div className="text-sm text-gray-600">Completion Rate</div>
            <div className="text-xs text-green-600 mt-1">
              +5% from last month
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Clock className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">42 min</div>
            <div className="text-sm text-gray-600">Avg. Duration</div>
            <div className="text-xs text-green-600 mt-1">
              -8 min from last month
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <MapPin className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">94%</div>
            <div className="text-sm text-gray-600">On-time Arrival</div>
            <div className="text-xs text-green-600 mt-1">
              +3% from last month
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
