import React from 'react';
import { useNavigate } from 'react-router-dom';
// import { useInvoiceForm } from "../../../hooks/useInvoiceForm";
// import InvoiceHeader from '../components/files/invoices/InvoiceHeader';
// import InvoiceForm from '../components/invoice/InvoiceForm';
import { useInvoiceForm } from '../../../hooks/useInvoiceForm';
const CreateInvoice = () => {
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
    console.log('Saving invoice...');
  };

  const handleSaveAndNew = () => {
    // Save and new logic here
    console.log('Saving and creating new...');
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

export default CreateInvoice;