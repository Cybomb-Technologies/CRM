import React from 'react';
import { useNavigate } from 'react-router-dom';
import VendorHeader from './VendorHeader';
import VendorForm from './VendorForm';

const CreateVendorContent = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = React.useState({
    // Basic Information
    vendorName: '',
    contactPerson: '',
    email: '',
    phone: '',
    website: '',
    taxId: '',
    
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
    
    // Banking Information
    bankName: '',
    accountNumber: '',
    routingNumber: '',
    accountType: 'checking',
    
    // Additional Details
    category: '',
    paymentTerms: 'Net 30',
    creditLimit: '',
    notes: '',
    status: 'Active'
  });

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
    console.log('Saving vendor...', formData);
    // API call would go here
    navigate('/vendors');
  };

  const handleSaveAndNew = () => {
    console.log('Saving and creating new vendor...', formData);
    // Save current and reset form
    window.location.reload();
  };

  const handleCancel = () => {
    navigate('/vendors');
  };

  const handleBack = () => {
    navigate('/vendors');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <VendorHeader 
        onBack={handleBack}
        onSave={handleSave}
        onSaveAndNew={handleSaveAndNew}
        onCancel={handleCancel}
        title="Add New Vendor"
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

export default CreateVendorContent;