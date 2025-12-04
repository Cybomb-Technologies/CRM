import React from 'react';
import { useNavigate } from 'react-router-dom';
import InvoiceHeader from './InvoiceHeader';
import InvoiceForm from './InvoiceForm';
import { useInvoiceForm } from '@/hooks/useInvoiceForm';

const CreateInvoiceContent = () => {
  const navigate = useNavigate();
  const {
    formData,
    items,
    totals,
    handleInputChange,
    handleItemChange,
    addItem,
    removeItem,
    copyBillingToShipping,
    clearAddress
  } = useInvoiceForm();

  const handleSave = () => {
    // Save logic here
    console.log('Saving invoice...', formData);
    navigate('/invoices');
  };

  const handleSaveAndNew = () => {
    // Save and new logic here
    console.log('Saving and creating new...', formData);
    // Reset form and stay on the page
    window.location.reload(); // Or implement form reset
  };

  const handleCancel = () => {
    navigate('/invoices');
  };

  const handleBack = () => {
    navigate('/invoices');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <InvoiceHeader 
        onBack={handleBack}
        onSave={handleSave}
        onSaveAndNew={handleSaveAndNew}
        onCancel={handleCancel}
        title="Create New Invoice"
      />

      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <InvoiceForm 
            formData={formData}
            items={items}
            totals={totals}
            onInputChange={handleInputChange}
            onItemChange={handleItemChange}
            onAddItem={addItem}
            onRemoveItem={removeItem}
            onCopyBillingToShipping={copyBillingToShipping}
            onClearAddress={clearAddress}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateInvoiceContent;