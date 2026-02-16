import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  Target,
  DollarSign,
  ShoppingCart,
  Filter,
  Download,
  MoreVertical,
  BarChart3
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

// Monthly Sales Trend Chart Component
const MonthlySalesTrend = ({ data }) => {
  // Data expects array of { _id: { month: 1 }, totalSales: 1000, count: 5 }
  // We need to map this to 12 months, filling missing with 0
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const mappedData = monthNames.map((name, index) => {
    const monthNum = index + 1;
    const found = data.find(d => d._id.month === monthNum);
    return {
      month: name,
      revenue: found ? found.totalSales : 0,
      count: found ? found.count : 0
    };
  });

  const maxRevenue = Math.max(...mappedData.map(d => d.revenue), 100000); // Default max to avoid div by zero

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">MONTHLY SALES TREND</h3>

      <div className="flex mb-4">
        {/* Y-Axis Label Area - Simplified */}
        <div className="w-16 mr-2 flex flex-col justify-between text-xs text-gray-600 text-right h-40">
          <div>{`Rs. ${(maxRevenue / 1000).toFixed(0)}k`}</div>
          <div>0</div>
        </div>

        {/* Chart Bars */}
        <div className="flex-1 flex items-end justify-between h-40">
          {mappedData.map((item, index) => (
            <div key={index} className="flex flex-col items-center flex-1 group">
              {/* Tooltip hint */}
              <div
                className="w-4 bg-blue-500 rounded-t transition-all duration-500 relative"
                style={{ height: `${(item.revenue / maxRevenue) * 100}%` }}
              >
                <div className="opacity-0 group-hover:opacity-100 absolute bottom-full mb-1 text-xs bg-gray-800 text-white p-1 rounded whitespace-nowrap -left-2 z-10">
                  Rs. {item.revenue.toLocaleString()}
                </div>
              </div>
              <div className="text-xs text-gray-600 mt-2">{item.month}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Quarterly Performance Component
const QuarterlyPerformance = ({ data }) => {
  // Derive quarters from monthly data provided by parent or same source
  // data is array of { _id: { month: 1 }, totalSales: 1000, count: 5 }

  const getQuarterData = (qNum) => {
    const startMonth = (qNum - 1) * 3 + 1;
    const endMonth = startMonth + 2;
    const qData = data.filter(d => d._id.month >= startMonth && d._id.month <= endMonth);
    const revenue = qData.reduce((sum, d) => sum + d.totalSales, 0);
    const count = qData.reduce((sum, d) => sum + d.count, 0);
    return { revenue, count };
  };

  const quarters = [
    { name: 'Q1', ...getQuarterData(1) },
    { name: 'Q2', ...getQuarterData(2) },
    { name: 'Q3', ...getQuarterData(3) },
    { name: 'Q4', ...getQuarterData(4) },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">QUARTERLY PERFORMANCE</h3>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quarters.map((quarter, index) => (
          <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-lg font-bold text-gray-900 mb-1">{quarter.name}</p>
            <p className="text-xl font-semibold text-blue-600 mb-1">Rs. {quarter.revenue.toLocaleString()}</p>
            <p className="text-xs text-gray-600">{quarter.count} Deals</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Product Performance Component
const ProductPerformance = ({ data }) => {
  // data: [{ _id: "Prod Name", totalRevenue: 100, quantitySold: 5 }]
  const totalRev = data.reduce((sum, item) => sum + item.totalRevenue, 0);

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">PRODUCT PERFORMANCE TREND</h3>
        <div className="text-gray-500 text-center py-4">No product sales data available.</div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">PRODUCT PERFORMANCE TREND</h3>

      <div className="space-y-4">
        {data.map((product, index) => {
          const percentage = totalRev > 0 ? (product.totalRevenue / totalRev) * 100 : 0;
          return (
            <div key={index}>
              <div className="flex justify-between text-sm mb-1">
                <div className="flex items-center">
                  <span className="text-gray-700">{product._id || 'Unknown Product'}</span>
                </div>
                <div className="text-right">
                  <span className="font-semibold text-gray-900">Rs. {product.totalRevenue.toLocaleString()}</span>
                  <span className="text-gray-500 text-xs ml-2">({product.quantitySold} qty)</span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-blue-500 transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <div className="text-right text-xs text-gray-500 mt-1">{percentage.toFixed(1)}% of total revenue</div>
            </div>
          )
        })}
      </div>
    </div>
  );
};

// Main SalesTrend Component
export default function SalesTrend() {
  const [loading, setLoading] = React.useState(true);
  const [trendData, setTrendData] = React.useState({
    monthlySales: [], // Array of { _id: { month }, totalSales, count }
    productPerformance: [] // Array of { _id, totalRevenue, quantitySold }
  });

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await analyticsService.getSalesTrend();
        if (response.success) {
          setTrendData(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch sales trend:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalYTDRevenue = trendData.monthlySales.reduce((sum, item) => sum + item.totalSales, 0);
  const totalYTDDeals = trendData.monthlySales.reduce((sum, item) => sum + item.count, 0);
  const avgDealSize = totalYTDDeals > 0 ? (totalYTDRevenue / totalYTDDeals) : 0;

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

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading sales trend...</div>
        </div>
      ) : (
        <>
          {/* Main Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <MetricCard
              title="YTD REVENUE"
              value={`Rs. ${totalYTDRevenue.toLocaleString()}`}
              change=""
              subtitle="Year to Date"
              icon={DollarSign}
              trend="up"
            />

            <MetricCard
              title="TOTAL ORDERS"
              value={totalYTDDeals.toString()}
              change=""
              subtitle="This Year"
              icon={Target}
              trend="up"
            />

            <MetricCard
              title="AVG ORDER VALUE"
              value={`Rs. ${avgDealSize.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
              change=""
              subtitle="This Year"
              icon={ShoppingCart}
              trend="up"
            />
          </div>

          {/* Monthly Sales Trend */}
          <div className="mb-6">
            <MonthlySalesTrend data={trendData.monthlySales} />
          </div>

          {/* Quarterly Performance */}
          <div className="mb-6">
            <QuarterlyPerformance data={trendData.monthlySales} />
          </div>

          {/* Product Performance */}
          <div className="mb-6">
            <ProductPerformance data={trendData.productPerformance} />
          </div>

        </>
      )}
    </div>
  );
}