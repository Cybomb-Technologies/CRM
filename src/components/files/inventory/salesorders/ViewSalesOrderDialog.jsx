import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Building,
  User,
  Mail,
  Phone,
  FileText
} from "lucide-react";

const ViewSalesOrderDialog = ({ open, onOpenChange, salesOrder }) => {
  if (!salesOrder) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      'Created': 'bg-gray-100 text-gray-800',
      'Approved': 'bg-blue-100 text-blue-800',
      'In Process': 'bg-yellow-100 text-yellow-800',
      'Delivered': 'bg-purple-100 text-purple-800',
      'Completed': 'bg-green-100 text-green-800',
      'Cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                {salesOrder.orderNumber} - {salesOrder.subject}
              </DialogTitle>
              <DialogDescription>
                Created on {formatDate(salesOrder.createdAt)}
              </DialogDescription>
            </div>
            <Badge className={`${getStatusColor(salesOrder.status)}`}>
              {salesOrder.status}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Account Information */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-500">Account Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500">Account</div>
                    <div className="font-medium">{salesOrder.accountName}</div>
                  </div>
                </div>

                {salesOrder.contactName && (
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-500">Contact</div>
                      <div>{salesOrder.contactName}</div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                {salesOrder.customerEmail && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-500">Email</div>
                      <a href={`mailto:${salesOrder.customerEmail}`} className="text-blue-600 hover:underline">
                        {salesOrder.customerEmail}
                      </a>
                    </div>
                  </div>
                )}

                {salesOrder.customerPhone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-500">Phone</div>
                      <a href={`tel:${salesOrder.customerPhone}`} className="text-blue-600 hover:underline">
                        {salesOrder.customerPhone}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-500">Order Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-500">Due Date</div>
                  <div className="font-medium">{formatDate(salesOrder.dueDate)}</div>
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-500">Total Amount</div>
                <div className="text-xl font-bold text-gray-900">
                  {formatCurrency(salesOrder.grandTotal || salesOrder.summary?.grandTotal || 0)}
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {salesOrder.notes && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Notes</h3>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-700 whitespace-pre-line">{salesOrder.notes}</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewSalesOrderDialog;