import React, { useState, useEffect } from 'react';
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
  Activity,
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

// Activity Timeline Component
const ActivityTimeline = ({ timeline }) => {
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
      <h3 className="text-lg font-semibold text-gray-900 mb-6">TODAY'S ACTIVITY TIMELINE (Recent)</h3>

      {timeline.length > 0 ? (
        <div className="space-y-4">
          {timeline.map((item, index) => (
            <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex flex-col items-center">
                <div className="text-sm font-semibold text-gray-900">
                  {new Date(item.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div className="w-px h-12 bg-gray-300 my-1"></div>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {getActivityIcon(item.type)}
                    <span className="font-medium text-gray-900">{item.title || item.activity}</span>
                  </div>
                  <span className={cn(
                    "px-2 py-1 text-xs rounded-full font-medium",
                    getStatusColor(item.status)
                  )}>
                    {item.status.replace('-', ' ')}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>By: {item.assignedTo || item.user}</span>
                  <span>Duration: {item.duration || 30} mins</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">No activities found for today.</div>
      )}
    </div>
  );
};

// Activity Type Distribution Component
const ActivityTypeDistribution = ({ distribution }) => {
  const colors = ["bg-blue-500", "bg-green-500", "bg-purple-500", "bg-orange-500", "bg-red-500"];
  const total = distribution.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">ACTIVITY TYPE DISTRIBUTION</h3>

      <div className="space-y-4">
        {distribution.map((activity, index) => {
          const percentage = total > 0 ? Math.round((activity.count / total) * 100) : 0;
          return (
            <div key={index}>
              <div className="flex justify-between text-sm mb-1">
                <div className="flex items-center">
                  <div className={`w-3 h-3 ${colors[index % colors.length]} rounded-full mr-2`}></div>
                  <span className="text-gray-700">{activity.type}</span>
                </div>
                <span className="font-semibold text-gray-900">
                  {activity.count} ({percentage}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${colors[index % colors.length]} transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Weekly Activity Trend Component
const WeeklyActivityTrend = () => {
  const weeklyData = [
    { day: 'Mon', activities: 45, completed: 42 },
    { day: 'Tue', activities: 52, completed: 48 },
    { day: 'Wed', activities: 48, completed: 45 },
    { day: 'Thu', activities: 55, completed: 52 },
    { day: 'Fri', activities: 40, completed: 38 },
    { day: 'Sat', activities: 15, completed: 14 },
    { day: 'Sun', activities: 8, completed: 7 }
  ];

  const maxActivities = 60;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">WEEKLY ACTIVITY TREND (Mock)</h3>

      <div className="flex items-end justify-between h-48 px-4">
        {weeklyData.map((day, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div className="flex items-end space-x-1 h-32">
              <div
                className="w-4 bg-blue-300 rounded-t transition-all duration-500"
                style={{ height: `${(day.activities / maxActivities) * 120}px` }}
              ></div>
              <div
                className="w-4 bg-green-500 rounded-t transition-all duration-500"
                style={{ height: `${(day.completed / maxActivities) * 120}px` }}
              ></div>
            </div>
            <div className="text-xs text-gray-600 mt-2">{day.day}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Main ActivityStats Component
export default function ActivityStats() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalActivities: 0,
    completionRate: "0",
    typeDistribution: [],
    timeline: [],
    breakdown: { meetings: 0, calls: 0, tasks: 0 }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await analyticsService.getActivityStats();
        if (response.success) {
          setStats(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch activity stats:", error);
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
            <h1 className="text-3xl font-bold text-gray-900">Activity Stats</h1>
            <p className="text-gray-600 mt-2">Track team performance and engagement</p>
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
          title="TOTAL ACTIVITIES"
          value={stats.totalActivities}
          change=""
          subtitle="This Week"
          icon={Activity}
          trend="neutral"
        />

        <MetricCard
          title="COMPLETION RATE"
          value={`${stats.completionRate}%`}
          change=""
          subtitle="This Week"
          icon={CheckCircle}
          trend={parseFloat(stats.completionRate) > 80 ? "up" : "neutral"}
        />

        <MetricCard
          title="MEETINGS"
          value={stats.breakdown.meetings}
          change=""
          subtitle="Scheduled"
          icon={Users}
          trend="neutral"
        />

        <MetricCard
          title="CALLS"
          value={stats.breakdown.calls}
          change=""
          subtitle="Logged"
          icon={Phone}
          trend="neutral"
        />
      </div>

      {/* Activity Timeline */}
      <div className="mb-6">
        <ActivityTimeline timeline={stats.timeline} />
      </div>

      {/* Second Row - Activity Distribution and Weekly Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ActivityTypeDistribution distribution={stats.typeDistribution} />
        <WeeklyActivityTrend />
      </div>

      {/* Bottom Row - Additional Metrics (Static/Placeholder for now as logic is complex) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">TEAM PRODUCTIVITY</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-700">Activities per User</span>
              <span className="text-sm font-semibold text-gray-900">N/A</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}