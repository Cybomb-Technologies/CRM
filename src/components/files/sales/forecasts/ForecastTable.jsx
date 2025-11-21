// src/components/forecasts/ForecastTable.jsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Building, 
  User, 
  DollarSign, 
  Target, 
  Calendar,
  TrendingUp 
} from 'lucide-react';

const ForecastTable = ({ data, type, forecastType }) => {
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

  if (!data || (Array.isArray(data) && data.length === 0) || (typeof data === 'object' && Object.keys(data).length === 0)) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-gray-500">
          No data available
        </CardContent>
      </Card>
    );
  }

  if (type === 'deals') {
    // Deal details table
    return (
      <Card>
        <CardHeader>
          <CardTitle>Deal Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-3 font-medium">Deal</th>
                  <th className="text-left p-3 font-medium">Company</th>
                  <th className="text-left p-3 font-medium">Value</th>
                  <th className="text-left p-3 font-medium">Probability</th>
                  <th className="text-left p-3 font-medium">Stage</th>
                  <th className="text-left p-3 font-medium">Owner</th>
                  <th className="text-left p-3 font-medium">Close Date</th>
                  <th className="text-left p-3 font-medium">Weighted</th>
                </tr>
              </thead>
              <tbody>
                {data.map((deal) => (
                  <tr key={deal.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{deal.title}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        <Building className="w-3 h-3" />
                        {deal.company}
                      </div>
                    </td>
                    <td className="p-3 font-semibold">
                      {formatIndianUnits(deal.value)}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-12 bg-gray-200 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full bg-blue-600"
                            style={{ width: `${deal.probability || 0}%` }}
                          />
                        </div>
                        <span>{deal.probability || 0}%</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge variant="outline" className="capitalize">
                        {deal.stage?.replace('-', ' ')}
                      </Badge>
                    </td>
                    <td className="p-3">{deal.owner}</td>
                    <td className="p-3">
                      {deal.closeDate ? new Date(deal.closeDate).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="p-3 font-semibold text-green-600">
                      {formatIndianUnits((deal.value || 0) * (deal.probability || 0) / 100)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Owner or Stage breakdown table
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {type === 'owner' ? 'Team Performance' : 'Pipeline Stage Analysis'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3 font-medium">
                  {type === 'owner' ? 'Owner' : 'Stage'}
                </th>
                <th className="text-left p-3 font-medium">Deals</th>
                <th className="text-left p-3 font-medium">Total Value</th>
                <th className="text-left p-3 font-medium">Weighted Value</th>
                <th className="text-left p-3 font-medium">Avg Probability</th>
                <th className="text-left p-3 font-medium">% of Forecast</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(data).map(([key, item]) => {
                const avgProbability = item.dealCount > 0 
                  ? item.deals.reduce((sum, deal) => sum + (deal.probability || 0), 0) / item.dealCount
                  : 0;
                
                const percentageOfTotal = item.weightedValue > 0 && forecastType === 'realistic'
                  ? (item.weightedValue / Object.values(data).reduce((sum, i) => sum + i.weightedValue, 0)) * 100
                  : 0;

                return (
                  <tr key={key} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium capitalize">
                      {key.replace('-', ' ')}
                    </td>
                    <td className="p-3">{item.dealCount}</td>
                    <td className="p-3 font-semibold">
                      {formatIndianUnits(item.totalValue)}
                    </td>
                    <td className="p-3 font-semibold text-green-600">
                      {formatIndianUnits(item.weightedValue)}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-12 bg-gray-200 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full bg-blue-600"
                            style={{ width: `${avgProbability}%` }}
                          />
                        </div>
                        <span>{avgProbability.toFixed(0)}%</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full bg-green-500"
                          style={{ width: `${percentageOfTotal}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-600 ml-2">
                        {percentageOfTotal.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ForecastTable;