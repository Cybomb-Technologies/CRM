import React from 'react';
import POInformation from './POInformation';
import AddressInformation from '../common/AddressInformation';
import PurchaseItems from './PurchaseItems';
import TermsAndConditions from '../common/TermsAndConditions';
import DescriptionInformation from '../common/DescriptionInformation';
import FormViews from '../common/FormViews';

const POForm = ({ 
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
      <POInformation 
        formData={formData} 
        onInputChange={onInputChange} 
      />
      
      <AddressInformation 
        formData={formData}
        onInputChange={onInputChange}
        onCopyBillingToShipping={onCopyBillingToShipping}
        onClearAddress={onClearAddress}
        type="purchase"
      />
      
      <PurchaseItems 
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

export default POForm;