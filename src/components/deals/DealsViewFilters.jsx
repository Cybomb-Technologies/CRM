import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const DealsViewFilters = ({ currentView, onViewChange }) => {
  const viewOptions = [
    { value: 'all', label: 'All Deals', description: 'View all deals across all stages' },
    { value: 'my-deals', label: 'My Deals', description: 'Deals assigned to me' },
    { value: 'high-value', label: 'High Value Deals', description: 'Deals worth $50,000 or more' },
    { value: 'closing-this-month', label: 'Closing This Month', description: 'Deals expected to close this month' },
    { value: 'stuck-deals', label: 'Stuck Deals', description: 'Deals not updated in 30+ days' },
    { value: 'qualification-stage', label: 'Qualification Stage', description: 'Deals in qualification phase' },
    { value: 'proposal-stage', label: 'Proposal Stage', description: 'Deals with proposals sent' },
    { value: 'negotiation-stage', label: 'Negotiation Stage', description: 'Deals in negotiation' },
    { value: 'closed-won', label: 'Closed Won', description: 'Successfully closed deals' },
    { value: 'closed-lost', label: 'Closed Lost', description: 'Unsuccessful deals' }
  ];

  const handleSaveView = () => {
    // Implementation for saving custom views
    console.log('Save view functionality');
  };

  const handleManageViews = () => {
    // Implementation for managing views
    console.log('Manage views functionality');
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div className="flex-1 max-w-md">
        <Select value={currentView} onValueChange={onViewChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select a view" />
          </SelectTrigger>
          <SelectContent>
            {viewOptions.map((view) => (
              <SelectItem key={view.value} value={view.value}>
                <div className="flex flex-col">
                  <span className="font-medium">{view.label}</span>
                  <span className="text-xs text-gray-500">{view.description}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={handleSaveView}>
          Save View
        </Button>
        
        <Button variant="outline" size="sm" onClick={handleManageViews}>
          Manage Views
        </Button>
      </div>
    </div>
  );
};

export default DealsViewFilters;