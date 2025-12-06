import contactsAPI from "./contactsAPI";
import { useToast } from "@/components/ui/use-toast";

// Helper function to convert array of objects to CSV
const convertToCSV = (contacts) => {
  if (!contacts || contacts.length === 0) return "";

  // Get all unique keys from all contacts
  const headers = new Set();
  contacts.forEach((contact) => {
    Object.keys(contact).forEach((key) => {
      if (contact[key] !== null && contact[key] !== undefined) {
        headers.add(key);
      }
    });
  });

  const headerArray = Array.from(headers);

  // Create CSV rows
  const rows = contacts.map((contact) => {
    return headerArray
      .map((header) => {
        let value = contact[header] || "";

        // Convert to string if it's not already
        if (typeof value !== "string") {
          value = String(value);
        }

        // Handle special characters for CSV
        if (
          value.includes(",") ||
          value.includes('"') ||
          value.includes("\n") ||
          value.includes("\r")
        ) {
          value = `"${value.replace(/"/g, '""')}"`;
        }

        return value;
      })
      .join(",");
  });

  // Combine headers and rows
  return [headerArray.join(","), ...rows].join("\n");
};

// Service functions for contacts
export const contactsService = {
  // Fetch contacts with filters
  fetchContacts: async (params = {}) => {
    try {
      const result = await contactsAPI.getAllContacts(params);
      return {
        success: true,
        data: result.data,
        pagination: result.pagination,
        filters: result.filters,
        stats: result.stats,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch contacts",
        error: error,
      };
    }
  },

  // Create contact
  createContact: async (contactData) => {
    try {
      const result = await contactsAPI.createContact(contactData);
      return {
        success: true,
        data: result.data,
        message: result.message || "Contact created successfully",
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to create contact",
        errors: error.response?.data?.errors,
        error: error,
      };
    }
  },

  // Update contact - FIXED
  updateContact: async (id, contactData) => {
    try {
      // Ensure required fields are present
      if (!contactData.firstName || !contactData.lastName) {
        return {
          success: false,
          message: "First name and last name are required",
        };
      }

      // Clean up the data before sending
      const cleanedData = { ...contactData };

      // Remove React-specific properties that might be in the object
      delete cleanedData._id;
      delete cleanedData.id;
      delete cleanedData.createdAt;
      delete cleanedData.createdBy;
      delete cleanedData.__v;

      const result = await contactsAPI.updateContact(id, cleanedData);
      return {
        success: true,
        data: result.data,
        message: result.message || "Contact updated successfully",
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update contact",
        errors: error.response?.data?.errors,
        error: error,
      };
    }
  },

  // Delete contact
  deleteContact: async (id) => {
    try {
      const result = await contactsAPI.deleteContact(id);
      return {
        success: true,
        data: result.data,
        message: result.message || "Contact deleted successfully",
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to delete contact",
        error: error,
      };
    }
  },

  // Bulk delete contacts
  bulkDeleteContacts: async (contactIds) => {
    try {
      const result = await contactsAPI.bulkDeleteContacts(contactIds);
      return {
        success: true,
        data: result.data,
        message: result.message || "Contacts deleted successfully",
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to delete contacts",
        error: error,
      };
    }
  },

  // Bulk update contacts
  bulkUpdateContacts: async (contactIds, updates) => {
    try {
      const result = await contactsAPI.bulkUpdateContacts(contactIds, updates);
      return {
        success: true,
        data: result.data,
        message: result.message || "Contacts updated successfully",
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update contacts",
        error: error,
      };
    }
  },

  // Search contacts
  searchContacts: async (query, limit = 10) => {
    try {
      const result = await contactsAPI.searchContacts(query, limit);
      return {
        success: true,
        data: result.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to search contacts",
        error: error,
      };
    }
  },

  // Get filter values
  getFilterValues: async () => {
    try {
      const result = await contactsAPI.getFilterValues();
      return {
        success: true,
        data: result.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to get filter values",
        error: error,
      };
    }
  },

  // Get contact stats
  getContactStats: async () => {
    try {
      const result = await contactsAPI.getContactStats();
      return {
        success: true,
        data: result.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to get contact stats",
        error: error,
      };
    }
  },

  // Convert lead to contact
  convertLeadToContact: async (
    leadData,
    accountData = null,
    dealData = null
  ) => {
    try {
      const result = await contactsAPI.convertLeadToContact(
        leadData,
        accountData,
        dealData
      );
      return {
        success: true,
        data: result.data,
        message: result.message || "Lead converted to contact successfully",
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to convert lead to contact",
        error: error,
      };
    }
  },

  // Sync contact from lead
  syncContactFromLead: async (contactId, leadData) => {
    try {
      const result = await contactsAPI.syncContactFromLead(contactId, leadData);
      return {
        success: true,
        data: result.data,
        message: result.message || "Contact synced from lead successfully",
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to sync contact from lead",
        error: error,
      };
    }
  },

  // Merge contacts
  mergeContacts: async (
    primaryContactId,
    duplicateContactIds,
    mergeFields = {}
  ) => {
    try {
      const result = await contactsAPI.mergeContacts(
        primaryContactId,
        duplicateContactIds,
        mergeFields
      );
      return {
        success: true,
        data: result.data,
        message: result.message || "Contacts merged successfully",
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to merge contacts",
        error: error,
      };
    }
  },

  // Export contacts - CSV only
  exportContacts: async (format = "csv", filters = {}) => {
    try {
      console.log(
        "Exporting contacts with format:",
        format,
        "filters:",
        filters
      );

      // Get contacts data from API
      const result = await contactsAPI.exportContacts(format, filters);

      // Extract contacts from response
      let contacts = [];
      if (result.success && result.data) {
        contacts = result.data;
      } else if (result.contacts) {
        contacts = result.contacts;
      } else if (Array.isArray(result)) {
        contacts = result;
      }

      if (contacts.length === 0) {
        return {
          success: false,
          message: "No contacts found to export",
        };
      }

      console.log(`Exporting ${contacts.length} contacts as ${format}`);

      if (format === "csv") {
        // Convert contacts to CSV
        const csvData = convertToCSV(contacts);

        // Handle CSV download
        const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;

        // Create filename with timestamp
        const timestamp = new Date()
          .toISOString()
          .slice(0, 19)
          .replace(/:/g, "-");
        link.download = `contacts_export_${timestamp}.csv`;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        return {
          success: true,
          message: `${contacts.length} contacts exported as CSV successfully`,
        };
      } else if (format === "json") {
        // Handle JSON download
        const jsonString = JSON.stringify(contacts, null, 2);
        const blob = new Blob([jsonString], { type: "application/json" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;

        const timestamp = new Date()
          .toISOString()
          .slice(0, 19)
          .replace(/:/g, "-");
        link.download = `contacts_export_${timestamp}.json`;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        return {
          success: true,
          message: `${contacts.length} contacts exported as JSON successfully`,
        };
      }

      // Default to CSV if format not recognized
      const csvData = convertToCSV(contacts);
      const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      const timestamp = new Date()
        .toISOString()
        .slice(0, 19)
        .replace(/:/g, "-");
      link.download = `contacts_export_${timestamp}.csv`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      return {
        success: true,
        message: `${contacts.length} contacts exported as CSV successfully`,
      };
    } catch (error) {
      console.error("Export contacts error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to export contacts",
        error: error,
      };
    }
  },

  // Import contacts
  importContacts: async (contacts, overwrite = false) => {
    try {
      const result = await contactsAPI.importContacts(contacts, overwrite);
      return {
        success: true,
        data: result.data,
        message: result.message || "Contacts imported successfully",
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to import contacts",
        error: error,
      };
    }
  },
};

// Hook for using contacts service with toast notifications
export const useContactsService = () => {
  const { toast } = useToast();

  const withToast = async (serviceCall, successMessage, errorMessage) => {
    try {
      const result = await serviceCall();

      if (result.success) {
        toast({
          title: "Success",
          description: successMessage || result.message,
          variant: "default",
        });
      } else {
        toast({
          title: "Error",
          description: errorMessage || result.message,
          variant: "destructive",
        });
      }

      return result;
    } catch (error) {
      toast({
        title: "Error",
        description: errorMessage || "An unexpected error occurred",
        variant: "destructive",
      });
      return {
        success: false,
        message: "An unexpected error occurred",
        error,
      };
    }
  };

  return {
    fetchContacts: (params) =>
      withToast(
        () => contactsService.fetchContacts(params),
        "Contacts loaded successfully"
      ),

    createContact: (contactData) =>
      withToast(
        () => contactsService.createContact(contactData),
        "Contact created successfully"
      ),

    updateContact: (id, contactData) =>
      withToast(
        () => contactsService.updateContact(id, contactData),
        "Contact updated successfully"
      ),

    deleteContact: (id) =>
      withToast(
        () => contactsService.deleteContact(id),
        "Contact deleted successfully"
      ),

    bulkDeleteContacts: (contactIds) =>
      withToast(
        () => contactsService.bulkDeleteContacts(contactIds),
        "Contacts deleted successfully"
      ),

    bulkUpdateContacts: (contactIds, updates) =>
      withToast(
        () => contactsService.bulkUpdateContacts(contactIds, updates),
        "Contacts updated successfully"
      ),

    searchContacts: (query, limit) =>
      withToast(
        () => contactsService.searchContacts(query, limit),
        "Search completed successfully"
      ),

    getFilterValues: () =>
      withToast(
        () => contactsService.getFilterValues(),
        "Filter values loaded successfully"
      ),

    getContactStats: () =>
      withToast(
        () => contactsService.getContactStats(),
        "Contact statistics loaded successfully"
      ),

    exportContacts: (format, filters) =>
      withToast(
        () => contactsService.exportContacts(format, filters),
        "Contacts exported successfully"
      ),

    importContacts: (contacts, overwrite) =>
      withToast(
        () => contactsService.importContacts(contacts, overwrite),
        "Contacts imported successfully"
      ),

    convertLeadToContact: (leadData, accountData, dealData) =>
      withToast(
        () =>
          contactsService.convertLeadToContact(leadData, accountData, dealData),
        "Lead converted to contact successfully"
      ),

    syncContactFromLead: (contactId, leadData) =>
      withToast(
        () => contactsService.syncContactFromLead(contactId, leadData),
        "Contact synced from lead successfully"
      ),

    mergeContacts: (primaryContactId, duplicateContactIds, mergeFields) =>
      withToast(
        () =>
          contactsService.mergeContacts(
            primaryContactId,
            duplicateContactIds,
            mergeFields
          ),
        "Contacts merged successfully"
      ),
  };
};

export default contactsService;
