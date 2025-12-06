import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import VendorHeader from './VendorHeader';
import VendorForm from './VendorForm';

const EditVendorContent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Mock initial data - in real app, fetch from API using id
  const initialFormData = {
    // Basic Information
    vendorName: 'Acme Supplies Inc',
    contactPerson: 'John Smith',
    email: 'john@acmesupplies.com',
    phone: '(555) 123-4567',
    website: 'https://acmesupplies.com',
    taxId: 'TAX-123456789',
    
    // Address Information
    billingAddress: {
      street: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'United States'
    },
    shippingAddress: {
      street: '456 Warehouse Ave',
      city: 'New York',
      state: 'NY',
      zipCode: '10002',
      country: 'United States'
    },
    
    // Banking Information
    bankName: 'First National Bank',
    accountNumber: '1234567890',
    routingNumber: '123000789',
    accountType: 'business',
    
    // Additional Details
    category: 'Office Supplies',
    paymentTerms: 'Net 30',
    creditLimit: '50000',
    notes: 'Preferred vendor for office supplies. Always on time with deliveries. Excellent customer service.',
    status: 'Active'
  };

  const [formData, setFormData] = useState(initialFormData);

  const handleInputChange = (section, field, value) => {
    if (section === 'main') {
      setFormData(prev => ({ ...prev, [field]: value }));
    } else if (section === 'billing' || section === 'shipping') {
      setFormData(prev => ({
        ...prev,
        [`${section}Address`]: {
          ...prev[`${section}Address`],
          [field]: value
        }
      }));
    }
  };

  const copyBillingToShipping = () => {
    setFormData(prev => ({
      ...prev,
      shippingAddress: { ...prev.billingAddress }
    }));
  };

  const clearAddress = (type) => {
    const emptyAddress = { street: '', city: '', state: '', zipCode: '', country: '' };
    setFormData(prev => ({
      ...prev,
      [`${type}Address`]: emptyAddress
    }));
  };

  const handleSave = () => {
    console.log('Updating vendor...', formData);
    // API call to update vendor
    navigate(`/vendors/view/${id}`);
  };

  const handleSaveAndNew = () => {
    console.log('Updating and creating new...', formData);
    // Update current and navigate to create new
    navigate('/create-vendor');
  };

  const handleCancel = () => {
    navigate(`/vendors/view/${id}`);
  };

  const handleBack = () => {
    navigate(`/vendors/view/${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <VendorHeader 
        onBack={handleBack}
        onSave={handleSave}
        onSaveAndNew={handleSaveAndNew}
        onCancel={handleCancel}
        title={`Edit Vendor - ${id}`}
      />

      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <VendorForm 
            formData={formData}
            onInputChange={handleInputChange}
            onCopyBillingToShipping={copyBillingToShipping}
            onClearAddress={clearAddress}
          />
        </div>
      </div>
    </div>
  );
};

export default EditVendorContent;