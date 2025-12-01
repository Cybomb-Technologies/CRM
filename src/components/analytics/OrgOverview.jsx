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
            percentage === "100%" ? "text-green-600" : "text-gray-600"
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

// Progress Bar Component
const ProgressBar = ({ value, max, label, amount, target }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <h3 className="text-lg font-semibold text-gray-900">{label}</h3>
      <div className="text-right">
        <p className="text-sm text-gray-600">Target: {target}</p>
        <p className="text-sm font-semibold text-gray-900">{amount}</p>
      </div>
    </div>
    
    <div className="mb-2">
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div 
          className="bg-blue-600 h-3 rounded-full transition-all duration-300"
          style={{ width: `${(value / max) * 100}%` }}
        ></div>
      </div>
    </div>
    
    <div className="flex justify-between text-sm text-gray-600">
      <span>0</span>
      <span>100000</span>
      <span>200000</span>
      <span>300000</span>
      <span>400000</span>
      <span>500000</span>
      <span>600000</span>
      <span>700000</span>
      <span>800000</span>
      <span>900000</span>
    </div>
    
    <div className="mt-4 text-center">
      <p className="text-sm text-gray-600">Sum of Amount</p>
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
      {data.map((item, index) => (
        <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
          <span className="text-sm font-medium text-gray-700">{item.metric}</span>
          <span className="text-sm font-semibold text-gray-900">{item.value}</span>
        </div>
      ))}
    </div>
  </div>
);

// LeadsBySource Component
const LeadsBySource = ({ data }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
    <h3 className="text-lg font-semibold text-gray-900 mb-6">LEADS BY SOURCE</h3>
    
    <div className="space-y-3">
      {data.map((source, index) => (
        <div key={index} className="flex justify-between items-center">
          <span className="text-sm text-gray-700">{source.name}</span>
          <span className="text-sm font-semibold text-gray-900">
            {source.count} ({source.percentage})
          </span>
        </div>
      ))}
    </div>
  </div>
);

// SalesRepsTable Component
const SalesRepsTable = ({ data, title }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
    <h3 className="text-lg font-semibold text-gray-900 mb-6">{title}</h3>
    
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left text-sm font-medium text-gray-600 pb-3">Deal Owner</th>
            <th className="text-right text-sm font-medium text-gray-600 pb-3">Sum Of Amount</th>
          </tr>
        </thead>
        <tbody>
          {data.map((rep, index) => (
            <tr key={index} className="border-b border-gray-100 last:border-b-0">
              <td className="py-3 text-sm text-gray-700">{rep.name}</td>
              <td className="py-3 text-sm font-semibold text-gray-900 text-right">{rep.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// Main OrgOverview Component
export default function OrgOverview() {
  // Sample data - replace with actual API data
  const metricsData = [
    {
      title: "LEADS THIS MONTH",
      value: "10",
      percentage: "100%",
      subtitle: "Last Month Relative: 0",
      icon: Users
    },
    {
      title: "REVENUE THIS MONTH",
      value: "Rs. 35,000.00",
      percentage: "100%",
      subtitle: "Last Month Relative: 0",
      icon: TrendingUp
    },
    {
      title: "DEALS IN PIPELINE",
      value: "8",
      percentage: "",
      subtitle: "",
      icon: Target
    },
    {
      title: "ACCOUNTS THIS MONTH",
      value: "10",
      percentage: "100%",
      subtitle: "Last Month Relative: 0",
      icon: Building2
    }
  ];

  const targetData = {
    label: "LEAD GENERATION TARGET - THIS YEAR",
    value: 0,
    max: 1000,
    amount: "0",
    target: "990",
    subtitle: "Remaining: 990"
  };

  const revenueTargetData = {
    label: "REVENUE TARGET - THIS YEAR",
    value: 780000,
    max: 1000000,
    amount: "Rs. 7,80,000.00",
    target: "Rs. 10,000.00",
    subtitle: "Entire Org"
  };

  const performanceData = [
    { metric: "LEADS CREATED", value: "10" },
    { metric: "DEALS CREATED", value: "10" },
    { metric: "DEALS WON", value: "1" },
    { metric: "REVENUE WON", value: "Rs. 35,000.00" },
    { metric: "OPEN AMOUNT", value: "Rs. 6,20,000.00" }
  ];

  const leadsBySourceData = [
    { name: "Web Download", count: 1, percentage: "10.00%" },
    { name: "Seminar Partner", count: 1, percentage: "10.00%" },
    { name: "Partner", count: 1, percentage: "10.00%" },
    { name: "Online Store", count: 2, percentage: "20.00%" },
    { name: "Advertisement", count: 2, percentage: "20.00%" },
    { name: "Cold Call", count: 2, percentage: "20.00%" },
    { name: "External Referral", count: 1, percentage: "10.00%" }
  ];

  const salesRepsData = [
    { name: "1. DEVASHREE SALUNKE", amount: "Rs. 35,000.00" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Org Overview</h1>
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
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
        {metricsData.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        {/* Lead Generation Target */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {targetData.label}
          </h3>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-2">{targetData.amount}</div>
            <p className="text-sm text-gray-600">Remaining: {targetData.target}</p>
          </div>
        </div>

        {/* Revenue Target */}
        <ProgressBar 
          value={revenueTargetData.value}
          max={revenueTargetData.max}
          label={revenueTargetData.label}
          amount={revenueTargetData.amount}
          target={revenueTargetData.target}
        />
      </div>

      {/* Performance and Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Last 3 Months Performance */}
        <div className="lg:col-span-1">
          <PerformanceTable 
            data={performanceData}
            title="LAST 3 MONTHS PERFORMANCE MONITORING"
            period="November 2025"
          />
        </div>

        {/* Leads by Source */}
        <div className="lg:col-span-1">
          <LeadsBySource data={leadsBySourceData} />
        </div>

        {/* Prolific Sales Reps */}
        <div className="lg:col-span-1">
          <SalesRepsTable 
            data={salesRepsData}
            title="PROLIFIC SALES REPS"
          />
        </div>
      </div>

      {/* Additional Charts Section (Placeholder for future charts) */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
          <div className="h-48 flex items-center justify-center text-gray-500">
            <BarChart3 className="w-12 h-12 mb-2" />
            <p>Revenue chart will be displayed here</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Lead Conversion</h3>
          <div className="h-48 flex items-center justify-center text-gray-500">
            <TrendingUp className="w-12 h-12 mb-2" />
            <p>Conversion chart will be displayed here</p>
          </div>
        </div>
      </div>
    </div>
  );
}