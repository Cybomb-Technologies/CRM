// src/components/deals/DealsPageContent.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Filter, LayoutGrid, Table } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/components/ui/use-toast';
import CreateDealDialog from './CreateDealDialog';
import ViewDealDialog from './ViewDealDialog';
import EditDealDialog from './EditDealDialog';
import DealsTable from './DealsTable';
import DealsKanban from './DealsKanban';
import DealsFilters from './DealsFilters';
import DealsViewFilters from './DealsViewFilters';
import DealsBulkActions from './DealsBulkActions';

const DealsPageContent = () => {
  const { 
    getAllDeals, 
    loading, 
    fetchData,
    bulkDeleteDeals,
    updateDataItem
  } = useData();
  const { toast } = useToast();
  
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [selectedDeals, setSelectedDeals] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentView, setCurrentView] = useState('all');
  const [filters, setFilters] = useState({ 
    stage: '', 
    owner: '', 
    company: '',
    probability: '',
    valueRange: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'kanban'

  const deals = getAllDeals();

  useEffect(() => { 
    fetchData();
  }, [fetchData]);

  const filteredDeals = useMemo(() => {
    if (!deals || !Array.isArray(deals)) return [];
    
    let filtered = [...deals];

    // Apply view filters
    switch (currentView) {
      case 'all':
        break;
      case 'my-deals':
        filtered = filtered.filter(deal => deal.owner === 'Current User');
        break;
      case 'high-value':
        filtered = filtered.filter(deal => deal.value >= 50000);
        break;
      case 'closing-this-month':
        const thisMonthEnd = new Date();
        thisMonthEnd.setMonth(thisMonthEnd.getMonth() + 1);
        thisMonthEnd.setDate(0); // Last day of current month
        filtered = filtered.filter(deal => 
          deal.closeDate && new Date(deal.closeDate) <= thisMonthEnd
        );
        break;
      case 'stuck-deals':
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        filtered = filtered.filter(deal => 
          deal.updatedAt && new Date(deal.updatedAt) < thirtyDaysAgo
        );
        break;
      default:
        break;
    }

    // Apply custom filters
    if (filters.stage && filters.stage !== 'all-stages') {
      filtered = filtered.filter(deal => deal.stage === filters.stage);
    }
    if (filters.owner && filters.owner !== 'all-owners') {
      filtered = filtered.filter(deal => deal.owner === filters.owner);
    }
    if (filters.company) {
      filtered = filtered.filter(deal => 
        deal.company && deal.company.toLowerCase().includes(filters.company.toLowerCase())
      );
    }
    if (filters.probability && filters.probability !== 'all-probabilities') {
      switch (filters.probability) {
        case 'high':
          filtered = filtered.filter(deal => (deal.probability || 0) >= 70);
          break;
        case 'medium':
          filtered = filtered.filter(deal => (deal.probability || 0) >= 30 && (deal.probability || 0) < 70);
          break;
        case 'low':
          filtered = filtered.filter(deal => (deal.probability || 0) < 30);
          break;
      }
    }
    if (filters.valueRange && filters.valueRange !== 'all-values') {
      switch (filters.valueRange) {
        case '0-10000':
          filtered = filtered.filter(deal => (deal.value || 0) >= 0 && (deal.value || 0) <= 10000);
          break;
        case '10000-50000':
          filtered = filtered.filter(deal => (deal.value || 0) > 10000 && (deal.value || 0) <= 50000);
          break;
        case '50000-100000':
          filtered = filtered.filter(deal => (deal.value || 0) > 50000 && (deal.value || 0) <= 100000);
          break;
        case '100000+':
          filtered = filtered.filter(deal => (deal.value || 0) > 100000);
          break;
      }
    }

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(deal => {
        if (!deal) return false;
        return (
          (deal.title && deal.title.toLowerCase().includes(searchLower)) ||
          (deal.company && deal.company.toLowerCase().includes(searchLower)) ||
          (deal.contactName && deal.contactName.toLowerCase().includes(searchLower)) ||
          (deal.description && deal.description.toLowerCase().includes(searchLower)) ||
          (deal.tags && deal.tags.some(tag => tag.toLowerCase().includes(searchLower)))
        );
      });
    }

    return filtered;
  }, [deals, currentView, filters, searchTerm]);

  // Deal CRUD Operations
  const handleDealCreated = (newDeal) => {
    toast({ 
      title: "Deal Created", 
      description: `${newDeal.title} has been created successfully.` 
    });
    setCreateDialogOpen(false);
    fetchData();
  };

  const handleDealUpdated = (updatedDeal) => {
    toast({ 
      title: "Deal Updated", 
      description: `${updatedDeal.title} has been updated successfully.` 
    });
    setEditDialogOpen(false);
    setSelectedDeal(null);
    fetchData();
  };

  const handleViewDeal = (deal) => { 
    setSelectedDeal(deal); 
    setViewDialogOpen(true); 
  };

  const handleEditDeal = (deal) => { 
    setSelectedDeal(deal); 
    setEditDialogOpen(true); 
  };

  const handleDeleteDeal = (deal) => {
    if (window.confirm(`Are you sure you want to delete "${deal.title}"?`)) {
      const result = bulkDeleteDeals([deal.id]);
      toast({
        title: result.success ? "Success" : "Error",
        description: result.message,
        variant: result.success ? "default" : "destructive"
      });
      fetchData();
    }
  };

  // Bulk operations
  const handleBulkDelete = (dealIds) => {
    if (confirm(`Are you sure you want to delete ${dealIds.length} deals?`)) {
      const result = bulkDeleteDeals(dealIds);
      setSelectedDeals([]);
      toast({
        title: result.success ? "Success" : "Error",
        description: result.message,
        variant: result.success ? "default" : "destructive"
      });
      fetchData();
    }
  };

  const handleBulkUpdate = (dealIds, updates) => {
    const result = bulkUpdateDeals(dealIds, updates);
    setSelectedDeals([]);
    toast({
      title: result.success ? "Success" : "Error",
      description: result.message,
      variant: result.success ? "default" : "destructive"
    });
    fetchData();
  };

  const handleExport = (dealIds) => {
    const csvContent = dealIds.map(dealId => {
      const deal = deals.find(d => d.id === dealId);
      return `"${deal?.title || ''}","${deal?.company || ''}","${deal?.contactName || ''}","${deal?.value || ''}","${deal?.probability || ''}","${deal?.stage || ''}","${deal?.owner || ''}","${deal?.closeDate || ''}"`;
    }).join('\n');
    
    const blob = new Blob([`Title,Company,Contact,Value,Probability,Stage,Owner,Close Date\n${csvContent}`], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'deals-export.csv';
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Export Completed",
      description: `${dealIds.length} deals exported successfully.`
    });
  };

  const totalValue = filteredDeals.reduce((sum, deal) => sum + (deal.value || 0), 0);
  const weightedValue = filteredDeals.reduce((sum, deal) => sum + (deal.value || 0) * (deal.probability || 0) / 100, 0);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Deals</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Total: {filteredDeals.length} deals • Value: ${totalValue.toLocaleString()} • Weighted: ${weightedValue.toLocaleString()}
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={() => setViewMode(viewMode === 'table' ? 'kanban' : 'table')}
            className="flex items-center gap-2"
          >
            {viewMode === 'table' ? <LayoutGrid className="w-4 h-4" /> : <Table className="w-4 h-4" />}
            {viewMode === 'table' ? 'Kanban View' : 'Table View'}
          </Button>
          <Button 
            onClick={() => setCreateDialogOpen(true)} 
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" /> Create Deal
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
            <DealsFilters 
              filters={filters} 
              onFiltersChange={setFilters} 
            />
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
        {viewMode === 'table' ? (
          <DealsTable 
            deals={filteredDeals} 
            loading={loading} 
            selectedDeals={selectedDeals}
            onDealSelect={setSelectedDeals}
            onDealView={handleViewDeal}
            onDealEdit={handleEditDeal}
            onDealDelete={handleDeleteDeal}
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