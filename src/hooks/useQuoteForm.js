import { useState, useEffect } from 'react';

export const useQuoteForm = () => {
  const [formData, setFormData] = useState({
    owner: '',
    subject: '',
    quoteStage: 'Draft',
    team: '',
    carrier: 'FedEX',
    dealName: '',
    validUntil: '',
    contactName: '',
    accountName: '',
    termsAndConditions: '',
    description: '',
    // Billing Address
    billingCountry: '',
    billingBuilding: '',
    billingStreet: '',
    billingCity: '',
    billingState: '',
    billingZip: '',
    billingLatitude: '',
    billingLongitude: '',
    // Shipping Address
    shippingCountry: '',
    shippingBuilding: '',
    shippingStreet: '',
    shippingCity: '',
    shippingState: '',
    shippingZip: '',
    shippingLatitude: '',
    shippingLongitude: '',
  });

  const [quoteItems, setQuoteItems] = useState([
    {
      id: 1,
      productName: '',
      quantity: 1,
      listPrice: 0,
      amount: 0,
      discount: 0,
      tax: 0,
      total: 0
    }
  ]);

  // Simulate getting current user
  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {
      name: 'DEVASHREE SALUNKE',
      email: 'devashree@company.com',
      role: 'Sales Manager'
    };
    
    setFormData(prev => ({
      ...prev,
      owner: currentUser.name
    }));
  }, []);

  // Calculate totals
  const subtotal = quoteItems.reduce((sum, item) => sum + item.amount, 0);
  const totalDiscount = quoteItems.reduce((sum, item) => sum + item.discount, 0);
  const totalTax = quoteItems.reduce((sum, item) => sum + item.tax, 0);
  const grandTotal = subtotal - totalDiscount + totalTax;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleItemChange = (id, field, value) => {
    setQuoteItems(prev => prev.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        
        // Calculate amount when quantity or listPrice changes
        if (field === 'quantity' || field === 'listPrice') {
          const quantity = field === 'quantity' ? value : item.quantity;
          const listPrice = field === 'listPrice' ? value : item.listPrice;
          updatedItem.amount = quantity * listPrice;
        }
        
        // Calculate total
        updatedItem.total = updatedItem.amount - updatedItem.discount + updatedItem.tax;
        
        return updatedItem;
      }
      return item;
    }));
  };

  const addItem = () => {
    const newItem = {
      id: Date.now(),
      productName: '',
      quantity: 1,
      listPrice: 0,
      amount: 0,
      discount: 0,
      tax: 0,
      total: 0
    };
    setQuoteItems(prev => [...prev, newItem]);
  };

  const removeItem = (id) => {
    if (quoteItems.length > 1) {
      setQuoteItems(prev => prev.filter(item => item.id !== id));
    } else {
      alert('At least one quote item is required.');
    }
  };

  const copyBillingToShipping = () => {
    setFormData(prev => ({
      ...prev,
      shippingCountry: prev.billingCountry,
      shippingBuilding: prev.billingBuilding,
      shippingStreet: prev.billingStreet,
      shippingCity: prev.billingCity,
      shippingState: prev.billingState,
      shippingZip: prev.billingZip,
      shippingLatitude: prev.billingLatitude,
      shippingLongitude: prev.billingLongitude,
    }));
  };

  const clearAddress = (type) => {
    const prefix = type === 'billing' ? 'billing' : 'shipping';
    const fields = ['Country', 'Building', 'Street', 'City', 'State', 'Zip', 'Latitude', 'Longitude'];
    
    const updates = {};
    fields.forEach(field => {
      updates[`${prefix}${field}`] = '';
    });

    setFormData(prev => ({
      ...prev,
      ...updates
    }));
  };

  const resetForm = () => {
    setFormData(prev => ({
      owner: prev.owner,
      subject: '',
      quoteStage: 'Draft',
      team: '',
      carrier: 'FedEX',
      dealName: '',
      validUntil: '',
      contactName: '',
      accountName: '',
      termsAndConditions: '',
      description: '',
      billingCountry: '',
      billingBuilding: '',
      billingStreet: '',
      billingCity: '',
      billingState: '',
      billingZip: '',
      billingLatitude: '',
      billingLongitude: '',
      shippingCountry: '',
      shippingBuilding: '',
      shippingStreet: '',
      shippingCity: '',
      shippingState: '',
      shippingZip: '',
      shippingLatitude: '',
      shippingLongitude: '',
    }));
    
    setQuoteItems([{
      id: 1,
      productName: '',
      quantity: 1,
      listPrice: 0,
      amount: 0,
      discount: 0,
      tax: 0,
      total: 0
    }]);
  };

  return {
    formData,
    quoteItems,
    totals: { subtotal, totalDiscount, totalTax, grandTotal },
    handleInputChange,
    handleItemChange,
    addItem,
    removeItem,
    copyBillingToShipping,
    clearAddress,
    resetForm
  };
};