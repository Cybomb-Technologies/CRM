import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Download, 
  Trash2, 
  FileText,
  Printer,
  Copy
} from "lucide-react";

const SalesOrdersBulkActions = ({
  selectedSalesOrders,
  onBulkDelete,
  onBulkUpdate,
  onExport,
  onPrint,
  onDuplicate
}) => {
  const [selectedStatus, setSelectedStatus] = useState('');

  const handleStatusUpdate = () => {
    if (selectedStatus) {
      onBulkUpdate(selectedSalesOrders, { status: selectedStatus });
      setSelectedStatus('');
    }
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          <span className="font-medium text-blue-900">
            {selectedSalesOrders.length} sales orders selected
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Update */}
          <div className="flex items-center gap-2">
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Update status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Created">Created</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Shipped">Shipped</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="On Hold">On Hold</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              size="sm" 
              onClick={handleStatusUpdate}
              disabled={!selectedStatus}
            >
              Update
            </Button>
          </div>

          {/* Export */}
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onExport(selectedSalesOrders)}
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>

          {/* Print */}
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onPrint && onPrint(selectedSalesOrders)}
          >
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>

          {/* Duplicate */}
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onDuplicate && onDuplicate(selectedSalesOrders)}
          >
            <Copy className="w-4 h-4 mr-2" />
            Duplicate
          </Button>

          {/* Delete */}
          <Button 
            variant="destructive" 
            size="sm"
            onClick={() => onBulkDelete(selectedSalesOrders)}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SalesOrdersBulkActions;