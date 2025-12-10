// src/components/files/sales/campaigns/campaignsService.js
import { campaignsAPI } from "./campaignsAPI";

export const campaignsService = {
  // Fetch all campaigns with optional filters
  fetchCampaigns: async (filters = {}) => {
    try {
      const response = await campaignsAPI.getCampaigns(filters);
      return {
        success: true,
        data: response.data,
        total: response.total,
        message: "Campaigns fetched successfully",
      };
    } catch (error) {
      console.error("Fetch campaigns error:", error);
      return {
        success: false,
        data: [],
        total: 0,
        message: error.message || "Failed to fetch campaigns",
      };
    }
  },

  // Fetch single campaign
  fetchCampaign: async (id) => {
    try {
      const response = await campaignsAPI.getCampaign(id);
      return {
        success: true,
        data: response.data,
        message: "Campaign fetched successfully",
      };
    } catch (error) {
      console.error("Fetch campaign error:", error);
      return {
        success: false,
        data: null,
        message: error.message || "Failed to fetch campaign",
      };
    }
  },

  // Create new campaign
  createCampaign: async (campaignData) => {
    try {
      const response = await campaignsAPI.createCampaign(campaignData);
      return {
        success: true,
        data: response.data,
        message: "Campaign created successfully",
      };
    } catch (error) {
      console.error("Create campaign error:", error);
      return {
        success: false,
        data: null,
        message: error.message || "Failed to create campaign",
      };
    }
  },

  // Update campaign
  updateCampaign: async (id, campaignData) => {
    try {
      const response = await campaignsAPI.updateCampaign(id, campaignData);
      return {
        success: true,
        data: response.data,
        message: "Campaign updated successfully",
      };
    } catch (error) {
      console.error("Update campaign error:", error);
      return {
        success: false,
        data: null,
        message: error.message || "Failed to update campaign",
      };
    }
  },

  // Delete campaign (archive)
  deleteCampaign: async (id) => {
    try {
      await campaignsAPI.deleteCampaign(id);
      return {
        success: true,
        message: "Campaign archived successfully",
      };
    } catch (error) {
      console.error("Delete campaign error:", error);
      return {
        success: false,
        message: error.message || "Failed to archive campaign",
      };
    }
  },

  // Add members to campaign
  addMembersToCampaign: async (campaignId, members) => {
    try {
      const response = await campaignsAPI.addMembersToCampaign(
        campaignId,
        members
      );
      return {
        success: true,
        data: response.data,
        message: `${members.length} members added to campaign`,
      };
    } catch (error) {
      console.error("Add members to campaign error:", error);
      return {
        success: false,
        message: error.message || "Failed to add members to campaign",
      };
    }
  },

  // Remove members from campaign
  removeMembersFromCampaign: async (campaignId, memberIds) => {
    try {
      const response = await campaignsAPI.removeMembersFromCampaign(
        campaignId,
        memberIds
      );
      return {
        success: true,
        data: response.data,
        message: `${memberIds.length} members removed from campaign`,
      };
    } catch (error) {
      console.error("Remove members from campaign error:", error);
      return {
        success: false,
        message: error.message || "Failed to remove members from campaign",
      };
    }
  },

  // Update member status
  updateMemberStatus: async (campaignId, memberId, status, value) => {
    try {
      const response = await campaignsAPI.updateMemberStatus(
        campaignId,
        memberId,
        status,
        value
      );
      return {
        success: true,
        data: response.data,
        message: `Member ${status} status updated`,
      };
    } catch (error) {
      console.error("Update member status error:", error);
      return {
        success: false,
        message: error.message || "Failed to update member status",
      };
    }
  },

  // Get campaign activities
  fetchCampaignActivities: async (campaignId, filters = {}) => {
    try {
      const response = await campaignsAPI.getCampaignActivities(
        campaignId,
        filters
      );
      return {
        success: true,
        data: response.data,
        total: response.total,
        message: "Campaign activities fetched successfully",
      };
    } catch (error) {
      console.error("Fetch campaign activities error:", error);
      return {
        success: false,
        data: [],
        total: 0,
        message: error.message || "Failed to fetch campaign activities",
      };
    }
  },

  // Add activity to campaign
  addActivityToCampaign: async (campaignId, activityData) => {
    try {
      const response = await campaignsAPI.addActivityToCampaign(
        campaignId,
        activityData
      );
      return {
        success: true,
        data: response.data,
        message: "Activity added to campaign",
      };
    } catch (error) {
      console.error("Add activity to campaign error:", error);
      return {
        success: false,
        message: error.message || "Failed to add activity to campaign",
      };
    }
  },

  // Update activity in campaign
  updateActivityInCampaign: async (campaignId, activityId, activityData) => {
    try {
      const response = await campaignsAPI.updateActivityInCampaign(
        campaignId,
        activityId,
        activityData
      );
      return {
        success: true,
        data: response.data,
        message: "Activity updated successfully",
      };
    } catch (error) {
      console.error("Update activity in campaign error:", error);
      return {
        success: false,
        message: error.message || "Failed to update activity",
      };
    }
  },

  // Delete activity from campaign
  deleteActivityFromCampaign: async (campaignId, activityId) => {
    try {
      await campaignsAPI.deleteActivityFromCampaign(campaignId, activityId);
      return {
        success: true,
        message: "Activity deleted from campaign",
      };
    } catch (error) {
      console.error("Delete activity from campaign error:", error);
      return {
        success: false,
        message: error.message || "Failed to delete activity",
      };
    }
  },

  // Get campaign analytics
  fetchCampaignAnalytics: async (campaignId) => {
    try {
      const response = await campaignsAPI.getCampaignAnalytics(campaignId);
      return {
        success: true,
        data: response.data,
        message: "Campaign analytics fetched successfully",
      };
    } catch (error) {
      console.error("Fetch campaign analytics error:", error);
      return {
        success: false,
        data: null,
        message: error.message || "Failed to fetch campaign analytics",
      };
    }
  },

  // Bulk operations
  bulkUpdateCampaigns: async (campaignIds, updates) => {
    try {
      const response = await campaignsAPI.bulkUpdateCampaigns(
        campaignIds,
        updates
      );
      return {
        success: true,
        data: response.data,
        message: response.message || `${campaignIds.length} campaigns updated`,
      };
    } catch (error) {
      console.error("Bulk update campaigns error:", error);
      return {
        success: false,
        message: error.message || "Failed to update campaigns",
      };
    }
  },

  bulkDeleteCampaigns: async (campaignIds) => {
    try {
      const response = await campaignsAPI.bulkDeleteCampaigns(campaignIds);
      return {
        success: true,
        data: response.data,
        message: response.message || `${campaignIds.length} campaigns archived`,
      };
    } catch (error) {
      console.error("Bulk delete campaigns error:", error);
      return {
        success: false,
        message: error.message || "Failed to archive campaigns",
      };
    }
  },

  bulkAddMembersToCampaigns: async (campaignIds, members) => {
    try {
      const response = await campaignsAPI.bulkAddMembersToCampaigns(
        campaignIds,
        members
      );
      return {
        success: true,
        data: response.data,
        message:
          response.message ||
          `Members added to ${campaignIds.length} campaigns`,
      };
    } catch (error) {
      console.error("Bulk add members to campaigns error:", error);
      return {
        success: false,
        message: error.message || "Failed to add members to campaigns",
      };
    }
  },
};
