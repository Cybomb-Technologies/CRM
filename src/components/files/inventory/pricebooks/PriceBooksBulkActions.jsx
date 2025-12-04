// src/components/files/inventory/pricebooks/PriceBooksBulkActions.jsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Download,
  Tag,
  Copy,
  Eye
} from 'lucide-react';

const PriceBooksBulkActions = ({ 
  selectedPriceBooks, 
  onBulkDelete, 
  onBulkUpdate,
  onExport
}) => {
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  const handleStatusUpdate = (status) => {
    onBulkUpdate({ status });
    setShowStatusMenu(false);
  };

  const handleFlagsUpdate = (flags) => {
    onBulkUpdate({ flags });
  };

  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center">
          <Eye className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
          <span className="font-medium text-blue-900 dark:text-blue-100">
            {selectedPriceBooks.length} price book{selectedPriceBooks.length !== 1 ? 's' : ''} selected
          </span>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onExport(selectedPriceBooks)}
            className="border-blue-200 text-blue-700 hover:bg-blue-100 dark:border-blue-700 dark:text-blue-300 dark:hover:bg-blue-800"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="border-blue-200 text-blue-700 hover:bg-blue-100 dark:border-blue-700 dark:text-blue-300 dark:hover:bg-blue-800">
                <CheckCircle className="w-4 h-4 mr-2" />
                Set Status
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleStatusUpdate('Active')}>
                <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                Active
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusUpdate('Inactive')}>
                <XCircle className="w-4 h-4 mr-2 text-gray-600" />
                Inactive
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusUpdate('Pending')}>
                <Clock className="w-4 h-4 mr-2 text-yellow-600" />
                Pending
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="border-blue-200 text-blue-700 hover:bg-blue-100 dark:border-blue-700 dark:text-blue-300 dark:hover:bg-blue-800">
                <Tag className="w-4 h-4 mr-2" />
                Set Flags
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleFlagsUpdate('Default')}>
                Default
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFlagsUpdate('Premium')}>
                Premium
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFlagsUpdate('Standard')}>
                Standard
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFlagsUpdate('Volume')}>
                Volume
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFlagsUpdate('Special')}>
                Special
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFlagsUpdate('Restricted')}>
                Restricted
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="destructive"
            size="sm"
            onClick={onBulkDelete}
            className="bg-red-600 hover:bg-red-700"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PriceBooksBulkActions;