// src/components/files/sales/leads/LeadsPageContent.jsx
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Filter } from "lucide-react";
import CreateLeadDialog from "@/components/files/sales/leads/CreateLeadDialog";
import ViewLeadDialog from "@/components/files/sales/leads/ViewLeadDialog";
import EditLeadDialog from "@/components/files/sales/leads/EditLeadDialog";
import LeadsTable from "@/components/files/sales/leads/LeadsTable";
import LeadsFilters from "@/components/files/sales/leads/LeadsFilters";
import LeadsViewFilters from "@/components/files/sales/leads/LeadsViewFilters";
import LeadsBulkActions from "@/components/files/sales/leads/LeadsBulkActions";
import { leadsService } from "./leadsService";
import { useToast } from "@/components/ui/use-toast";

const LeadsPageContent = () => {
  const { toast } = useToast();

  // State management
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentView, setCurrentView] = useState("all");
  const [filters, setFilters] = useState({
    status: "",
    source: "",
    industry: "",
    dateRange: "",
  });
  const [showFilters, setShowFilters] = useState(false);

  // Fetch leads on component mount and when filters change
  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const apiFilters = {
        ...filters,
        view: currentView,
        search: searchTerm || undefined,
      };

      const result = await leadsService.fetchLeads(apiFilters);
      if (result.success) {
        setLeads(result.data);
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Fetch leads error:", error);
      toast({
        title: "Error",
        description: "Failed to fetch leads",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [filters, currentView, searchTerm, toast]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // Filter logic for client-side search (in addition to API filtering)
  const filteredLeads = useMemo(() => {
    if (!leads || !Array.isArray(leads)) return [];

    let filtered = [...leads];

    // Apply client-side search filter for better UX
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter((lead) => {
        if (!lead) return false;
        return (
          (lead.firstName &&
            lead.firstName.toLowerCase().includes(searchLower)) ||
          (lead.lastName &&
            lead.lastName.toLowerCase().includes(searchLower)) ||
          (lead.company && lead.company.toLowerCase().includes(searchLower)) ||
          (lead.email && lead.email.toLowerCase().includes(searchLower)) ||
          (lead.phone && lead.phone.toLowerCase().includes(searchLower)) ||
          (lead.tags &&
            lead.tags.some((tag) => tag.toLowerCase().includes(searchLower)))
        );
      });
    }

    return filtered;
  }, [leads, searchTerm]);

  // Event handlers
  const handleLeadCreated = useCallback(
    (newLead) => {
      toast({
        title: "Lead Created",
        description: `${newLead.firstName} ${newLead.lastName} has been created successfully.`,
      });
      setCreateDialogOpen(false);
      fetchLeads();
    },
    [toast, fetchLeads]
  );

  const handleLeadUpdated = useCallback(
    (updatedLead) => {
      toast({
        title: "Lead Updated",
        description: `${updatedLead.firstName} ${updatedLead.lastName} has been updated successfully.`,
      });
      setEditDialogOpen(false);
      setSelectedLead(null);
      fetchLeads();
    },
    [toast, fetchLeads]
  );

  const handleLeadEdit = useCallback((lead) => {
    setSelectedLead(lead);
    setEditDialogOpen(true);
  }, []);

  const handleLeadDelete = useCallback(
    async (lead) => {
      if (window.confirm(`Delete ${lead.firstName} ${lead.lastName}?`)) {
        const result = await leadsService.deleteLead(lead.id || lead._id);
        if (result.success) {
          toast({
            title: "Lead Deleted",
            description: `${lead.firstName} ${lead.lastName} has been deleted.`,
          });
          fetchLeads();
        } else {
          toast({
            title: "Error",
            description: result.message,
            variant: "destructive",
          });
        }
      }
    },
    [toast, fetchLeads]
  );

  const handleViewLead = useCallback((lead) => {
    setSelectedLead(lead);
    setViewDialogOpen(true);
  }, []);

  const handleLeadConvert = useCallback(
    async (lead) => {
      const result = await leadsService.convertLead(lead.id || lead._id);
      if (result.success) {
        toast({
          title: "Lead Converted",
          description: `${lead.firstName} ${lead.lastName} has been converted to contact.`,
        });
        fetchLeads();
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    },
    [toast, fetchLeads]
  );

  const handleLeadEmail = useCallback(
    (lead) => {
      toast({
        title: "Email Prepared",
        description: `Email composer opened for ${lead.firstName} ${lead.lastName}.`,
      });
    },
    [toast]
  );

  // Bulk action handlers
  const handleBulkUpdate = useCallback(
    async (leadIds, updates) => {
      const result = await leadsService.bulkUpdateLeads(leadIds, updates);
      setSelectedLeads([]);
      toast({
        title: result.success ? "Success" : "Error",
        description: result.message,
        variant: result.success ? "default" : "destructive",
      });
      fetchLeads();
    },
    [toast, fetchLeads]
  );

  const handleBulkDelete = useCallback(
    async (leadIds) => {
      if (confirm(`Are you sure you want to delete ${leadIds.length} leads?`)) {
        const result = await leadsService.bulkDeleteLeads(leadIds);
        setSelectedLeads([]);
        toast({
          title: result.success ? "Success" : "Error",
          description: result.message,
          variant: result.success ? "default" : "destructive",
        });
        fetchLeads();
      }
    },
    [toast, fetchLeads]
  );

  const handleBulkConvert = useCallback(
    async (leadIds) => {
      const result = await leadsService.bulkConvertLeads(leadIds);
      setSelectedLeads([]);
      toast({
        title: result.success ? "Success" : "Error",
        description: result.message,
        variant: result.success ? "default" : "destructive",
      });
      fetchLeads();
    },
    [toast, fetchLeads]
  );

  const handleManageTags = useCallback(
    async (leadIds, tagsToAdd = [], tagsToRemove = []) => {
      const result = await leadsService.manageLeadTags(
        leadIds,
        tagsToAdd,
        tagsToRemove
      );
      setSelectedLeads([]);
      toast({
        title: result.success ? "Success" : "Error",
        description: result.message,
        variant: result.success ? "default" : "destructive",
      });
      fetchLeads();
    },
    [toast, fetchLeads]
  );

  const handleMassEmail = useCallback(
    (leadIds, emailData) => {
      console.log("Sending mass email to:", leadIds, emailData);
      toast({
        title: "Mass Email Sent",
        description: `Email sent to ${leadIds.length} leads.`,
      });
    },
    [toast]
  );

  const handleExport = useCallback(
    (leadIds) => {
      const csvContent = leadIds
        .map((leadId) => {
          const lead = leads.find((l) => l.id === leadId || l._id === leadId);
          return `"${lead?.firstName || ""}","${lead?.lastName || ""}","${
            lead?.company || ""
          }","${lead?.email || ""}","${lead?.phone || ""}","${
            lead?.leadStatus || ""
          }","${lead?.leadSource || ""}","${lead?.industry || ""}"`;
        })
        .join("\n");

      const blob = new Blob(
        [
          `First Name,Last Name,Company,Email,Phone,Status,Source,Industry\n${csvContent}`,
        ],
        { type: "text/csv" }
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "leads-export.csv";
      a.click();
      URL.revokeObjectURL(url);

      toast({
        title: "Export Completed",
        description: `${leadIds.length} leads exported successfully.`,
      });
    },
    [leads, toast]
  );

  const handleAddToCampaign = useCallback(
    async (leadIds, campaignId) => {
      const result = await leadsService.addLeadsToCampaign(leadIds, campaignId);
      toast({
        title: result.success ? "Success" : "Error",
        description: result.message,
        variant: result.success ? "default" : "destructive",
      });
    },
    [toast]
  );

  const handleDeduplicateLeads = useCallback(async () => {
    const result = await leadsService.deduplicateLeads();
    toast({
      title: "Deduplication Complete",
      description: result.message,
      variant: result.success ? "default" : "destructive",
    });
    fetchLeads();
  }, [toast, fetchLeads]);

  const handleApproveLeads = useCallback(
    async (leadIds) => {
      const result = await leadsService.approveLeads(leadIds);
      setSelectedLeads([]);
      toast({
        title: result.success ? "Success" : "Error",
        description: result.message,
        variant: result.success ? "default" : "destructive",
      });
      fetchLeads();
    },
    [toast, fetchLeads]
  );

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Leads
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage and track your potential customers
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleDeduplicateLeads}>
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
            <LeadsFilters filters={filters} onFiltersChange={setFilters} />
          </div>
        )}
      </div>

      {/* Bulk Actions */}
      {selectedLeads.length > 0 && (
        <LeadsBulkActions
          selectedLeads={selectedLeads}
          leads={leads} // Add this line to pass leads data
          onBulkDelete={handleBulkDelete}
          onBulkUpdate={handleBulkUpdate}
          onBulkConvert={handleBulkConvert}
          onManageTags={handleManageTags}
          onMassEmail={handleMassEmail}
          onExport={handleExport}
          onAddToCampaign={handleAddToCampaign}
          onApproveLeads={handleApproveLeads}
          onDeduplicateLeads={handleDeduplicateLeads}
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
