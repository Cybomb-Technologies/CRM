// src/components/contacts/ContactsFilters.jsx
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ContactsFilters = ({
  filters,
  onFiltersChange,
  contacts,
  filterOptions,
}) => {
  const handleFilterChange = (key, value) => {
    onFiltersChange((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    onFiltersChange({
      account: "all",
      department: "all",
      leadSource: "all",
      dateRange: "all",
    });
  };

  // Use filterOptions if provided, otherwise fallback to contacts
  // Ensure all values are strings and not empty
  const accounts = filterOptions?.accounts || [
    ...new Set(
      contacts
        .map((contact) => contact.accountName)
        .filter(
          (name) => name && typeof name === "string" && name.trim() !== ""
        )
    ),
  ];

  const departments = filterOptions?.departments || [
    ...new Set(
      contacts
        .map((contact) => contact.department)
        .filter(
          (dept) => dept && typeof dept === "string" && dept.trim() !== ""
        )
    ),
  ];

  const leadSources = filterOptions?.leadSources || [
    ...new Set(
      contacts
        .map((contact) => contact.leadSource)
        .filter(
          (source) =>
            source && typeof source === "string" && source.trim() !== ""
        )
    ),
  ];

  // Ensure we have valid arrays (not undefined)
  const safeAccounts = Array.isArray(accounts) ? accounts : [];
  const safeDepartments = Array.isArray(departments) ? departments : [];
  const safeLeadSources = Array.isArray(leadSources) ? leadSources : [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-4 pt-4 border-t">
      <div>
        <label className="text-sm font-medium mb-2 block">Account</label>
        <Select
          value={filters.account || "all"}
          onValueChange={(value) => handleFilterChange("account", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Accounts" />
          </SelectTrigger>
          <SelectContent className="max-h-60 overflow-y-auto">
            <SelectItem value="all">All Accounts</SelectItem>
            {safeAccounts.map((account) => (
              <SelectItem key={`account-${account}`} value={account}>
                {account}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Department</label>
        <Select
          value={filters.department || "all"}
          onValueChange={(value) => handleFilterChange("department", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Departments" />
          </SelectTrigger>
          <SelectContent className="max-h-60 overflow-y-auto">
            <SelectItem value="all">All Departments</SelectItem>
            {safeDepartments.map((dept) => (
              <SelectItem key={`dept-${dept}`} value={dept}>
                {dept}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Lead Source</label>
        <Select
          value={filters.leadSource || "all"}
          onValueChange={(value) => handleFilterChange("leadSource", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Sources" />
          </SelectTrigger>
          <SelectContent className="max-h-60 overflow-y-auto">
            <SelectItem value="all">All Sources</SelectItem>
            {safeLeadSources.map((source) => (
              <SelectItem key={`source-${source}`} value={source}>
                {source}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Date Range</label>
        <Select
          value={filters.dateRange || "all"}
          onValueChange={(value) => handleFilterChange("dateRange", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Time" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
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
