import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePOForm } from '../../../hooks/usePOForm';
import { usePOStorage } from '../../../hooks/usePOStorage';
import POHeader from '../../../hooks/POHeader';
import POForm from '../../../hooks/POForm';

const CreatePurchaseOrder = () => {
  const navigate = useNavigate();
  const { savePurchaseOrder } = usePOStorage();
  
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
  } = usePOForm();

  const handleSave = () => {
    const result = savePurchaseOrder({ formData, items, ...totals });
    
    if (result.success) {
      console.log('Purchase Order saved successfully');
      navigate('/purchase-orders');
    } else {
      alert('Failed to save purchase order. Please try again.');
    }
  };

  const handleSaveAndNew = () => {
    const result = savePurchaseOrder({ formData, items, ...totals });
    
    if (result.success) {
      // Reset form logic would go here
      alert('Purchase Order saved successfully! You can now create another one.');
    } else {
      alert('Failed to save purchase order. Please try again.');
    }
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
      navigate('/purchase-orders');
    }
  };

  const handleBack = () => {
    navigate('/purchase-orders');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <POHeader 
        onBack={handleBack}
        onSave={handleSave}
        onSaveAndNew={handleSaveAndNew}
        onCancel={handleCancel}
      />

      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <POForm 
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

export default CreatePurchaseOrder;