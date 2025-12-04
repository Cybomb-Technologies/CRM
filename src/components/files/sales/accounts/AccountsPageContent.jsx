import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Filter, Building2, RefreshCw } from "lucide-react";
import CreateAccountDialog from "@/components/files/sales/accounts/CreateAccountDialog";
import ViewAccountDialog from "@/components/files/sales/accounts/ViewAccountDialog";
import EditAccountDialog from "@/components/files/sales/accounts/EditAccountDialog";
import AccountsTable from "@/components/files/sales/accounts/AccountsTable";
import AccountsFilters from "@/components/files/sales/accounts/AccountsFilters";
import AccountsViewFilters from "@/components/files/sales/accounts/AccountsViewFilters";
import AccountsBulkActions from "@/components/files/sales/accounts/AccountsBulkActions";
import { useToast } from "@/components/ui/use-toast";
import accountsAPI from "./accountsAPI";

const AccountsPageContent = () => {
  const { toast } = useToast();

  // State management
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentView, setCurrentView] = useState("all");
  const [filters, setFilters] = useState({
    industry: "",
    type: "",
    dateRange: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalAccounts, setTotalAccounts] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch accounts from backend
  const fetchAccounts = useCallback(
    async (isManualRefresh = false) => {
      if (isManualRefresh) {
        setIsRefreshing(true);
      }
      setLoading(true);

      try {
        const params = {};

        // Apply search
        if (searchTerm) {
          params.search = searchTerm;
        }

        // Apply view filters
        switch (currentView) {
          case "customers":
            params.type = "Customer";
            break;
          case "partners":
            params.type = "Partner";
            break;
          case "vendors":
            params.type = "Vendor";
            break;
          case "recently-created":
            params.dateRange = "this-week";
            break;
          case "today":
            params.dateRange = "today";
            break;
          case "high-value":
            params.sortBy = "annualRevenue";
            params.sortOrder = "desc";
            break;
          default:
            // 'all' view - no specific filter
            break;
        }

        // Apply custom filters
        if (filters.industry) {
          params.industry = filters.industry;
        }
        if (filters.type && filters.type !== currentView) {
          // Only apply if not already set by view
          params.type = filters.type;
        }
        if (filters.dateRange && !params.dateRange) {
          // Only apply if not already set by view
          params.dateRange = filters.dateRange;
        }

        params.page = page;
        params.limit = 50;

        console.log("Fetching accounts with params:", params);
        const response = await accountsAPI.fetchAccounts(params);

        if (response.success) {
          console.log("Accounts fetched:", response.data.length);
          setAccounts(response.data);
          setTotalAccounts(response.pagination?.total || response.data.length);
          setTotalPages(response.pagination?.pages || 1);
        } else {
          toast({
            title: "Error",
            description: response.message || "Failed to fetch accounts",
            variant: "destructive",
          });
          setAccounts([]);
        }
      } catch (error) {
        console.error("Error fetching accounts:", error);
        toast({
          title: "Error",
          description: "Failed to load accounts. Please try again.",
          variant: "destructive",
        });
        setAccounts([]);
      } finally {
        setLoading(false);
        if (isManualRefresh) {
          setIsRefreshing(false);
        }
      }
    },
    [searchTerm, currentView, filters, page, toast]
  );

  // Initial fetch only
  useEffect(() => {
    fetchAccounts();
  }, []); // Empty dependency array - fetch only on mount

  // Fetch when filters/search change
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAccounts();
    }, 500); // Debounce to prevent rapid API calls

    return () => clearTimeout(timer);
  }, [searchTerm, currentView, filters, page, fetchAccounts]);

  // Filter logic for local filtering
  const filteredAccounts = useMemo(() => {
    if (!accounts || !Array.isArray(accounts)) return [];

    let filtered = [...accounts];

    // Apply local search filter (additional to API search)
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter((account) => {
        if (!account) return false;
        return (
          (account.name && account.name.toLowerCase().includes(searchLower)) ||
          (account.website &&
            account.website.toLowerCase().includes(searchLower)) ||
          (account.email &&
            account.email.toLowerCase().includes(searchLower)) ||
          (account.phone &&
            account.phone.toLowerCase().includes(searchLower)) ||
          (account.industry &&
            account.industry.toLowerCase().includes(searchLower))
        );
      });
    }

    return filtered;
  }, [accounts, searchTerm]);

  // Event handlers
  const handleAccountCreated = useCallback(
    async (newAccount) => {
      try {
        console.log("Account created, refreshing list...");
        setCreateDialogOpen(false);

        // Show success message
        toast({
          title: "Account Created",
          description: `${newAccount.name} has been created successfully.`,
          duration: 3000,
        });

        // Refresh accounts list after a short delay
        setTimeout(() => {
          fetchAccounts(true);
        }, 1000);
      } catch (error) {
        console.error("Error in account created handler:", error);
        toast({
          title: "Error",
          description: "Failed to process account creation.",
          variant: "destructive",
          duration: 3000,
        });
      }
    },
    [toast, fetchAccounts]
  );

  const handleAccountUpdated = useCallback(
    async (updatedAccount) => {
      try {
        setEditDialogOpen(false);
        setSelectedAccount(null);

        toast({
          title: "Account Updated",
          description: `${updatedAccount.name} has been updated successfully.`,
          duration: 3000,
        });

        // Refresh accounts list
        setTimeout(() => {
          fetchAccounts(true);
        }, 1000);
      } catch (error) {
        console.error("Error in account updated handler:", error);
        toast({
          title: "Error",
          description: "Failed to process account update.",
          variant: "destructive",
          duration: 3000,
        });
      }
    },
    [toast, fetchAccounts]
  );

  const handleAccountEdit = useCallback((account) => {
    setSelectedAccount(account);
    setEditDialogOpen(true);
  }, []);

  const handleAccountDelete = useCallback(
    async (account) => {
      if (
        window.confirm(`Are you sure you want to delete "${account.name}"?`)
      ) {
        try {
          const response = await accountsAPI.deleteAccount(
            account._id || account.id
          );

          if (response.success) {
            toast({
              title: "Account Deleted",
              description: `${account.name} has been deleted.`,
              duration: 3000,
            });
            // Refresh accounts list
            fetchAccounts(true);
          } else {
            toast({
              title: "Error",
              description: response.message || "Failed to delete account",
              variant: "destructive",
              duration: 3000,
            });
          }
        } catch (error) {
          console.error("Error deleting account:", error);
          toast({
            title: "Error",
            description: "Failed to delete account. Please try again.",
            variant: "destructive",
            duration: 3000,
          });
        }
      }
    },
    [toast, fetchAccounts]
  );

  const handleViewAccount = useCallback((account) => {
    setSelectedAccount(account);
    setViewDialogOpen(true);
  }, []);

  // Bulk action handlers
  const handleBulkDelete = useCallback(
    async (accountIds) => {
      if (accountIds.length === 0) {
        toast({
          title: "No Accounts Selected",
          description: "Please select accounts to delete.",
          variant: "destructive",
        });
        return;
      }

      if (
        confirm(
          `Are you sure you want to delete ${accountIds.length} account(s)?`
        )
      ) {
        try {
          const response = await accountsAPI.bulkDeleteAccounts(accountIds);

          if (response.success) {
            setSelectedAccounts([]);
            toast({
              title: "Accounts Deleted",
              description: `${
                response.data.deletedCount || accountIds.length
              } account(s) have been deleted.`,
              duration: 3000,
            });
            // Refresh accounts list
            fetchAccounts(true);
          } else {
            toast({
              title: "Error",
              description: response.message || "Failed to delete accounts",
              variant: "destructive",
              duration: 3000,
            });
          }
        } catch (error) {
          console.error("Error bulk deleting accounts:", error);
          toast({
            title: "Error",
            description: "Failed to delete accounts. Please try again.",
            variant: "destructive",
            duration: 3000,
          });
        }
      }
    },
    [toast, fetchAccounts]
  );

  // Refresh handler
  const handleRefresh = () => {
    fetchAccounts(true);
  };

  // Clear filters
  const handleClearFilters = () => {
    setSearchTerm("");
    setCurrentView("all");
    setFilters({
      industry: "",
      type: "",
      dateRange: "",
    });
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Building2 className="w-6 h-6" />
            Accounts
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {loading && !isRefreshing
              ? "Loading..."
              : `${totalAccounts} account(s) found`}
            {totalPages > 1 && ` • Page ${page} of ${totalPages}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={loading || isRefreshing}
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
            />
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </Button>
          <Button
            onClick={() => setCreateDialogOpen(true)}
            className="bg-blue-600 hover:bg-blue-700"
            disabled={loading}
          >
            <Plus className="w-4 h-4 mr-2" /> Create Account
          </Button>
        </div>
      </div>

      {/* View Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <AccountsViewFilters
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
              placeholder="Search accounts by name, website, or industry..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              disabled={loading}
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
            disabled={loading}
          >
            <Filter className="w-4 h-4" /> Filters
          </Button>
          <Button
            variant="outline"
            onClick={handleClearFilters}
            disabled={loading}
          >
            Clear All
          </Button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <AccountsFilters
              filters={filters}
              onFiltersChange={setFilters}
              accounts={accounts}
            />
          </div>
        )}
      </div>

      {/* Bulk Actions */}
      {selectedAccounts.length > 0 && (
        <AccountsBulkActions
          selectedAccounts={selectedAccounts}
          onBulkDelete={handleBulkDelete}
          accounts={accounts} // ← Make sure this is passed
        />
      )}

      {/* Accounts Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <AccountsTable
          accounts={filteredAccounts}
          loading={loading}
          selectedAccounts={selectedAccounts}
          onAccountSelect={setSelectedAccounts}
          onAccountEdit={handleAccountEdit}
          onAccountDelete={handleAccountDelete}
          onAccountView={handleViewAccount}
        />
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={page === 1 || loading}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={page === totalPages || loading}
          >
            Next
          </Button>
        </div>
      )}

      {/* Dialogs */}
      <CreateAccountDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onAccountCreated={handleAccountCreated}
      />

      <ViewAccountDialog
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        account={selectedAccount}
      />

      <EditAccountDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onAccountUpdated={handleAccountUpdated}
        initialData={selectedAccount}
      />
    </div>
  );
};

export default AccountsPageContent;
