import React from 'react';
import InvoiceInformation from './InvoiceInformation';
import AddressInformation from './AddressInformation';
import InvoicedItems from './InvoicedItems';
import TermsAndConditions from './TermsAndConditions';
import DescriptionInformation from './DescriptionInformation';
import FormViews from './FormViews';

const InvoiceForm = ({ 
  formData, 
  items, 
  totals,
  onInputChange, 
  onItemChange, 
  onAddItem, 
  onRemoveItem,
  onCopyBillingToShipping,
  onClearAddress 
}) => {
  return (
    <div className="space-y-6">
      <InvoiceInformation 
        formData={formData} 
        onInputChange={onInputChange} 
      />
      
      <AddressInformation 
        formData={formData}
        onInputChange={onInputChange}
        onCopyBillingToShipping={onCopyBillingToShipping}
        onClearAddress={onClearAddress}
      />
      
      <InvoicedItems 
        items={items}
        totals={totals}
        onItemChange={onItemChange}
        onAddItem={onAddItem}
        onRemoveItem={onRemoveItem}
      />
      
      <TermsAndConditions 
        value={formData.termsAndConditions}
        onChange={(value) => onInputChange('main', 'termsAndConditions', value)}
      />
      
      <DescriptionInformation 
        value={formData.description}
        onChange={(value) => onInputChange('main', 'description', value)}
      />
      
      <FormViews />
    </div>
  );
};

export default InvoiceForm;