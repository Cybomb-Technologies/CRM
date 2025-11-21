// src/components/contacts/ContactsFilters.jsx
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const ContactsFilters = ({ filters, onFiltersChange, contacts }) => {
  const handleFilterChange = (key, value) => {
    onFiltersChange(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    onFiltersChange({
      account: '',
      department: '',
      leadSource: '',
      dateRange: ''
    });
  };

  // Get unique values for filters
  const accounts = [...new Set(contacts.map(contact => contact.accountName).filter(Boolean))];
  const departments = [...new Set(contacts.map(contact => contact.department).filter(Boolean))];
  const leadSources = [...new Set(contacts.map(contact => contact.leadSource).filter(Boolean))];

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-4 pt-4 border-t">
      <div>
        <label className="text-sm font-medium mb-2 block">Account</label>
        <Select value={filters.account} onValueChange={(value) => handleFilterChange('account', value)}>
          <SelectTrigger>
            <SelectValue placeholder="All Accounts" />
          </SelectTrigger>
          <SelectContent>
            {accounts.map(account => (
              <SelectItem key={account} value={account}>{account}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Department</label>
        <Select value={filters.department} onValueChange={(value) => handleFilterChange('department', value)}>
          <SelectTrigger>
            <SelectValue placeholder="All Departments" />
          </SelectTrigger>
          <SelectContent>
            {departments.map(dept => (
              <SelectItem key={dept} value={dept}>{dept}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Lead Source</label>
        <Select value={filters.leadSource} onValueChange={(value) => handleFilterChange('leadSource', value)}>
          <SelectTrigger>
            <SelectValue placeholder="All Sources" />
          </SelectTrigger>
          <SelectContent>
            {leadSources.map(source => (
              <SelectItem key={source} value={source}>{source}</SelectItem>
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

export default ContactsFilters;