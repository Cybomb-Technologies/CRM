import React from 'react';
import {
  TrendingUp,
  Users,
  Target,
  Building2,
  BarChart3,
  Calendar,
  Download,
  Filter,
  MoreVertical
} from 'lucide-react';
import analyticsService from '@/services/analyticsService';

// Utility function for class names
const cn = (...classes) => classes.filter(Boolean).join(' ');

// Metric Card Component
const MetricCard = ({ title, value, percentage, subtitle, trend, icon: Icon }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-sm font-medium text-gray-600">{title}</h3>
      <Icon className="w-5 h-5 text-gray-400" />
    </div>
    <div className="flex items-end justify-between">
      <div>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
        <div className="flex items-center mt-1">
          <span className={cn(
            "text-sm font-medium",
            // Simple color logic: if we have a percentage and it's not 0%, show green, else gray
            percentage && percentage !== "0%" ? "text-green-600" : "text-gray-600"
          )}>
            {percentage}
          </span>
          {trend && (
            <span className="text-xs text-gray-500 ml-2">{trend}</span>
          )}
        </div>
        {subtitle && (
          <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
        )}
      </div>
    </div>
  </div>
);

// Performance Table Component
const PerformanceTable = ({ data, title, period }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
        {period}
      </span>
    </div>

    <div className="space-y-4">
      {data.length > 0 ? (
        data.map((item, index) => (
          <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
            <span className="text-sm font-medium text-gray-700">{item.metric}</span>
            <span className="text-sm font-semibold text-gray-900">{item.value}</span>
          </div>
        ))
      ) : (
        <div className="text-center text-gray-500 py-4">No performance data available.</div>
      )}
    </div>
  </div>
);

// Main OrgOverview Component
export default function OrgOverview() {
  const [metricsData, setMetricsData] = React.useState([
    { title: "LEADS THIS MONTH", value: "0", percentage: "", subtitle: "Loading...", icon: Users },
    { title: "REVENUE THIS MONTH", value: "Rs. 0", percentage: "", subtitle: "Loading...", icon: TrendingUp },
    { title: "DEALS IN PIPELINE", value: "0", percentage: "", subtitle: "Loading...", icon: Target },
    { title: "ACCOUNTS THIS MONTH", value: "0", percentage: "", subtitle: "Loading...", icon: Building2 }
  ]);
  const [performanceData, setPerformanceData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await analyticsService.getOrgOverview();
        if (response.success) {
          const { leadsThisMonth, revenueThisMonth, dealsInPipeline, accountsThisMonth, performanceData } = response.data;

          setMetricsData([
            {
              title: "LEADS THIS MONTH",
              value: leadsThisMonth.toString(),
              percentage: "", // Removed static 100%
              subtitle: "This Month",
              icon: Users
            },
            {
              title: "REVENUE THIS MONTH",
              value: `Rs. ${revenueThisMonth.toLocaleString()}`,
              percentage: "",
              subtitle: "This Month",
              icon: TrendingUp
            },
            {
              title: "DEALS IN PIPELINE",
              value: dealsInPipeline.toString(),
              percentage: "",
              subtitle: "Open Deals",
              icon: Target
            },
            {
              title: "ACCOUNTS THIS MONTH",
              value: accountsThisMonth.toString(),
              percentage: "",
              subtitle: "New Accounts",
              icon: Building2
            }
          ]);

          // Map performance data for the chart/table
          // We can use the last 3 months data from the API
          const formattedPerfData = performanceData.map(item => ({
            metric: `${monthNames[item._id.month - 1]} ${item._id.year}`,
            value: `Rs. ${item.totalRevenue.toLocaleString()} (${item.count} deals)`
          }));
          setPerformanceData(formattedPerfData);
        }
      } catch (error) {
        console.error("Failed to fetch org overview data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Org Overview</h1>
            <p className="text-gray-600 mt-2">Dashboard</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
              <Filter className="w-4 h-4" />
              Filter
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button className="p-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading analytics...</div>
        </div>
      ) : (
        <>
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
            {metricsData.map((metric, index) => (
              <MetricCard key={index} {...metric} />
            ))}
          </div>

          {/* Performance and Analytics Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Last 3 Months Performance */}
            <div className="lg:col-span-1">
              <PerformanceTable
                data={performanceData}
                title="LAST 3 MONTHS REVENUE"
                period="Recent"
              />
            </div>

            {/* Placeholder for future expansion or another real-data widget */}
            <div className="lg:col-span-1 bg-white rounded-lg border border-gray-200 p-6 shadow-sm flex items-center justify-center">
              <div className="text-center text-gray-400">
                <BarChart3 className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>More analytics coming soon...</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}