import React from 'react';

// Components
import ViewVendorContent from '@/components/files/inventory/vendors/ViewVendorContent';
import EditVendorContent from '@/components/files/inventory/vendors/EditVendorContent';
import VendorsPageContent from '@/components/files/inventory/vendors/VendorsPageContent';

// View Vendor Page
export const ViewVendor = () => {
  return <ViewVendorContent />;
};

// Edit Vendor Page
export const EditVendor = () => {
  return <EditVendorContent />;
};

// Vendors List Page
export const Vendors = () => {
  return <VendorsPageContent />;
};

export default {
  ViewVendor,
  EditVendor,
  Vendors,
};
