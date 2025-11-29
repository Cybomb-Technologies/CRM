import React from 'react';
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
  PieChart as CampaignIcon
} from 'lucide-react';

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
  const leadsData = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0];
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">CAMPAIGNS BY LEADS</h3>
      
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
        <p className="text-sm text-gray-600">Record Count</p>
      </div>
    </div>
  );
};

// Campaigns Cost and Revenue Component
const CampaignsCostRevenue = () => {
  const costData = [
    { title: "ACTUAL COST", value: "Rs. 15,000.00", change: "▲ 12%", trend: "up" },
    { title: "BUDGETED COST", value: "Rs. 20,000.00", change: "▼ 5%", trend: "down" },
    { title: "EXPECTED REVENUE", value: "Rs. 1,50,000.00", change: "▲ 25%", trend: "up" }
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">TOTAL CAMPAIGNS - FINANCIAL OVERVIEW</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {costData.map((item, index) => (
          <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-600 mb-2">{item.title}</p>
            <p className="text-xl font-semibold text-gray-900 mb-1">{item.value}</p>
            <p className={cn(
              "text-xs font-medium",
              item.trend === 'up' ? "text-green-600" : "text-red-600"
            )}>
              {item.change}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Campaigns by Type Component
const CampaignsByType = () => {
  const campaignTypes = [
    { type: "Email Campaign", count: 4, percentage: "36.4%", color: "bg-blue-500" },
    { type: "Social Media", count: 3, percentage: "27.3%", color: "bg-green-500" },
    { type: "Webinar", count: 2, percentage: "18.2%", color: "bg-purple-500" },
    { type: "Content Marketing", count: 1, percentage: "9.1%", color: "bg-orange-500" },
    { type: "Paid Ads", count: 1, percentage: "9.1%", color: "bg-red-500" }
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">CAMPAIGNS BY TYPE</h3>
      
      <div className="space-y-4">
        {campaignTypes.map((campaign, index) => (
          <div key={index}>
            <div className="flex justify-between text-sm mb-1">
              <div className="flex items-center">
                <div className={`w-3 h-3 ${campaign.color} rounded-full mr-2`}></div>
                <span className="text-gray-700">{campaign.type}</span>
              </div>
              <span className="font-semibold text-gray-900">
                {campaign.count} ({campaign.percentage})
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${campaign.color} transition-all duration-500`}
                style={{ width: campaign.percentage }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Campaigns by Revenue Component
const CampaignsByRevenue = () => {
  const revenueData = [
    { campaign: "Q4 Product Launch", revenue: "Rs. 75,000.00", percentage: "50%", color: "bg-green-500" },
    { campaign: "Social Media Blitz", revenue: "Rs. 45,000.00", percentage: "30%", color: "bg-blue-500" },
    { campaign: "Email Nurture", revenue: "Rs. 30,000.00", percentage: "20%", color: "bg-purple-500" }
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">CAMPAIGNS BY REVENUE AMOUNT</h3>
      
      {revenueData.length > 0 ? (
        <div className="space-y-4">
          {revenueData.map((item, index) => (
            <div key={index}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700">{item.campaign}</span>
                <span className="font-semibold text-gray-900">{item.revenue} ({item.percentage})</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${item.color} transition-all duration-500`}
                  style={{ width: item.percentage }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">No data available</p>
          <p className="text-gray-400 text-sm mt-1">No data available</p>
        </div>
      )}
    </div>
  );
};

// ROI Metrics Component
const ROIMetrics = () => {
  const roiData = [
    { metric: "Overall ROI", value: "900%", change: "▲ 15%", trend: "up" },
    { metric: "Cost Per Lead", value: "Rs. 136.36", change: "▼ 8%", trend: "down" },
    { metric: "Lead to Customer Rate", value: "9.1%", change: "▲ 2.1%", trend: "up" },
    { metric: "Campaign ROI", value: "8.5x", change: "▲ 1.2x", trend: "up" }
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">MARKETING ROI METRICS</h3>
      
      <div className="grid grid-cols-2 gap-4">
        {roiData.map((item, index) => (
          <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">{item.metric}</p>
            <p className="text-xl font-semibold text-gray-900 mb-1">{item.value}</p>
            <p className={cn(
              "text-xs font-medium",
              item.trend === 'up' ? "text-green-600" : "text-red-600"
            )}>
              {item.change}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Campaign Performance Table
const CampaignPerformanceTable = () => {
  const performanceData = [
    {
      campaign: "Q4 Product Launch",
      leads: 45,
      cost: "Rs. 8,000.00",
      revenue: "Rs. 75,000.00",
      roi: "837.5%",
      status: "Active"
    },
    {
      campaign: "Social Media Blitz",
      leads: 32,
      cost: "Rs. 4,000.00",
      revenue: "Rs. 45,000.00",
      roi: "1025%",
      status: "Completed"
    },
    {
      campaign: "Email Nurture",
      leads: 28,
      cost: "Rs. 3,000.00",
      revenue: "Rs. 30,000.00",
      roi: "900%",
      status: "Active"
    }
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">CAMPAIGN PERFORMANCE</h3>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left text-sm font-medium text-gray-600 pb-3">Campaign</th>
              <th className="text-center text-sm font-medium text-gray-600 pb-3">Leads</th>
              <th className="text-center text-sm font-medium text-gray-600 pb-3">Cost</th>
              <th className="text-center text-sm font-medium text-gray-600 pb-3">Revenue</th>
              <th className="text-center text-sm font-medium text-gray-600 pb-3">ROI</th>
              <th className="text-center text-sm font-medium text-gray-600 pb-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {performanceData.map((campaign, index) => (
              <tr key={index} className="border-b border-gray-100 last:border-b-0">
                <td className="py-3 text-sm text-gray-700">{campaign.campaign}</td>
                <td className="py-3 text-sm font-semibold text-gray-900 text-center">{campaign.leads}</td>
                <td className="py-3 text-sm text-gray-700 text-center">{campaign.cost}</td>
                <td className="py-3 text-sm text-gray-700 text-center">{campaign.revenue}</td>
                <td className="py-3 text-sm font-semibold text-green-600 text-center">{campaign.roi}</td>
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
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Marketing Metrics</h1>
            <p className="text-gray-600 mt-2">Add Description</p>
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

      {/* Main Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <MetricCard
          title="TOTAL CAMPAIGNS"
          value="11"
          change="▲ 22%"
          subtitle="This Quarter"
          icon={CampaignIcon}
          trend="up"
        />
        
        <MetricCard
          title="TOTAL LEADS"
          value="105"
          change="▲ 18%"
          subtitle="From Campaigns"
          icon={Users}
          trend="up"
        />
        
        <MetricCard
          title="CONVERSION RATE"
          value="9.1%"
          change="▲ 2.3%"
          subtitle="Campaign Leads"
          icon={Target}
          trend="up"
        />
        
        <MetricCard
          title="TOTAL REVENUE"
          value="Rs. 1,50,000.00"
          change="▲ 25%"
          subtitle="Attributed to Campaigns"
          icon={DollarSign}
          trend="up"
        />
      </div>

      {/* Second Row - Campaigns by Leads and Cost Revenue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <CampaignsByLeadsChart />
        <CampaignsCostRevenue />
      </div>

      {/* Third Row - Campaigns by Type and Revenue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <CampaignsByType />
        <CampaignsByRevenue />
      </div>

      {/* Fourth Row - ROI Metrics */}
      <div className="mb-6">
        <ROIMetrics />
      </div>

      {/* Fifth Row - Campaign Performance Table */}
      <div className="mb-6">
        <CampaignPerformanceTable />
      </div>

      {/* Bottom Row - Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">LEAD SOURCE EFFECTIVENESS</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-700">Email Marketing</span>
              <span className="text-sm font-semibold text-gray-900">42 leads</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-700">Social Media</span>
              <span className="text-sm font-semibold text-gray-900">35 leads</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-700">Content Marketing</span>
              <span className="text-sm font-semibold text-gray-900">28 leads</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">CAMPAIGN ENGAGEMENT</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-700">Email Open Rate</span>
              <span className="text-sm font-semibold text-gray-900">24.5%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-700">Click-Through Rate</span>
              <span className="text-sm font-semibold text-gray-900">8.2%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-700">Conversion Rate</span>
              <span className="text-sm font-semibold text-gray-900">3.1%</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">BUDGET UTILIZATION</h3>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 mb-2">75%</div>
            <p className="text-sm text-gray-600">Budget Spent</p>
            <p className="text-xs text-gray-500 mt-1">Rs. 15,000 / Rs. 20,000</p>
          </div>
        </div>
      </div>
    </div>
  );
}