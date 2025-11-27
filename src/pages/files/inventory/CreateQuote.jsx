import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuoteForm } from '../../../hooks/useQuoteForm';
import { useQuoteStorage } from '../../../hooks/useQuoteStorage';
import QuoteHeader from "../../../components/files/inventory/quotes/QuoteHeader";
import QuoteForm from "../../../components/files/inventory/quotes/QuoteForm";
// import TermsAndConditions from "../../../components/files/inventory/TermsAndConditions";
// import DescriptionInformation from "../../../components/invoice/DescriptionInformation";
import TermsAndConditions from '../../../components/files/inventory/purchaseorders/TermsAndConditions';
import DescriptionInformation from '../../../components/files/inventory/invoices/DescriptionInformation';

const CreateQuote = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { saveQuote } = useQuoteStorage();
  
  const {
    formData,
    quoteItems,
    totals,
    handleInputChange,
    handleItemChange,
    addItem,
    removeItem,
    copyBillingToShipping,
    clearAddress,
    resetForm
  } = useQuoteForm();

  const validateForm = () => {
    if (!formData.subject.trim()) {
      alert('Please enter a subject for the quote');
      return false;
    }
    
    if (!formData.accountName.trim()) {
      alert('Please enter an account name');
      return false;
    }

    const invalidItems = quoteItems.filter(item => 
      !item.productName.trim() || item.quantity <= 0 || item.listPrice < 0
    );
    
    if (invalidItems.length > 0) {
      alert('Please fill all product details correctly. Quantity must be greater than 0 and prices cannot be negative.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result = saveQuote({ formData, quoteItems, ...totals });
      
      if (result.success) {
        console.log('Quote saved successfully');
        navigate('/quotes');
      } else {
        alert('Failed to save quote. Please try again.');
      }
    } catch (error) {
      console.error('Error in form submission:', error);
      alert('An error occurred while saving the quote. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveAndNew = () => {
    if (!validateForm()) {
      return;
    }

    const result = saveQuote({ formData, quoteItems, ...totals });
    
    if (result.success) {
      resetForm();
      window.scrollTo(0, 0);
      alert('Quote saved successfully! You can now create another quote.');
    } else {
      alert('Failed to save quote. Please try again.');
    }
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
      navigate('/quotes');
    }
  };

  const handleBack = () => {
    navigate('/quotes');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <QuoteHeader 
        onBack={handleBack}
        onSave={handleSubmit}
        onSaveAndNew={handleSaveAndNew}
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
      />

      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <QuoteForm 
            formData={formData}
            quoteItems={quoteItems}
            totals={totals}
            onInputChange={handleInputChange}
            onItemChange={handleItemChange}
            onAddItem={addItem}
            onRemoveItem={removeItem}
            onCopyBillingToShipping={copyBillingToShipping}
            onClearAddress={clearAddress}
          />

          {/* Reuse existing components */}
          <TermsAndConditions 
            value={formData.termsAndConditions}
            onChange={(value) => handleInputChange('termsAndConditions', value)}
          />
          
          <DescriptionInformation 
            value={formData.description}
            onChange={(value) => handleInputChange('description', value)}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateQuote;