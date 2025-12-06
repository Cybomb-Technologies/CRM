// src/components/files/inventory/pricebooks/ViewPriceBookDialog.jsx
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, X, Calendar, Building, Mail, Phone, FileText, Tag } from 'lucide-react';

const ViewPriceBookDialog = ({ open, onOpenChange, priceBook }) => {
  if (!priceBook) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Inactive": return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
      case "Pending": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      default: return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>{priceBook.name}</DialogTitle>
              <DialogDescription>
                Price book details and information
              </DialogDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-1">
                  <Building className="w-4 h-4" />
                  <span>Company</span>
                </div>
                <p className="font-medium">{priceBook.company}</p>
              </div>

              <div>
                <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-1">
                  <Mail className="w-4 h-4" />
                  <span>Email</span>
                </div>
                <p className="font-medium">{priceBook.email}</p>
              </div>

              <div>
                <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-1">
                  <Phone className="w-4 h-4" />
                  <span>Phone</span>
                </div>
                <p className="font-medium">{priceBook.phone}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-1">
                  <Tag className="w-4 h-4" />
                  <span>Status</span>
                </div>
                <Badge className={`${getStatusColor(priceBook.status)} capitalize`}>
                  {priceBook.status}
                </Badge>
              </div>

              <div>
                <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-1">
                  <Tag className="w-4 h-4" />
                  <span>Source</span>
                </div>
                <p className="font-medium">{priceBook.source}</p>
              </div>

              <div>
                <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-1">
                  <Calendar className="w-4 h-4" />
                  <span>Created</span>
                </div>
                <p className="font-medium">
                  {new Date(priceBook.created).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          {priceBook.description && (
            <div>
              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                <FileText className="w-4 h-4" />
                <span>Description</span>
              </div>
              <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                {priceBook.description}
              </p>
            </div>
          )}

          {/* Flags and Products */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                <Tag className="w-4 h-4" />
                <span>Flags</span>
              </div>
              {priceBook.flags && (
                <Badge variant="outline" className="text-sm">
                  {priceBook.flags}
                </Badge>
              )}
            </div>

            <div>
              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                <Tag className="w-4 h-4" />
                <span>Products</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold">{priceBook.products}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  products in this price book
                </span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewPriceBookDialog;