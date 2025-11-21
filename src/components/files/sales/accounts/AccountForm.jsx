// src/components/accounts/AccountForm.jsx
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Building2, Globe, Phone, Mail, MapPin, IndianRupee, Users } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/components/ui/use-toast';

const AccountForm = ({ onSuccess, onCancel, initialData }) => {
  const { addDataItem, updateDataItem } = useData();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    // Account Information
    name: '',
    website: '',
    phone: '',
    email: '',
    industry: '',
    type: 'Customer',
    employees: '',
    annualRevenue: '',
    
    // Address Information
    billingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    shippingAddress: {
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
        billingAddress: initialData.billingAddress || { street: '', city: '', state: '', zipCode: '', country: '' },
        shippingAddress: initialData.shippingAddress || { street: '', city: '', state: '', zipCode: '', country: '' }
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
      if (!formData.name) {
        toast({
          title: "Validation Error",
          description: "Account Name is a required field.",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (initialData) {
        // Update existing account
        const updatedAccount = {
          ...initialData,
          ...formData,
          updatedAt: new Date().toISOString()
        };
        updateDataItem('accounts', updatedAccount.id, updatedAccount);
        onSuccess(updatedAccount);
      } else {
        // Create new account
        const newAccount = {
          id: Date.now().toString(),
          ...formData,
          contacts: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        addDataItem('accounts', newAccount);
        onSuccess(newAccount);
      }
      
      toast({
        title: initialData ? "Success" : "Success",
        description: initialData ? "Account updated successfully" : "Account created successfully",
      });

    } catch (error) {
      toast({
        title: "Error",
        description: initialData ? "Failed to update account" : "Failed to create account",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const industries = [
    'Agriculture', 'Apparel', 'Banking', 'Biotechnology', 'Chemicals',
    'Communications', 'Construction', 'Consulting', 'Education',
    'Electronics', 'Energy', 'Engineering', 'Entertainment',
    'Environmental', 'Finance', 'Food & Beverage', 'Government',
    'Healthcare', 'Hospitality', 'Insurance', 'Machinery',
    'Manufacturing', 'Media', 'Not For Profit', 'Recreation',
    'Retail', 'Shipping', 'Technology', 'Telecommunications',
    'Transportation', 'Utilities', 'Other'
  ];

  const accountTypes = ['Customer', 'Partner', 'Vendor', 'Prospect', 'Other'];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Account Information */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Building2 className="w-5 h-5 mr-2" />
          Account Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Account Name *</label>
              <Input
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Account Name"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">Website</label>
              <Input
                value={formData.website}
                onChange={(e) => handleChange('website', e.target.value)}
                placeholder="Website"
              />
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
              <label className="text-sm font-medium">Industry</label>
              <Select value={formData.industry} onValueChange={(value) => handleChange('industry', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Industry" />
                </SelectTrigger>
                <SelectContent>
                  {industries.map(industry => (
                    <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
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
              <label className="text-sm font-medium">Account Type</label>
              <Select value={formData.type} onValueChange={(value) => handleChange('type', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {accountTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Number of Employees</label>
              <Input
                type="number"
                value={formData.employees}
                onChange={(e) => handleChange('employees', e.target.value)}
                placeholder="Employees"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Annual Revenue</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                <Input
                  value={formData.annualRevenue}
                  onChange={(e) => handleChange('annualRevenue', e.target.value)}
                  placeholder="Annual Revenue"
                  className="pl-8"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Billing Address */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <MapPin className="w-5 h-5 mr-2" />
          Billing Address
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Street</label>
            <Input
              value={formData.billingAddress.street}
              onChange={(e) => handleChange('billingAddress.street', e.target.value)}
              placeholder="Street Address"
            />
          </div>

          <div>
            <label className="text-sm font-medium">City</label>
            <Input
              value={formData.billingAddress.city}
              onChange={(e) => handleChange('billingAddress.city', e.target.value)}
              placeholder="City"
            />
          </div>

          <div>
            <label className="text-sm font-medium">State</label>
            <Input
              value={formData.billingAddress.state}
              onChange={(e) => handleChange('billingAddress.state', e.target.value)}
              placeholder="State"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Zip Code</label>
            <Input
              value={formData.billingAddress.zipCode}
              onChange={(e) => handleChange('billingAddress.zipCode', e.target.value)}
              placeholder="Zip Code"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Country</label>
            <Input
              value={formData.billingAddress.country}
              onChange={(e) => handleChange('billingAddress.country', e.target.value)}
              placeholder="Country"
            />
          </div>
        </div>
      </div>

      {/* Shipping Address */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <MapPin className="w-5 h-5 mr-2" />
          Shipping Address
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Street</label>
            <Input
              value={formData.shippingAddress.street}
              onChange={(e) => handleChange('shippingAddress.street', e.target.value)}
              placeholder="Street Address"
            />
          </div>

          <div>
            <label className="text-sm font-medium">City</label>
            <Input
              value={formData.shippingAddress.city}
              onChange={(e) => handleChange('shippingAddress.city', e.target.value)}
              placeholder="City"
            />
          </div>

          <div>
            <label className="text-sm font-medium">State</label>
            <Input
              value={formData.shippingAddress.state}
              onChange={(e) => handleChange('shippingAddress.state', e.target.value)}
              placeholder="State"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Zip Code</label>
            <Input
              value={formData.shippingAddress.zipCode}
              onChange={(e) => handleChange('shippingAddress.zipCode', e.target.value)}
              placeholder="Zip Code"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Country</label>
            <Input
              value={formData.shippingAddress.country}
              onChange={(e) => handleChange('shippingAddress.country', e.target.value)}
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
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {loading ? 'Saving...' : (initialData ? 'Update' : 'Create')}
        </Button>
      </div>
    </form>
  );
};

export default AccountForm;