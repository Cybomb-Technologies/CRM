import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const SalesOrdersViewFilters = ({ currentView, onViewChange, salesOrders = [] }) => {
  // Calculate counts for each view
  const calculateCounts = (orders) => {
    const today = new Date();
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    return {
      all: orders.length,
      draft: orders.filter(o => o.status === 'Draft').length,
      'pending-approval': orders.filter(o => o.status === 'Pending Approval').length,
      approved: orders.filter(o => o.status === 'Approved').length,
      'in-progress': orders.filter(o => o.status === 'In Progress').length,
      shipped: orders.filter(o => o.status === 'Shipped').length,
      completed: orders.filter(o => o.status === 'Completed').length,
      cancelled: orders.filter(o => o.status === 'Cancelled').length,
      'on-hold': orders.filter(o => o.status === 'On Hold').length,
      overdue: orders.filter(o => {
        if (!o.dueDate) return false;
        const dueDate = new Date(o.dueDate);
        return dueDate < today && 
               !['Completed', 'Cancelled', 'Shipped'].includes(o.status);
      }).length,
      urgent: orders.filter(o => o.isUrgent).length,
      'high-value': orders.filter(o => o.totalAmount && o.totalAmount > 5000).length,
      recent: orders.filter(o => o.createdAt && new Date(o.createdAt) > oneWeekAgo).length,
    };
  };

  const counts = calculateCounts(salesOrders);

  const viewOptions = [
    { id: 'all', label: 'All Orders', count: counts.all },
    { id: 'draft', label: 'Draft', color: 'bg-gray-500', count: counts.draft },
    { id: 'pending-approval', label: 'Pending Approval', color: 'bg-yellow-500', count: counts['pending-approval'] },
    { id: 'approved', label: 'Approved', color: 'bg-blue-500', count: counts.approved },
    { id: 'in-progress', label: 'In Progress', color: 'bg-purple-500', count: counts['in-progress'] },
    { id: 'shipped', label: 'Shipped', color: 'bg-green-500', count: counts.shipped },
    { id: 'completed', label: 'Completed', color: 'bg-green-500', count: counts.completed },
    { id: 'cancelled', label: 'Cancelled', color: 'bg-red-500', count: counts.cancelled },
    { id: 'on-hold', label: 'On Hold', color: 'bg-orange-500', count: counts['on-hold'] },
    { id: 'overdue', label: 'Overdue', color: 'bg-red-500', count: counts.overdue },
    { id: 'urgent', label: 'Urgent', color: 'bg-red-500', count: counts.urgent },
    { id: 'high-value', label: 'High Value', color: 'bg-indigo-500', count: counts['high-value'] },
    { id: 'recent', label: 'Recent', color: 'bg-blue-500', count: counts.recent },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {viewOptions.map((view) => (
        <Button
          key={view.id}
          variant={currentView === view.id ? "default" : "outline"}
          size="sm"
          onClick={() => onViewChange(view.id)}
          className="relative"
        >
          {view.label}
          {view.count > 0 && (
            <Badge 
              variant="secondary" 
              className="ml-2 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
            >
              {view.count}
            </Badge>
          )}
        </Button>
      ))}
    </div>
  );
};

export default SalesOrdersViewFilters;