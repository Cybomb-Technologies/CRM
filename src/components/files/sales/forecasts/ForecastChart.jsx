// src/components/forecasts/ForecastChart.jsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, BarChart3 } from 'lucide-react';

const ForecastChart = ({ forecastData, forecastType }) => {
  // Simple bar chart implementation - in a real app, you'd use a charting library
  const monthlyData = forecastData.breakdown?.monthly || {};
  
  const maxValue = Math.max(
    ...Object.values(monthlyData).map(data => data[forecastType]),
    forecastData.totals?.[forecastType] || 0
  );

  const getBarHeight = (value) => {
    const maxHeight = 120; // pixels
    return maxValue > 0 ? (value / maxValue) * maxHeight : 0;
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

  if (!forecastData.totals || Object.keys(monthlyData).length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Forecast Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500">
            <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No forecast data available for the selected period</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Monthly Breakdown Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Monthly Forecast Breakdown
            <Badge variant="outline">{forecastType}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-end justify-between h-32 gap-2">
              {Object.entries(monthlyData).map(([monthIndex, data]) => (
                <div key={monthIndex} className="flex flex-col items-center flex-1">
                  <div className="text-xs text-gray-500 mb-1">{data.month}</div>
                  <div
                    className="w-full bg-blue-500 rounded-t transition-all duration-500 hover:bg-blue-600"
                    style={{ height: `${getBarHeight(data[forecastType])}px` }}
                    title={`${data.month}: ${formatIndianUnits(data[forecastType])}`}
                  />
                  <div className="text-xs text-gray-600 mt-1">
                    {formatIndianUnits(data[forecastType])}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-between items-center pt-4 border-t">
              <div className="text-sm text-gray-600">
                Total: {formatIndianUnits(forecastData.totals[forecastType])}
              </div>
              <div className="text-sm text-gray-600">
                {Object.values(monthlyData).reduce((sum, data) => sum + data.dealCount, 0)} deals
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Forecast Composition */}
      <Card>
        <CardHeader>
          <CardTitle>Forecast Composition</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Stage Breakdown */}
            <div>
              <h4 className="font-semibold mb-3">By Stage</h4>
              <div className="space-y-2">
                {Object.entries(forecastData.breakdown.byStage || {}).map(([stage, data]) => {
                  const percentage = forecastData.totals.realistic > 0 
                    ? (data.weightedValue / forecastData.totals.realistic) * 100 
                    : 0;
                  
                  return (
                    <div key={stage} className="flex items-center justify-between">
                      <span className="text-sm capitalize">{stage.replace('-', ' ')}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium w-16 text-right">
                          {formatIndianUnits(data.weightedValue)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Probability Distribution */}
            <div>
              <h4 className="font-semibold mb-3">Probability Distribution</h4>
              <div className="space-y-2">
                {[
                  { range: 'High (70-100%)', min: 70, max: 100 },
                  { range: 'Medium (30-69%)', min: 30, max: 69 },
                  { range: 'Low (0-29%)', min: 0, max: 29 }
                ].map(({ range, min, max }) => {
                  const dealsInRange = forecastData.deals.filter(
                    deal => (deal.probability || 0) >= min && (deal.probability || 0) <= max
                  );
                  const value = dealsInRange.reduce((sum, deal) => sum + (deal.value || 0), 0);
                  
                  return (
                    <div key={range} className="flex justify-between text-sm">
                      <span>{range}</span>
                      <span className="font-medium">
                        {dealsInRange.length} deals ({formatIndianUnits(value)})
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForecastChart;