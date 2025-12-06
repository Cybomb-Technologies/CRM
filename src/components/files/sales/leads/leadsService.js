import { leadsAPI } from "./leadsAPI";

export const leadsService = {
  // Fetch all leads with optional filters
  fetchLeads: async (filters = {}) => {
    try {
      const response = await leadsAPI.getLeads(filters);
      return {
        success: true,
        data: response.data,
        message: "Leads fetched successfully",
      };
    } catch (error) {
      console.error("Fetch leads error:", error);
      return {
        success: false,
        data: [],
        message: error.message || "Failed to fetch leads",
      };
    }
  },

  // Fetch single lead
  fetchLead: async (id) => {
    try {
      const response = await leadsAPI.getLead(id);
      return {
        success: true,
        data: response.data,
        message: "Lead fetched successfully",
      };
    } catch (error) {
      console.error("Fetch lead error:", error);
      return {
        success: false,
        data: null,
        message: error.message || "Failed to fetch lead",
      };
    }
  },

  // Create new lead
  createLead: async (leadData) => {
    try {
      // Handle image file upload
      const dataToSend = { ...leadData };

      // If image is a File object, it will be handled by the API
      // Remove any non-serializable properties
      if (dataToSend.image && !(dataToSend.image instanceof File)) {
        // If it's not a File, it might be a string URL from existing data
        // We don't need to send it back for creation
        delete dataToSend.image;
      }

      const response = await leadsAPI.createLead(dataToSend);
      return {
        success: true,
        data: response.data,
        message: "Lead created successfully",
      };
    } catch (error) {
      console.error("Create lead error:", error);
      return {
        success: false,
        data: null,
        message: error.message || "Failed to create lead",
      };
    }
  },

  // Update lead
  updateLead: async (id, leadData) => {
    try {
      const dataToSend = { ...leadData };

      // Handle image properly - if it's a File, keep it for upload
      // If removeImage is true, ensure it's sent
      if (
        dataToSend.image &&
        !(dataToSend.image instanceof File) &&
        !dataToSend.removeImage
      ) {
        // If it's not a File and we're not removing it, it might be existing image data
        // We don't need to send it in the update
        delete dataToSend.image;
      }

      const response = await leadsAPI.updateLead(id, dataToSend);
      return {
        success: true,
        data: response.data,
        message: "Lead updated successfully",
      };
    } catch (error) {
      console.error("Update lead error:", error);
      return {
        success: false,
        data: null,
        message: error.message || "Failed to update lead",
      };
    }
  },

  // Delete lead
  deleteLead: async (id) => {
    try {
      await leadsAPI.deleteLead(id);
      return {
        success: true,
        message: "Lead deleted successfully",
      };
    } catch (error) {
      console.error("Delete lead error:", error);
      return {
        success: false,
        message: error.message || "Failed to delete lead",
      };
    }
  },

  // Bulk operations
  bulkUpdateLeads: async (leadIds, updates) => {
    try {
      const response = await leadsAPI.bulkUpdateLeads(leadIds, updates);
      return {
        success: true,
        data: response.data,
        message:
          response.message || `${leadIds.length} leads updated successfully`,
      };
    } catch (error) {
      console.error("Bulk update leads error:", error);
      return {
        success: false,
        message: error.message || "Failed to update leads",
      };
    }
  },

  bulkDeleteLeads: async (leadIds) => {
    try {
      const response = await leadsAPI.bulkDeleteLeads(leadIds);
      return {
        success: true,
        message:
          response.message || `${leadIds.length} leads deleted successfully`,
      };
    } catch (error) {
      console.error("Bulk delete leads error:", error);
      return {
        success: false,
        message: error.message || "Failed to delete leads",
      };
    }
  },

  // Lead conversion - FIXED: Actually creates contact
  convertLead: async (leadId, dealData = {}) => {
    try {
      console.log("Service: Converting lead", leadId);
      const response = await leadsAPI.convertLead(leadId, dealData);
      return {
        success: true,
        data: response.data,
        message: response.message || "Lead converted to contact successfully",
      };
    } catch (error) {
      console.error("Convert lead error:", error);
      return {
        success: false,
        message: error.message || "Failed to convert lead to contact",
      };
    }
  },

  // Bulk convert leads - FIXED: Actually creates contacts
  bulkConvertLeads: async (leadIds) => {
    try {
      console.log("Service: Bulk converting leads", leadIds);
      const response = await leadsAPI.bulkConvertLeads(leadIds);
      return {
        success: true,
        data: response.data,
        message:
          response.message ||
          `${leadIds.length} leads converted to contacts successfully`,
      };
    } catch (error) {
      console.error("Bulk convert leads error:", error);
      return {
        success: false,
        message: error.message || "Failed to convert leads to contacts",
      };
    }
  },

  // Sync lead to contact - FIXED: Actually syncs or creates contact
  syncLeadToContact: async (leadId) => {
    try {
      console.log("Service: Syncing lead to contact", leadId);
      const response = await leadsAPI.syncLeadToContact(leadId);
      return {
        success: true,
        data: response.data,
        message: response.message || "Lead synced to contact successfully",
      };
    } catch (error) {
      console.error("Sync lead error:", error);
      return {
        success: false,
        message: error.message || "Failed to sync lead to contact",
      };
    }
  },

  // Approve leads
  approveLeads: async (leadIds) => {
    try {
      const response = await leadsAPI.approveLeads(leadIds);
      return {
        success: true,
        data: response.data,
        message:
          response.message || `${leadIds.length} leads approved successfully`,
      };
    } catch (error) {
      console.error("Approve leads error:", error);
      return {
        success: false,
        message: error.message || "Failed to approve leads",
      };
    }
  },

  // Manage tags
  manageLeadTags: async (leadIds, tagsToAdd = [], tagsToRemove = []) => {
    try {
      const response = await leadsAPI.manageLeadTags(
        leadIds,
        tagsToAdd,
        tagsToRemove
      );
      return {
        success: true,
        data: response.data,
        message: response.message || `Tags updated for ${leadIds.length} leads`,
      };
    } catch (error) {
      console.error("Manage tags error:", error);
      return {
        success: false,
        message: error.message || "Failed to update tags",
      };
    }
  },

  // Deduplicate leads
  deduplicateLeads: async (criteria = ["email", "phone"]) => {
    try {
      const response = await leadsAPI.deduplicateLeads(criteria);
      return {
        success: true,
        data: response.data,
        message: response.message || "Deduplication completed",
      };
    } catch (error) {
      console.error("Deduplicate leads error:", error);
      return {
        success: false,
        message: error.message || "Failed to deduplicate leads",
      };
    }
  },

  // Add to campaign
  addLeadsToCampaign: async (leadIds, campaignId) => {
    try {
      const response = await leadsAPI.addLeadsToCampaign(leadIds, campaignId);
      return {
        success: true,
        data: response.data,
        message:
          response.message || `${leadIds.length} leads added to campaign`,
      };
    } catch (error) {
      console.error("Add to campaign error:", error);
      return {
        success: false,
        message: error.message || "Failed to add leads to campaign",
      };
    }
  },
};
