// src/components/contacts/ContactsPageContent.jsx
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Filter, RefreshCw } from "lucide-react";
import CreateContactDialog from "@/components/files/sales/contacts/CreateContactDialog";
import ViewContactDialog from "@/components/files/sales/contacts/ViewContactDialog";
import EditContactDialog from "@/components/files/sales/contacts/EditContactDialog";
import ContactsTable from "@/components/files/sales/contacts/ContactsTable";
import ContactsFilters from "@/components/files/sales/contacts/ContactsFilters";
import ContactsViewFilters from "@/components/files/sales/contacts/ContactsViewFilters";
import ContactsBulkActions from "@/components/files/sales/contacts/ContactsBulkActions";
import { useToast } from "@/components/ui/use-toast";
import contactsAPI from "./contactsAPI";

const ContactsPageContent = () => {
  const { toast } = useToast();

  // State management
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentView, setCurrentView] = useState("all");
  const [filters, setFilters] = useState({
    account: "all",
    department: "all",
    leadSource: "all",
    dateRange: "all",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [filterOptions, setFilterOptions] = useState({
    accounts: [],
    departments: [],
    leadSources: [],
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    pages: 1,
  });

  // Convert frontend filter values to backend values
  const getBackendFilters = useCallback(() => {
    const backendFilters = {};

    // Convert 'all' to empty string for backend
    Object.keys(filters).forEach((key) => {
      backendFilters[key] = filters[key] === "all" ? "" : filters[key];
    });

    return backendFilters;
  }, [filters]);

  // Fetch contacts from API
  const fetchContacts = useCallback(async () => {
    setLoading(true);
    try {
      const backendFilters = getBackendFilters();

      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm,
        account: backendFilters.account,
        department: backendFilters.department,
        leadSource: backendFilters.leadSource,
        dateRange: backendFilters.dateRange,
        view: currentView,
        sortBy: "createdAt",
        sortOrder: "desc",
      };

      console.log("Fetching contacts with params:", params);

      const response = await contactsAPI.getContacts(params);

      if (response.success) {
        setContacts(response.contacts);
        setPagination({
          page: response.page,
          limit: response.limit,
          total: response.total,
          pages: response.pages,
        });

        // Update filter options if available
        if (response.filters) {
          setFilterOptions(response.filters);
        }
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to fetch contacts",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
      toast({
        title: "Error",
        description: "Failed to load contacts. Please try again.",
        variant: "destructive",
      });

      // Set empty array
      setContacts([]);
    } finally {
      setLoading(false);
    }
  }, [
    pagination.page,
    pagination.limit,
    searchTerm,
    filters,
    currentView,
    getBackendFilters,
    toast,
  ]);

  // Fetch contacts on component mount and when dependencies change
  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  // Event handlers
  const handleContactCreated = useCallback(
    async (newContact) => {
      try {
        const response = await contactsAPI.createContact(newContact);

        if (response.success) {
          toast({
            title: "Contact Created",
            description: `${response.contact.firstName} ${response.contact.lastName} has been created successfully.`,
          });
          setCreateDialogOpen(false);
          fetchContacts(); // Refresh the list
        } else {
          toast({
            title: "Error",
            description: response.message || "Failed to create contact",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error creating contact:", error);
        toast({
          title: "Error",
          description:
            error.response?.data?.message ||
            "Failed to create contact. Please try again.",
          variant: "destructive",
        });
      }
    },
    [toast, fetchContacts]
  );

  const handleContactUpdated = useCallback(
    async (updatedContact) => {
      try {
        console.log("Updating contact with data:", updatedContact);

        // Get the contact ID (handle both _id and id)
        const contactId = updatedContact._id || updatedContact.id;

        if (!contactId) {
          console.error("No contact ID found for update");
          toast({
            title: "Error",
            description: "Cannot update contact: No ID found",
            variant: "destructive",
          });
          return;
        }

        console.log("Updating contact ID:", contactId);

        // Remove internal fields before sending to backend
        const { _id, id, name, createdAt, updatedAt, ...cleanData } =
          updatedContact;

        const response = await contactsAPI.updateContact(contactId, cleanData);

        if (response.success) {
          toast({
            title: "Contact Updated",
            description: `${response.contact.firstName} ${response.contact.lastName} has been updated successfully.`,
          });
          setEditDialogOpen(false);
          setSelectedContact(null);
          fetchContacts();
        } else {
          toast({
            title: "Error",
            description: response.message || "Failed to update contact",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error updating contact:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        });
        toast({
          title: "Error",
          description:
            error.response?.data?.message ||
            "Failed to update contact. Please try again.",
          variant: "destructive",
        });
      }
    },
    [toast, fetchContacts]
  );

  const handleContactEdit = useCallback((contact) => {
    setSelectedContact(contact);
    setEditDialogOpen(true);
  }, []);

  const handleContactDelete = useCallback(
    async (contact) => {
      if (window.confirm(`Delete ${contact.firstName} ${contact.lastName}?`)) {
        try {
          const contactId = contact._id || contact.id;
          const response = await contactsAPI.deleteContact(contactId);

          if (response.success) {
            toast({
              title: "Contact Deleted",
              description: `${contact.firstName} ${contact.lastName} has been deleted.`,
            });
            fetchContacts();
          } else {
            toast({
              title: "Error",
              description: response.message || "Failed to delete contact",
              variant: "destructive",
            });
          }
        } catch (error) {
          console.error("Error deleting contact:", error);
          toast({
            title: "Error",
            description:
              error.response?.data?.message ||
              "Failed to delete contact. Please try again.",
            variant: "destructive",
          });
        }
      }
    },
    [toast, fetchContacts]
  );

  const handleViewContact = useCallback((contact) => {
    setSelectedContact(contact);
    setViewDialogOpen(true);
  }, []);

  const handleContactEmail = useCallback(
    (contact) => {
      toast({
        title: "Email Prepared",
        description: `Email composer opened for ${contact.firstName} ${contact.lastName}.`,
      });
    },
    [toast]
  );

  // Bulk action handlers
  const handleBulkUpdate = useCallback(
    async (contactIds, updates) => {
      try {
        console.log("Bulk updating contacts:", contactIds, updates);

        // Clean updates - remove 'no-change' values
        const cleanUpdates = {};
        Object.keys(updates).forEach((key) => {
          if (updates[key] && updates[key] !== "no-change") {
            cleanUpdates[key] = updates[key];
          }
        });

        if (Object.keys(cleanUpdates).length === 0) {
          toast({
            title: "No Changes",
            description: "No updates were selected.",
            variant: "default",
          });
          return;
        }

        const response = await contactsAPI.bulkUpdateContacts(
          contactIds,
          cleanUpdates
        );

        if (response.success) {
          setSelectedContacts([]);
          toast({
            title: "Contacts Updated",
            description:
              response.message ||
              `${contactIds.length} contacts have been updated successfully.`,
          });
          fetchContacts();
        } else {
          toast({
            title: "Error",
            description: response.message || "Failed to update contacts",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error bulk updating contacts:", error);
        toast({
          title: "Error",
          description:
            error.response?.data?.message ||
            "Failed to update contacts. Please try again.",
          variant: "destructive",
        });
      }
    },
    [toast, fetchContacts]
  );

  const handleBulkDelete = useCallback(
    async (contactIds) => {
      if (
        confirm(
          `Are you sure you want to delete ${contactIds.length} contacts?`
        )
      ) {
        try {
          const response = await contactsAPI.bulkDeleteContacts(contactIds);

          if (response.success) {
            setSelectedContacts([]);
            toast({
              title: "Contacts Deleted",
              description:
                response.message ||
                `${contactIds.length} contacts have been deleted.`,
            });
            fetchContacts();
          } else {
            toast({
              title: "Error",
              description: response.message || "Failed to delete contacts",
              variant: "destructive",
            });
          }
        } catch (error) {
          console.error("Error bulk deleting contacts:", error);
          toast({
            title: "Error",
            description:
              error.response?.data?.message ||
              "Failed to delete contacts. Please try again.",
            variant: "destructive",
          });
        }
      }
    },
    [toast, fetchContacts]
  );

  // Handle view change
  const handleViewChange = useCallback((view) => {
    setCurrentView(view);
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  // Handle filter change
  const handleFiltersChange = useCallback((newFilters) => {
    setFilters(newFilters);
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  // Handle search
  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  // Handle refresh
  const handleRefresh = useCallback(() => {
    fetchContacts();
  }, [fetchContacts]);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Contacts
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {loading ? "Loading..." : `${pagination.total} contact(s) found`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={loading}>
            <RefreshCw
              className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Button
            onClick={() => setCreateDialogOpen(true)}
            className="bg-blue-600 hover:bg-blue-700"
            disabled={loading}
          >
            <Plus className="w-4 h-4 mr-2" /> Create Contact
          </Button>
        </div>
      </div>

      {/* View Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <ContactsViewFilters
          currentView={currentView}
          onViewChange={handleViewChange}
        />
      </div>

      {/* Search and Filters Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search contacts by name, email, or company..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
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
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <ContactsFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              contacts={contacts}
              filterOptions={filterOptions}
            />
          </div>
        )}
      </div>

      {/* Bulk Actions */}
      {selectedContacts.length > 0 && (
        <ContactsBulkActions
          selectedContacts={selectedContacts}
          onBulkDelete={handleBulkDelete}
          onBulkUpdate={handleBulkUpdate}
          currentFilters={filters}
        />
      )}

      {/* Contacts Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <ContactsTable
          contacts={contacts}
          loading={loading}
          selectedContacts={selectedContacts}
          onContactSelect={setSelectedContacts}
          onContactEdit={handleContactEdit}
          onContactDelete={handleContactDelete}
          onContactView={handleViewContact}
          onContactEmail={handleContactEmail}
        />
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Showing page {pagination.page} of {pagination.pages}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  page: Math.max(1, prev.page - 1),
                }))
              }
              disabled={pagination.page === 1 || loading}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  page: Math.min(pagination.pages, prev.page + 1),
                }))
              }
              disabled={pagination.page === pagination.pages || loading}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Dialogs */}
      <CreateContactDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onContactCreated={handleContactCreated}
      />

      <ViewContactDialog
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        contact={selectedContact}
      />

      <EditContactDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onContactUpdated={handleContactUpdated}
        initialData={selectedContact}
      />
    </div>
  );
};

export default ContactsPageContent;
