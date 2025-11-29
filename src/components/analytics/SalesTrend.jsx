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
  LineChart,
  DollarSign,
  Calendar,
  ShoppingCart,
  PieChart
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

// Monthly Sales Trend Chart Component
const MonthlySalesTrend = () => {
  const monthlyData = [
    { month: 'Jan', revenue: 450000, deals: 45, target: 500000 },
    { month: 'Feb', revenue: 520000, deals: 52, target: 500000 },
    { month: 'Mar', revenue: 480000, deals: 48, target: 500000 },
    { month: 'Apr', revenue: 610000, deals: 61, target: 550000 },
    { month: 'May', revenue: 580000, deals: 58, target: 550000 },
    { month: 'Jun', revenue: 720000, deals: 72, target: 600000 },
    { month: 'Jul', revenue: 680000, deals: 68, target: 600000 },
    { month: 'Aug', revenue: 750000, deals: 75, target: 650000 },
    { month: 'Sep', revenue: 820000, deals: 82, target: 700000 },
    { month: 'Oct', revenue: 780000, deals: 78, target: 700000 },
    { month: 'Nov', revenue: 850000, deals: 85, target: 750000 },
    { month: 'Dec', revenue: 920000, deals: 92, target: 800000 }
  ];

  const maxRevenue = 1000000;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">MONTHLY SALES TREND</h3>
      
      <div className="flex mb-4">
        <div className="w-20 mr-4">
          <div className="text-right space-y-4 text-xs text-gray-600">
            <div>10L</div>
            <div>9L</div>
            <div>8L</div>
            <div>7L</div>
            <div>6L</div>
            <div>5L</div>
            <div>4L</div>
            <div>3L</div>
            <div>2L</div>
            <div>1L</div>
            <div>0</div>
          </div>
        </div>
        
        {/* Chart Bars */}
        <div className="flex-1 flex items-end justify-between">
          {monthlyData.map((item, index) => (
            <div key={index} className="flex flex-col items-center flex-1">
              <div className="flex items-end space-x-1 h-40">
                {/* Actual Revenue */}
                <div
                  className="w-3 bg-blue-500 rounded-t transition-all duration-500"
                  style={{ height: `${(item.revenue / maxRevenue) * 160}px` }}
                ></div>
                {/* Target Revenue */}
                <div
                  className="w-3 bg-green-300 rounded-t transition-all duration-500"
                  style={{ height: `${(item.target / maxRevenue) * 160}px` }}
                ></div>
              </div>
              <div className="text-xs text-gray-600 mt-2">{item.month}</div>
              <div className="text-xs font-semibold text-gray-900 mt-1">
                Rs. {(item.revenue / 100000).toFixed(1)}L
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-center space-x-6 mt-4">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
          <span className="text-xs text-gray-600">Actual Revenue</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-300 rounded mr-2"></div>
          <span className="text-xs text-gray-600">Target Revenue</span>
        </div>
      </div>
    </div>
  );
};

// Quarterly Performance Component
const QuarterlyPerformance = () => {
  const quarterData = [
    { quarter: 'Q1', revenue: 'Rs. 14.5L', growth: '▲ 15%', deals: 145, target: 'Rs. 15L' },
    { quarter: 'Q2', revenue: 'Rs. 19.1L', growth: '▲ 32%', deals: 191, target: 'Rs. 17.5L' },
    { quarter: 'Q3', revenue: 'Rs. 22.5L', growth: '▲ 18%', deals: 225, target: 'Rs. 20L' },
    { quarter: 'Q4', revenue: 'Rs. 25.5L', growth: '▲ 13%', deals: 255, target: 'Rs. 22.5L' }
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">QUARTERLY PERFORMANCE</h3>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quarterData.map((quarter, index) => (
          <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-lg font-bold text-gray-900 mb-1">{quarter.quarter}</p>
            <p className="text-xl font-semibold text-blue-600 mb-1">{quarter.revenue}</p>
            <p className="text-sm text-green-600 font-medium mb-1">{quarter.growth}</p>
            <p className="text-xs text-gray-600">{quarter.deals} Deals</p>
            <p className="text-xs text-gray-500 mt-1">Target: {quarter.target}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Product Performance Component
const ProductPerformance = () => {
  const productData = [
    { product: 'Product A', revenue: 'Rs. 12.5L', growth: '▲ 25%', percentage: '25%', color: 'bg-blue-500' },
    { product: 'Product B', revenue: 'Rs. 10.8L', growth: '▲ 18%', percentage: '21%', color: 'bg-green-500' },
    { product: 'Product C', revenue: 'Rs. 8.2L', growth: '▲ 12%', percentage: '16%', color: 'bg-purple-500' },
    { product: 'Product D', revenue: 'Rs. 7.5L', growth: '▲ 8%', percentage: '15%', color: 'bg-orange-500' },
    { product: 'Product E', revenue: 'Rs. 6.0L', growth: '▲ 5%', percentage: '12%', color: 'bg-red-500' },
    { product: 'Others', revenue: 'Rs. 5.0L', growth: '▲ 3%', percentage: '10%', color: 'bg-gray-500' }
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">PRODUCT PERFORMANCE TREND</h3>
      
      <div className="space-y-4">
        {productData.map((product, index) => (
          <div key={index}>
            <div className="flex justify-between text-sm mb-1">
              <div className="flex items-center">
                <div className={`w-3 h-3 ${product.color} rounded-full mr-2`}></div>
                <span className="text-gray-700">{product.product}</span>
              </div>
              <div className="text-right">
                <span className="font-semibold text-gray-900">{product.revenue}</span>
                <span className="text-green-600 text-xs ml-2">{product.growth}</span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${product.color} transition-all duration-500`}
                style={{ width: product.percentage }}
              ></div>
            </div>
            <div className="text-right text-xs text-gray-500 mt-1">{product.percentage} of total revenue</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Regional Sales Distribution
const RegionalSales = () => {
  const regionData = [
    { region: 'North Region', revenue: 'Rs. 15.2L', growth: '▲ 22%', percentage: '30%', color: 'bg-blue-500' },
    { region: 'South Region', revenue: 'Rs. 12.8L', growth: '▲ 18%', percentage: '25%', color: 'bg-green-500' },
    { region: 'East Region', revenue: 'Rs. 10.5L', growth: '▲ 15%', percentage: '21%', color: 'bg-purple-500' },
    { region: 'West Region', revenue: 'Rs. 8.5L', growth: '▲ 12%', percentage: '17%', color: 'bg-orange-500' },
    { region: 'Central Region', revenue: 'Rs. 3.0L', growth: '▲ 8%', percentage: '6%', color: 'bg-red-500' }
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">REGIONAL SALES DISTRIBUTION</h3>
      
      <div className="space-y-4">
        {regionData.map((region, index) => (
          <div key={index}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-700">{region.region}</span>
              <div className="text-right">
                <span className="font-semibold text-gray-900">{region.revenue}</span>
                <span className="text-green-600 text-xs ml-2">{region.growth}</span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${region.color} transition-all duration-500`}
                style={{ width: region.percentage }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Sales Team Performance
const SalesTeamPerformance = () => {
  const teamData = [
    { name: 'DEVASHREE SALUNKE', revenue: 'Rs. 12.5L', deals: 125, target: '110%', trend: 'up' },
    { name: 'RAJESH KUMAR', revenue: 'Rs. 9.8L', deals: 98, target: '98%', trend: 'up' },
    { name: 'PRIYA SHARMA', revenue: 'Rs. 8.2L', deals: 82, target: '95%', trend: 'up' },
    { name: 'AMIT PATEL', revenue: 'Rs. 7.5L', deals: 75, target: '88%', trend: 'down' },
    { name: 'Sneha Verma', revenue: 'Rs. 6.8L', deals: 68, target: '85%', trend: 'up' }
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">SALES TEAM PERFORMANCE TREND</h3>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left text-sm font-medium text-gray-600 pb-3">Sales Rep</th>
              <th className="text-center text-sm font-medium text-gray-600 pb-3">Revenue</th>
              <th className="text-center text-sm font-medium text-gray-600 pb-3">Deals Closed</th>
              <th className="text-center text-sm font-medium text-gray-600 pb-3">Target Achievement</th>
              <th className="text-center text-sm font-medium text-gray-600 pb-3">Trend</th>
            </tr>
          </thead>
          <tbody>
            {teamData.map((member, index) => (
              <tr key={index} className="border-b border-gray-100 last:border-b-0">
                <td className="py-3 text-sm text-gray-700">{member.name}</td>
                <td className="py-3 text-sm font-semibold text-gray-900 text-center">{member.revenue}</td>
                <td className="py-3 text-sm text-gray-700 text-center">{member.deals}</td>
                <td className="py-3 text-center">
                  <span className={cn(
                    "px-2 py-1 text-xs rounded-full font-medium",
                    parseFloat(member.target) >= 100 
                      ? "bg-green-100 text-green-800" 
                      : parseFloat(member.target) >= 90
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  )}>
                    {member.target}
                  </span>
                </td>
                <td className="py-3 text-center">
                  {member.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4 text-green-600 inline" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-600 inline" />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Sales Forecast Component
const SalesForecast = () => {
  const forecastData = [
    { period: 'Next Month', forecast: 'Rs. 9.8L', confidence: '85%', trend: 'up' },
    { period: 'Next Quarter', forecast: 'Rs. 28.5L', confidence: '78%', trend: 'up' },
    { period: 'Next 6 Months', forecast: 'Rs. 55.2L', confidence: '72%', trend: 'up' },
    { period: 'Next Year', forecast: 'Rs. 1.2Cr', confidence: '65%', trend: 'up' }
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">SALES FORECAST TREND</h3>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {forecastData.map((item, index) => (
          <div key={index} className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
            <p className="text-sm font-medium text-gray-600 mb-2">{item.period}</p>
            <p className="text-xl font-bold text-blue-700 mb-2">{item.forecast}</p>
            <div className="flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
              <span className="text-sm font-medium text-green-600">{item.confidence} Confidence</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Main SalesTrend Component
export default function SalesTrend() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sales Trend</h1>
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
          title="YTD REVENUE"
          value="Rs. 81.6L"
          change="▲ 19.5%"
          subtitle="Year to Date"
          icon={DollarSign}
          trend="up"
        />
        
        <MetricCard
          title="TOTAL DEALS"
          value="816"
          change="▲ 22%"
          subtitle="This Year"
          icon={Target}
          trend="up"
        />
        
        <MetricCard
          title="AVG DEAL SIZE"
          value="Rs. 1,00,000"
          change="▲ 8%"
          subtitle="This Year"
          icon={ShoppingCart}
          trend="up"
        />
        
        <MetricCard
          title="CONVERSION RATE"
          value="24.8%"
          change="▲ 3.2%"
          subtitle="Lead to Deal"
          icon={TrendingUp}
          trend="up"
        />
      </div>

      {/* Monthly Sales Trend */}
      <div className="mb-6">
        <MonthlySalesTrend />
      </div>

      {/* Quarterly Performance */}
      <div className="mb-6">
        <QuarterlyPerformance />
      </div>

      {/* Third Row - Product Performance and Regional Sales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ProductPerformance />
        <RegionalSales />
      </div>

      {/* Sales Team Performance */}
      <div className="mb-6">
        <SalesTeamPerformance />
      </div>

      {/* Sales Forecast */}
      <div className="mb-6">
        <SalesForecast />
      </div>

      {/* Bottom Row - Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">SALES CYCLE TREND</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-700">Current Average</span>
              <span className="text-sm font-semibold text-gray-900">45 days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-700">Last Quarter</span>
              <span className="text-sm font-semibold text-gray-900">52 days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-700">Improvement</span>
              <span className="text-sm font-semibold text-green-600">▼ 13%</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">WIN RATE TREND</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-700">Current Quarter</span>
              <span className="text-sm font-semibold text-gray-900">28.5%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-700">Last Quarter</span>
              <span className="text-sm font-semibold text-gray-900">25.2%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-700">Improvement</span>
              <span className="text-sm font-semibold text-green-600">▲ 13%</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">PIPELINE HEALTH</h3>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-2">Rs. 2.8Cr</div>
            <p className="text-sm text-gray-600">Total Pipeline Value</p>
            <p className="text-xs text-gray-500 mt-1">▲ 15% from last month</p>
          </div>
        </div>
      </div>
    </div>
  );
}