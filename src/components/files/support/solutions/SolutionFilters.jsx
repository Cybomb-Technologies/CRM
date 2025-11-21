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
import { statusOptions, productOptions } from "./utils";

export function SolutionFilters({ filters, onFiltersChange, status = "all" }) {
  const handleFilterChange = (filterType, value) => {
    onFiltersChange({
      ...filters,
      [filterType]: value,
    });
  };

  const handleClearFilters = () => {
    onFiltersChange({
      search: "",
      status: "all",
      product: "all",
    });
  };

  return (
    <div className="flex flex-wrap gap-4 items-end p-4 bg-gray-50 rounded-lg">
      <div className="flex-1 min-w-[200px]">
        <Label htmlFor="search" className="text-sm font-medium mb-1 block">
          Search Solutions
        </Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            id="search"
            placeholder="Search by title, question, or solution number..."
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {status === "all" && (
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
      )}

      <div className="w-48">
        <Label htmlFor="product" className="text-sm font-medium mb-1 block">
          Product
        </Label>
        <Select
          value={filters.product}
          onValueChange={(value) => handleFilterChange("product", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All products" />
          </SelectTrigger>
          <SelectContent>
            {productOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button variant="outline" onClick={handleClearFilters}>
        <Filter className="w-4 h-4 mr-2" />
        Clear Filters
      </Button>
    </div>
  );
}
