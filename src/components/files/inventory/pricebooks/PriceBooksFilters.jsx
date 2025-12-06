// src/components/files/inventory/pricebooks/PriceBooksFilters.jsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const PriceBooksFilters = ({ filters, onFiltersChange }) => {
  const handleFilterChange = (key, value) => {
    onFiltersChange(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="status-filter">Status</Label>
          <Select 
            value={filters.status} 
            onValueChange={(value) => handleFilterChange('status', value)}
          >
            <SelectTrigger id="status-filter">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Status</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="source-filter">Source</Label>
          <Select 
            value={filters.source} 
            onValueChange={(value) => handleFilterChange('source', value)}
          >
            <SelectTrigger id="source-filter">
              <SelectValue placeholder="All Sources" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Sources</SelectItem>
              <SelectItem value="Website">Website</SelectItem>
              <SelectItem value="Partner">Partner</SelectItem>
              <SelectItem value="Direct">Direct</SelectItem>
              <SelectItem value="Reseller">Reseller</SelectItem>
              <SelectItem value="Government">Government</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="flags-filter">Flags</Label>
          <Select 
            value={filters.flags} 
            onValueChange={(value) => handleFilterChange('flags', value)}
          >
            <SelectTrigger id="flags-filter">
              <SelectValue placeholder="All Flags" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Flags</SelectItem>
              <SelectItem value="Default">Default</SelectItem>
              <SelectItem value="Premium">Premium</SelectItem>
              <SelectItem value="Standard">Standard</SelectItem>
              <SelectItem value="Volume">Volume</SelectItem>
              <SelectItem value="Special">Special</SelectItem>
              <SelectItem value="Restricted">Restricted</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onFiltersChange({ status: '', source: '', flags: '', dateRange: '' })}
        >
          Clear Filters
        </Button>
      </div>
    </div>
  );
};

export default PriceBooksFilters;