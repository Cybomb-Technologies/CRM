// src/components/accounts/AccountsPageContent.jsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Filter, Building2 } from 'lucide-react';
import CreateAccountDialog from '@/components/files/sales/accounts/CreateAccountDialog';
import ViewAccountDialog from '@/components/files/sales/accounts/ViewAccountDialog';
import EditAccountDialog from '@/components/files/sales/accounts/EditAccountDialog';
import AccountsTable from '@/components/files/sales/accounts/AccountsTable';
import AccountsFilters from '@/components/files/sales/accounts/AccountsFilters';
import AccountsViewFilters from '@/components/files/sales/accounts/AccountsViewFilters';
import AccountsBulkActions from '@/components/files/sales/accounts/AccountsBulkActions';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/components/ui/use-toast';

const AccountsPageContent = () => {
  const { data, loading, fetchData, updateDataItem, bulkDeleteAccounts } = useData();
  const { toast } = useToast();
  
  // State management
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentView, setCurrentView] = useState('all');
  const [filters, setFilters] = useState({ 
    industry: '', 
    type: '',
    dateRange: '' 
  });
  const [showFilters, setShowFilters] = useState(false);

  // Get accounts from data context
  const accounts = data.accounts || [];

  // Fetch data on component mount
  useEffect(() => { 
    fetchData(); 
  }, [fetchData]);

  // Filter logic
  const filteredAccounts = useMemo(() => {
    if (!accounts || !Array.isArray(accounts)) return [];
    
    let filtered = [...accounts];

    // Apply view filters
    switch (currentView) {
      case 'all':
        break;
      case 'customers':
        filtered = filtered.filter(account => account.type === 'Customer');
        break;
      case 'partners':
        filtered = filtered.filter(account => account.type === 'Partner');
        break;
      case 'vendors':
        filtered = filtered.filter(account => account.type === 'Vendor');
        break;
      case 'recently-created':
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        filtered = filtered.filter(account => 
          account.createdAt && new Date(account.createdAt) > oneWeekAgo
        );
        break;
      case 'recently-modified':
        const twoDaysAgo = new Date();
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
        filtered = filtered.filter(account => 
          account.updatedAt && new Date(account.updatedAt) > twoDaysAgo
        );
        break;
      case 'today':
        const today = new Date().toDateString();
        filtered = filtered.filter(account => 
          account.createdAt && new Date(account.createdAt).toDateString() === today
        );
        break;
      case 'high-value':
        filtered = filtered.filter(account => account.annualRevenue > 1000000);
        break;
      default:
        break;
    }

    // Apply custom filters
    if (filters.industry) {
      filtered = filtered.filter(account => account.industry === filters.industry);
    }
    if (filters.type) {
      filtered = filtered.filter(account => account.type === filters.type);
    }
    if (filters.dateRange) {
      const now = new Date();
      let startDate;
      
      switch (filters.dateRange) {
        case 'today':
          startDate = new Date(now.setHours(0, 0, 0, 0));
          filtered = filtered.filter(account => 
            account.createdAt && new Date(account.createdAt) >= startDate
          );
          break;
        case 'this-week':
          startDate = new Date(now);
          startDate.setDate(startDate.getDate() - startDate.getDay());
          startDate.setHours(0, 0, 0, 0);
          filtered = filtered.filter(account => 
            account.createdAt && new Date(account.createdAt) >= startDate
          );
          break;
        case 'this-month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          filtered = filtered.filter(account => 
            account.createdAt && new Date(account.createdAt) >= startDate
          );
          break;
      }
    }

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(account => {
        if (!account) return false;
        return (
          (account.name && account.name.toLowerCase().includes(searchLower)) ||
          (account.website && account.website.toLowerCase().includes(searchLower)) ||
          (account.email && account.email.toLowerCase().includes(searchLower)) ||
          (account.phone && account.phone.toLowerCase().includes(searchLower)) ||
          (account.industry && account.industry.toLowerCase().includes(searchLower))
        );
      });
    }

    return filtered;
  }, [accounts, currentView, filters, searchTerm]);

  // Event handlers
  const handleAccountCreated = useCallback((newAccount) => {
    toast({ 
      title: "Account Created", 
      description: `${newAccount.name} has been created successfully.` 
    });
    setCreateDialogOpen(false);
    fetchData();
  }, [toast, fetchData]);

  const handleAccountUpdated = useCallback((updatedAccount) => {
    toast({ 
      title: "Account Updated", 
      description: `${updatedAccount.name} has been updated successfully.` 
    });
    setEditDialogOpen(false);
    setSelectedAccount(null);
    fetchData();
  }, [toast, fetchData]);

  const handleAccountEdit = useCallback((account) => { 
    setSelectedAccount(account); 
    setEditDialogOpen(true); 
  }, []);

  const handleAccountDelete = useCallback((account) => {
    if (window.confirm(`Delete ${account.name}? This will also delete all associated contacts.`)) {
      // In a real CRM, you would handle contact reassignment or deletion
      bulkDeleteAccounts([account.id]);
      toast({ 
        title: "Account Deleted", 
        description: `${account.name} has been deleted.` 
      });
      fetchData();
    }
  }, [bulkDeleteAccounts, toast, fetchData]);

  const handleViewAccount = useCallback((account) => { 
    setSelectedAccount(account); 
    setViewDialogOpen(true); 
  }, []);

  // Bulk action handlers
  const handleBulkDelete = useCallback((accountIds) => {
    if (confirm(`Are you sure you want to delete ${accountIds.length} accounts? This will also delete all associated contacts.`)) {
      bulkDeleteAccounts(accountIds);
      setSelectedAccounts([]);
      toast({
        title: "Accounts Deleted",
        description: `${accountIds.length} accounts have been deleted.`
      });
      fetchData();
    }
  }, [bulkDeleteAccounts, toast, fetchData]);

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
            {filteredAccounts.length} account(s) found
          </p>
        </div>
        <Button 
          onClick={() => setCreateDialogOpen(true)} 
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" /> Create Account
        </Button>
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