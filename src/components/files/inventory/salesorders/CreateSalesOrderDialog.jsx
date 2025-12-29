import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CreateSalesOrderDialog = ({ open, onOpenChange, onSalesOrderCreated }) => {
  const [formData, setFormData] = useState({
    subject: '',
    accountName: '',
    contactName: '',
    customerEmail: '',
    customerPhone: '',
    status: 'Created',
    dueDate: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:5000/api/file/inventory/sales-orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          // Add default items if needed or handle items in form
          items: [
            { productName: 'Default Item', quantity: 1, unitPrice: 0, total: 0, amount: 0 }
          ],
          total: 0
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create sales order');
      }

      const newOrder = await response.json();

      onSalesOrderCreated(newOrder);
      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error('Error creating sales order:', error);
      // Ideally show error toast here or pass error up
      alert(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      subject: '',
      accountName: '',
      contactName: '',
      customerEmail: '',
      customerPhone: '',
      status: 'Created',
      dueDate: new Date().toISOString().split('T')[0],
      notes: ''
    });
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Sales Order</DialogTitle>
          <DialogDescription>
            Create a new sales order for your customer.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subject">Subject *</Label>
            <Input
              id="subject"
              value={formData.subject}
              onChange={(e) => handleInputChange('subject', e.target.value)}
              placeholder="e.g., Annual Software License"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="accountName">Account Name *</Label>
              <Input
                id="accountName"
                value={formData.accountName}
                onChange={(e) => handleInputChange('accountName', e.target.value)}
                placeholder="Company name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactName">Contact Name</Label>
              <Input
                id="contactName"
                value={formData.contactName}
                onChange={(e) => handleInputChange('contactName', e.target.value)}
                placeholder="Contact person"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customerEmail">Email</Label>
              <Input
                id="customerEmail"
                type="email"
                value={formData.customerEmail}
                onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                placeholder="customer@company.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="customerPhone">Phone</Label>
              <Input
                id="customerPhone"
                value={formData.customerPhone}
                onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                placeholder="+91 9876543210"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleInputChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Created">Created</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="In Process">In Process</SelectItem>
                  <SelectItem value="Delivered">Delivered</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleInputChange('dueDate', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Additional notes..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                resetForm();
              }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Sales Order'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateSalesOrderDialog;