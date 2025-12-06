import React from 'react';
import ContactInformation from './ContactInformation';
import AddressInformation from './AddressInformation';
import BankingInformation from './BankingInformation';
import AdditionalDetails from './AdditionalDetails';

const VendorForm = ({ 
  formData, 
  onInputChange,
  onCopyBillingToShipping,
  onClearAddress 
}) => {
  return (
    <div className="space-y-6">
      <ContactInformation 
        formData={formData} 
        onInputChange={onInputChange} 
      />
      
      <AddressInformation 
        formData={formData}
        onInputChange={onInputChange}
        onCopyBillingToShipping={onCopyBillingToShipping}
        onClearAddress={onClearAddress}
      />
      
      <BankingInformation 
        formData={formData}
        onInputChange={onInputChange}
      />
      
      <AdditionalDetails 
        formData={formData}
        onInputChange={onInputChange}
      />
    </div>
  );
};

export default VendorForm;