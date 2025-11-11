import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { TrendingUp, Users, DollarSign, Target, ArrowUp, ArrowDown, BarChart2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';

const DashboardPage = () => {
  const { user } = useAuth();
  const { data } = useData();

  const totalRevenue = Object.values(data.deals).flat().filter(d => d.probability === 100).reduce((acc, deal) => acc + deal.value, 0);
  const activeDeals = Object.values(data.deals).flat().filter(d => d.probability > 0 && d.probability < 100).length;
  const newLeads = data.leads.filter(l => l.status === 'New').length;
  
  const stats = [
    { name: 'Total Revenue', value: `$${(totalRevenue / 1000).toFixed(0)}k`, change: '+12.5%', trend: 'up', icon: DollarSign, color: 'text-green-600', bgColor: 'bg-green-100 dark:bg-green-900/50' },
    { name: 'Active Deals', value: activeDeals, change: '+8', trend: 'up', icon: Target, color: 'text-blue-600', bgColor: 'bg-blue-100 dark:bg-blue-900/50' },
    { name: 'New Leads', value: newLeads, change: '+23', trend: 'up', icon: Users, color: 'text-purple-600', bgColor: 'bg-purple-100 dark:bg-purple-900/50' },
    { name: 'Win Rate', value: '68%', change: '-2%', trend: 'down', icon: TrendingUp, color: 'text-orange-600', bgColor: 'bg-orange-100 dark:bg-orange-900/50' }
  ];

  const revenueData = [
    { month: 'Jan', revenue: 45000 }, { month: 'Feb', revenue: 52000 },
    { month: 'Mar', revenue: 48000 }, { month: 'Apr', revenue: 61000 },
    { month: 'May', revenue: 55000 }, { month: 'Jun', revenue: 67000 }
  ];

  const pipelineData = Object.entries(data.deals).map(([key, value]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1).replace('-', ' '),
    value: value.length
  }));

  const pipelineColors = {
      'Qualification': '#3b82f6', 'Proposal': '#8b5cf6', 'Negotiation': '#f59e0b',
      'Closed Won': '#10b981', 'Closed Lost': '#ef4444'
  };

  return (
    <>
      <Helmet>
        <title>Dashboard - CloudCRM</title>
        <meta name="description" content="CloudCRM dashboard with analytics and insights" />
      </Helmet>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Welcome back, {user?.name}!</h1>
          <p className="text-muted-foreground mt-1">Here's what's happening with your sales today.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    <div className={`flex items-center text-sm font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.trend === 'up' ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
                      {stat.change}
                    </div>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-2xl font-bold text-foreground">{stat.value}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{stat.name}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle>Revenue Trend</CardTitle>
                  <CardDescription>Last 6 months performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                      <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(value) => `$${value/1000}k`}/>
                      <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}/>
                      <Legend />
                      <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: 'hsl(var(--primary))' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Pipeline Distribution</CardTitle>
                   <CardDescription>Current deal stages</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={pipelineData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        innerRadius={60}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pipelineData.map((entry) => (
                          <Cell key={`cell-${entry.name}`} fill={pipelineColors[entry.name]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}/>
                      <Legend/>
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
        
        <Card>
          <CardHeader>
              <CardTitle>Upcoming Activities</CardTitle>
              <CardDescription>Your next tasks, calls and meetings.</CardDescription>
          </CardHeader>
          <CardContent>
              {data.activities.filter(a => a.status === 'Pending').slice(0,5).map(activity => (
                  <div key={activity.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                      <div>
                          <p className="font-medium text-foreground">{activity.title}</p>
                          <p className="text-sm text-muted-foreground">{activity.type} on {new Date(activity.dueDate).toLocaleDateString()}</p>
                      </div>
                      <span className="text-sm text-muted-foreground">{activity.assignedTo}</span>
                  </div>
              ))}
          </CardContent>
        </Card>

      </div>
    </>
  );
};

export default DashboardPage;