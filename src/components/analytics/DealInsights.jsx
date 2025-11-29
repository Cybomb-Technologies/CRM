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
          {data.map((user, index) => (
            <tr key={index} className="border-b border-gray-100 last:border-b-0">
              <td className="py-3 text-sm text-gray-700">
                <div>
                  {user.name}
                  <p className="text-xs text-gray-500 mt-1">* Compared with Last Year Relative</p>
                </div>
              </td>
              <td className="py-3 text-sm font-semibold text-gray-900 text-right">
                {user.amount}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// Deals By Stage Component
const DealsByStage = () => {
  const stagesData = [
    { stage: "Qualification", count: 1, color: "bg-blue-500" },
    { stage: "Needs Analysis", count: 2, color: "bg-blue-400" },
    { stage: "Value Proposition", count: 1, color: "bg-blue-300" },
    { stage: "Identify Decision Makers", count: 2, color: "bg-yellow-500" },
    { stage: "Proposal/Price Quote", count: 1, color: "bg-yellow-400" },
    { stage: "Negotiation/Review", count: 1, color: "bg-orange-500" },
    { stage: "Closed Won", count: 1, color: "bg-green-500" },
    { stage: "Closed Lost", count: 1, color: "bg-red-500" }
  ];

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
const AmountByStageChart = () => {
  const amountData = [
    { stage: "Qualification", amount: "Rs. 2,50,000.00", value: 250000, color: "bg-blue-500" },
    { stage: "Needs Analysis", amount: "Rs. 1,00,000.00", value: 100000, color: "bg-blue-400" },
    { stage: "Value Proposition", amount: "Rs. 70,000.00", value: 70000, color: "bg-blue-300" },
    { stage: "Identify Decision...", amount: "Rs. 1,05,000.00", value: 105000, color: "bg-yellow-500" },
    { stage: "Proposal/Price Q...", amount: "Rs. 25,000.00", value: 25000, color: "bg-yellow-400" },
    { stage: "Negotiation/Rev...", amount: "Rs. 70,000.00", value: 70000, color: "bg-orange-500" },
    { stage: "Closed Won", amount: "Rs. 35,000.00", value: 35000, color: "bg-green-500" },
    { stage: "Closed Lost", amount: "Rs. 45,000.00", value: 45000, color: "bg-red-500" }
  ];

  const maxAmount = 280000;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">AMOUNT BY STAGE</h3>
      
      {/* Amount Scale */}
      <div className="flex mb-4">
        <div className="w-32 mr-4">
          <div className="text-right space-y-1 text-xs text-gray-600">
            <div>280000</div>
            <div>240000</div>
            <div>220000</div>
            <div>200000</div>
            <div>180000</div>
            <div>160000</div>
            <div>140000</div>
            <div>120000</div>
            <div>100000</div>
            <div>80000</div>
            <div>60000</div>
            <div>40000</div>
            <div>20000</div>
            <div>0</div>
          </div>
        </div>
        
        {/* Chart Bars */}
        <div className="flex-1 flex items-end space-x-2">
          {amountData.map((item, index) => (
            <div key={index} className="flex flex-col items-center flex-1">
              <div
                className={`w-full ${item.color} rounded-t transition-all duration-500 max-w-12`}
                style={{ height: `${(item.value / maxAmount) * 200}px` }}
              ></div>
              <div className="text-xs text-gray-600 mt-2 text-center leading-tight">
                {item.stage}
              </div>
              <div className="text-xs font-semibold text-gray-900 mt-1">
                {item.amount}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="text-center mt-4">
        <p className="text-sm text-gray-600">Sum of Amount</p>
      </div>
    </div>
  );
};

// Pipeline Health Component
const PipelineHealth = () => {
  const healthData = [
    { stage: "Early Stage", amount: "Rs. 4,20,000.00", percentage: "60%", color: "bg-blue-500" },
    { stage: "Mid Stage", amount: "Rs. 2,00,000.00", percentage: "28%", color: "bg-yellow-500" },
    { stage: "Late Stage", amount: "Rs. 70,000.00", percentage: "10%", color: "bg-orange-500" },
    { stage: "Closed", amount: "Rs. 80,000.00", percentage: "2%", color: "bg-green-500" }
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">PIPELINE HEALTH</h3>
      
      <div className="space-y-4">
        {healthData.map((item, index) => (
          <div key={index}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-700">{item.stage}</span>
              <span className="font-semibold text-gray-900">{item.amount} ({item.percentage})</span>
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
const WinRateMetrics = () => {
  const winRateData = [
    { metric: "Overall Win Rate", value: "10%", change: "▲ 2%", trend: "up" },
    { metric: "Average Deal Size", value: "Rs. 35,000.00", change: "▲ 5%", trend: "up" },
    { metric: "Sales Cycle Length", value: "45 days", change: "▼ 3 days", trend: "down" },
    { metric: "Conversion Rate", value: "12%", change: "▲ 1.5%", trend: "up" }
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">PERFORMANCE METRICS</h3>
      
      <div className="grid grid-cols-2 gap-4">
        {winRateData.map((item, index) => (
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

// Main DealInsights Component
export default function DealInsights() {
  // Sample data
  const revenueUsersData = [
    { name: "DEVASHREE SALUNKE", amount: "Rs. 35,000.00" }
  ];

  const openAmountUsersData = [
    { name: "DEVASHREE SALUNKE", amount: "Rs. 6,20,000.00" }
  ];

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

      {/* Main Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <MetricCard
          title="REVENUE THIS MONTH"
          value="Rs. 35,000.00"
          change="▲ 100%"
          subtitle="Last Month Relative: 0"
          icon={DollarSign}
          trend="up"
        />
        
        <MetricCard
          title="DEALS CREATED"
          value="10"
          change="▲ 100%"
          subtitle="Last Month Relative: 0"
          icon={Target}
          trend="up"
        />
        
        <MetricCard
          title="DEALS IN PIPELINE"
          value="8"
          change=""
          subtitle=""
          icon={TrendingUp}
          trend=""
        />
        
        <MetricCard
          title="AVERAGE DEAL SIZE"
          value="Rs. 35,000.00"
          change="▲ 5%"
          subtitle="This Month"
          icon={BarChart3}
          trend="up"
        />
      </div>

      {/* Second Row - User Revenue and Deals by Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Revenue by Users */}
        <div className="lg:col-span-1">
          <UserRevenueTable
            title="REVENUE BY USERS"
            data={revenueUsersData}
          />
        </div>

        {/* Open Amount by Users */}
        <div className="lg:col-span-1">
          <UserRevenueTable
            title="OPEN AMOUNT BY USERS"
            data={openAmountUsersData}
          />
        </div>

        {/* Deals by Stage */}
        <div className="lg:col-span-1">
          <DealsByStage />
        </div>
      </div>

      {/* Third Row - Amount by Stage Chart */}
      <div className="mb-6">
        <AmountByStageChart />
      </div>

      {/* Fourth Row - Additional Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PipelineHealth />
        <WinRateMetrics />
      </div>

      {/* Bottom Row - Additional Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">TOP PERFORMING PRODUCTS</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-700">Product A</span>
              <span className="text-sm font-semibold text-gray-900">Rs. 1,50,000.00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-700">Product B</span>
              <span className="text-sm font-semibold text-gray-900">Rs. 1,20,000.00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-700">Product C</span>
              <span className="text-sm font-semibold text-gray-900">Rs. 80,000.00</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">DEAL VELOCITY</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-700">Qualification to Proposal</span>
              <span className="text-sm font-semibold text-gray-900">15 days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-700">Proposal to Close</span>
              <span className="text-sm font-semibold text-gray-900">30 days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-700">Total Sales Cycle</span>
              <span className="text-sm font-semibold text-gray-900">45 days</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">FORECAST ACCURACY</h3>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-2">92%</div>
            <p className="text-sm text-gray-600">This Quarter</p>
            <p className="text-xs text-gray-500 mt-1">▲ 3% from last quarter</p>
          </div>
        </div>
      </div>
    </div>
  );
}