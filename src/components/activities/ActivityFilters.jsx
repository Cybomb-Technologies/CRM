import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import {
  typeOptions,
  statusOptions,
  priorityOptions,
  callTypeOptions,
} from "./utils";

export function ActivityFilters({ filters, onFiltersChange, type = "all" }) {
  const handleFilterChange = (filterType, value) => {
    onFiltersChange({
      ...filters,
      [filterType]: value,
    });
  };

  const handleClearFilters = () => {
    onFiltersChange({
      search: "",
      type: "all",
      status: "all",
      priority: "all",
      callType: "all",
    });
  };

  return (
    <div className="flex flex-wrap gap-4 items-end p-4 bg-gray-50 rounded-lg">
      <div className="flex-1 min-w-[200px]">
        <Label htmlFor="search" className="text-sm font-medium mb-1 block">
          Search
        </Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            id="search"
            placeholder="Search activities..."
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {type === "all" && (
        <div className="w-48">
          <Label htmlFor="type" className="text-sm font-medium mb-1 block">
            Type
          </Label>
          <Select
            value={filters.type}
            onValueChange={(value) => handleFilterChange("type", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              {typeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="w-48">
        <Label htmlFor="status" className="text-sm font-medium mb-1 block">
          Status
        </Label>
        <Select
          value={filters.status}
          onValueChange={(value) => handleFilterChange("status", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="w-48">
        <Label htmlFor="priority" className="text-sm font-medium mb-1 block">
          Priority
        </Label>
        <Select
          value={filters.priority}
          onValueChange={(value) => handleFilterChange("priority", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All priorities" />
          </SelectTrigger>
          <SelectContent>
            {priorityOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {type === "call" && (
        <div className="w-48">
          <Label htmlFor="callType" className="text-sm font-medium mb-1 block">
            Call Type
          </Label>
          <Select
            value={filters.callType}
            onValueChange={(value) => handleFilterChange("callType", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All call types" />
            </SelectTrigger>
            <SelectContent>
              {callTypeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <Button variant="outline" onClick={handleClearFilters}>
        <Filter className="w-4 h-4 mr-2" />
        Clear Filters
      </Button>
    </div>
  );
}
