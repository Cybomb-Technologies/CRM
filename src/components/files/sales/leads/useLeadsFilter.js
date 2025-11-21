// src/hooks/useLeadsFilter.js
import { useMemo } from 'react';

export const useLeadsFilter = (leads, filters, currentView) => {
  return useMemo(() => {
    let filteredLeads = [...leads];

    // Apply view filters
    switch (currentView) {
      case 'all':
        break;
      case 'locked':
        filteredLeads = filteredLeads.filter(lead => lead.isLocked);
        break;
      case 'converted':
        filteredLeads = filteredLeads.filter(lead => lead.isConverted);
        break;
      case 'junk':
        filteredLeads = filteredLeads.filter(lead => lead.isJunk);
        break;
      case 'my-converted':
        filteredLeads = filteredLeads.filter(lead => lead.isConverted);
        break;
      case 'my-leads':
        // Assuming current user logic here
        filteredLeads = filteredLeads.filter(lead => !lead.isConverted);
        break;
      case 'not-qualified':
        filteredLeads = filteredLeads.filter(lead => !lead.isQualified);
        break;
      case 'open':
        filteredLeads = filteredLeads.filter(lead => 
          ['New', 'Contacted', 'Qualified'].includes(lead.leadStatus)
        );
        break;
      case 'recently-created':
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        filteredLeads = filteredLeads.filter(lead => 
          new Date(lead.createdAt) > oneWeekAgo
        );
        break;
      case 'recently-modified':
        const twoDaysAgo = new Date();
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
        filteredLeads = filteredLeads.filter(lead => 
          new Date(lead.updatedAt) > twoDaysAgo
        );
        break;
      case 'today':
        const today = new Date().toDateString();
        filteredLeads = filteredLeads.filter(lead => 
          new Date(lead.createdAt).toDateString() === today
        );
        break;
      case 'unread':
        filteredLeads = filteredLeads.filter(lead => lead.isUnread);
        break;
      case 'unsubscribed':
        filteredLeads = filteredLeads.filter(lead => lead.isUnsubscribed);
        break;
      default:
        break;
    }

    // Apply custom filters
    if (filters.status) {
      filteredLeads = filteredLeads.filter(lead => lead.leadStatus === filters.status);
    }
    if (filters.source) {
      filteredLeads = filteredLeads.filter(lead => lead.leadSource === filters.source);
    }
    if (filters.industry) {
      filteredLeads = filteredLeads.filter(lead => lead.industry === filters.industry);
    }
    if (filters.dateRange) {
      const now = new Date();
      let startDate;
      
      switch (filters.dateRange) {
        case 'today':
          startDate = new Date(now.setHours(0, 0, 0, 0));
          break;
        case 'yesterday':
          startDate = new Date(now);
          startDate.setDate(startDate.getDate() - 1);
          startDate.setHours(0, 0, 0, 0);
          const endDate = new Date(startDate);
          endDate.setDate(endDate.getDate() + 1);
          filteredLeads = filteredLeads.filter(lead => {
            const leadDate = new Date(lead.createdAt);
            return leadDate >= startDate && leadDate < endDate;
          });
          break;
        case 'this-week':
          startDate = new Date(now);
          startDate.setDate(startDate.getDate() - startDate.getDay());
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'last-week':
          startDate = new Date(now);
          startDate.setDate(startDate.getDate() - startDate.getDay() - 7);
          startDate.setHours(0, 0, 0, 0);
          const weekEnd = new Date(startDate);
          weekEnd.setDate(weekEnd.getDate() + 7);
          filteredLeads = filteredLeads.filter(lead => {
            const leadDate = new Date(lead.createdAt);
            return leadDate >= startDate && leadDate < weekEnd;
          });
          break;
        case 'this-month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case 'last-month':
          startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
          const monthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
          filteredLeads = filteredLeads.filter(lead => {
            const leadDate = new Date(lead.createdAt);
            return leadDate >= startDate && leadDate <= monthEnd;
          });
          break;
      }
      
      if (filters.dateRange !== 'yesterday' && filters.dateRange !== 'last-week' && filters.dateRange !== 'last-month') {
        filteredLeads = filteredLeads.filter(lead => new Date(lead.createdAt) >= startDate);
      }
    }

    return filteredLeads;
  }, [leads, filters, currentView]);
};