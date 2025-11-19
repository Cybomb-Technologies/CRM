// src/components/contacts/ContactsPageContent.jsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Filter } from 'lucide-react';
import CreateContactDialog from '@/components/contacts/CreateContactDialog';
import ViewContactDialog from '@/components/contacts/ViewContactDialog';
import EditContactDialog from '@/components/contacts/EditContactDialog';
import ContactsTable from '@/components/contacts/ContactsTable';
import ContactsFilters from '@/components/contacts/ContactsFilters';
import ContactsViewFilters from '@/components/contacts/ContactsViewFilters';
import ContactsBulkActions from '@/components/contacts/ContactsBulkActions';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/components/ui/use-toast';

const ContactsPageContent = () => {
  const { data, loading, fetchContacts, bulkUpdateContacts, bulkDeleteContacts, addDataItem } = useData();
  const { toast } = useToast();
  
  // State management
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentView, setCurrentView] = useState('all');
  const [filters, setFilters] = useState({ 
    account: '', 
    department: '', 
    leadSource: '',
    dateRange: '' 
  });
  const [showFilters, setShowFilters] = useState(false);

  // Get contacts from data context
  const contacts = data.contacts || [];

  // Fetch contacts on component mount
  useEffect(() => { 
    fetchContacts(); 
  }, [fetchContacts]);

  // Filter logic
  const filteredContacts = useMemo(() => {
    if (!contacts || !Array.isArray(contacts)) return [];
    
    let filtered = [...contacts];

    // Apply view filters
    switch (currentView) {
      case 'all':
        break;
      case 'recently-created':
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        filtered = filtered.filter(contact => 
          contact.createdAt && new Date(contact.createdAt) > oneWeekAgo
        );
        break;
      case 'recently-modified':
        const twoDaysAgo = new Date();
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
        filtered = filtered.filter(contact => 
          contact.updatedAt && new Date(contact.updatedAt) > twoDaysAgo
        );
        break;
      case 'today':
        const today = new Date().toDateString();
        filtered = filtered.filter(contact => 
          contact.createdAt && new Date(contact.createdAt).toDateString() === today
        );
        break;
      case 'converted':
        filtered = filtered.filter(contact => contact.convertedFromLead);
        break;
      default:
        break;
    }

    // Apply custom filters
    if (filters.account) {
      filtered = filtered.filter(contact => contact.accountName === filters.account);
    }
    if (filters.department) {
      filtered = filtered.filter(contact => contact.department === filters.department);
    }
    if (filters.leadSource) {
      filtered = filtered.filter(contact => contact.leadSource === filters.leadSource);
    }
    if (filters.dateRange) {
      const now = new Date();
      let startDate;
      
      switch (filters.dateRange) {
        case 'today':
          startDate = new Date(now.setHours(0, 0, 0, 0));
          filtered = filtered.filter(contact => 
            contact.createdAt && new Date(contact.createdAt) >= startDate
          );
          break;
        case 'this-week':
          startDate = new Date(now);
          startDate.setDate(startDate.getDate() - startDate.getDay());
          startDate.setHours(0, 0, 0, 0);
          filtered = filtered.filter(contact => 
            contact.createdAt && new Date(contact.createdAt) >= startDate
          );
          break;
        case 'this-month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          filtered = filtered.filter(contact => 
            contact.createdAt && new Date(contact.createdAt) >= startDate
          );
          break;
      }
    }

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(contact => {
        if (!contact) return false;
        return (
          (contact.firstName && contact.firstName.toLowerCase().includes(searchLower)) ||
          (contact.lastName && contact.lastName.toLowerCase().includes(searchLower)) ||
          (contact.name && contact.name.toLowerCase().includes(searchLower)) ||
          (contact.email && contact.email.toLowerCase().includes(searchLower)) ||
          (contact.phone && contact.phone.toLowerCase().includes(searchLower)) ||
          (contact.accountName && contact.accountName.toLowerCase().includes(searchLower))
        );
      });
    }

    return filtered;
  }, [contacts, currentView, filters, searchTerm]);

  // Event handlers
  const handleContactCreated = useCallback((newContact) => {
    console.log('Contact created in ContactsPage:', newContact);
    
    // Add the contact to the data context
    addDataItem('contacts', newContact);
    
    toast({ 
      title: "Contact Created", 
      description: `${newContact.firstName} ${newContact.lastName} has been created successfully.` 
    });
    setCreateDialogOpen(false);
    
    // Refresh the contacts list
    fetchContacts();
  }, [toast, fetchContacts, addDataItem]);

  const handleContactUpdated = useCallback((updatedContact) => {
    toast({ 
      title: "Contact Updated", 
      description: `${updatedContact.firstName} ${updatedContact.lastName} has been updated successfully.` 
    });
    setEditDialogOpen(false);
    setSelectedContact(null);
    fetchContacts();
  }, [toast, fetchContacts]);

  const handleContactEdit = useCallback((contact) => { 
    setSelectedContact(contact); 
    setEditDialogOpen(true); 
  }, []);

  const handleContactDelete = useCallback((contact) => {
    if (window.confirm(`Delete ${contact.firstName} ${contact.lastName}?`)) {
      bulkDeleteContacts([contact.id]);
      toast({ 
        title: "Contact Deleted", 
        description: `${contact.firstName} ${contact.lastName} has been deleted.` 
      });
    }
  }, [bulkDeleteContacts, toast]);

  const handleViewContact = useCallback((contact) => { 
    setSelectedContact(contact); 
    setViewDialogOpen(true); 
  }, []);

  const handleContactEmail = useCallback((contact) => {
    toast({
      title: "Email Prepared",
      description: `Email composer opened for ${contact.firstName} ${contact.lastName}.`
    });
  }, [toast]);

  // Bulk action handlers
  const handleBulkUpdate = useCallback((contactIds, updates) => {
    bulkUpdateContacts(contactIds, updates);
    setSelectedContacts([]);
    toast({
      title: "Contacts Updated",
      description: `${contactIds.length} contacts have been updated successfully.`
    });
    fetchContacts();
  }, [bulkUpdateContacts, toast, fetchContacts]);

  const handleBulkDelete = useCallback((contactIds) => {
    if (confirm(`Are you sure you want to delete ${contactIds.length} contacts?`)) {
      bulkDeleteContacts(contactIds);
      setSelectedContacts([]);
      toast({
        title: "Contacts Deleted",
        description: `${contactIds.length} contacts have been deleted.`
      });
      fetchContacts();
    }
  }, [bulkDeleteContacts, toast, fetchContacts]);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Contacts</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {filteredContacts.length} contact(s) found
          </p>
        </div>
        <Button 
          onClick={() => setCreateDialogOpen(true)} 
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" /> Create Contact
        </Button>
      </div>

      {/* View Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <ContactsViewFilters 
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
              placeholder="Search contacts by name, email, or company..." 
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
            <ContactsFilters 
              filters={filters} 
              onFiltersChange={setFilters} 
              contacts={contacts}
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
        />
      )}

      {/* Contacts Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <ContactsTable 
          contacts={filteredContacts} 
          loading={loading} 
          selectedContacts={selectedContacts}
          onContactSelect={setSelectedContacts}
          onContactEdit={handleContactEdit} 
          onContactDelete={handleContactDelete} 
          onContactView={handleViewContact}
          onContactEmail={handleContactEmail}
        />
      </div>

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