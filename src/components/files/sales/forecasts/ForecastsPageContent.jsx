// src/components/forecasts/ForecastsPageContent.jsx
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import forecastsAPI from './forecastsAPI';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Download, RefreshCw } from 'lucide-react';

import { useToast } from '@/components/ui/use-toast';
import ForecastMetrics from './ForecastMetrics';
import ForecastChart from './ForecastChart';
import ForecastTable from './ForecastTable';
import ForecastFilters from './ForecastFilters';
import ForecastPeriodSelector from './ForecastPeriodSelector';
import ForecastQuotaSettings from './ForecastQuotaSettings';

const ForecastsPageContent = () => {
  const { toast } = useToast();

  const [period, setPeriod] = useState('quarterly');
  const [forecastType, setForecastType] = useState('realistic');
  const [filters, setFilters] = useState({
    owner: 'all',
    team: 'all',
    stage: 'all',
    probability: 'all'
  });
  const [showSettings, setShowSettings] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // State for forecast data
  const [forecastData, setForecastData] = useState({
    period: {},
    totals: {
      pessimistic: 0,
      realistic: 0,
      optimistic: 0,
      totalDeals: 0,
      totalValue: 0
    },
    breakdown: {
      byOwner: {},
      byStage: {},
      monthly: {}
    },
    deals: [],
    filterOptions: {
      owners: [],
      stages: []
    }
  });

  // Fetch forecast statistics
  const fetchForecastData = async () => {
    try {
      setIsLoading(true);
      const data = await forecastsAPI.getStatistics({
        period,
        ...filters
      });
      setForecastData(data);
    } catch (error) {
      console.error('Error fetching forecast:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load forecast data.",
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Initial fetch and on filter/period change
  useEffect(() => {
    fetchForecastData();
  }, [period, filters]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchForecastData();
  };

  const handleExport = () => {
    if (!forecastData.deals || forecastData.deals.length === 0) {
      toast({
        title: "No Data",
        description: "There is no data to export.",
      });
      return;
    }

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
          <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing || isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
          <Button variant="outline" onClick={handleExport} disabled={isLoading}>
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
            <ForecastPeriodSelector period={period} onPeriodChange={setPeriod} disabled={isLoading} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <ForecastFilters filters={filters} onFiltersChange={setFilters} disabled={isLoading} filterOptions={forecastData.filterOptions} />
          </CardContent>
        </Card>
      </div>

      {/* Forecast Metrics */}
      <ForecastMetrics
        forecastData={forecastData}
        forecastType={forecastType}
        onForecastTypeChange={setForecastType}
        loading={isLoading}
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
        onSettingsChange={handleRefresh} // Refresh data if settings (like quotas) change
      />
    </div>
  );
};

export default ForecastsPageContent;