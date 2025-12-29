// src/components/files/inventory/pricebooks/CreatePriceBookDialog.jsx
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const CreatePriceBookDialog = ({ open, onOpenChange, onPriceBookCreated }) => {
  const [formData, setFormData] = useState({
    priceBookName: '',
    company: '',
    email: '',
    phone: '',
    description: '',
    status: 'Active',
    source: 'Website',
    flags: 'Default',
    active: true,
  });

  const handleInputChange = (field, value) => {
    if (field === 'phone') {
      // Remove all non-digit characters
      const numericValue = value.replace(/\D/g, '');
      // Limit to 10 digits
      if (numericValue.length <= 10) {
        setFormData(prev => ({ ...prev, [field]: numericValue }));
      }
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newPriceBook = {
      ...formData,
      name: formData.priceBookName,
    };

    onPriceBookCreated(newPriceBook);
    setFormData({
      priceBookName: '',
      company: '',
      email: '',
      phone: '',
      description: '',
      status: 'Active',
      source: 'Website',
      flags: 'Default',
      active: true,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Price Book</DialogTitle>
          <DialogDescription>
            Add a new price book to manage pricing strategies for customer segments.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="priceBookName">Price Book Name *</Label>
                <Input
                  id="priceBookName"
                  value={formData.priceBookName}
                  onChange={(e) => handleInputChange('priceBookName', e.target.value)}
                  placeholder="Enter price book name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  placeholder="Enter company name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter email address"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Enter phone number"
                />
              </div>
            </div>

            <div className="space-y-4">
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
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="source">Source</Label>
                <Select
                  value={formData.source}
                  onValueChange={(value) => handleInputChange('source', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Website">Website</SelectItem>
                    <SelectItem value="Partner">Partner</SelectItem>
                    <SelectItem value="Direct">Direct</SelectItem>
                    <SelectItem value="Reseller">Reseller</SelectItem>
                    <SelectItem value="Government">Government</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="flags">Flags</Label>
                <Select
                  value={formData.flags}
                  onValueChange={(value) => handleInputChange('flags', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Default">Default</SelectItem>
                    <SelectItem value="Premium">Premium</SelectItem>
                    <SelectItem value="Standard">Standard</SelectItem>
                    <SelectItem value="Volume">Volume</SelectItem>
                    <SelectItem value="Special">Special</SelectItem>
                    <SelectItem value="Restricted">Restricted</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <Checkbox
                  id="active"
                  checked={formData.active}
                  onCheckedChange={(checked) => handleInputChange('active', checked)}
                />
                <Label htmlFor="active">Active</Label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              rows={3}
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter price book description..."
            />
          </div>

          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Create Price Book
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePriceBookDialog;