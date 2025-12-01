import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Users,
  Phone,
  Mail,
  MessageSquare,
  Filter,
  Download,
  MoreVertical,
  BarChart3,
  PieChart,
  Target,
  Activity
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

// Activity Timeline Component
const ActivityTimeline = () => {
  const timelineData = [
    { 
      time: '09:00 AM', 
      activity: 'Meeting with ABC Corp', 
      type: 'meeting', 
      user: 'DEVASHREE SALUNKE',
      status: 'completed',
      duration: '45 mins'
    },
    { 
      time: '10:30 AM', 
      activity: 'Follow-up call with XYZ Ltd', 
      type: 'call', 
      user: 'RAJESH KUMAR',
      status: 'completed',
      duration: '20 mins'
    },
    { 
      time: '11:45 AM', 
      activity: 'Product demo for New Client', 
      type: 'demo', 
      user: 'PRIYA SHARMA',
      status: 'in-progress',
      duration: '60 mins'
    },
    { 
      time: '02:00 PM', 
      activity: 'Sales proposal review', 
      type: 'task', 
      user: 'AMIT PATEL',
      status: 'scheduled',
      duration: '30 mins'
    },
    { 
      time: '03:30 PM', 
      activity: 'Team coordination meeting', 
      type: 'meeting', 
      user: 'DEVASHREE SALUNKE',
      status: 'scheduled',
      duration: '45 mins'
    }
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'meeting': return <Users className="w-4 h-4 text-blue-500" />;
      case 'call': return <Phone className="w-4 h-4 text-green-500" />;
      case 'demo': return <Target className="w-4 h-4 text-purple-500" />;
      case 'task': return <CheckCircle className="w-4 h-4 text-orange-500" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'in-progress': return 'text-blue-600 bg-blue-100';
      case 'scheduled': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">TODAY'S ACTIVITY TIMELINE</h3>
      
      <div className="space-y-4">
        {timelineData.map((item, index) => (
          <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex flex-col items-center">
              <div className="text-sm font-semibold text-gray-900">{item.time}</div>
              <div className="w-px h-12 bg-gray-300 my-1"></div>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {getActivityIcon(item.type)}
                  <span className="font-medium text-gray-900">{item.activity}</span>
                </div>
                <span className={cn(
                  "px-2 py-1 text-xs rounded-full font-medium",
                  getStatusColor(item.status)
                )}>
                  {item.status.replace('-', ' ')}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>By: {item.user}</span>
                <span>Duration: {item.duration}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Activity Type Distribution Component
const ActivityTypeDistribution = () => {
  const activityData = [
    { type: 'Meetings', count: 45, percentage: '30%', color: 'bg-blue-500' },
    { type: 'Calls', count: 38, percentage: '25%', color: 'bg-green-500' },
    { type: 'Emails', count: 35, percentage: '23%', color: 'bg-purple-500' },
    { type: 'Tasks', count: 20, percentage: '13%', color: 'bg-orange-500' },
    { type: 'Demos', count: 12, percentage: '8%', color: 'bg-red-500' }
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">ACTIVITY TYPE DISTRIBUTION</h3>
      
      <div className="space-y-4">
        {activityData.map((activity, index) => (
          <div key={index}>
            <div className="flex justify-between text-sm mb-1">
              <div className="flex items-center">
                <div className={`w-3 h-3 ${activity.color} rounded-full mr-2`}></div>
                <span className="text-gray-700">{activity.type}</span>
              </div>
              <span className="font-semibold text-gray-900">
                {activity.count} ({activity.percentage})
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${activity.color} transition-all duration-500`}
                style={{ width: activity.percentage }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// User Activity Performance Component
const UserActivityPerformance = () => {
  const userData = [
    { 
      name: 'DEVASHREE SALUNKE', 
      activities: 45, 
      completed: 42, 
      completion: '93%',
      avgTime: '25 mins',
      trend: 'up'
    },
    { 
      name: 'RAJESH KUMAR', 
      activities: 38, 
      completed: 35, 
      completion: '92%',
      avgTime: '28 mins',
      trend: 'up'
    },
    { 
      name: 'PRIYA SHARMA', 
      activities: 35, 
      completed: 32, 
      completion: '91%',
      avgTime: '22 mins',
      trend: 'up'
    },
    { 
      name: 'AMIT PATEL', 
      activities: 28, 
      completed: 24, 
      completion: '86%',
      avgTime: '35 mins',
      trend: 'down'
    },
    { 
      name: 'SNEHA VERMA', 
      activities: 25, 
      completed: 22, 
      completion: '88%',
      avgTime: '30 mins',
      trend: 'up'
    }
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">USER ACTIVITY PERFORMANCE</h3>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left text-sm font-medium text-gray-600 pb-3">User</th>
              <th className="text-center text-sm font-medium text-gray-600 pb-3">Total Activities</th>
              <th className="text-center text-sm font-medium text-gray-600 pb-3">Completed</th>
              <th className="text-center text-sm font-medium text-gray-600 pb-3">Completion Rate</th>
              <th className="text-center text-sm font-medium text-gray-600 pb-3">Avg Time</th>
              <th className="text-center text-sm font-medium text-gray-600 pb-3">Trend</th>
            </tr>
          </thead>
          <tbody>
            {userData.map((user, index) => (
              <tr key={index} className="border-b border-gray-100 last:border-b-0">
                <td className="py-3 text-sm text-gray-700">{user.name}</td>
                <td className="py-3 text-sm font-semibold text-gray-900 text-center">{user.activities}</td>
                <td className="py-3 text-sm text-gray-700 text-center">{user.completed}</td>
                <td className="py-3 text-center">
                  <span className={cn(
                    "px-2 py-1 text-xs rounded-full font-medium",
                    parseFloat(user.completion) >= 90 
                      ? "bg-green-100 text-green-800" 
                      : parseFloat(user.completion) >= 85
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  )}>
                    {user.completion}
                  </span>
                </td>
                <td className="py-3 text-sm text-gray-700 text-center">{user.avgTime}</td>
                <td className="py-3 text-center">
                  {user.trend === 'up' ? (
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

// Weekly Activity Trend Component
const WeeklyActivityTrend = () => {
  const weeklyData = [
    { day: 'Mon', activities: 45, completed: 42, color: 'bg-blue-500' },
    { day: 'Tue', activities: 52, completed: 48, color: 'bg-green-500' },
    { day: 'Wed', activities: 48, completed: 45, color: 'bg-purple-500' },
    { day: 'Thu', activities: 55, completed: 52, color: 'bg-orange-500' },
    { day: 'Fri', activities: 40, completed: 38, color: 'bg-red-500' },
    { day: 'Sat', activities: 15, completed: 14, color: 'bg-indigo-500' },
    { day: 'Sun', activities: 8, completed: 7, color: 'bg-pink-500' }
  ];

  const maxActivities = 60;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">WEEKLY ACTIVITY TREND</h3>
      
      <div className="flex items-end justify-between h-48 px-4">
        {weeklyData.map((day, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div className="flex items-end space-x-1 h-32">
              {/* Total Activities */}
              <div
                className="w-4 bg-blue-300 rounded-t transition-all duration-500"
                style={{ height: `${(day.activities / maxActivities) * 120}px` }}
              ></div>
              {/* Completed Activities */}
              <div
                className="w-4 bg-green-500 rounded-t transition-all duration-500"
                style={{ height: `${(day.completed / maxActivities) * 120}px` }}
              ></div>
            </div>
            <div className="text-xs text-gray-600 mt-2">{day.day}</div>
            <div className="text-xs font-semibold text-gray-900 mt-1">
              {day.completed}/{day.activities}
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-center space-x-6 mt-4">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-300 rounded mr-2"></div>
          <span className="text-xs text-gray-600">Total Activities</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
          <span className="text-xs text-gray-600">Completed</span>
        </div>
      </div>
    </div>
  );
};

// Activity Completion Rate Component
const ActivityCompletionRate = () => {
  const completionData = [
    { category: 'Meetings', completed: 42, total: 45, rate: '93%', trend: 'up' },
    { category: 'Calls', completed: 35, total: 38, rate: '92%', trend: 'up' },
    { category: 'Emails', completed: 32, total: 35, rate: '91%', trend: 'up' },
    { category: 'Tasks', completed: 18, total: 20, rate: '90%', trend: 'down' },
    { category: 'Demos', completed: 10, total: 12, rate: '83%', trend: 'up' }
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">ACTIVITY COMPLETION RATES</h3>
      
      <div className="space-y-4">
        {completionData.map((item, index) => (
          <div key={index}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-700">{item.category}</span>
              <div className="flex items-center">
                <span className="font-semibold text-gray-900 mr-2">{item.rate}</span>
                {item.trend === 'up' ? (
                  <TrendingUp className="w-4 h-4 text-green-600" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-600" />
                )}
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="h-2 rounded-full bg-green-500 transition-all duration-500"
                style={{ width: item.rate }}
              ></div>
            </div>
            <div className="text-right text-xs text-gray-500 mt-1">
              {item.completed}/{item.total} completed
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Peak Activity Hours Component
const PeakActivityHours = () => {
  const hourData = [
    { hour: '8-9 AM', activities: 15, percentage: '10%', color: 'bg-blue-500' },
    { hour: '9-10 AM', activities: 35, percentage: '23%', color: 'bg-green-500' },
    { hour: '10-11 AM', activities: 42, percentage: '28%', color: 'bg-green-600' },
    { hour: '11-12 PM', activities: 38, percentage: '25%', color: 'bg-green-500' },
    { hour: '12-1 PM', activities: 12, percentage: '8%', color: 'bg-yellow-500' },
    { hour: '1-2 PM', activities: 8, percentage: '5%', color: 'bg-orange-500' },
    { hour: '2-3 PM', activities: 25, percentage: '17%', color: 'bg-blue-500' },
    { hour: '3-4 PM', activities: 32, percentage: '21%', color: 'bg-green-500' },
    { hour: '4-5 PM', activities: 28, percentage: '19%', color: 'bg-blue-500' },
    { hour: '5-6 PM', activities: 15, percentage: '10%', color: 'bg-purple-500' }
  ];

  const maxActivities = 50;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">PEAK ACTIVITY HOURS</h3>
      
      <div className="flex items-end justify-between h-48 px-2">
        {hourData.map((hour, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div
              className={`w-3 ${hour.color} rounded-t transition-all duration-500`}
              style={{ height: `${(hour.activities / maxActivities) * 160}px` }}
            ></div>
            <div className="text-xs text-gray-600 mt-2 text-center leading-tight">
              {hour.hour}
            </div>
            <div className="text-xs font-semibold text-gray-900 mt-1">
              {hour.activities}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Main ActivityStats Component
export default function ActivityStats() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Activity Stats</h1>
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
          title="TOTAL ACTIVITIES"
          value="152"
          change="▲ 15%"
          subtitle="This Week"
          icon={Activity}
          trend="up"
        />
        
        <MetricCard
          title="COMPLETION RATE"
          value="91.4%"
          change="▲ 3.2%"
          subtitle="This Week"
          icon={CheckCircle}
          trend="up"
        />
        
        <MetricCard
          title="AVG TIME PER ACTIVITY"
          value="28 mins"
          change="▼ 5 mins"
          subtitle="Efficiency Improved"
          icon={Clock}
          trend="down"
        />
        
        <MetricCard
          title="PEAK ACTIVITY HOUR"
          value="10-11 AM"
          change="42 activities"
          subtitle="Most Productive"
          icon={TrendingUp}
          trend="up"
        />
      </div>

      {/* Activity Timeline */}
      <div className="mb-6">
        <ActivityTimeline />
      </div>

      {/* Second Row - Activity Distribution and Weekly Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ActivityTypeDistribution />
        <WeeklyActivityTrend />
      </div>

      {/* User Performance */}
      <div className="mb-6">
        <UserActivityPerformance />
      </div>

      {/* Third Row - Completion Rates and Peak Hours */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ActivityCompletionRate />
        <PeakActivityHours />
      </div>

      {/* Bottom Row - Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">ACTIVITY EFFICIENCY</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-700">Response Time</span>
              <span className="text-sm font-semibold text-gray-900">2.3 hours</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-700">Follow-up Rate</span>
              <span className="text-sm font-semibold text-gray-900">88%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-700">Task Overdue</span>
              <span className="text-sm font-semibold text-red-600">4.2%</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">TEAM PRODUCTIVITY</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-700">Activities per User</span>
              <span className="text-sm font-semibold text-gray-900">30.4</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-700">Collaboration Rate</span>
              <span className="text-sm font-semibold text-gray-900">65%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-700">Team Utilization</span>
              <span className="text-sm font-semibold text-gray-900">78%</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">WEEKLY GOAL PROGRESS</h3>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-2">85%</div>
            <p className="text-sm text-gray-600">Weekly Target Achievement</p>
            <p className="text-xs text-gray-500 mt-1">129/152 activities completed</p>
          </div>
        </div>
      </div>
    </div>
  );
}