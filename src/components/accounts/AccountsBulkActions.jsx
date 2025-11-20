// src/components/accounts/AccountsBulkActions.jsx
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { 
  MoreHorizontal, 
  Trash2, 
  Download
} from 'lucide-react';

const AccountsBulkActions = ({ 
  selectedAccounts, 
  onBulkDelete
}) => {
  if (selectedAccounts.length === 0) return null;

  return (
    <div className="flex items-center gap-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <span className="text-sm text-blue-800">
        {selectedAccounts.length} account(s) selected
      </span>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <MoreHorizontal className="w-4 h-4 mr-2" />
            Bulk Actions
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          {/* Export */}
          <DropdownMenuItem onClick={() => console.log('Export accounts')}>
            <Download className="w-4 h-4 mr-2" />
            Export Accounts
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* Destructive Actions */}
          <DropdownMenuItem 
            onClick={() => onBulkDelete(selectedAccounts)}
            className="text-red-600"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Mass Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button 
        variant="outline" 
        size="sm"
        onClick={() => onBulkDelete(selectedAccounts)}
        className="text-red-600 border-red-200 hover:bg-red-50"
      >
        <Trash2 className="w-4 h-4 mr-2" />
        Delete Selected
      </Button>
    </div>
  );
};

export default AccountsBulkActions;