import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Target,
  Users,
  Filter,
  Download,
  MoreVertical,
  BarChart3,
  PieChart,
  DollarSign,
  Calendar,
  PieChart as CampaignIcon,
  Loader2
} from 'lucide-react';
import analyticsService from '../../services/analyticsService';

// Utility function for class names
const cn = (...classes) => classes.filter(Boolean).join(' ');

// Metric Card Component
const MetricCard = ({ title, value, change, subtitle, icon: Icon, trend }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-sm font-medium text-gray-600">{title}</h3>
      <Icon className="w-5 h-5 text-gray-400" />
    </div>
    <div className="flex items-end justify-between">
      <div>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
        <div className="flex items-center mt-1">
          {trend === 'up' ? (
            <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
          ) : trend === 'down' ? (
            <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
          ) : null}
          {change && (
            <span className={cn(
              "text-sm font-medium",
              trend === 'up' ? "text-green-600" :
                trend === 'down' ? "text-red-600" : "text-gray-600"
            )}>
              {change}
            </span>
          )}
        </div>
        {subtitle && (
          <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
        )}
      </div>
    </div>
  </div>
);

// Campaigns by Leads Chart Component
const CampaignsByLeadsChart = () => {
  // Placeholder for chart - in a real scenario this would use Recharts or similar library
  // or dynamic CSS bars based on data passed as props
  const leadsData = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">CAMPAIGNS BY LEADS (Trend)</h3>

      <div className="flex items-end justify-between h-48 px-4">
        {leadsData.map((value, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="text-xs text-gray-600 mb-1">{value}</div>
            <div
              className="w-8 bg-gradient-to-t from-purple-500 to-purple-300 rounded-t transition-all duration-500"
              style={{ height: `${value * 4}px` }}
            ></div>
            <div className="text-xs text-gray-600 mt-2">{index + 1}</div>
          </div>
        ))}
      </div>

      <div className="text-center mt-4">
        <p className="text-sm text-gray-600">Recent Campaigns</p>
      </div>
    </div>
  );
};

// Campaigns Cost and Revenue Component
const CampaignsCostRevenue = ({ stats }) => {
  if (!stats) return null;

  const costData = [
    { title: "ACTUAL COST", value: `Rs. ${stats.totalActualCost.toLocaleString()}`, change: "", trend: "neutral" },
    { title: "BUDGETED COST", value: `Rs. ${stats.totalBudget.toLocaleString()}`, change: "", trend: "neutral" },
    { title: "TOTAL REVENUE", value: `Rs. ${stats.totalRevenue.toLocaleString()}`, change: "", trend: "up" }
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">TOTAL CAMPAIGNS - FINANCIAL OVERVIEW</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {costData.map((item, index) => (
          <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-600 mb-2">{item.title}</p>
            <p className="text-xl font-semibold text-gray-900 mb-1">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Campaigns by Type Component
const CampaignsByType = ({ campaignsByType }) => {
  const colors = ["bg-blue-500", "bg-green-500", "bg-purple-500", "bg-orange-500", "bg-red-500"];
  const total = campaignsByType.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">CAMPAIGNS BY TYPE</h3>

      <div className="space-y-4">
        {campaignsByType.map((campaign, index) => {
          const percentage = total > 0 ? ((campaign.count / total) * 100).toFixed(1) + "%" : "0%";
          return (
            <div key={index}>
              <div className="flex justify-between text-sm mb-1">
                <div className="flex items-center">
                  <div className={`w-3 h-3 ${colors[index % colors.length]} rounded-full mr-2`}></div>
                  <span className="text-gray-700">{campaign._id}</span>
                </div>
                <span className="font-semibold text-gray-900">
                  {campaign.count} ({percentage})
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${colors[index % colors.length]} transition-all duration-500`}
                  style={{ width: percentage }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Campaigns by Revenue Component
const CampaignsByRevenue = ({ topCampaigns }) => {
  const colors = ["bg-green-500", "bg-blue-500", "bg-purple-500", "bg-orange-500", "bg-red-500"];
  const maxRevenue = topCampaigns.length > 0 ? topCampaigns[0].totalRevenue : 1;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">TOP CAMPAIGNS BY REVENUE</h3>

      {topCampaigns.length > 0 ? (
        <div className="space-y-4">
          {topCampaigns.map((item, index) => {
            const percentage = ((item.totalRevenue / maxRevenue) * 100) + "%";
            return (
              <div key={index}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">{item.campaignName}</span>
                  <span className="font-semibold text-gray-900">Rs. {item.totalRevenue.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${colors[index % colors.length]} transition-all duration-500`}
                    style={{ width: percentage }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8">
          <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">No data available</p>
        </div>
      )}
    </div>
  );
};

// ROI Metrics Component
const ROIMetrics = ({ roi }) => {
  const roiData = [
    { metric: "Overall ROI", value: `${roi}%`, change: "", trend: parseFloat(roi) > 0 ? "up" : "down" },
    // Other metrics would need more complex calculation or data from analytics API
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">MARKETING ROI METRICS</h3>

      <div className="grid grid-cols-1 gap-4">
        {roiData.map((item, index) => (
          <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">{item.metric}</p>
            <p className="text-xl font-semibold text-gray-900 mb-1">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Campaign Performance Table
const CampaignPerformanceTable = ({ data }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">CAMPAIGN PERFORMANCE</h3>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left text-sm font-medium text-gray-600 pb-3">Campaign</th>
              <th className="text-center text-sm font-medium text-gray-600 pb-3">Actual Cost</th>
              <th className="text-center text-sm font-medium text-gray-600 pb-3">Revenue</th>
              <th className="text-center text-sm font-medium text-gray-600 pb-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((campaign, index) => (
              <tr key={index} className="border-b border-gray-100 last:border-b-0">
                <td className="py-3 text-sm text-gray-700">{campaign.campaignName}</td>
                <td className="py-3 text-sm text-gray-700 text-center">Rs. {campaign.actualCost.toLocaleString()}</td>
                <td className="py-3 text-sm text-gray-700 text-center">Rs. {campaign.totalRevenue.toLocaleString()}</td>
                <td className="py-3 text-center">
                  <span className={cn(
                    "px-2 py-1 text-xs rounded-full",
                    campaign.status === "Active"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  )}>
                    {campaign.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Main MarketingMetrics Component
export default function MarketingMetrics() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalCampaigns: 0,
    stats: { totalBudget: 0, totalActualCost: 0, totalExpectedRevenue: 0, totalRevenue: 0 },
    campaignsByType: [],
    topCampaignsByRevenue: [],
    campaignPerformance: [],
    roi: "0"
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await analyticsService.getMarketingMetrics();
        if (response.success) {
          setMetrics(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch marketing metrics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Marketing Metrics</h1>
            <p className="text-gray-600 mt-2">Campaign Performance & ROI</p>
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
          </div>
        </div>
      </div>

      {/* Main Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <MetricCard
          title="TOTAL CAMPAIGNS"
          value={metrics.totalCampaigns}
          change=""
          subtitle="This Quarter"
          icon={CampaignIcon}
          trend="neutral"
        />

        <MetricCard
          title="TOTAL REVENUE"
          value={`Rs. ${metrics.stats.totalRevenue.toLocaleString()}`}
          change=""
          subtitle="From Campaigns"
          icon={DollarSign}
          trend="up"
        />

        <MetricCard
          title="ROI"
          value={`${metrics.roi}%`}
          change=""
          subtitle="Overall Return"
          icon={TrendingUp}
          trend={parseFloat(metrics.roi) > 0 ? "up" : "down"}
        />

        <MetricCard
          title="ACTUAL COST"
          value={`Rs. ${metrics.stats.totalActualCost.toLocaleString()}`}
          change=""
          subtitle="Total Spend"
          icon={DollarSign}
          trend="neutral"
        />
      </div>

      {/* Second Row - Campaigns by Leads and Cost Revenue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Keeping the chart static/placeholder as backend doesn't provide this granularity yet */}
        <CampaignsByLeadsChart />
        <CampaignsCostRevenue stats={metrics.stats} />
      </div>

      {/* Third Row - Campaigns by Type and Revenue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <CampaignsByType campaignsByType={metrics.campaignsByType} />
        <CampaignsByRevenue topCampaigns={metrics.topCampaignsByRevenue} />
      </div>

      {/* Fourth Row - ROI Metric Detail */}
      <div className="mb-6">
        <ROIMetrics roi={metrics.roi} />
      </div>

      {/* Fifth Row - Campaign Performance Table */}
      <div className="mb-6">
        <CampaignPerformanceTable data={metrics.campaignPerformance} />
      </div>
    </div>
  );
}