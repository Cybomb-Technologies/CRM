// src/components/forecasts/ForecastPeriodSelector.jsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, TrendingUp, Target } from 'lucide-react';

const ForecastPeriodSelector = ({ period, onPeriodChange, disabled }) => {
  const periods = [
    {
      value: 'monthly',
      label: 'Monthly',
      description: 'Current month forecast',
      icon: Calendar
    },
    {
      value: 'quarterly',
      label: 'Quarterly',
      description: 'Current quarter forecast',
      icon: TrendingUp
    },
    {
      value: 'yearly',
      label: 'Yearly',
      description: 'Full year forecast',
      icon: Target
    }
  ];

  return (
    <div className="space-y-3">
      {periods.map(({ value, label, description, icon: Icon }) => (
        <Card
          key={value}
          className={`cursor-pointer transition-all ${period === value
              ? 'border-blue-500 bg-blue-50'
              : 'hover:border-gray-300'
            } ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
          onClick={() => !disabled && onPeriodChange(value)}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${period === value ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                }`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="font-medium">{label}</div>
                <div className="text-sm text-gray-600">{description}</div>
              </div>
              {period === value && (
                <div className="w-2 h-2 bg-blue-600 rounded-full" />
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ForecastPeriodSelector;