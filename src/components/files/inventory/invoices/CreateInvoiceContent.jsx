import React from 'react';
import { useNavigate } from 'react-router-dom';
import InvoiceHeader from './InvoiceHeader';
import InvoiceForm from './InvoiceForm';
import { useInvoiceForm } from '@/hooks/useInvoiceForm';
import { apiRequest, getAuthHeaders } from "@/services/api";

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

  // Helper to convert DD/MM/YYYY to ISO Date
  const parseDate = (dateStr) => {
    if (!dateStr) return null;
    if (dateStr.includes('-')) return dateStr; // Already valid or YYYY-MM-DD
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      // Assume DD/MM/YYYY
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return dateStr;
  };

  const validateForm = () => {
    if (!formData.accountName.trim()) {
      alert('Account Name is required');
      return false;
    }
    if (!formData.subject.trim()) {
      alert('Subject is required');
      return false;
    }

    // Check if at least one item exists and has a product name
    if (items.length === 0) {
      alert('Please add at least one item');
      return false;
    }

    // Check for empty product names
    const invalidItems = items.filter(item => !item.productName.trim());
    if (invalidItems.length > 0) {
      alert('All items must have a Product Name');
      return false;
    }

    return true;
  };

  const preparePayload = () => {
    // Map items to match backend schema (listPrice -> unitPrice)
    const mappedItems = items.map(item => ({
      ...item,
      quantity: Number(item.quantity) || 1, // Ensure min 1
      unitPrice: Number(item.listPrice) || 0,
      amount: Number(item.amount) || 0,
      total: Number(item.total) || 0,
      discount: Number(item.discount) || 0,
      tax: Number(item.tax) || 0
    }));

    // Map address fields (zipCode -> code)
    const mapAddress = (addr) => ({
      street: addr.street || '',
      city: addr.city || '',
      state: addr.state || '',
      code: addr.zipCode || addr.code || '',
      country: addr.country || ''
    });

    return {
      ...formData,
      // Map Order Numbers
      salesOrderNumber: formData.salesOrder,
      purchaseOrderNumber: formData.purchaseOrder,

      // Map Addresses
      billingAddress: mapAddress(formData.billingAddress),
      shippingAddress: mapAddress(formData.shippingAddress),

      // Valid backend statuses: Draft, Sent, Paid, Partial, Overdue, Cancelled, Void
      status: ['Draft', 'Sent', 'Paid', 'Partial', 'Overdue', 'Cancelled', 'Void'].includes(formData.status)
        ? formData.status
        : 'Draft', // Force Draft if invalid (e.g. 'Created')
      invoiceDate: parseDate(formData.invoiceDate),
      dueDate: parseDate(formData.dueDate),
      items: mappedItems,
      subTotal: totals.subTotal,
      discountTotal: totals.totalDiscount,
      taxTotal: totals.totalTax,
      grandTotal: totals.grandTotal,
      shippingCost: totals.shippingCost || 0
    };
  };

  const submitInvoice = async (onSuccess) => {
    if (!validateForm()) return;

    try {
      const payload = preparePayload();
      console.log('Sending Invoice Payload:', payload);

      const response = await apiRequest('/invoices', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      });

      console.log('Invoice created successfully:', response);
      if (onSuccess) onSuccess(response.data);
    } catch (error) {
      console.error('Error creating invoice:', error);
      alert(`Error creating invoice: ${error.message}`);
    }
  };

  const handleSave = () => {
    submitInvoice(() => {
      navigate('/invoices');
    });
  };

  const handleSaveAndNew = () => {
    submitInvoice(() => {
      window.location.reload();
    });
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