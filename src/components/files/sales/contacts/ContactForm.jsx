// src/components/contacts/ContactForm.jsx
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { User, Building, Mail, Phone, MapPin } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/components/ui/use-toast';

const ContactForm = ({ onSuccess, onCancel, initialData }) => {
  const { addDataItem, updateDataItem, data } = useData();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    // Contact Information
    firstName: '',
    lastName: '',
    accountId: '',
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
    otherAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    
    // Description
    description: ''
  });

  // Initialize form with initialData when editing
  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        ...initialData,
        mailingAddress: initialData.mailingAddress || { street: '', city: '', state: '', zipCode: '', country: '' },
        otherAddress: initialData.otherAddress || { street: '', city: '', state: '', zipCode: '', country: '' }
      }));
    }
  }, [initialData]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.firstName || !formData.lastName) {
        toast({
          title: "Validation Error",
          description: "First Name and Last Name are required fields.",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (initialData) {
        // Update existing contact
        const updatedContact = {
          ...initialData,
          ...formData,
          name: `${formData.firstName} ${formData.lastName}`,
          updatedAt: new Date().toISOString()
        };
        updateDataItem('contacts', updatedContact.id, updatedContact);
        onSuccess(updatedContact);
      } else {
        // Create new contact
        const newContact = {
          id: Date.now().toString(),
          ...formData,
          name: `${formData.firstName} ${formData.lastName}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        addDataItem('contacts', newContact);
        onSuccess(newContact);
      }
      
      toast({
        title: initialData ? "Success" : "Success",
        description: initialData ? "Contact updated successfully" : "Contact created successfully",
      });

    } catch (error) {
      toast({
        title: "Error",
        description: initialData ? "Failed to update contact" : "Failed to create contact",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAndNew = async (e) => {
    await handleSubmit(e);
    if (!loading) {
      // Reset form for new entry
      setFormData({
        firstName: '',
        lastName: '',
        accountId: '',
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
        otherAddress: {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: ''
        },
        description: ''
      });
    }
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
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Contact Information */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <User className="w-5 h-5 mr-2" />
          Contact Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left Column */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">First Name *</label>
              <Input
                value={formData.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                placeholder="First Name"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">Title</label>
              <Input
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Title"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Department</label>
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
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="Email"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Mobile</label>
              <Input
                value={formData.mobile}
                onChange={(e) => handleChange('mobile', e.target.value)}
                placeholder="Mobile"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Assistant</label>
              <Input
                value={formData.assistant}
                onChange={(e) => handleChange('assistant', e.target.value)}
                placeholder="Assistant"
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Last Name *</label>
              <Input
                value={formData.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
                placeholder="Last Name"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">Account</label>
              <Select 
                value={formData.accountId} 
                onValueChange={(value) => {
                  const account = data.accounts?.find(acc => acc.id === value);
                  handleChange('accountId', value);
                  handleChange('accountName', account?.name || '');
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Account" />
                </SelectTrigger>
                <SelectContent className="max-h-60 overflow-y-auto">
                  {data.accounts?.map(account => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Lead Source</label>
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
              <label className="text-sm font-medium">Phone</label>
              <Input
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="Phone"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Assistant Phone</label>
              <Input
                value={formData.assistantPhone}
                onChange={(e) => handleChange('assistantPhone', e.target.value)}
                placeholder="Assistant Phone"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Reports To</label>
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
          <label className="text-sm font-medium">Email Opt Out</label>
        </div>
      </div>

      {/* Address Information */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <MapPin className="w-5 h-5 mr-2" />
          Mailing Address
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Street</label>
            <Input
              value={formData.mailingAddress.street}
              onChange={(e) => handleChange('mailingAddress.street', e.target.value)}
              placeholder="Street Address"
            />
          </div>

          <div>
            <label className="text-sm font-medium">City</label>
            <Input
              value={formData.mailingAddress.city}
              onChange={(e) => handleChange('mailingAddress.city', e.target.value)}
              placeholder="City"
            />
          </div>

          <div>
            <label className="text-sm font-medium">State</label>
            <Input
              value={formData.mailingAddress.state}
              onChange={(e) => handleChange('mailingAddress.state', e.target.value)}
              placeholder="State"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Zip Code</label>
            <Input
              value={formData.mailingAddress.zipCode}
              onChange={(e) => handleChange('mailingAddress.zipCode', e.target.value)}
              placeholder="Zip Code"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Country</label>
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
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={handleSaveAndNew}
          disabled={loading}
        >
          Save and New
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {loading ? 'Saving...' : (initialData ? 'Update' : 'Save')}
        </Button>
      </div>
    </form>
  );
};

export default ContactForm;