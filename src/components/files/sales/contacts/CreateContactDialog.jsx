import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';

const CreateContactDialog = ({ open, onOpenChange, onContactCreated }) => {
  const [formData, setFormData] = useState({
    // Contact Information
    firstName: '',
    lastName: '',
    accountName: '',
    title: '',
    department: '',
    email: '',
    phone: '',
    mobile: '',
    assistant: '',
    assistantPhone: '',
    leadSource: '',
    reportsTo: '',
    emailOptOut: false,
    
    // Address Information
    mailingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    
    // Description
    description: ''
  });
  
  const { toast } = useToast();

  const handleChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.firstName || !formData.lastName) {
      toast({
        title: "Validation Error",
        description: "First Name and Last Name are required fields.",
        variant: "destructive"
      });
      return;
    }

    const newContact = {
      id: Date.now().toString(),
      ...formData,
      name: `${formData.firstName} ${formData.lastName}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    if (onContactCreated) onContactCreated(newContact);
    
    toast({
      title: "Contact Created",
      description: `${formData.firstName} ${formData.lastName} has been created successfully.`
    });
    
    // Reset form
    setFormData({
      firstName: '',
      lastName: '',
      accountName: '',
      title: '',
      department: '',
      email: '',
      phone: '',
      mobile: '',
      assistant: '',
      assistantPhone: '',
      leadSource: '',
      reportsTo: '',
      emailOptOut: false,
      mailingAddress: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
      },
      description: ''
    });
    
    onOpenChange(false);
  };

  const leadSources = [
    'None', 'Advertisement', 'Cold Call', 'Employee Referral', 
    'External Referral', 'Online Store', 'Partner', 'Public Relations',
    'Sales Email', 'Seminar', 'Trade Show', 'Web Download', 'Web Research'
  ];

  const departments = [
    'None', 'Administration', 'Engineering', 'Finance', 'Human Resources',
    'IT', 'Marketing', 'Operations', 'Sales', 'Support'
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Contact</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Contact Information */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">First Name *</Label>
                  <Input
                    value={formData.firstName}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    placeholder="First Name"
                    required
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">Title</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    placeholder="Title"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">Department</Label>
                  <Select value={formData.department} onValueChange={(value) => handleChange('department', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Department" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 overflow-y-auto">
                      {departments.map(dept => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium">Email</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="Email"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">Mobile</Label>
                  <Input
                    value={formData.mobile}
                    onChange={(e) => handleChange('mobile', e.target.value)}
                    placeholder="Mobile"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">Assistant</Label>
                  <Input
                    value={formData.assistant}
                    onChange={(e) => handleChange('assistant', e.target.value)}
                    placeholder="Assistant"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Last Name *</Label>
                  <Input
                    value={formData.lastName}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                    placeholder="Last Name"
                    required
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">Account</Label>
                  <Input
                    value={formData.accountName}
                    onChange={(e) => handleChange('accountName', e.target.value)}
                    placeholder="Account Name"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">Lead Source</Label>
                  <Select value={formData.leadSource} onValueChange={(value) => handleChange('leadSource', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Source" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 overflow-y-auto">
                      {leadSources.map(source => (
                        <SelectItem key={source} value={source}>{source}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium">Phone</Label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    placeholder="Phone"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">Assistant Phone</Label>
                  <Input
                    value={formData.assistantPhone}
                    onChange={(e) => handleChange('assistantPhone', e.target.value)}
                    placeholder="Assistant Phone"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">Reports To</Label>
                  <Input
                    value={formData.reportsTo}
                    onChange={(e) => handleChange('reportsTo', e.target.value)}
                    placeholder="Reports To"
                  />
                </div>
              </div>
            </div>

            {/* Email Opt Out */}
            <div className="flex items-center space-x-2 mt-4">
              <Checkbox
                checked={formData.emailOptOut}
                onCheckedChange={(checked) => handleChange('emailOptOut', checked)}
              />
              <Label className="text-sm font-medium">Email Opt Out</Label>
            </div>
          </div>

          {/* Address Information */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">Mailing Address</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Street</Label>
                <Input
                  value={formData.mailingAddress.street}
                  onChange={(e) => handleChange('mailingAddress.street', e.target.value)}
                  placeholder="Street Address"
                />
              </div>

              <div>
                <Label className="text-sm font-medium">City</Label>
                <Input
                  value={formData.mailingAddress.city}
                  onChange={(e) => handleChange('mailingAddress.city', e.target.value)}
                  placeholder="City"
                />
              </div>

              <div>
                <Label className="text-sm font-medium">State</Label>
                <Input
                  value={formData.mailingAddress.state}
                  onChange={(e) => handleChange('mailingAddress.state', e.target.value)}
                  placeholder="State"
                />
              </div>

              <div>
                <Label className="text-sm font-medium">Zip Code</Label>
                <Input
                  value={formData.mailingAddress.zipCode}
                  onChange={(e) => handleChange('mailingAddress.zipCode', e.target.value)}
                  placeholder="Zip Code"
                />
              </div>

              <div>
                <Label className="text-sm font-medium">Country</Label>
                <Input
                  value={formData.mailingAddress.country}
                  onChange={(e) => handleChange('mailingAddress.country', e.target.value)}
                  placeholder="Country"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">Description</h3>
            <Textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Enter description..."
              rows={4}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700"
            >
              Create Contact
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateContactDialog;