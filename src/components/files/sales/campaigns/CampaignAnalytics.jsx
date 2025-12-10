import React, { useState, useEffect } from "react";
import { campaignsService } from "./campaignsService";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const CampaignAnalytics = ({ campaign, metrics: initialMetrics }) => {
  const { toast } = useToast();
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState(initialMetrics);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, [campaign._id]);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const campaignId = campaign._id || campaign.id;

      if (!campaignId) {
        throw new Error("Campaign ID is missing");
      }

      const result = await campaignsService.fetchCampaignAnalytics(campaignId);

      if (result.success) {
        setAnalyticsData(result.data);
        setMetrics({
          totalMembers: result.data.totalMembers || 0,
          responseRate: result.data.responseRate || 0,
          conversionRate: result.data.conversionRate || 0,
          roi: result.data.roi || 0,
          totalActivities: result.data.totalActivities || 0,
          completedActivities: result.data.completedActivities || 0,
          pendingActivities: result.data.pendingActivities || 0,
          activityCompletionRate: result.data.activityCompletionRate || 0,
        });
      } else {
        throw new Error(result.message || "Failed to fetch analytics");
      }
    } catch (error) {
      setError(error.message);
      toast({
        title: "Analytics Error",
        description:
          "Could not load analytics data. Showing calculated metrics instead.",
        variant: "destructive",
      });

      // Use calculated metrics as fallback
      const members = campaign.members || [];
      const activities = campaign.activities || [];
      const responses = members.filter((m) => m.responded).length;
      const converted = members.filter((m) => m.converted).length;

      const revenue = parseFloat(campaign.expectedRevenue) || 0;
      const cost =
        parseFloat(campaign.actualCost) ||
        parseFloat(campaign.budgetedCost) ||
        0;
      const roi = cost > 0 ? ((revenue - cost) / cost) * 100 : 0;

      const completedActivities = activities.filter(
        (a) => a.status === "Completed"
      ).length;
      const pendingActivities = activities.filter(
        (a) => a.status === "Pending"
      ).length;
      const activityCompletionRate =
        activities.length > 0
          ? (completedActivities / activities.length) * 100
          : 0;

      setMetrics({
        totalMembers: members.length,
        responses,
        converted,
        responseRate:
          members.length > 0 ? (responses / members.length) * 100 : 0,
        conversionRate: responses > 0 ? (converted / responses) * 100 : 0,
        roi,
        totalActivities: activities.length,
        completedActivities,
        pendingActivities,
        activityCompletionRate,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <h3 className="text-lg font-semibold">Campaign Analytics</h3>
        <div className="text-center py-12">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600" />
          <p className="mt-4 text-gray-600">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  if (error && !analyticsData) {
    return (
      <div className="space-y-8">
        <h3 className="text-lg font-semibold">Campaign Analytics</h3>
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <p className="text-gray-500">
            Unable to load analytics data from server.
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Showing calculated metrics instead.
          </p>
        </div>
      </div>
    );
  }

  const members = campaign.members || [];
  const activities = campaign.activities || [];

  // Use data from analytics or calculate locally
  const responseData = analyticsData?.responseData || [
    { name: "Responded", value: members.filter((m) => m.responded).length },
    {
      name: "Not Responded",
      value: members.filter((m) => !m.responded).length,
    },
  ];

  const conversionData = analyticsData?.conversionData || [
    { name: "Converted", value: members.filter((m) => m.converted).length },
    {
      name: "Not Converted",
      value: members.filter((m) => !m.converted).length,
    },
  ];

  const typeData = analyticsData?.typeData || [
    { name: "Leads", value: members.filter((m) => m.type === "lead").length },
    {
      name: "Contacts",
      value: members.filter((m) => m.type === "contact").length,
    },
  ];

  const activityStatusData = analyticsData?.activityStatusData || [
    {
      name: "Completed",
      value: activities.filter((a) => a.status === "Completed").length,
    },
    {
      name: "In Progress",
      value: activities.filter((a) => a.status === "In Progress").length,
    },
    {
      name: "Pending",
      value: activities.filter((a) => a.status === "Pending").length,
    },
    {
      name: "Cancelled",
      value: activities.filter((a) => a.status === "Cancelled").length,
    },
  ];

  const activityTypeData = analyticsData?.activityTypeData || [
    {
      name: "Email",
      value: activities.filter((a) => a.type === "Email").length,
    },
    { name: "Call", value: activities.filter((a) => a.type === "Call").length },
    {
      name: "Meeting",
      value: activities.filter((a) => a.type === "Meeting").length,
    },
    { name: "Task", value: activities.filter((a) => a.type === "Task").length },
    { name: "Note", value: activities.filter((a) => a.type === "Note").length },
  ];

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#82CA9D",
  ];

  const performanceData = analyticsData?.performanceData || [
    {
      metric: "Total Members",
      value: metrics.totalMembers,
      target: campaign.numbersSent || 100,
    },
    {
      metric: "Response Rate",
      value: metrics.responseRate,
      target: campaign.expectedResponse || 20,
    },
    { metric: "Conversion Rate", value: metrics.conversionRate, target: 10 },
    { metric: "ROI", value: metrics.roi, target: 50 },
    {
      metric: "Activities Completed",
      value: metrics.activityCompletionRate,
      target: 75,
    },
  ];

  const activityMetrics = analyticsData?.activityMetrics || [
    {
      name: "Total Activities",
      value: metrics.totalActivities,
      color: "text-blue-600",
    },
    {
      name: "Completed",
      value: metrics.completedActivities,
      color: "text-green-600",
    },
    {
      name: "Pending",
      value: metrics.pendingActivities,
      color: "text-yellow-600",
    },
    {
      name: "Completion Rate",
      value: `${metrics.activityCompletionRate.toFixed(1)}%`,
      color: "text-purple-600",
    },
  ];

  return (
    <div className="space-y-8">
      <h3 className="text-lg font-semibold">Campaign Analytics</h3>

      {/* Performance vs Target */}
      <div>
        <h4 className="font-medium mb-4">Performance vs Target</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {performanceData.map((item, index) => (
            <div key={item.metric} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-sm">{item.metric}</span>
                <span
                  className={`font-bold text-lg ${
                    item.value >= item.target
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {typeof item.value === "number"
                    ? item.value.toFixed(1)
                    : item.value}
                  {item.metric.includes("Rate") ||
                  item.metric === "ROI" ||
                  item.metric.includes("Completed")
                    ? "%"
                    : ""}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    item.value >= item.target ? "bg-green-600" : "bg-blue-600"
                  }`}
                  style={{
                    width: `${Math.min(
                      (item.value / item.target) * 100,
                      100
                    )}%`,
                  }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>
                  Current:{" "}
                  {typeof item.value === "number"
                    ? item.value.toFixed(1)
                    : item.value}
                  {item.metric.includes("Rate") ||
                  item.metric === "ROI" ||
                  item.metric.includes("Completed")
                    ? "%"
                    : ""}
                </span>
                <span>
                  Target: {item.target}
                  {item.metric.includes("Rate") ||
                  item.metric === "ROI" ||
                  item.metric.includes("Completed")
                    ? "%"
                    : ""}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Activity Metrics Summary */}
      <div className="bg-white p-6 border rounded-lg">
        <h4 className="font-medium mb-4">Activity Metrics</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {activityMetrics.map((metric, index) => (
            <div key={metric.name} className="text-center">
              <p className={`text-2xl font-bold ${metric.color}`}>
                {metric.value}
              </p>
              <p className="text-sm text-gray-600">{metric.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Response Chart */}
        <div className="bg-white p-4 border rounded-lg">
          <h4 className="font-medium mb-4 text-center">Response Status</h4>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={responseData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} (${(percent * 100).toFixed(0)}%)`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {responseData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} members`, "Count"]} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Conversion Chart */}
        <div className="bg-white p-4 border rounded-lg">
          <h4 className="font-medium mb-4 text-center">Conversion Status</h4>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={conversionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} (${(percent * 100).toFixed(0)}%)`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {conversionData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[(index + 2) % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} members`, "Count"]} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Member Type Chart */}
        <div className="bg-white p-4 border rounded-lg">
          <h4 className="font-medium mb-4 text-center">Member Types</h4>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={typeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} (${(percent * 100).toFixed(0)}%)`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {typeData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[(index + 1) % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} members`, "Count"]} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Activity Status Chart */}
        <div className="bg-white p-4 border rounded-lg">
          <h4 className="font-medium mb-4 text-center">Activity Status</h4>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={activityStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} (${(percent * 100).toFixed(0)}%)`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {activityStatusData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`${value} activities`, "Count"]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Activity Type Chart */}
        <div className="bg-white p-4 border rounded-lg">
          <h4 className="font-medium mb-4 text-center">Activity Types</h4>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={activityTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} (${(percent * 100).toFixed(0)}%)`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {activityTypeData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`${value} activities`, "Count"]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Activity Summary */}
        <div className="bg-white p-4 border rounded-lg">
          <h4 className="font-medium mb-4 text-center">Activity Summary</h4>
          <div className="flex items-center justify-center h-48">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {metrics.totalActivities}
              </div>
              <p className="text-gray-600">Total Activities</p>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Completed:</span>
                  <span className="font-semibold text-green-600">
                    {metrics.completedActivities}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>In Progress:</span>
                  <span className="font-semibold text-blue-600">
                    {
                      activities.filter((a) => a.status === "In Progress")
                        .length
                    }
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Pending:</span>
                  <span className="font-semibold text-yellow-600">
                    {metrics.pendingActivities}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Summary */}
      <div className="bg-white p-6 border rounded-lg">
        <h4 className="font-medium mb-4">Financial Summary</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              Rs.{" "}
              {campaign.budgetedCost
                ? parseInt(campaign.budgetedCost).toLocaleString()
                : "0"}
            </p>
            <p className="text-sm text-gray-600">Budgeted Cost</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">
              Rs.{" "}
              {campaign.actualCost
                ? parseInt(campaign.actualCost).toLocaleString()
                : "0"}
            </p>
            <p className="text-sm text-gray-600">Actual Cost</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              Rs.{" "}
              {campaign.expectedRevenue
                ? parseInt(campaign.expectedRevenue).toLocaleString()
                : "0"}
            </p>
            <p className="text-sm text-gray-600">Expected Revenue</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">
              {metrics.roi.toFixed(1)}%
            </p>
            <p className="text-sm text-gray-600">ROI</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignAnalytics;
