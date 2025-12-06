import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SalesOrdersFilters = ({ filters, onFiltersChange }) => {
  const handleFilterChange = (filterType, value) => {
    onFiltersChange({
      ...filters,
      [filterType]: value
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select 
          value={filters.status} 
          onValueChange={(value) => handleFilterChange('status', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Status</SelectItem>
            <SelectItem value="Created">Created</SelectItem>
            <SelectItem value="Approved">Approved</SelectItem>
            <SelectItem value="In Process">In Process</SelectItem>
            <SelectItem value="Delivered">Delivered</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
            <SelectItem value="Cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="account">Account</Label>
        <Input
          id="account"
          placeholder="Filter by account..."
          value={filters.account}
          onChange={(e) => handleFilterChange('account', e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="salesPerson">Sales Person</Label>
        <Input
          id="salesPerson"
          placeholder="Filter by sales person..."
          value={filters.salesPerson}
          onChange={(e) => handleFilterChange('salesPerson', e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="dateRange">Date Range</Label>
        <Select 
          value={filters.dateRange} 
          onValueChange={(value) => handleFilterChange('dateRange', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Dates" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Dates</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="this-week">This Week</SelectItem>
            <SelectItem value="this-month">This Month</SelectItem>
            <SelectItem value="last-month">Last Month</SelectItem>
            <SelectItem value="last-3-months">Last 3 Months</SelectItem>
            <SelectItem value="last-6-months">Last 6 Months</SelectItem>
            <SelectItem value="this-year">This Year</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default SalesOrdersFilters;