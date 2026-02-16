import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Target,
  Filter,
  Download,
  MoreVertical,
  BarChart3,
  PieChart
} from 'lucide-react';
import analyticsService from '@/services/analyticsService';

// Utility function for class names
const cn = (...classes) => classes.filter(Boolean).join(' ');

// Metric Card Component
const MetricCard = ({ title, value, change, subtitle, trend }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
    <h3 className="text-sm font-medium text-gray-600 mb-2">{title}</h3>
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
              trend === 'up' ? "text-green-600" : "text-red-600"
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

// Table Component for Lead Sources
const DataTable = ({ title, headers, data }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            {headers.map((header, index) => (
              <th
                key={index}
                className="text-left text-sm font-medium text-gray-600 pb-3"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data && data.length > 0 ? (
            data.map((row, index) => (
              <tr key={index} className="border-b border-gray-100 last:border-b-0">
                <td className="py-3 text-sm text-gray-700">{row.name}</td>
                <td className="py-3 text-sm font-semibold text-gray-900">
                  {row.count}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={headers.length} className="py-3 text-center text-gray-500">No data available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);

// Industry Distribution Component
const IndustryDistribution = ({ data }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">LEADS BY INDUSTRY</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data && data.length > 0 ? (
          data.map((industry, index) => (
            <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-700">{industry.name}</span>
              <span className="text-sm font-semibold text-gray-900">
                {industry.count} ({industry.percentage})
              </span>
            </div>
          ))
        ) : (
          <div className="col-span-2 text-center text-gray-500 py-4">No industry data available</div>
        )}
      </div>
    </div>
  );
};

// Main LeadAnalytics Component
export default function LeadAnalytics() {
  const [loading, setLoading] = React.useState(true);
  const [topLeadSources, setTopLeadSources] = React.useState([]);
  const [industryData, setIndustryData] = React.useState([]);
  const [metrics, setMetrics] = React.useState({
    leadsThisWeek: 0,
    conversionRate: "0%",
    totalLeads: 0
  });

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await analyticsService.getLeadAnalytics();
        if (response.success) {
          const { leadsBySource, leadsThisWeek, conversionRate, leadsByIndustry, totalLeads } = response.data;

          // Map Lead Sources
          const formattedSources = leadsBySource.map((source, index) => ({
            name: `${index + 1}. ${source._id || 'Unknown'}`,
            count: source.count
          }));
          setTopLeadSources(formattedSources);

          // Map Industry Data
          const totalIndustryCount = leadsByIndustry.reduce((acc, curr) => acc + curr.count, 0);
          const formattedIndustry = leadsByIndustry.map(item => ({
            name: item._id || 'Unknown',
            count: item.count,
            percentage: totalIndustryCount > 0 ? `${((item.count / totalIndustryCount) * 100).toFixed(2)}%` : '0%'
          }));
          setIndustryData(formattedIndustry);

          setMetrics({
            leadsThisWeek,
            conversionRate: `${conversionRate}%`,
            totalLeads
          });
        }
      } catch (error) {
        console.error("Failed to fetch lead analytics:", error);
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
            <h1 className="text-3xl font-bold text-gray-900">Lead Analytics</h1>
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
          <div className="text-gray-500">Loading lead analytics...</div>
        </div>
      ) : (
        <>
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Top Lead Sources */}
            <div className="lg:col-span-2">
              <DataTable
                title="TOP LEAD SOURCES"
                headers={["Lead Source", "Record Count"]}
                data={topLeadSources}
              />
            </div>

            {/* This Week's Leads */}
            <div className="lg:col-span-1">
              <MetricCard
                title="THIS WEEK'S LEADS"
                value={metrics.leadsThisWeek.toString()}
                change=""
                subtitle="Since Sunday"
                trend=""
              />
            </div>
          </div>

          {/* Additional Metrics Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <MetricCard
              title="TOTAL LEADS"
              value={metrics.totalLeads.toString()}
              change=""
              subtitle="All Time"
              trend="up"
            />
            <MetricCard
              title="CONVERSION RATE"
              value={metrics.conversionRate}
              change=""
              subtitle="Overall"
              trend="up"
            />
            {/* Leads by Industry moved here as it's a list/grid */}
            <div className="col-span-1 md:col-span-1">
              <IndustryDistribution data={industryData} />
            </div>
          </div>

        </>
      )}
    </div>
  );
}