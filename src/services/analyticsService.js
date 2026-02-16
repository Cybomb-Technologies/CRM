import axios from 'axios';

const API_URL = 'http://localhost:5000/api/analytics';

const analyticsService = {
    getOrgOverview: async () => {
        const response = await axios.get(`${API_URL}/org-overview`);
        return response.data;
    },

    getLeadAnalytics: async () => {
        const response = await axios.get(`${API_URL}/leads`);
        return response.data;
    },

    getDealInsights: async () => {
        const response = await axios.get(`${API_URL}/deals`);
        return response.data;
    },

    getSalesTrend: async () => {
        const response = await axios.get(`${API_URL}/sales-trend`);
        return response.data;
    },

    getMarketingMetrics: async () => {
        const response = await axios.get(`${API_URL}/marketing`);
        return response.data;
    },

    getActivityStats: async () => {
        const response = await axios.get(`${API_URL}/activity`);
        return response.data;
    }
};

export default analyticsService;
