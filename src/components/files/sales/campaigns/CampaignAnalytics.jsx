import React, { useState, useEffect, useCallback } from "react";
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
import { Loader2, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

const CampaignAnalytics = ({
  campaign,
  metrics: initialMetrics,
  refreshKey,
}) => {
  const { toast } = useToast();
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState(initialMetrics);
  const [error, setError] = useState(null);
  const [forceRefresh, setForceRefresh] = useState(0);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const campaignId = campaign._id || campaign.id;

      if (!campaignId) {
        throw new Error("Campaign ID is missing");
      }

      console.log("Fetching analytics for campaign:", campaignId);

      // Add timestamp to prevent caching
      const result = await campaignsService.fetchCampaignAnalytics(campaignId);

      if (result.success && result.data) {
        console.log("Analytics data received:", result.data);
        setAnalyticsData(result.data);
        setMetrics({
          totalMembers: result.data.totalMembers || 0,
          respondedMembers: result.data.respondedMembers || 0,
          convertedMembers: result.data.convertedMembers || 0,
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
      console.error("Fetch analytics error:", error);
      setError(error.message);

      // Use calculated metrics as fallback
      const members = campaign.members || [];
      const activities = campaign.activities || [];

      // Parse members if they are JSON strings
      const parsedMembers = members.map((member) => {
        if (typeof member === "string") {
          try {
            return JSON.parse(member);
          } catch (error) {
            return {
              id: member,
              name: "Unknown Member",
              type: "unknown",
              responded: false,
              converted: false,
            };
          }
        }
        return member;
      });

      const responses = parsedMembers.filter((m) => m.responded).length;
      const converted = parsedMembers.filter((m) => m.converted).length;

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

      const fallbackMetrics = {
        totalMembers: parsedMembers.length,
        respondedMembers: responses,
        convertedMembers: converted,
        responseRate:
          parsedMembers.length > 0
            ? (responses / parsedMembers.length) * 100
            : 0,
        conversionRate: responses > 0 ? (converted / responses) * 100 : 0,
        roi,
        totalActivities: activities.length,
        completedActivities,
        pendingActivities,
        activityCompletionRate,
      };

      setMetrics(fallbackMetrics);

      toast({
        title: "Analytics Warning",
        description:
          "Using locally calculated metrics. Analytics API might be delayed.",
        variant: "warning",
      });
    } finally {
      setLoading(false);
    }
  }, [campaign, toast]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics, refreshKey, forceRefresh]);

  const handleManualRefresh = () => {
    setForceRefresh((prev) => prev + 1);
    toast({
      title: "Refreshing",
      description: "Updating analytics data...",
    });
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Campaign Analytics</h3>
          <Button variant="outline" size="sm" disabled>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Loading...
          </Button>
        </div>
        <div className="text-center py-12">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600" />
          <p className="mt-4 text-gray-600">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  const members = campaign.members || [];
  const activities = campaign.activities || [];

  // Parse members if they are JSON strings
  const parsedMembers = members.map((member) => {
    if (typeof member === "string") {
      try {
        return JSON.parse(member);
      } catch (error) {
        return {
          id: member,
          name: "Unknown Member",
          type: "unknown",
          responded: false,
          converted: false,
        };
      }
    }
    return member;
  });

  // Use data from analytics API or calculate locally
  const responseData = analyticsData?.responseData || [
    {
      name: "Responded",
      value:
        metrics.respondedMembers ||
        parsedMembers.filter((m) => m.responded).length,
    },
    {
      name: "Not Responded",
      value:
        (metrics.totalMembers || parsedMembers.length) -
        (metrics.respondedMembers ||
          parsedMembers.filter((m) => m.responded).length),
    },
  ];

  const conversionData = analyticsData?.conversionData || [
    {
      name: "Converted",
      value:
        metrics.convertedMembers ||
        parsedMembers.filter((m) => m.converted).length,
    },
    {
      name: "Not Converted",
      value:
        (metrics.totalMembers || parsedMembers.length) -
        (metrics.convertedMembers ||
          parsedMembers.filter((m) => m.converted).length),
    },
  ];

  const typeData = analyticsData?.typeData || [
    {
      name: "Leads",
      value: parsedMembers.filter((m) => m.type === "lead").length,
    },
    {
      name: "Contacts",
      value: parsedMembers.filter((m) => m.type === "contact").length,
    },
  ];

  const activityStatusData = analyticsData?.activityStatusData || [
    {
      name: "Completed",
      value:
        metrics.completedActivities ||
        activities.filter((a) => a.status === "Completed").length,
    },
    {
      name: "In Progress",
      value: activities.filter((a) => a.status === "In Progress").length,
    },
    {
      name: "Pending",
      value:
        metrics.pendingActivities ||
        activities.filter((a) => a.status === "Pending").length,
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

  const performanceData = [
    {
      metric: "Total Members",
      value: metrics.totalMembers || parsedMembers.length,
      target: campaign.numbersSent || 100,
    },
    {
      metric: "Response Rate",
      value:
        metrics.responseRate ||
        (parsedMembers.length > 0
          ? (parsedMembers.filter((m) => m.responded).length /
              parsedMembers.length) *
            100
          : 0),
      target: campaign.expectedResponse || 20,
    },
    {
      metric: "Conversion Rate",
      value:
        metrics.conversionRate ||
        (parsedMembers.filter((m) => m.responded).length > 0
          ? (parsedMembers.filter((m) => m.converted).length /
              parsedMembers.filter((m) => m.responded).length) *
            100
          : 0),
      target: 10,
    },
    { metric: "ROI", value: metrics.roi || 0, target: 50 },
    {
      metric: "Activities Completed",
      value: metrics.activityCompletionRate || 0,
      target: 75,
    },
  ];

  const activityMetrics = [
    {
      name: "Total Activities",
      value: metrics.totalActivities || activities.length,
      color: "text-blue-600",
    },
    {
      name: "Completed",
      value:
        metrics.completedActivities ||
        activities.filter((a) => a.status === "Completed").length,
      color: "text-green-600",
    },
    {
      name: "Pending",
      value:
        metrics.pendingActivities ||
        activities.filter((a) => a.status === "Pending").length,
      color: "text-yellow-600",
    },
    {
      name: "Completion Rate",
      value: `${(metrics.activityCompletionRate || 0).toFixed(1)}%`,
      color: "text-purple-600",
    },
  ];

  // Consistent label renderer for ALL charts
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const RADIAN = Math.PI / 180;

    // Always position labels at 65% of the slice (well inside the slice)
    const radius = innerRadius + (outerRadius - innerRadius) * 0.65;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    // Don't show label for very small slices
    if (percent < 0.05) {
      return null;
    }

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={11}
        fontWeight="bold"
        className="drop-shadow-sm"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // Custom legend formatter to show full text
  const renderCustomLegend = (value) => {
    return <span className="text-xs">{value}</span>;
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Campaign Analytics</h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleManualRefresh}
            disabled={loading}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Analytics
          </Button>
        </div>
      </div>

      {/* Real-time Metrics Summary */}
      <div className="bg-white p-6 border rounded-lg">
        <h4 className="font-medium mb-4">Current Metrics</h4>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">
              {metrics.totalMembers || 0}
            </p>
            <p className="text-sm text-gray-600">Total Members</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">
              {metrics.respondedMembers || 0}
            </p>
            <p className="text-sm text-gray-600">Responded</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">
              {metrics.convertedMembers || 0}
            </p>
            <p className="text-sm text-gray-600">Converted</p>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <p className="text-2xl font-bold text-orange-600">
              {(metrics.responseRate || 0).toFixed(1)}%
            </p>
            <p className="text-sm text-gray-600">Response Rate</p>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <p className="text-2xl font-bold text-red-600">
              {(metrics.conversionRate || 0).toFixed(1)}%
            </p>
            <p className="text-sm text-gray-600">Conversion Rate</p>
          </div>
        </div>
      </div>

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

      {/* Charts Grid - ALL CHARTS USE SAME LABEL RENDERER */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Response Chart */}
        <div className="bg-white p-4 border rounded-lg">
          <h4 className="font-medium mb-4 text-center">Response Status</h4>
          <div className="h-64 md:h-72 lg:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={responseData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={75}
                  innerRadius={35}
                  paddingAngle={2}
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
                <Tooltip
                  formatter={(value) => [`${value} members`, "Count"]}
                  contentStyle={{ fontSize: "12px" }}
                />
                <Legend
                  formatter={renderCustomLegend}
                  wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="text-center mt-2 text-sm text-gray-600">
            {metrics.respondedMembers || 0} responded out of{" "}
            {metrics.totalMembers || 0}
          </div>
        </div>

        {/* Conversion Chart */}
        <div className="bg-white p-4 border rounded-lg">
          <h4 className="font-medium mb-4 text-center">Conversion Status</h4>
          <div className="h-64 md:h-72 lg:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={conversionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={75}
                  innerRadius={35}
                  paddingAngle={2}
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
                <Tooltip
                  formatter={(value) => [`${value} members`, "Count"]}
                  contentStyle={{ fontSize: "12px" }}
                />
                <Legend
                  formatter={renderCustomLegend}
                  wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="text-center mt-2 text-sm text-gray-600">
            {metrics.convertedMembers || 0} converted out of{" "}
            {metrics.respondedMembers || 0} responded
          </div>
        </div>

        {/* Member Type Chart */}
        <div className="bg-white p-4 border rounded-lg">
          <h4 className="font-medium mb-4 text-center">Member Types</h4>
          <div className="h-64 md:h-72 lg:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={typeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={75}
                  innerRadius={35}
                  paddingAngle={2}
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
                <Tooltip
                  formatter={(value) => [`${value} members`, "Count"]}
                  contentStyle={{ fontSize: "12px" }}
                />
                <Legend
                  formatter={renderCustomLegend}
                  wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Activity Status Chart - NOW USING SAME RENDERER */}
        <div className="bg-white p-4 border rounded-lg">
          <h4 className="font-medium mb-4 text-center">Activity Status</h4>
          <div className="h-64 md:h-72 lg:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={activityStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={75}
                  innerRadius={35}
                  paddingAngle={2}
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
                  contentStyle={{ fontSize: "12px" }}
                />
                <Legend
                  formatter={renderCustomLegend}
                  wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Activity Type Chart - NOW USING SAME RENDERER */}
        <div className="bg-white p-4 border rounded-lg">
          <h4 className="font-medium mb-4 text-center">Activity Types</h4>
          <div className="h-64 md:h-72 lg:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={activityTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={75}
                  innerRadius={35}
                  paddingAngle={3}
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
                  contentStyle={{ fontSize: "12px" }}
                />
                <Legend
                  formatter={renderCustomLegend}
                  wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Activity Summary */}
        <div className="bg-white p-4 border rounded-lg">
          <h4 className="font-medium mb-4 text-center">Activity Summary</h4>
          <div className="flex items-center justify-center h-64 md:h-72 lg:h-64">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {metrics.totalActivities || 0}
              </div>
              <p className="text-gray-600">Total Activities</p>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Completed:</span>
                  <span className="font-semibold text-green-600">
                    {metrics.completedActivities || 0}
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
                    {metrics.pendingActivities || 0}
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
              {(metrics.roi || 0).toFixed(1)}%
            </p>
            <p className="text-sm text-gray-600">ROI</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignAnalytics;
