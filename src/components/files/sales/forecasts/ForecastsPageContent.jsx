// src/components/forecasts/ForecastsPageContent.jsx
import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Download, RefreshCw } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/components/ui/use-toast';
import ForecastMetrics from './ForecastMetrics';
import ForecastChart from './ForecastChart';
import ForecastTable from './ForecastTable';
import ForecastFilters from './ForecastFilters';
import ForecastPeriodSelector from './ForecastPeriodSelector';
import ForecastQuotaSettings from './ForecastQuotaSettings';

const ForecastsPageContent = () => {
  const { getAllDeals, data } = useData();
  const { toast } = useToast();
  
  const [period, setPeriod] = useState('quarterly'); // monthly, quarterly, yearly
  const [forecastType, setForecastType] = useState('realistic'); // pessimistic, realistic, optimistic
  const [filters, setFilters] = useState({
  owner: 'all',
  team: 'all',
  stage: 'all',
  probability: 'all'
});
  const [showSettings, setShowSettings] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const allDeals = getAllDeals();

  // Forecast calculation logic
  const forecastData = useMemo(() => {
    if (!allDeals || allDeals.length === 0) return {};

    const now = new Date();
    let periodStart, periodEnd;

    // Set time period boundaries
    switch (period) {
      case 'monthly':
        periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
        periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        break;
      case 'quarterly':
        const currentQuarter = Math.floor(now.getMonth() / 3);
        periodStart = new Date(now.getFullYear(), currentQuarter * 3, 1);
        periodEnd = new Date(now.getFullYear(), (currentQuarter + 1) * 3, 0);
        break;
      case 'yearly':
        periodStart = new Date(now.getFullYear(), 0, 1);
        periodEnd = new Date(now.getFullYear(), 11, 31);
        break;
      default:
        periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
        periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    }

    // Filter deals based on close date and filters
    const filteredDeals = allDeals.filter(deal => {
  if (!deal.closeDate) return false;
  
  const closeDate = new Date(deal.closeDate);
  const inPeriod = closeDate >= periodStart && closeDate <= periodEnd;
  
  // Apply additional filters
  const ownerMatch = filters.owner === 'all' || deal.owner === filters.owner;
  const stageMatch = filters.stage === 'all' || deal.stage === filters.stage;
  const probabilityMatch = filters.probability === 'all' || 
    (filters.probability === 'high' && deal.probability >= 70) ||
    (filters.probability === 'medium' && deal.probability >= 30 && deal.probability < 70) ||
    (filters.probability === 'low' && deal.probability < 30);

  return inPeriod && ownerMatch && stageMatch && probabilityMatch;
});

    // Calculate different forecast types
    const calculateForecast = (type) => {
      return filteredDeals.reduce((total, deal) => {
        const value = deal.value || 0;
        const probability = deal.probability || 0;

        switch (type) {
          case 'pessimistic':
            // Only include deals with high probability (70%+)
            return probability >= 70 ? total + value : total;
          
          case 'realistic':
            // Weighted forecast: value × probability
            return total + (value * probability / 100);
          
          case 'optimistic':
            // Include all open deals regardless of probability
            return total + value;
          
          default:
            return total + (value * probability / 100);
        }
      }, 0);
    };

    // Group by owner for team breakdown
    const ownerBreakdown = filteredDeals.reduce((acc, deal) => {
      const owner = deal.owner || 'Unassigned';
      if (!acc[owner]) {
        acc[owner] = {
          deals: [],
          totalValue: 0,
          weightedValue: 0,
          dealCount: 0
        };
      }
      
      acc[owner].deals.push(deal);
      acc[owner].totalValue += deal.value || 0;
      acc[owner].weightedValue += (deal.value || 0) * (deal.probability || 0) / 100;
      acc[owner].dealCount += 1;
      
      return acc;
    }, {});

    // Group by stage for pipeline analysis
    const stageBreakdown = filteredDeals.reduce((acc, deal) => {
      const stage = deal.stage || 'unknown';
      if (!acc[stage]) {
        acc[stage] = {
          deals: [],
          totalValue: 0,
          weightedValue: 0,
          dealCount: 0
        };
      }
      
      acc[stage].deals.push(deal);
      acc[stage].totalValue += deal.value || 0;
      acc[stage].weightedValue += (deal.value || 0) * (deal.probability || 0) / 100;
      acc[stage].dealCount += 1;
      
      return acc;
    }, {});

    // Monthly breakdown for charts
    const monthlyBreakdown = {};
    for (let i = 0; i < 12; i++) {
      const monthStart = new Date(now.getFullYear(), i, 1);
      const monthEnd = new Date(now.getFullYear(), i + 1, 0);
      const monthDeals = filteredDeals.filter(deal => {
        if (!deal.closeDate) return false;
        const closeDate = new Date(deal.closeDate);
        return closeDate >= monthStart && closeDate <= monthEnd;
      });

      monthlyBreakdown[i] = {
        month: monthStart.toLocaleString('default', { month: 'short' }),
        pessimistic: monthDeals.reduce((sum, deal) => 
          (deal.probability || 0) >= 70 ? sum + (deal.value || 0) : sum, 0),
        realistic: monthDeals.reduce((sum, deal) => 
          sum + (deal.value || 0) * (deal.probability || 0) / 100, 0),
        optimistic: monthDeals.reduce((sum, deal) => 
          sum + (deal.value || 0), 0),
        dealCount: monthDeals.length
      };
    }

    return {
      period: {
        start: periodStart,
        end: periodEnd,
        type: period
      },
      totals: {
        pessimistic: calculateForecast('pessimistic'),
        realistic: calculateForecast('realistic'),
        optimistic: calculateForecast('optimistic'),
        totalDeals: filteredDeals.length,
        totalValue: filteredDeals.reduce((sum, deal) => sum + (deal.value || 0), 0)
      },
      breakdown: {
        byOwner: ownerBreakdown,
        byStage: stageBreakdown,
        monthly: monthlyBreakdown
      },
      deals: filteredDeals
    };
  }, [allDeals, period, filters]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast({
        title: "Forecast Updated",
        description: "Forecast data has been refreshed with latest deals.",
      });
    }, 1000);
  };

  const handleExport = () => {
    // Simple CSV export implementation
    const csvContent = [
      ['Period', 'Forecast Type', 'Amount(₹)', 'Deal Count', 'Total Value(₹)'],
      [period, forecastType, forecastData.totals[forecastType].toFixed(2), forecastData.totals.totalDeals, forecastData.totals.totalValue.toFixed(2)],
      ...forecastData.deals.map(deal => [
        deal.title,
        deal.company,
        deal.value,
        deal.probability + '%',
        deal.stage,
        deal.owner,
        new Date(deal.closeDate).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `forecast-${period}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: "Forecast data exported as CSV.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Sales Forecast</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Predictive revenue forecasting based on your sales pipeline
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" onClick={() => setShowSettings(true)}>
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Period Selector and Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Forecast Period</CardTitle>
          </CardHeader>
          <CardContent>
            <ForecastPeriodSelector period={period} onPeriodChange={setPeriod} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <ForecastFilters filters={filters} onFiltersChange={setFilters} />
          </CardContent>
        </Card>
      </div>

      {/* Forecast Metrics */}
      <ForecastMetrics 
        forecastData={forecastData} 
        forecastType={forecastType}
        onForecastTypeChange={setForecastType}
      />

      {/* Charts and Tables */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="pipeline">Pipeline Analysis</TabsTrigger>
          <TabsTrigger value="team">Team Performance</TabsTrigger>
          <TabsTrigger value="details">Deal Details</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <ForecastChart forecastData={forecastData} forecastType={forecastType} />
        </TabsContent>

        <TabsContent value="pipeline">
          <ForecastTable 
            data={forecastData.breakdown?.byStage} 
            type="stage" 
            forecastType={forecastType}
          />
        </TabsContent>

        <TabsContent value="team">
          <ForecastTable 
            data={forecastData.breakdown?.byOwner} 
            type="owner" 
            forecastType={forecastType}
          />
        </TabsContent>

        <TabsContent value="details">
          <ForecastTable 
            data={forecastData.deals} 
            type="deals" 
            forecastType={forecastType}
          />
        </TabsContent>
      </Tabs>

      {/* Quota Settings Dialog */}
      <ForecastQuotaSettings 
        open={showSettings} 
        onOpenChange={setShowSettings} 
      />
    </div>
  );
};

export default ForecastsPageContent;