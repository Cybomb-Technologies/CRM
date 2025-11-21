// src/components/accounts/AccountsFilters.jsx
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const AccountsFilters = ({ filters, onFiltersChange, accounts }) => {
  const handleFilterChange = (key, value) => {
    onFiltersChange(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    onFiltersChange({
      industry: '',
      type: '',
      dateRange: ''
    });
  };

  // Get unique values for filters
  const industries = [...new Set(accounts.map(account => account.industry).filter(Boolean))];
  const types = [...new Set(accounts.map(account => account.type).filter(Boolean))];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 pt-4 border-t">
      <div>
        <label className="text-sm font-medium mb-2 block">Industry</label>
        <Select value={filters.industry} onValueChange={(value) => handleFilterChange('industry', value)}>
          <SelectTrigger>
            <SelectValue placeholder="All Industries" />
          </SelectTrigger>
          <SelectContent>
            {industries.map(industry => (
              <SelectItem key={industry} value={industry}>{industry}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Type</label>
        <Select value={filters.type} onValueChange={(value) => handleFilterChange('type', value)}>
          <SelectTrigger>
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            {types.map(type => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Date Range</label>
        <Select value={filters.dateRange} onValueChange={(value) => handleFilterChange('dateRange', value)}>
          <SelectTrigger>
            <SelectValue placeholder="All Time" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="this-week">This Week</SelectItem>
            <SelectItem value="this-month">This Month</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-end gap-2">
        <Button variant="outline" onClick={clearFilters} className="flex-1">
          Clear Filters
        </Button>
      </div>
    </div>
  );
};

export default AccountsFilters;