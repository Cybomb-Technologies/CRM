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
  DollarSign
} from 'lucide-react';
import analyticsService from '@/services/analyticsService';

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

// User Revenue Table Component
const UserRevenueTable = ({ title, data }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left text-sm font-medium text-gray-600 pb-3">Deal Owner</th>
            <th className="text-right text-sm font-medium text-gray-600 pb-3">Sum Of Amount</th>
          </tr>
        </thead>
        <tbody>
          {data && data.length > 0 ? (
            data.map((user, index) => (
              <tr key={index} className="border-b border-gray-100 last:border-b-0">
                <td className="py-3 text-sm text-gray-700">
                  <div>
                    {user.name}
                    {/* Hiding comparison as we don't have historical data per user yet */}
                  </div>
                </td>
                <td className="py-3 text-sm font-semibold text-gray-900 text-right">
                  {user.amount}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2" className="py-3 text-center text-gray-500">No data available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);

// Deals By Stage Component
const DealsByStage = ({ data }) => {
  // Define colors for known stages to maintain visual consistency
  const stageColors = {
    'qualification': 'bg-blue-500',
    'needs-analysis': 'bg-blue-400',
    'value-proposition': 'bg-blue-300',
    'identify-decision-makers': 'bg-yellow-500',
    'proposal-price-quote': 'bg-yellow-400',
    'negotiation-review': 'bg-orange-500',
    'closed-won': 'bg-green-500',
    'closed-lost': 'bg-red-500',
    'closed-lost-to-competition': 'bg-red-600'
  };

  // Merge API data with stage config
  const stagesData = data ? data.map(item => ({
    stage: item._id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), // Format stage name
    count: item.count,
    color: stageColors[item._id] || 'bg-gray-400'
  })) : [];

  if (stagesData.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">DEALS BY STAGES</h3>
        <p className="text-gray-500">No deals found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">DEALS BY STAGES</h3>

      <div className="space-y-3">
        {stagesData.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`w-3 h-3 ${item.color} rounded-full mr-3`}></div>
              <span className="text-sm text-gray-700">{item.stage}</span>
            </div>
            <span className="text-sm font-semibold text-gray-900">{item.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Amount By Stage Chart Component
const AmountByStageChart = ({ data }) => {
  // data: Array of { _id: stageName, count: X, totalValue: Y }
  const stageColors = {
    'qualification': 'bg-blue-500',
    'needs-analysis': 'bg-blue-400',
    'value-proposition': 'bg-blue-300',
    'identify-decision-makers': 'bg-yellow-500',
    'proposal-price-quote': 'bg-yellow-400',
    'negotiation-review': 'bg-orange-500',
    'closed-won': 'bg-green-500',
    'closed-lost': 'bg-red-500',
    'closed-lost-to-competition': 'bg-red-600'
  };

  const amountData = data ? data.map(item => ({
    stage: item._id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    amount: `Rs. ${item.totalValue.toLocaleString()}`,
    value: item.totalValue,
    color: stageColors[item._id] || 'bg-gray-400'
  })) : [];

  const maxAmount = Math.max(...(amountData.map(d => d.value) || [0]), 100000); // Default min max

  if (amountData.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">AMOUNT BY STAGE</h3>
        <div className="text-center text-gray-500">No data available</div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">AMOUNT BY STAGE</h3>

      <div className="flex mb-4">
        {/* Y-Axis scale simplified */}
        <div className="w-24 mr-4 flex flex-col justify-between text-xs text-gray-600 text-right h-48">
          <div>Rs. {(maxAmount).toLocaleString()}</div>
          <div>0</div>
        </div>

        {/* Chart Bars */}
        <div className="flex-1 flex items-end justify-between h-48 space-x-2">
          {amountData.map((item, index) => (
            <div key={index} className="flex flex-col items-center flex-1 group">
              {/* Tooltip */}
              <div
                className={`w-full ${item.color} rounded-t transition-all duration-500 max-w-12 relative`}
                style={{ height: `${(item.value / maxAmount) * 100}%` }}
              >
                <div className="opacity-0 group-hover:opacity-100 absolute bottom-full mb-1 text-xs bg-gray-800 text-white p-1 rounded whitespace-nowrap -left-2 z-10">
                  {item.amount}
                </div>
              </div>
              <div className="text-xs text-gray-600 mt-2 text-center leading-tight truncate w-full" title={item.stage}>
                {item.stage}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Pipeline Health Component
const PipelineHealth = ({ data }) => {
  // data: Array of { _id: stageName, count: X, totalValue: Y }
  // Group into Early, Mid, Late, Closed

  // Simple mapping logic
  const earlyStages = ['qualification', 'needs-analysis'];
  const midStages = ['value-proposition', 'identify-decision-makers'];
  const lateStages = ['proposal-price-quote', 'negotiation-review'];
  const closedStages = ['closed-won', 'closed-lost', 'closed-lost-to-competition'];

  const groupByStage = (stages) => {
    const group = data.filter(item => stages.includes(item._id));
    const amount = group.reduce((sum, item) => sum + item.totalValue, 0);
    const count = group.reduce((sum, item) => sum + item.count, 0);
    return { amount, count };
  };

  const totalPipeline = data.reduce((sum, item) => sum + item.totalValue, 0);

  const healthData = [
    { stage: "Early Stage", ...groupByStage(earlyStages), color: "bg-blue-500" },
    { stage: "Mid Stage", ...groupByStage(midStages), color: "bg-yellow-500" },
    { stage: "Late Stage", ...groupByStage(lateStages), color: "bg-orange-500" },
    { stage: "Closed", ...groupByStage(closedStages), color: "bg-green-500" }
  ].map(item => ({
    ...item,
    percentage: totalPipeline > 0 ? `${((item.amount / totalPipeline) * 100).toFixed(1)}%` : '0%',
    amountStr: `Rs. ${item.amount.toLocaleString()}`
  }));

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">PIPELINE HEALTH</h3>

      <div className="space-y-4">
        {healthData.map((item, index) => (
          <div key={index}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-700">{item.stage}</span>
              <span className="font-semibold text-gray-900">{item.amountStr} ({item.percentage})</span>
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
    </div>
  );
};

// Win Rate Component
const WinRateMetrics = ({ data }) => {
  // Calculate basic metrics from data
  const wonDeals = data.find(d => d._id === 'closed-won');
  const totalWon = wonDeals ? wonDeals.count : 0;
  const totalWonValue = wonDeals ? wonDeals.totalValue : 0;
  const totalDeals = data.reduce((sum, d) => sum + d.count, 0);

  // Win Rate (Count based)
  const winRate = totalDeals > 0 ? ((totalWon / totalDeals) * 100).toFixed(1) : 0;

  // Avg Deal Size (Overall)
  const totalValue = data.reduce((sum, d) => sum + d.totalValue, 0);
  const avgDealSize = totalDeals > 0 ? (totalValue / totalDeals) : 0;

  const metrics = [
    { metric: "Overall Win Rate", value: `${winRate}%`, change: "", trend: "up" },
    { metric: "Average Deal Size", value: `Rs. ${avgDealSize.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, change: "", trend: "up" },
    // Removed other metrics as we cannot calculate them easily yet
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">PERFORMANCE METRICS</h3>

      <div className="grid grid-cols-2 gap-4">
        {metrics.map((item, index) => (
          <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">{item.metric}</p>
            <p className="text-xl font-semibold text-gray-900 mb-1">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Main DealInsights Component
export default function DealInsights() {
  const [loading, setLoading] = React.useState(true);
  const [dealsByStage, setDealsByStage] = React.useState([]);
  const [revenueByOwner, setRevenueByOwner] = React.useState([]);
  const [metrics, setMetrics] = React.useState({
    pipelineValue: 0
  });

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await analyticsService.getDealInsights();
        if (response.success) {
          const { dealsByStage, revenueByOwner, pipelineValue } = response.data;

          setDealsByStage(dealsByStage);

          // Map Revenue By Owner
          const formattedRevenue = revenueByOwner.map(item => ({
            name: item._id || 'Unassigned',
            amount: `Rs. ${item.totalRevenue.toLocaleString()}`
          }));
          setRevenueByOwner(formattedRevenue);

          setMetrics({
            pipelineValue
          });
        }
      } catch (error) {
        console.error("Failed to fetch deal insights:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalWonRevenue = revenueByOwner.reduce((sum, item) => sum + parseInt(item.amount.replace(/[^0-9]/g, '')), 0);
  const totalDealsCount = dealsByStage.reduce((sum, item) => sum + item.count, 0);
  const avgDealVal = totalDealsCount > 0 ? (dealsByStage.reduce((sum, item) => sum + item.totalValue, 0) / totalDealsCount) : 0;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Deal Insights</h1>
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

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading deal insights...</div>
        </div>
      ) : (
        <>
          {/* Main Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <MetricCard
              title="REVENUE (WON)"
              value={`Rs. ${totalWonRevenue.toLocaleString()}`}
              change=""
              subtitle="Closed Won Deals"
              icon={DollarSign}
              trend="up"
            />

            <MetricCard
              title="DEALS IN PIPELINE"
              value={metrics.pipelineValue > 0 ? `Rs. ${metrics.pipelineValue.toLocaleString()}` : 'Rs. 0'}
              change=""
              subtitle="Total Value"
              icon={TrendingUp}
              trend=""
            />

            <MetricCard
              title="DEALS CREATED"
              value={totalDealsCount.toString()}
              change=""
              subtitle="Total Deals"
              icon={Target}
              trend="up"
            />

            <MetricCard
              title="AVERAGE DEAL SIZE"
              value={`Rs. ${avgDealVal.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
              change=""
              subtitle="Calculated on real data"
              icon={BarChart3}
              trend="up"
            />
          </div>

          {/* Second Row - User Revenue and Deals by Stage */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Revenue by Users */}
            <div className="lg:col-span-1">
              <UserRevenueTable
                title="REVENUE BY USERS"
                data={revenueByOwner}
              />
            </div>

            {/* Deals by Stage */}
            <div className="lg:col-span-1">
              <DealsByStage data={dealsByStage} />
            </div>
          </div>

          {/* Third Row - Amount by Stage Chart */}
          <div className="mb-6">
            <AmountByStageChart data={dealsByStage} />
          </div>

          {/* Fourth Row - Additional Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PipelineHealth data={dealsByStage} />
            <WinRateMetrics data={dealsByStage} />
          </div>

        </>
      )}
    </div>
  );
}