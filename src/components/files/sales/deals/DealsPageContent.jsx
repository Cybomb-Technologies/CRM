// src/components/deals/DealsPageContent.jsx
import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Search,
  Filter,
  LayoutGrid,
  Table,
  RefreshCw,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import CreateDealDialog from "./CreateDealDialog";
import ViewDealDialog from "./ViewDealDialog";
import EditDealDialog from "./EditDealDialog";
import DealsTable from "./DealsTable";
import DealsKanban from "./DealsKanban";
import DealsFilters from "./DealsFilters";
import DealsViewFilters from "./DealsViewFilters";
import DealsBulkActions from "./DealsBulkActions";
import dealsAPI from "./dealsAPI";

const DealsPageContent = () => {
  const { toast } = useToast();
  const { user } = useAuth();

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [selectedDeals, setSelectedDeals] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentView, setCurrentView] = useState("all");
  const [filters, setFilters] = useState({
    stage: "",
    owner: "",
    company: "",
    probability: "",
    valueRange: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState("table");
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Expose refresh function
  useEffect(() => {
    window.refreshDeals = () => {
      console.log("Manual refresh triggered");
      handleManualRefresh();
    };

    return () => {
      delete window.refreshDeals;
    };
  }, []);

  // Fetch deals when filters, search, view, or refresh trigger changes
  useEffect(() => {
    fetchDeals();
  }, [currentView, filters, searchTerm, refreshTrigger]);

  const fetchDeals = async () => {
    setLoading(true);
    try {
      // Prepare filter parameters - ONLY include non-empty, non-default values
      const filterParams = {};

      if (
        filters.stage &&
        filters.stage !== "" &&
        filters.stage !== "all-stages"
      ) {
        filterParams.stage = filters.stage;
      }

      if (
        filters.owner &&
        filters.owner !== "" &&
        filters.owner !== "all-owners"
      ) {
        filterParams.owner = filters.owner;
      }

      if (filters.company && filters.company !== "") {
        filterParams.company = filters.company;
      }

      if (
        filters.probability &&
        filters.probability !== "" &&
        filters.probability !== "all-probabilities"
      ) {
        filterParams.probability = filters.probability;
      }

      if (
        filters.valueRange &&
        filters.valueRange !== "" &&
        filters.valueRange !== "all-values"
      ) {
        filterParams.valueRange = filters.valueRange;
      }

      const params = {
        view: currentView,
        search: searchTerm,
        page: 1,
        limit: 1000,
        ...filterParams, // Spread filter parameters
      };

      console.log("📤 Fetching deals with params:", params);

      const response = await dealsAPI.getDeals(params);

      if (response.success) {
        setDeals(response.deals || []);
        console.log(`✅ Loaded ${response.deals?.length || 0} deals`);

        // Show filter summary toast if filters are active
        const activeFilterCount = Object.keys(filterParams).length;
        if (activeFilterCount > 0) {
          const filterNames = [];
          if (filterParams.stage)
            filterNames.push(`Stage: ${filterParams.stage}`);
          if (filterParams.owner)
            filterNames.push(`Owner: ${filterParams.owner}`);
          if (filterParams.company)
            filterNames.push(`Company: ${filterParams.company}`);
          if (filterParams.probability)
            filterNames.push(`Probability: ${filterParams.probability}`);
          if (filterParams.valueRange)
            filterNames.push(`Value Range: ${filterParams.valueRange}`);

          toast({
            title: `Applied ${activeFilterCount} Filter(s)`,
            description: filterNames.join(", "),
            duration: 3000,
          });
        }
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to fetch deals",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching deals:", error);
      toast({
        title: "Error",
        description: "Failed to fetch deals",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  // Handle manual refresh with animation
  const handleManualRefresh = () => {
    setIsRefreshing(true);
    console.log("🔄 Manual refresh triggered");

    toast({
      title: "Refreshing",
      description: "Fetching latest deals...",
    });

    // Trigger refresh
    setRefreshTrigger((prev) => prev + 1);
  };

  const filteredDeals = useMemo(() => {
    if (!deals || !Array.isArray(deals)) return [];

    let filtered = [...deals];

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter((deal) => {
        if (!deal) return false;
        return (
          (deal.title && deal.title.toLowerCase().includes(searchLower)) ||
          (deal.company && deal.company.toLowerCase().includes(searchLower)) ||
          (deal.contactName &&
            deal.contactName.toLowerCase().includes(searchLower)) ||
          (deal.description &&
            deal.description.toLowerCase().includes(searchLower)) ||
          (deal.tags &&
            deal.tags.some((tag) => tag.toLowerCase().includes(searchLower)))
        );
      });
    }

    return filtered;
  }, [deals, searchTerm]);

  // Handle deal creation to trigger refresh
  const handleDealCreated = (deal) => {
    console.log("🔄 Deal created, refreshing deals list");

    // Show success toast
    toast({
      title: "Deal Created",
      description: `${
        deal?.title || "New deal"
      } has been created successfully.`,
    });

    // Refresh the deals list after a short delay
    setTimeout(() => {
      setRefreshTrigger((prev) => prev + 1);
    }, 500);
  };

  const handleDealUpdated = async (updatedDeal) => {
    try {
      const response = await dealsAPI.updateDeal(
        updatedDeal._id || updatedDeal.id,
        updatedDeal
      );

      if (response.success) {
        toast({
          title: "Deal Updated",
          description: `${response.deal.title} has been updated successfully.`,
        });
        setEditDialogOpen(false);
        setSelectedDeal(null);

        // Refresh deals list
        setRefreshTrigger((prev) => prev + 1);
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to update deal",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating deal:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update deal",
        variant: "destructive",
      });
    }
  };

  const handleViewDeal = (deal) => {
    setSelectedDeal(deal);
    setViewDialogOpen(true);
  };

  const handleEditDeal = (deal) => {
    setSelectedDeal(deal);
    setEditDialogOpen(true);
  };

  const handleDeleteDeal = async (deal) => {
    if (window.confirm(`Are you sure you want to delete "${deal.title}"?`)) {
      try {
        const response = await dealsAPI.deleteDeal(deal._id || deal.id);

        if (response.success) {
          toast({
            title: "Success",
            description: response.message,
          });

          // Refresh deals list
          setRefreshTrigger((prev) => prev + 1);
        } else {
          toast({
            title: "Error",
            description: response.message,
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error deleting deal:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to delete deal",
          variant: "destructive",
        });
      }
    }
  };

  // Bulk operations
  const handleBulkDelete = async (dealIds) => {
    if (confirm(`Are you sure you want to delete ${dealIds.length} deals?`)) {
      try {
        const response = await dealsAPI.bulkDeleteDeals(dealIds);

        if (response.success) {
          toast({
            title: "Success",
            description: response.message,
          });
          setSelectedDeals([]);

          // Refresh deals list
          setRefreshTrigger((prev) => prev + 1);
        } else {
          toast({
            title: "Error",
            description: response.message,
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error bulk deleting deals:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to delete deals",
          variant: "destructive",
        });
      }
    }
  };

  const handleBulkUpdate = async (dealIds, updates) => {
    try {
      const response = await dealsAPI.bulkUpdateDeals(dealIds, updates);

      if (response.success) {
        toast({
          title: "Success",
          description: response.message,
        });
        setSelectedDeals([]);

        // Refresh deals list
        setRefreshTrigger((prev) => prev + 1);
      } else {
        toast({
          title: "Error",
          description: response.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error bulk updating deals:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update deals",
        variant: "destructive",
      });
    }
  };

  const handleExport = async (dealIds) => {
    try {
      const response = await dealsAPI.exportDeals(dealIds);

      if (response.success) {
        const dealsToExport =
          dealIds.length > 0
            ? response.deals.filter((deal) =>
                dealIds.includes(deal._id || deal.id)
              )
            : response.deals;

        const csvContent = dealsToExport
          .map((deal) => {
            return `"${deal?.title || ""}","${deal?.company || ""}","${
              deal?.contactName || ""
            }","${deal?.value || ""}","${deal?.probability || ""}","${
              deal?.stage || ""
            }","${deal?.owner || ""}","${deal?.closeDate || ""}"`;
          })
          .join("\n");

        const blob = new Blob(
          [
            `Title,Company,Contact,Value,Probability,Stage,Owner,Close Date\n${csvContent}`,
          ],
          { type: "text/csv" }
        );
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "deals-export.csv";
        a.click();
        URL.revokeObjectURL(url);

        toast({
          title: "Export Completed",
          description: `${dealsToExport.length} deals exported successfully.`,
        });
      }
    } catch (error) {
      console.error("Error exporting deals:", error);
      toast({
        title: "Export Failed",
        description: "Failed to export deals",
        variant: "destructive",
      });
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const totalValue = filteredDeals.reduce(
    (sum, deal) => sum + (deal.value || 0),
    0
  );
  const weightedValue = filteredDeals.reduce(
    (sum, deal) => sum + ((deal.value || 0) * (deal.probability || 0)) / 100,
    0
  );

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Deals
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Total: {filteredDeals.length} deals • Value:{" "}
            {formatCurrency(totalValue)} • Weighted:{" "}
            {formatCurrency(weightedValue)}
          </p>
        </div>
        <div className="flex gap-2">
          {/* View Toggle Button */}
          <Button
            variant="outline"
            onClick={() =>
              setViewMode(viewMode === "table" ? "kanban" : "table")
            }
            className="flex items-center gap-2"
          >
            {viewMode === "table" ? (
              <LayoutGrid className="w-4 h-4" />
            ) : (
              <Table className="w-4 h-4" />
            )}
            {viewMode === "table" ? "Kanban View" : "Table View"}
          </Button>

          {/* Refresh Button */}
          <Button
            variant="outline"
            onClick={handleManualRefresh}
            disabled={isRefreshing || loading}
            className="flex items-center gap-2"
          >
            <RefreshCw
              className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </Button>

          {/* Create Deal Button */}
          <Button
            onClick={() => setCreateDialogOpen(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Deal
          </Button>
        </div>
      </div>

      {/* View Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <DealsViewFilters
          currentView={currentView}
          onViewChange={setCurrentView}
        />
      </div>

      {/* Search and Filters Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search deals by title, company, contact, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="w-4 h-4" /> Filters
          </Button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <DealsFilters filters={filters} onFiltersChange={setFilters} />
          </div>
        )}
      </div>

      {/* Bulk Actions */}
      {selectedDeals.length > 0 && (
        <DealsBulkActions
          selectedDeals={selectedDeals}
          onBulkDelete={handleBulkDelete}
          onBulkUpdate={handleBulkUpdate}
          onExport={handleExport}
        />
      )}

      {/* Deals Display */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        {viewMode === "table" ? (
          <DealsTable
            deals={filteredDeals}
            loading={loading}
            selectedDeals={selectedDeals}
            onDealSelect={setSelectedDeals}
            onDealView={handleViewDeal}
            onDealEdit={handleEditDeal}
            onDealDelete={handleDeleteDeal}
            refreshDeals={fetchDeals}
          />
        ) : (
          <DealsKanban
            deals={filteredDeals}
            loading={loading}
            selectedDeals={selectedDeals}
            onDealSelect={setSelectedDeals}
            onDealView={handleViewDeal}
            onDealEdit={handleEditDeal}
            onDealDelete={handleDeleteDeal}
            refreshDeals={fetchDeals}
          />
        )}
      </div>

      {/* Dialogs */}
      <CreateDealDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onDealCreated={handleDealCreated}
      />

      <ViewDealDialog
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        deal={selectedDeal}
        onEditDeal={handleEditDeal}
      />

      <EditDealDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onDealUpdated={handleDealUpdated}
        initialData={selectedDeal}
      />
    </div>
  );
};

export default DealsPageContent;
