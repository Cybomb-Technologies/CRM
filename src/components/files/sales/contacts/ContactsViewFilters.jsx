// src/components/contacts/ContactsViewFilters.jsx
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ContactsViewFilters = ({ currentView, onViewChange }) => {
  const viewOptions = [
    { value: "all", label: "All Contacts" },
    { value: "converted", label: "Converted from Leads" },
    { value: "recently-created", label: "Recently Created" },
    { value: "recently-modified", label: "Recently Modified" },
    { value: "today", label: "Today's Contacts" },
  ];

  return (
    <div className="flex items-center gap-4">
      <div className="flex-1 max-w-xs">
        <Select value={currentView} onValueChange={onViewChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select a view" />
          </SelectTrigger>
          <SelectContent className="max-h-60 overflow-y-auto">
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

export default ContactsViewFilters;
