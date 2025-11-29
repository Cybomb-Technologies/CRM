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
          ) : (
            <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
          )}
          <span className={cn(
            "text-sm font-medium",
            trend === 'up' ? "text-green-600" : "text-red-600"
          )}>
            {change}
          </span>
        </div>
        {subtitle && (
          <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
        )}
      </div>
    </div>
  </div>
);

// Table Component for Lead Sources and Owners
const DataTable = ({ title, headers, data, showPercentage = false }) => (
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
          {data.map((row, index) => (
            <tr key={index} className="border-b border-gray-100 last:border-b-0">
              <td className="py-3 text-sm text-gray-700">{row.name}</td>
              <td className="py-3 text-sm font-semibold text-gray-900">
                {row.count}
                {showPercentage && row.percentage && (
                  <span className={cn(
                    "ml-2 text-xs font-medium",
                    row.trend === 'up' ? "text-green-600" : "text-gray-600"
                  )}>
                    {row.trend === 'up' ? '▲' : ''} {row.percentage}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// Sales Funnel Component
const SalesFunnel = () => {
  const funnelData = [
    { stage: "Leads Created", value: 11, color: "bg-blue-500" },
    { stage: "Contacts", value: 10, color: "bg-blue-400" },
    { stage: "Opportunities", value: 10, color: "bg-blue-300" },
    { stage: "Customers", value: 0, color: "bg-blue-200" }
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">SALES FUNNEL</h3>
      
      <div className="flex items-end justify-center space-x-2 h-48">
        {funnelData.map((item, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="text-xs text-gray-600 mb-1">{item.value}</div>
            <div
              className={`w-16 ${item.color} rounded-t transition-all duration-500`}
              style={{ height: `${item.value * 4}px` }}
            ></div>
            <div className="text-xs text-gray-600 mt-2 text-center">
              {item.stage}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Conversion Table Component
const ConversionTable = () => {
  const conversionData = [
    {
      source: "Advertisement",
      leadsCreated: 2,
      convertedToContacts: "0%",
      customers: 0,
      conversionRate: "0%"
    },
    {
      source: "Cold Call",
      leadsCreated: 2,
      convertedToContacts: "0%",
      customers: 0,
      conversionRate: "0%"
    },
    {
      source: "External Referral",
      leadsCreated: 1,
      convertedToContacts: "0%",
      customers: 0,
      conversionRate: "0%"
    }
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Lead Source Performance</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left text-sm font-medium text-gray-600 pb-3">Lead Source</th>
              <th className="text-center text-sm font-medium text-gray-600 pb-3">LEADS CREATED</th>
              <th className="text-center text-sm font-medium text-gray-600 pb-3">CONVERTED TO CONTACTS</th>
              <th className="text-center text-sm font-medium text-gray-600 pb-3">CUSTOMERS</th>
              <th className="text-center text-sm font-medium text-gray-600 pb-3">Conversion Rate</th>
            </tr>
          </thead>
          <tbody>
            {conversionData.map((row, index) => (
              <tr key={index} className="border-b border-gray-100 last:border-b-0">
                <td className="py-3 text-sm text-gray-700">{row.source}</td>
                <td className="py-3 text-sm font-semibold text-gray-900 text-center">{row.leadsCreated}</td>
                <td className="py-3 text-sm text-gray-700 text-center">{row.convertedToContacts}</td>
                <td className="py-3 text-sm text-gray-700 text-center">{row.customers}</td>
                <td className="py-3 text-sm text-gray-700 text-center">{row.conversionRate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Industry Distribution Component
const IndustryDistribution = () => {
  const industryData = [
    { name: "Data/Telecom OEM", percentage: "10.00%", count: 1 },
    { name: "Government/Military", percentage: "10.00%", count: 1 },
    { name: "Large Enterprise", percentage: "10.00%", count: 1 },
    { name: "MSP (Management Service P.)", percentage: "10.00%", count: 1 },
    { name: "Non-management ISV", percentage: "10.00%", count: 1 },
    { name: "Management ISV", percentage: "10.00%", count: 1 },
    { name: "E&P", percentage: "10.00%", count: 1 },
    { name: "Storage Equipment", percentage: "10.00%", count: 1 },
    { name: "Service Provider", percentage: "10.00%", count: 1 },
    { name: "Optical Networking", percentage: "10.00%", count: 1 }
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">LEADS BY INDUSTRY</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {industryData.map((industry, index) => (
          <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-700">{industry.name}</span>
            <span className="text-sm font-semibold text-gray-900">
              {industry.count} ({industry.percentage})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Monthly Lead Chart Component
const MonthlyLeadChart = () => {
  const monthlyData = [11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">MONTHLY LEAD CREATION</h3>
      
      <div className="flex items-end justify-between h-48 px-4">
        {monthlyData.map((value, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="text-xs text-gray-600 mb-1">{value}</div>
            <div
              className="w-6 bg-gradient-to-t from-blue-500 to-blue-300 rounded-t transition-all duration-500"
              style={{ height: `${value * 4}px` }}
            ></div>
            <div className="text-xs text-gray-600 mt-2">{index + 1}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Main LeadAnalytics Component
export default function LeadAnalytics() {
  // Sample data
  const topLeadSources = [
    { name: "1. Advertisement", count: 2 },
    { name: "2. Cold Call", count: 2 },
    { name: "3. Online Store", count: 2 },
    { name: "4. External Referral", count: 1 },
    { name: "5. Partner", count: 1 },
    { name: "6. Seminar Partner", count: 1 },
    { name: "7. Web Download", count: 1 }
  ];

  const topLeadOwners = [
    { name: "DEVASHREE SALUNKE", count: 10, percentage: "100%", trend: "up" }
  ];

  const junkLeadsBySource = [
    { name: "No junk leads", count: 0 }
  ];

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

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Today's Leads */}
        <div className="lg:col-span-2">
          <DataTable
            title="TODAY'S LEADS - TOP 10 LEAD SOURCES"
            headers={["Lead Source", "Record Count"]}
            data={topLeadSources}
          />
        </div>

        {/* This Week's Leads */}
        <div className="lg:col-span-1">
          <MetricCard
            title="THIS WEEK'S LEADS"
            value="0"
            change="▼ 100%"
            subtitle="Last Week Relative: 10"
            trend="down"
          />
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Top Lead Owners */}
        <div className="lg:col-span-1">
          <DataTable
            title="TOP LEAD OWNERS"
            headers={["Lead Owner", "Record Count"]}
            data={topLeadOwners}
            showPercentage={true}
          />
        </div>

        {/* Junk Leads */}
        <div className="lg:col-span-1">
          <DataTable
            title="JUNK LEADS BY SOURCE"
            headers={["Lead Source", "Record Count"]}
            data={junkLeadsBySource}
          />
        </div>

        {/* Sales Funnel */}
        <div className="lg:col-span-1">
          <SalesFunnel />
        </div>
      </div>

      {/* Third Row - Conversion Table */}
      <div className="mb-6">
        <ConversionTable />
      </div>

      {/* Fourth Row - Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Lead Creation */}
        <MonthlyLeadChart />
        
        {/* Leads by Industry */}
        <IndustryDistribution />
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
        <MetricCard
          title="TOTAL LEADS"
          value="110"
          change="▲ 5%"
          subtitle="This Month"
          trend="up"
        />
        <MetricCard
          title="CONVERSION RATE"
          value="9.1%"
          change="▲ 2.1%"
          subtitle="Overall"
          trend="up"
        />
        <MetricCard
          title="AVG RESPONSE TIME"
          value="2.3h"
          change="▼ 0.5h"
          subtitle="This Week"
          trend="down"
        />
        <MetricCard
          title="QUALIFIED LEADS"
          value="45"
          change="▲ 12%"
          subtitle="This Month"
          trend="up"
        />
      </div>
    </div>
  );
}