// src/components/leads/LeadsViewFilters.jsx
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const LeadsViewFilters = ({ currentView, onViewChange }) => {
  const viewOptions = [
    { value: 'all', label: 'All Leads' },
    { value: 'locked', label: 'All Locked Leads' },
    { value: 'converted', label: 'Converted Leads' },
    { value: 'junk', label: 'Junk Leads' },
    { value: 'my-converted', label: 'My Converted Leads' },
    { value: 'my-leads', label: 'My Leads' },
    { value: 'not-qualified', label: 'Not Qualified Leads' },
    { value: 'open', label: 'Open Leads' },
    { value: 'recently-created', label: 'Recently Created Leads' },
    { value: 'recently-modified', label: 'Recently Modified Leads' },
    { value: 'today', label: "Today's Leads" },
    { value: 'unread', label: 'Unread Leads' },
    { value: 'unsubscribed', label: 'Unsubscribed Leads' },
    { value: 'mailing-labels', label: 'Mailing Labels' }
  ];

  return (
    <div className="flex items-center gap-4">
      <div className="flex-1 max-w-xs">
        <Select value={currentView} onValueChange={onViewChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select a view" />
          </SelectTrigger>
          <SelectContent>
            {viewOptions.map((view) => (
              <SelectItem key={view.value} value={view.value}>
                {view.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <Button variant="outline" size="sm">
        Save View
      </Button>
      
      <Button variant="outline" size="sm">
        Manage Views
      </Button>
    </div>
  );
};

export default LeadsViewFilters;