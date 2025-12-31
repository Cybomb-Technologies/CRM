import { casesAPI } from "./casesAPI";

export const casesService = {
    // Fetch all cases with optional filters
    fetchCases: async (filters = {}) => {
        try {
            const response = await casesAPI.getCases(filters);
            return {
                success: true,
                data: response.data,
                message: "Cases fetched successfully",
            };
        } catch (error) {
            console.error("Fetch cases error:", error);
            return {
                success: false,
                data: [],
                message: error.message || "Failed to fetch cases",
            };
        }
    },

    // Fetch single case
    fetchCase: async (id) => {
        try {
            const response = await casesAPI.getCase(id);
            return {
                success: true,
                data: response.data,
                message: "Case fetched successfully",
            };
        } catch (error) {
            console.error("Fetch case error:", error);
            return {
                success: false,
                data: null,
                message: error.message || "Failed to fetch case",
            };
        }
    },

    // Create new case
    createCase: async (caseData) => {
        try {
            const response = await casesAPI.createCase(caseData);
            return {
                success: true,
                data: response.data,
                message: "Case created successfully",
            };
        } catch (error) {
            console.error("Create case error:", error);
            return {
                success: false,
                data: null,
                message: error.message || "Failed to create case",
            };
        }
    },

    // Update case
    updateCase: async (id, caseData) => {
        try {
            const response = await casesAPI.updateCase(id, caseData);
            return {
                success: true,
                data: response.data,
                message: "Case updated successfully",
            };
        } catch (error) {
            console.error("Update case error:", error);
            return {
                success: false,
                data: null,
                message: error.message || "Failed to update case",
            };
        }
    },

    // Delete case
    deleteCase: async (id) => {
        try {
            await casesAPI.deleteCase(id);
            return {
                success: true,
                message: "Case deleted successfully",
            };
        } catch (error) {
            console.error("Delete case error:", error);
            return {
                success: false,
                message: error.message || "Failed to delete case",
            };
        }
    },

    // Bulk operations
    bulkUpdateCases: async (caseIds, updates) => {
        try {
            const response = await casesAPI.bulkUpdateCases(caseIds, updates);
            return {
                success: true,
                data: response.data,
                message:
                    response.message || `${caseIds.length} cases updated successfully`,
            };
        } catch (error) {
            console.error("Bulk update cases error:", error);
            return {
                success: false,
                message: error.message || "Failed to update cases",
            };
        }
    },

    bulkDeleteCases: async (caseIds) => {
        try {
            const response = await casesAPI.bulkDeleteCases(caseIds);
            return {
                success: true,
                message:
                    response.message || `${caseIds.length} cases deleted successfully`,
            };
        } catch (error) {
            console.error("Bulk delete cases error:", error);
            return {
                success: false,
                message: error.message || "Failed to delete cases",
            };
        }
    },
};
