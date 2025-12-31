import { useState } from 'react';

export const useInvoiceForm = () => {
  const [formData, setFormData] = useState({
    subject: '',
    invoiceDate: '18/11/2025',
    dueDate: '',
    salesCommission: '',
    accountName: '',
    contactName: '',
    dealName: '',
    salesOrder: '',
    purchaseOrder: '',
    exciseDuty: '',
    status: 'Draft',
    termsAndConditions: '',
    description: '',
    billingAddress: {
      country: '',
      building: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      latitude: '',
      longitude: ''
    },
    shippingAddress: {
      country: '',
      building: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      latitude: '',
      longitude: ''
    }
  });

  const [items, setItems] = useState([
    {
      id: 1,
      productName: '',
      quantity: '',
      listPrice: '',
      amount: '',
      discount: '',
      tax: '',
      total: '',
      description: ''
    }
  ]);

  const handleInputChange = (section, field, value) => {
    if (section === 'billingAddress' || section === 'shippingAddress') {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = items.map((item, i) => {
      if (i === index) {
        const updatedItem = { ...item, [field]: value };

        // Calculate amount if quantity or listPrice changes
        if (field === 'quantity' || field === 'listPrice') {
          const quantity = field === 'quantity' ? value : item.quantity;
          const listPrice = field === 'listPrice' ? value : item.listPrice;
          updatedItem.amount = quantity && listPrice ? (quantity * listPrice).toFixed(2) : '';
        }

        // Calculate total if amount, discount, or tax changes
        if (field === 'amount' || field === 'discount' || field === 'tax') {
          const amount = parseFloat(updatedItem.amount) || 0;
          const discount = parseFloat(updatedItem.discount) || 0;
          const tax = parseFloat(updatedItem.tax) || 0;
          updatedItem.total = (amount - discount + tax).toFixed(2);
        }

        return updatedItem;
      }
      return item;
    });
    setItems(updatedItems);
  };

  const addItem = () => {
    setItems(prev => [
      ...prev,
      {
        id: prev.length + 1,
        productName: '',
        quantity: '',
        listPrice: '',
        amount: '',
        discount: '',
        tax: '',
        total: '',
        description: ''
      }
    ]);
  };

  const removeItem = (index) => {
    if (items.length > 1) {
      setItems(prev => prev.filter((_, i) => i !== index));
    }
  };

  const copyBillingToShipping = () => {
    setFormData(prev => ({
      ...prev,
      shippingAddress: { ...prev.billingAddress }
    }));
  };

  const clearAddress = (type) => {
    setFormData(prev => ({
      ...prev,
      [type]: {
        country: '',
        building: '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        latitude: '',
        longitude: ''
      }
    }));
  };

  const calculateTotals = () => {
    const subTotal = items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
    const totalDiscount = items.reduce((sum, item) => sum + (parseFloat(item.discount) || 0), 0);
    const totalTax = items.reduce((sum, item) => sum + (parseFloat(item.tax) || 0), 0);
    const grandTotal = subTotal - totalDiscount + totalTax;

    return {
      subTotal: subTotal.toFixed(2),
      totalDiscount: totalDiscount.toFixed(2),
      totalTax: totalTax.toFixed(2),
      grandTotal: grandTotal.toFixed(2)
    };
  };

  const totals = calculateTotals();

  return {
    formData,
    items,
    totals,
    handleInputChange,
    handleItemChange,
    addItem,
    removeItem,
    copyBillingToShipping,
    clearAddress
  };
};