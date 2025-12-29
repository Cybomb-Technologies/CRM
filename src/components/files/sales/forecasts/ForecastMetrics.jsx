// src/components/forecasts/ForecastMetrics.jsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Target, TrendingUp, DollarSign, Users, FileText } from 'lucide-react';

const ForecastMetrics = ({ forecastData, forecastType, onForecastTypeChange, loading }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  const formatIndianUnits = (amount) => {
    if (amount >= 10000000) { // 1 crore
      return `₹${(amount / 10000000).toFixed(1)}Cr`;
    } else if (amount >= 100000) { // 1 lakh
      return `₹${(amount / 100000).toFixed(1)}L`;
    } else {
      return `₹${Math.round(amount).toLocaleString()}`;
    }
  };

  const getQuota = () => {
    const baseQuota = 42000000; // ₹4.2 crore quarterly quota
    switch (forecastData.period?.type) {
      case 'monthly': return baseQuota / 3;
      case 'quarterly': return baseQuota;
      case 'yearly': return baseQuota * 4;
      default: return baseQuota;
    }
  };

  const quota = getQuota();
  const forecastAmount = forecastData.totals?.[forecastType] || 0;
  const quotaAchievement = quota > 0 ? (forecastAmount / quota) * 100 : 0;

  const getAchievementColor = (percentage) => {
    if (percentage >= 100) return 'text-green-600 bg-green-100';
    if (percentage >= 80) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6 h-32 bg-gray-100 rounded-lg"></CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!forecastData.totals) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-500">No forecast data available</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Forecast Type Selector */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-lg font-semibold">Forecast Type</h3>
              <p className="text-sm text-gray-600">
                Choose how to calculate your forecast
              </p>
            </div>
            <Tabs value={forecastType} onValueChange={onForecastTypeChange}>
              <TabsList>
                <TabsTrigger value="pessimistic">Pessimistic</TabsTrigger>
                <TabsTrigger value="realistic">Realistic</TabsTrigger>
                <TabsTrigger value="optimistic">Optimistic</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Forecast Amount */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Forecast Amount</CardTitle>
            <DollarSign className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatIndianUnits(forecastAmount)}</div>
            <p className="text-xs text-muted-foreground">
              {forecastType.charAt(0).toUpperCase() + forecastType.slice(1)} forecast
            </p>
          </CardContent>
        </Card>

        {/* Quota Achievement */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quota Achievement</CardTitle>
            <Target className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{quotaAchievement.toFixed(1)}%</div>
            <div className="flex items-center gap-2">
              <Badge className={getAchievementColor(quotaAchievement)}>
                {quotaAchievement >= 100 ? 'Exceeded' : quotaAchievement >= 80 ? 'On Track' : 'At Risk'}
              </Badge>
              <p className="text-xs text-muted-foreground">
                {formatIndianUnits(quota)} target
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Deal Count */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Deals</CardTitle>
            <FileText className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{forecastData.totals.totalDeals}</div>
            <p className="text-xs text-muted-foreground">
              Total value: {formatIndianUnits(forecastData.totals.totalValue)}
            </p>
          </CardContent>
        </Card>

        {/* Pipeline Health */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pipeline Health</CardTitle>
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {forecastData.totals.totalValue > 0
                ? ((forecastData.totals.realistic / forecastData.totals.totalValue) * 100).toFixed(1)
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Weighted vs Total value
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Badge variant="outline" className="bg-blue-50 text-blue-700">Pessimistic</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatIndianUnits(forecastData.totals.pessimistic)}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              High-probability deals only (70%+)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Badge variant="outline" className="bg-green-50 text-green-700">Realistic</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatIndianUnits(forecastData.totals.realistic)}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Weighted by probability
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Badge variant="outline" className="bg-orange-50 text-orange-700">Optimistic</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {formatIndianUnits(forecastData.totals.optimistic)}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              All open deals included
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForecastMetrics;