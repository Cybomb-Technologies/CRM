// src/components/deals/DealsFilters.jsx
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import dealsAPI from "./dealsAPI";

const DealsFilters = ({ filters, onFiltersChange }) => {
  const { toast } = useToast();
  const [dealStages, setDealStages] = useState([]);
  const [uniqueOwners, setUniqueOwners] = useState([]);
  const [uniqueCompanies, setUniqueCompanies] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch filter options on mount
  useEffect(() => {
    const fetchFilterOptions = async () => {
      setLoading(true);
      try {
        // Fetch deal stages
        const stages = await dealsAPI.getDealStages();
        setDealStages(
          Object.entries(stages).map(([value, label]) => ({ value, label }))
        );

        // Fetch unique owners and companies
        const response = await dealsAPI.getDeals({ limit: 1 });
        if (response.success && response.filters) {
          setUniqueOwners(response.filters.owners || []);
          setUniqueCompanies(response.filters.companies || []);
        }
      } catch (error) {
        console.error("Error fetching filter options:", error);
        toast({
          title: "Error",
          description: "Failed to load filter options",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFilterOptions();
  }, [toast]);

  const handleFilterChange = (key, value) => {
    console.log(`Filter changed: ${key} = ${value}`);

    // Handle special "all" values
    let filterValue = value;
    if (value === "all-stages") filterValue = "";
    if (value === "all-owners") filterValue = "";
    if (value === "all-probabilities") filterValue = "";
    if (value === "all-values") filterValue = "";
    if (value === "all-companies") filterValue = "";

    onFiltersChange((prev) => ({ ...prev, [key]: filterValue }));
  };

  const clearFilters = () => {
    console.log("Clearing all filters");
    onFiltersChange({
      stage: "",
      owner: "",
      company: "",
      probability: "",
      valueRange: "",
    });
    toast({
      title: "Filters Cleared",
      description: "All filters have been reset",
    });
  };

  const applyFilters = () => {
    console.log("Applying filters:", filters);
    toast({
      title: "Filters Applied",
      description: "Deals are being filtered",
    });
  };

  // Helper to get display value for filter
  const getFilterDisplayValue = (key, value) => {
    if (!value) return "";

    switch (key) {
      case "stage":
        return dealStages.find((s) => s.value === value)?.label || value;
      case "probability":
        if (value === "high") return "High (70%+)";
        if (value === "medium") return "Medium (30-69%)";
        if (value === "low") return "Low (0-29%)";
        return `${value}%`;
      case "valueRange":
        if (value === "0-500000") return "₹0-₹5L";
        if (value === "500000-2500000") return "₹5L-₹25L";
        if (value === "2500000-5000000") return "₹25L-₹50L";
        if (value === "5000000+") return "₹50L+";
        return value;
      default:
        return value;
    }
  };

  return (
    <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filter Deals</h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={applyFilters}
            disabled={loading}
          >
            Apply Filters
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={clearFilters}
            disabled={loading}
          >
            Clear All
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Stage Filter */}
        <div>
          <label className="text-sm font-medium mb-2 block">Stage</label>
          <Select
            value={filters.stage || "all-stages"}
            onValueChange={(value) => handleFilterChange("stage", value)}
            disabled={loading}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Stages" />
            </SelectTrigger>
            <SelectContent className="max-h-60 overflow-y-auto">
              <SelectItem value="all-stages">All Stages</SelectItem>
              {dealStages.map((stage) => (
                <SelectItem key={stage.value} value={stage.value}>
                  {stage.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Owner Filter */}
        <div>
          <label className="text-sm font-medium mb-2 block">Owner</label>
          <Select
            value={filters.owner || "all-owners"}
            onValueChange={(value) => handleFilterChange("owner", value)}
            disabled={loading}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Owners" />
            </SelectTrigger>
            <SelectContent className="max-h-60 overflow-y-auto">
              <SelectItem value="all-owners">All Owners</SelectItem>
              <SelectItem value="Current User">Current User</SelectItem>
              {uniqueOwners
                .filter(
                  (owner) =>
                    owner && owner !== "Current User" && owner.trim() !== ""
                )
                .map((owner) => (
                  <SelectItem key={owner} value={owner}>
                    {owner}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        {/* Company Filter - FIXED: No empty value SelectItem */}
        <div>
          <label className="text-sm font-medium mb-2 block">Company</label>
          <Select
            value={filters.company || "all-companies"}
            onValueChange={(value) => handleFilterChange("company", value)}
            disabled={loading}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Companies" />
            </SelectTrigger>
            <SelectContent className="max-h-60 overflow-y-auto">
              <SelectItem value="all-companies">All Companies</SelectItem>
              {uniqueCompanies
                .filter((company) => company && company.trim() !== "")
                .map((company) => (
                  <SelectItem key={company} value={company}>
                    {company}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        {/* Probability Filter */}
        <div>
          <label className="text-sm font-medium mb-2 block">Probability</label>
          <Select
            value={filters.probability || "all-probabilities"}
            onValueChange={(value) => handleFilterChange("probability", value)}
            disabled={loading}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Probabilities" />
            </SelectTrigger>
            <SelectContent className="max-h-60 overflow-y-auto">
              <SelectItem value="all-probabilities">
                All Probabilities
              </SelectItem>
              <SelectItem value="high">High (70%+)</SelectItem>
              <SelectItem value="medium">Medium (30-69%)</SelectItem>
              <SelectItem value="low">Low (0-29%)</SelectItem>
              <SelectItem value="90">90%</SelectItem>
              <SelectItem value="75">75%</SelectItem>
              <SelectItem value="50">50%</SelectItem>
              <SelectItem value="25">25%</SelectItem>
              <SelectItem value="10">10%</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Value Range Filter */}
        <div>
          <label className="text-sm font-medium mb-2 block">Value Range</label>
          <Select
            value={filters.valueRange || "all-values"}
            onValueChange={(value) => handleFilterChange("valueRange", value)}
            disabled={loading}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Values" />
            </SelectTrigger>
            <SelectContent className="max-h-60 overflow-y-auto">
              <SelectItem value="all-values">All Values</SelectItem>
              <SelectItem value="0-500000">₹0 - ₹5L</SelectItem>
              <SelectItem value="500000-2500000">₹5L - ₹25L</SelectItem>
              <SelectItem value="2500000-5000000">₹25L - ₹50L</SelectItem>
              <SelectItem value="5000000+">₹50L+</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Active Filters Display */}
      {(filters.stage ||
        filters.owner ||
        filters.company ||
        filters.probability ||
        filters.valueRange) && (
        <div className="mt-4 pt-4 border-t">
          <h4 className="text-sm font-medium mb-2">Active Filters:</h4>
          <div className="flex flex-wrap gap-2">
            {filters.stage && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Stage: {getFilterDisplayValue("stage", filters.stage)}
                <button
                  onClick={() => handleFilterChange("stage", "all-stages")}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            )}
            {filters.owner && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Owner: {filters.owner}
                <button
                  onClick={() => handleFilterChange("owner", "all-owners")}
                  className="ml-2 text-green-600 hover:text-green-800"
                >
                  ×
                </button>
              </span>
            )}
            {filters.company && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                Company: {filters.company}
                <button
                  onClick={() => handleFilterChange("company", "all-companies")}
                  className="ml-2 text-purple-600 hover:text-purple-800"
                >
                  ×
                </button>
              </span>
            )}
            {filters.probability && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                Probability:{" "}
                {getFilterDisplayValue("probability", filters.probability)}
                <button
                  onClick={() =>
                    handleFilterChange("probability", "all-probabilities")
                  }
                  className="ml-2 text-yellow-600 hover:text-yellow-800"
                >
                  ×
                </button>
              </span>
            )}
            {filters.valueRange && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                Value: {getFilterDisplayValue("valueRange", filters.valueRange)}
                <button
                  onClick={() => handleFilterChange("valueRange", "all-values")}
                  className="ml-2 text-red-600 hover:text-red-800"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DealsFilters;
