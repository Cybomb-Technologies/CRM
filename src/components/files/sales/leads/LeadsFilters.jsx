// src/components/leads/LeadsFilters.jsx
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const LeadsFilters = ({ filters, onFiltersChange }) => {
  const handleFilterChange = (key, value) => {
    onFiltersChange(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    onFiltersChange({
      status: '',
      source: '',
      industry: '',
      tag: '',
      dateRange: ''
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-4 pt-4 border-t">
      <div>
        <label className="text-sm font-medium mb-2 block">Status</label>
        <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
          <SelectTrigger>
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent className="max-h-60 overflow-y-auto">
            <SelectItem value="New">New</SelectItem>
            <SelectItem value="Contacted">Contacted</SelectItem>
            <SelectItem value="Qualified">Qualified</SelectItem>
            <SelectItem value="Unqualified">Unqualified</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Source</label>
        <Select value={filters.source} onValueChange={(value) => handleFilterChange('source', value)}>
          <SelectTrigger>
            <SelectValue placeholder="All Sources" />
          </SelectTrigger>
          <SelectContent className="max-h-60 overflow-y-auto">
            <SelectItem value="Website">Website</SelectItem>
            <SelectItem value="Referral">Referral</SelectItem>
            <SelectItem value="LinkedIn">LinkedIn</SelectItem>
            <SelectItem value="Advertisement">Advertisement</SelectItem>
            <SelectItem value="Cold Call">Cold Call</SelectItem>
            <SelectItem value="Email">Email</SelectItem>
            <SelectItem value="Web Research">Web Research</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Industry</label>
        <Select value={filters.industry} onValueChange={(value) => handleFilterChange('industry', value)}>
          <SelectTrigger>
            <SelectValue placeholder="All Industries" />
          </SelectTrigger>
          <SelectContent className="max-h-60 overflow-y-auto">
            <SelectItem value="Technology">Technology</SelectItem>
            <SelectItem value="Finance">Finance</SelectItem>
            <SelectItem value="Healthcare">Healthcare</SelectItem>
            <SelectItem value="Manufacturing">Manufacturing</SelectItem>
            <SelectItem value="R&D">R&D</SelectItem>
            <SelectItem value="Marketing">Marketing</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Date Range</label>
        <Select value={filters.dateRange} onValueChange={(value) => handleFilterChange('dateRange', value)}>
          <SelectTrigger>
            <SelectValue placeholder="All Time" />
          </SelectTrigger>
          <SelectContent className="max-h-60 overflow-y-auto">
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="yesterday">Yesterday</SelectItem>
            <SelectItem value="this-week">This Week</SelectItem>
            <SelectItem value="last-week">Last Week</SelectItem>
            <SelectItem value="this-month">This Month</SelectItem>
            <SelectItem value="last-month">Last Month</SelectItem>
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

export default LeadsFilters;