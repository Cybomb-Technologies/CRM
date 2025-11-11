import React, { useState, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, Users, DollarSign, Download, PieChart as PieIcon, LineChart as LineIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast, useData } from '@/hooks';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import jsPDF from 'jspdf';
import { toPng } from 'html-to-image';

const ReportsPage = () => {
  const { toast } = useToast();
  const { data } = useData();
  const [activeReport, setActiveReport] = useState(null);
  const reportRef = useRef(null);
  
  const pipelineData = Object.entries(data.deals).map(([key, value]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1).replace('-', ' '),
    value: value.length
  }));
  const pipelineColors = { 'Qualification': '#3b82f6', 'Proposal': '#8b5cf6', 'Negotiation': '#f59e0b', 'Closed Won': '#10b981', 'Closed Lost': '#ef4444' };

  const revenueData = [
    { month: 'Jan', revenue: 45000 }, { month: 'Feb', revenue: 52000 }, { month: 'Mar', revenue: 48000 },
    { month: 'Apr', revenue: 61000 }, { month: 'May', revenue: 55000 }, { month: 'Jun', revenue: 67000 }
  ];

  const teamPerfData = [
    { name: 'John Doe', deals: 25, revenue: 150000 },
    { name: 'Jane Smith', deals: 32, revenue: 210000 },
    { name: 'Peter Jones', deals: 18, revenue: 95000 },
    { name: 'Mike Williams', deals: 15, revenue: 75000 },
  ];
  
  const winLossData = [{ name: 'Won', value: data.deals['closed-won']?.length || 0 }, { name: 'Lost', value: data.deals['closed-lost']?.length || 0 }];
  const winLossColors = ['#10b981', '#ef4444'];


  const reports = [
    { name: 'Pipeline Report', description: 'Analyze your sales pipeline stages, velocity, and conversion rates.', icon: TrendingUp, color: 'text-blue-600', bgColor: 'bg-blue-100 dark:bg-blue-900/50', component: 
        <ResponsiveContainer width="100%" height={300}><PieChart><Pie data={pipelineData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}>{pipelineData.map((entry, index) => <Cell key={`cell-${index}`} fill={pipelineColors[entry.name]} />)}</Pie><Tooltip /><Legend /></PieChart></ResponsiveContainer> },
    { name: 'Revenue Forecast', description: 'Forecast future revenue based on deal probability and close dates.', icon: DollarSign, color: 'text-green-600', bgColor: 'bg-green-100 dark:bg-green-900/50', component: 
        <ResponsiveContainer width="100%" height={300}><LineChart data={revenueData}><CartesianGrid /><XAxis dataKey="month" /><YAxis /><Tooltip /><Line type="monotone" dataKey="revenue" stroke="#10b981" /></LineChart></ResponsiveContainer> },
    { name: 'Team Performance', description: 'Track team metrics like activities, win rates, and quota attainment.', icon: Users, color: 'text-purple-600', bgColor: 'bg-purple-100 dark:bg-purple-900/50', component: 
        <ResponsiveContainer width="100%" height={300}><BarChart data={teamPerfData}><CartesianGrid /><XAxis dataKey="name" /><YAxis /><Tooltip /><Legend /><Bar dataKey="deals" fill="#8b5cf6" /><Bar dataKey="revenue" fill="#3b82f6" /></BarChart></ResponsiveContainer> },
    { name: 'Win/Loss Analysis', description: 'Analyze reasons for won and lost deals to improve strategy.', icon: BarChart3, color: 'text-orange-600', bgColor: 'bg-orange-100 dark:bg-orange-900/50', component: 
        <ResponsiveContainer width="100%" height={300}><PieChart><Pie data={winLossData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8">{winLossData.map((entry, index) => <Cell key={`cell-${index}`} fill={winLossColors[index]} />)}</Pie><Tooltip /><Legend /></PieChart></ResponsiveContainer> }
  ];
  
  const handleExport = async () => {
    if (!reportRef.current || !activeReport) return;
    
    toast({ title: 'Exporting Report...', description: 'Please wait while we generate your PDF.' });

    try {
      const dataUrl = await toPng(reportRef.current, { quality: 0.95 });
      const pdf = new jsPDF();
      pdf.setFontSize(18);
      pdf.text(activeReport.name, 15, 20);
      pdf.addImage(dataUrl, 'PNG', 15, 40, 180, 100);
      pdf.save(`${activeReport.name.toLowerCase().replace(/ /g, '_')}.pdf`);
      toast({ title: 'Export Successful!', description: 'Your report has been downloaded.' });
    } catch (err) {
      toast({ title: 'Export Failed', description: 'Something went wrong during the export.', variant: 'destructive' });
    }
  };


  return (
    <>
      <Helmet>
        <title>Reports - CloudCRM</title>
        <meta name="description" content="Analytics and reporting" />
      </Helmet>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
            <p className="text-muted-foreground mt-1">Gain deep insights from your sales data</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reports.map((report) => (
            <Card key={report.name} onClick={() => setActiveReport(report)} className="hover:shadow-lg transition-shadow cursor-pointer flex flex-col">
              <CardHeader>
                <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-xl ${report.bgColor} flex items-center justify-center`}>
                      <report.icon className={`w-6 h-6 ${report.color}`} />
                    </div>
                    <CardTitle className="text-lg">{report.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription>{report.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <Dialog open={!!activeReport} onOpenChange={() => setActiveReport(null)}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>{activeReport?.name}</DialogTitle>
                </DialogHeader>
                <div className="my-6" ref={reportRef}>
                    {activeReport?.component}
                </div>
                <Button onClick={handleExport} className="w-full">
                    <Download className="w-4 h-4 mr-2"/> Export as PDF
                </Button>
            </DialogContent>
        </Dialog>

      </div>
    </>
  );
};

export default ReportsPage;