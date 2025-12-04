// src/components/files/inventory/pricebooks/PriceBooksViewFilters.jsx
import React from 'react';
import { Button } from '@/components/ui/button';

const PriceBooksViewFilters = ({ currentView, onViewChange }) => {
  const viewOptions = [
    { id: 'all', label: 'All Price Books' },
    { id: 'active', label: 'Active' },
    { id: 'inactive', label: 'Inactive' },
    { id: 'pending', label: 'Pending' },
    { id: 'recent', label: 'Recently Created' },
    { id: 'default', label: 'Default' },
    { id: 'premium', label: 'Premium' },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {viewOptions.map((view) => (
        <Button
          key={view.id}
          variant={currentView === view.id ? "default" : "outline"}
          size="sm"
          onClick={() => onViewChange(view.id)}
          className={currentView === view.id ? "bg-blue-600 hover:bg-blue-700" : ""}
        >
          {view.label}
        </Button>
      ))}
    </div>
  );
};

export default PriceBooksViewFilters;