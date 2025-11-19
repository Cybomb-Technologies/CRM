// src/components/leads/LeadsPageContent.jsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Filter } from 'lucide-react';
import CreateLeadDialog from '@/components/leads/CreateLeadDialog';
import ViewLeadDialog from '@/components/leads/ViewLeadDialog';
import EditLeadDialog from '@/components/leads/EditLeadDialog';
import LeadsTable from '@/components/leads/LeadsTable';
import LeadsFilters from '@/components/leads/LeadsFilters';
import LeadsViewFilters from '@/components/leads/LeadsViewFilters';
import LeadsBulkActions from '@/components/leads/LeadsBulkActions';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/components/ui/use-toast';

const LeadsPageContent = () => {
  const { 
    leads, 
    loading, 
    fetchLeads, 
    updateDataItem, 
    bulkUpdateLeads, 
    bulkDeleteLeads, 
    convertLead,
    deduplicateLeads 
  } = useData();
  const { toast } = useToast();
  
  // State management
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentView, setCurrentView] = useState('all');
  const [filters, setFilters] = useState({ 
    status: '', 
    source: '', 
    industry: '',
    dateRange: '' 
  });
  const [showFilters, setShowFilters] = useState(false);

  // Fetch leads on component mount
  useEffect(() => { 
    fetchLeads(); 
  }, [fetchLeads]);

  // Filter logic
  const filteredLeads = useMemo(() => {
    if (!leads || !Array.isArray(leads)) return [];
    
    let filtered = [...leads];

    // Apply view filters
    switch (currentView) {
      case 'all':
        break;
      case 'locked':
        filtered = filtered.filter(lead => lead.isLocked);
        break;
      case 'converted':
        filtered = filtered.filter(lead => lead.isConverted);
        break;
      case 'junk':
        filtered = filtered.filter(lead => lead.isJunk);
        break;
      case 'my-converted':
        filtered = filtered.filter(lead => lead.isConverted);
        break;
      case 'my-leads':
        filtered = filtered.filter(lead => !lead.isConverted);
        break;
      case 'not-qualified':
        filtered = filtered.filter(lead => !lead.isQualified);
        break;
      case 'open':
        filtered = filtered.filter(lead => 
          ['New', 'Contacted', 'Qualified'].includes(lead.leadStatus)
        );
        break;
      case 'recently-created':
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        filtered = filtered.filter(lead => 
          lead.createdAt && new Date(lead.createdAt) > oneWeekAgo
        );
        break;
      case 'recently-modified':
        const twoDaysAgo = new Date();
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
        filtered = filtered.filter(lead => 
          lead.updatedAt && new Date(lead.updatedAt) > twoDaysAgo
        );
        break;
      case 'today':
        const today = new Date().toDateString();
        filtered = filtered.filter(lead => 
          lead.createdAt && new Date(lead.createdAt).toDateString() === today
        );
        break;
      case 'unread':
        filtered = filtered.filter(lead => lead.isUnread);
        break;
      case 'unsubscribed':
        filtered = filtered.filter(lead => lead.isUnsubscribed);
        break;
      default:
        break;
    }

    // Apply custom filters
    if (filters.status) {
      filtered = filtered.filter(lead => lead.leadStatus === filters.status);
    }
    if (filters.source) {
      filtered = filtered.filter(lead => lead.leadSource === filters.source);
    }
    if (filters.industry) {
      filtered = filtered.filter(lead => lead.industry === filters.industry);
    }
    if (filters.dateRange) {
      const now = new Date();
      let startDate;
      
      switch (filters.dateRange) {
        case 'today':
          startDate = new Date(now.setHours(0, 0, 0, 0));
          filtered = filtered.filter(lead => 
            lead.createdAt && new Date(lead.createdAt) >= startDate
          );
          break;
        case 'yesterday':
          startDate = new Date(now);
          startDate.setDate(startDate.getDate() - 1);
          startDate.setHours(0, 0, 0, 0);
          const endDate = new Date(startDate);
          endDate.setDate(endDate.getDate() + 1);
          filtered = filtered.filter(lead => {
            const leadDate = lead.createdAt && new Date(lead.createdAt);
            return leadDate && leadDate >= startDate && leadDate < endDate;
          });
          break;
        case 'this-week':
          startDate = new Date(now);
          startDate.setDate(startDate.getDate() - startDate.getDay());
          startDate.setHours(0, 0, 0, 0);
          filtered = filtered.filter(lead => 
            lead.createdAt && new Date(lead.createdAt) >= startDate
          );
          break;
        case 'last-week':
          startDate = new Date(now);
          startDate.setDate(startDate.getDate() - startDate.getDay() - 7);
          startDate.setHours(0, 0, 0, 0);
          const weekEnd = new Date(startDate);
          weekEnd.setDate(weekEnd.getDate() + 7);
          filtered = filtered.filter(lead => {
            const leadDate = lead.createdAt && new Date(lead.createdAt);
            return leadDate && leadDate >= startDate && leadDate < weekEnd;
          });
          break;
        case 'this-month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          filtered = filtered.filter(lead => 
            lead.createdAt && new Date(lead.createdAt) >= startDate
          );
          break;
        case 'last-month':
          startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
          const monthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
          filtered = filtered.filter(lead => {
            const leadDate = lead.createdAt && new Date(lead.createdAt);
            return leadDate && leadDate >= startDate && leadDate <= monthEnd;
          });
          break;
      }
    }

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(lead => {
        if (!lead) return false;
        return (
          (lead.firstName && lead.firstName.toLowerCase().includes(searchLower)) ||
          (lead.lastName && lead.lastName.toLowerCase().includes(searchLower)) ||
          (lead.company && lead.company.toLowerCase().includes(searchLower)) ||
          (lead.email && lead.email.toLowerCase().includes(searchLower)) ||
          (lead.phone && lead.phone.toLowerCase().includes(searchLower)) ||
          (lead.tags && lead.tags.some(tag => tag.toLowerCase().includes(searchLower)))
        );
      });
    }

    return filtered;
  }, [leads, currentView, filters, searchTerm]);

  // Event handlers
  const handleLeadCreated = useCallback((newLead) => {
    toast({ 
      title: "Lead Created", 
      description: `${newLead.firstName} ${newLead.lastName} has been created successfully.` 
    });
    setCreateDialogOpen(false);
    fetchLeads();
  }, [toast, fetchLeads]);

  const handleLeadUpdated = useCallback((updatedLead) => {
    toast({ 
      title: "Lead Updated", 
      description: `${updatedLead.firstName} ${updatedLead.lastName} has been updated successfully.` 
    });
    setEditDialogOpen(false);
    setSelectedLead(null);
    fetchLeads();
  }, [toast, fetchLeads]);

  const handleLeadEdit = useCallback((lead) => { 
    setSelectedLead(lead); 
    setEditDialogOpen(true); 
  }, []);

  const handleLeadDelete = useCallback((lead) => {
    if (window.confirm(`Delete ${lead.firstName} ${lead.lastName}?`)) {
      bulkDeleteLeads([lead.id]);
      toast({ 
        title: "Lead Deleted", 
        description: `${lead.firstName} ${lead.lastName} has been deleted.` 
      });
      fetchLeads();
    }
  }, [bulkDeleteLeads, toast, fetchLeads]);

  const handleViewLead = useCallback((lead) => { 
    setSelectedLead(lead); 
    setViewDialogOpen(true); 
  }, []);

  const handleLeadConvert = useCallback((lead) => {
    convertLead(lead.id);
    toast({
      title: "Lead Converted",
      description: `${lead.firstName} ${lead.lastName} has been converted to contact.`
    });
    fetchLeads();
  }, [convertLead, toast, fetchLeads]);

  const handleLeadEmail = useCallback((lead) => {
    toast({
      title: "Email Prepared",
      description: `Email composer opened for ${lead.firstName} ${lead.lastName}.`
    });
  }, [toast]);

  // Bulk action handlers
  const handleBulkUpdate = useCallback((leadIds, updates) => {
    const result = bulkUpdateLeads(leadIds, updates);
    setSelectedLeads([]);
    toast({
      title: result.success ? "Success" : "Error",
      description: result.message,
      variant: result.success ? "default" : "destructive"
    });
    fetchLeads();
  }, [bulkUpdateLeads, toast, fetchLeads]);

  const handleBulkDelete = useCallback((leadIds) => {
    if (confirm(`Are you sure you want to delete ${leadIds.length} leads?`)) {
      const result = bulkDeleteLeads(leadIds);
      setSelectedLeads([]);
      toast({
        title: result.success ? "Success" : "Error",
        description: result.message,
        variant: result.success ? "default" : "destructive"
      });
      fetchLeads();
    }
  }, [bulkDeleteLeads, toast, fetchLeads]);

  const handleBulkConvert = useCallback((leadIds) => {
    // This is now handled in LeadsBulkActions component
    toast({
      title: "Bulk Convert",
      description: `Initiating bulk conversion for ${leadIds.length} leads.`
    });
  }, [toast]);

  const handleManageTags = useCallback((leadIds) => {
    // This is now handled in LeadsBulkActions component
    toast({
      title: "Manage Tags",
      description: `Opening tag manager for ${leadIds.length} leads.`
    });
  }, [toast]);

  const handleMassEmail = useCallback((leadIds, emailData) => {
    // Simulate sending mass email
    console.log('Sending mass email to:', leadIds, emailData);
    toast({
      title: "Mass Email Sent",
      description: `Email sent to ${leadIds.length} leads.`
    });
  }, [toast]);

  const handleExport = useCallback((leadIds) => {
    const csvContent = leadIds.map(leadId => {
      const lead = leads.find(l => l.id === leadId);
      return `"${lead?.firstName || ''}","${lead?.lastName || ''}","${lead?.company || ''}","${lead?.email || ''}","${lead?.phone || ''}","${lead?.leadStatus || ''}","${lead?.leadSource || ''}","${lead?.industry || ''}"`;
    }).join('\n');
    
    const blob = new Blob([`First Name,Last Name,Company,Email,Phone,Status,Source,Industry\n${csvContent}`], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'leads-export.csv';
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Export Completed",
      description: `${leadIds.length} leads exported successfully.`
    });
  }, [leads, toast]);

  const handleAddToCampaign = useCallback((leadIds) => {
    // This is now handled in LeadsBulkActions component
    toast({
      title: "Add to Campaign",
      description: `Opening campaign selector for ${leadIds.length} leads.`
    });
  }, [toast]);

  const handleDeduplicateLeads = useCallback(async () => {
    const result = await deduplicateLeads();
    toast({
      title: "Deduplication Complete",
      description: result.message,
      variant: result.duplicatesFound > 0 ? "default" : "destructive"
    });
    fetchLeads();
  }, [deduplicateLeads, toast, fetchLeads]);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Leads</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage and track your potential customers</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={handleDeduplicateLeads}
          >
            Deduplicate Leads
          </Button>
          <Button 
            onClick={() => setCreateDialogOpen(true)} 
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" /> Create Lead
          </Button>
        </div>
      </div>

      {/* View Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <LeadsViewFilters 
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
              placeholder="Search leads by name, company, email, or tags..." 
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
            <LeadsFilters 
              filters={filters} 
              onFiltersChange={setFilters} 
            />
          </div>
        )}
      </div>

      {/* Bulk Actions */}
      {selectedLeads.length > 0 && (
        <LeadsBulkActions
          selectedLeads={selectedLeads}
          onBulkDelete={handleBulkDelete}
          onBulkUpdate={handleBulkUpdate}
          onBulkConvert={handleBulkConvert}
          onManageTags={handleManageTags}
          onMassEmail={handleMassEmail}
          onExport={handleExport}
          onAddToCampaign={handleAddToCampaign}
        />
      )}

      {/* Leads Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <LeadsTable 
          leads={filteredLeads} 
          loading={loading} 
          selectedLeads={selectedLeads}
          onLeadSelect={setSelectedLeads}
          onLeadEdit={handleLeadEdit} 
          onLeadDelete={handleLeadDelete} 
          onLeadView={handleViewLead}
          onLeadConvert={handleLeadConvert}
          onLeadEmail={handleLeadEmail}
        />
      </div>

      {/* Dialogs */}
      <CreateLeadDialog 
        open={createDialogOpen} 
        onOpenChange={setCreateDialogOpen} 
        onLeadCreated={handleLeadCreated} 
      />
      
      <ViewLeadDialog 
        open={viewDialogOpen} 
        onOpenChange={setViewDialogOpen} 
        lead={selectedLead} 
      />
      
      <EditLeadDialog 
        open={editDialogOpen} 
        onOpenChange={setEditDialogOpen} 
        onLeadUpdated={handleLeadUpdated} 
        initialData={selectedLead} 
      />
    </div>
  );
};

export default LeadsPageContent;