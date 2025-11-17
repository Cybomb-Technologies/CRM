// src/pages/CreateQuote.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Copy } from 'lucide-react';

const CreateQuote = () => {
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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

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

  // Calculate totals whenever quoteItems change
  const subtotal = quoteItems.reduce((sum, item) => sum + item.amount, 0);
  const totalDiscount = quoteItems.reduce((sum, item) => sum + item.discount, 0);
  const totalTax = quoteItems.reduce((sum, item) => sum + item.tax, 0);
  const grandTotal = subtotal - totalDiscount + totalTax;

  const saveQuoteToStorage = () => {
    try {
      const quotes = JSON.parse(localStorage.getItem('quotes')) || [];
      const newQuote = {
        id: Date.now().toString(),
        ...formData,
        quoteItems,
        subtotal,
        totalDiscount,
        totalTax,
        grandTotal,
        createdAt: new Date().toISOString(),
        status: 'Active'
      };
      
      quotes.unshift(newQuote); // Add to beginning of array
      localStorage.setItem('quotes', JSON.stringify(quotes));
      
      return true;
    } catch (error) {
      console.error('Error saving quote to localStorage:', error);
      return false;
    }
  };

  const validateForm = () => {
    if (!formData.subject.trim()) {
      alert('Please enter a subject for the quote');
      return false;
    }
    
    if (!formData.accountName.trim()) {
      alert('Please enter an account name');
      return false;
    }

    // Validate quote items
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
      console.log('Form submitted:', { formData, quoteItems });
      
      const saveSuccess = saveQuoteToStorage();
      
      if (saveSuccess) {
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

    console.log('Save and New:', { formData, quoteItems });
    
    const saveSuccess = saveQuoteToStorage();
    
    if (saveSuccess) {
      // Reset form for new quote
      setFormData(prev => ({
        owner: prev.owner, // Keep owner
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
      
      // Scroll to top and show success message
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

  const addQuoteItem = () => {
    const newItem = {
      id: Date.now(), // Use timestamp for unique ID
      productName: '',
      quantity: 1,
      listPrice: 0,
      amount: 0,
      discount: 0,
      tax: 0,
      total: 0
    };
    setQuoteItems([...quoteItems, newItem]);
  };

  const removeQuoteItem = (id) => {
    if (quoteItems.length > 1) {
      setQuoteItems(quoteItems.filter(item => item.id !== id));
    } else {
      alert('At least one quote item is required.');
    }
  };

  const updateQuoteItem = (id, field, value) => {
    setQuoteItems(quoteItems.map(item => {
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

  const clearBillingAddress = () => {
    if (window.confirm('Clear all billing address fields?')) {
      setFormData(prev => ({
        ...prev,
        billingCountry: '',
        billingBuilding: '',
        billingStreet: '',
        billingCity: '',
        billingState: '',
        billingZip: '',
        billingLatitude: '',
        billingLongitude: '',
      }));
    }
  };

  const clearShippingAddress = () => {
    if (window.confirm('Clear all shipping address fields?')) {
      setFormData(prev => ({
        ...prev,
        shippingCountry: '',
        shippingBuilding: '',
        shippingStreet: '',
        shippingCity: '',
        shippingState: '',
        shippingZip: '',
        shippingLatitude: '',
        shippingLongitude: '',
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleCancel}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Quotes
              </button>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Create New Quote</h1>
                <p className="text-gray-600 mt-1">Create a new customer quote</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                type="submit"
                form="quote-form"
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Saving...' : 'Save Quote'}
              </button>
              <button
                type="button"
                onClick={handleSaveAndNew}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
              >
                Save and New
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <form id="quote-form" onSubmit={handleSubmit} className="max-w-7xl mx-auto space-y-6">
          {/* Quote Information Section */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Quote Information</h2>
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Quote Owner */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quote Owner *
                </label>
                <div className="p-3 border border-gray-300 rounded-lg bg-gray-50">
                  <span className="text-gray-900 font-medium">{formData.owner}</span>
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter quote subject"
                />
              </div>

              {/* Quote Stage */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quote Stage
                </label>
                <select
                  value={formData.quoteStage}
                  onChange={(e) => setFormData({...formData, quoteStage: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Draft">Draft</option>
                  <option value="Delivered">Delivered</option>
                  <option value="On Hold">On Hold</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Closed Won">Closed Won</option>
                  <option value="Closed Lost">Closed Lost</option>
                </select>
              </div>

              {/* Team */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Team
                </label>
                <input
                  type="text"
                  value={formData.team}
                  onChange={(e) => setFormData({...formData, team: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter team"
                />
              </div>

              {/* Carrier */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Carrier
                </label>
                <select
                  value={formData.carrier}
                  onChange={(e) => setFormData({...formData, carrier: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="FedEX">FedEX</option>
                  <option value="UPS">UPS</option>
                  <option value="DHL">DHL</option>
                  <option value="USPS">USPS</option>
                </select>
              </div>

              {/* Deal Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deal Name
                </label>
                <input
                  type="text"
                  value={formData.dealName}
                  onChange={(e) => setFormData({...formData, dealName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter deal name"
                />
              </div>

              {/* Valid Until */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valid Until
                </label>
                <input
                  type="date"
                  value={formData.validUntil}
                  onChange={(e) => setFormData({...formData, validUntil: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Contact Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Name
                </label>
                <input
                  type="text"
                  value={formData.contactName}
                  onChange={(e) => setFormData({...formData, contactName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter contact name"
                />
              </div>

              {/* Account Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.accountName}
                  onChange={(e) => setFormData({...formData, accountName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter account name"
                />
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Address Information</h2>
                <button
                  type="button"
                  onClick={copyBillingToShipping}
                  className="flex items-center px-3 py-1 text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  <Copy className="w-4 h-4 mr-1" />
                  Copy Billing to Shipping
                </button>
              </div>
            </div>
            
            <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Billing Address */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-md font-semibold text-gray-900">Billing Address</h3>
                  <button
                    type="button"
                    onClick={clearBillingAddress}
                    className="text-sm text-red-600 hover:text-red-800 font-medium"
                  >
                    Clear All
                  </button>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Country / Region
                      </label>
                      <select
                        value={formData.billingCountry}
                        onChange={(e) => setFormData({...formData, billingCountry: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">-None-</option>
                        <option value="US">United States</option>
                        <option value="IN">India</option>
                        <option value="UK">United Kingdom</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Flat / House No. / Building / Apartment Name
                      </label>
                      <input
                        type="text"
                        value={formData.billingBuilding}
                        onChange={(e) => setFormData({...formData, billingBuilding: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Street Address
                      </label>
                      <input
                        type="text"
                        value={formData.billingStreet}
                        onChange={(e) => setFormData({...formData, billingStreet: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                        <input
                          type="text"
                          value={formData.billingCity}
                          onChange={(e) => setFormData({...formData, billingCity: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">State / Province</label>
                        <select
                          value={formData.billingState}
                          onChange={(e) => setFormData({...formData, billingState: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">-None-</option>
                          <option value="CA">California</option>
                          <option value="NY">New York</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Zip / Postal Code</label>
                        <input
                          type="text"
                          value={formData.billingZip}
                          onChange={(e) => setFormData({...formData, billingZip: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Latitude</label>
                        <input
                          type="text"
                          value={formData.billingLatitude}
                          onChange={(e) => setFormData({...formData, billingLatitude: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Longitude</label>
                        <input
                          type="text"
                          value={formData.billingLongitude}
                          onChange={(e) => setFormData({...formData, billingLongitude: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-md font-semibold text-gray-900">Shipping Address</h3>
                  <button
                    type="button"
                    onClick={clearShippingAddress}
                    className="text-sm text-red-600 hover:text-red-800 font-medium"
                  >
                    Clear All
                  </button>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Country / Region
                      </label>
                      <select
                        value={formData.shippingCountry}
                        onChange={(e) => setFormData({...formData, shippingCountry: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">-None-</option>
                        <option value="US">United States</option>
                        <option value="IN">India</option>
                        <option value="UK">United Kingdom</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Flat / House No. / Building / Apartment Name
                      </label>
                      <input
                        type="text"
                        value={formData.shippingBuilding}
                        onChange={(e) => setFormData({...formData, shippingBuilding: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Street Address
                      </label>
                      <input
                        type="text"
                        value={formData.shippingStreet}
                        onChange={(e) => setFormData({...formData, shippingStreet: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                        <input
                          type="text"
                          value={formData.shippingCity}
                          onChange={(e) => setFormData({...formData, shippingCity: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">State / Province</label>
                        <select
                          value={formData.shippingState}
                          onChange={(e) => setFormData({...formData, shippingState: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">-None-</option>
                          <option value="CA">California</option>
                          <option value="NY">New York</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Zip / Postal Code</label>
                        <input
                          type="text"
                          value={formData.shippingZip}
                          onChange={(e) => setFormData({...formData, shippingZip: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Latitude</label>
                        <input
                          type="text"
                          value={formData.shippingLatitude}
                          onChange={(e) => setFormData({...formData, shippingLatitude: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Longitude</label>
                        <input
                          type="text"
                          value={formData.shippingLongitude}
                          onChange={(e) => setFormData({...formData, shippingLongitude: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quoted Items Section */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Quoted Items</h2>
            </div>
            
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">S.NO</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Product Name *</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Quantity *</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">List Price (Rs.) *</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Amount (Rs.)</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Discount (Rs.)</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Tax (Rs.)</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Total (Rs.)</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quoteItems.map((item, index) => (
                      <tr key={item.id} className="border-b border-gray-200">
                        <td className="px-4 py-3">{index + 1}</td>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            required
                            value={item.productName}
                            onChange={(e) => updateQuoteItem(item.id, 'productName', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Product name"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            required
                            value={item.quantity}
                            onChange={(e) => updateQuoteItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                            className="w-20 px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            min="1"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            required
                            value={item.listPrice}
                            onChange={(e) => updateQuoteItem(item.id, 'listPrice', parseFloat(e.target.value) || 0)}
                            className="w-24 px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            step="0.01"
                            min="0"
                          />
                        </td>
                        <td className="px-4 py-3">{item.amount.toFixed(2)}</td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            value={item.discount}
                            onChange={(e) => updateQuoteItem(item.id, 'discount', parseFloat(e.target.value) || 0)}
                            className="w-20 px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            step="0.01"
                            min="0"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            value={item.tax}
                            onChange={(e) => updateQuoteItem(item.id, 'tax', parseFloat(e.target.value) || 0)}
                            className="w-20 px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            step="0.01"
                            min="0"
                          />
                        </td>
                        <td className="px-4 py-3 font-medium">{item.total.toFixed(2)}</td>
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => removeQuoteItem(item.id)}
                            className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <button
                type="button"
                onClick={addQuoteItem}
                className="mt-4 flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add row
              </button>

              {/* Totals Section */}
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl ml-auto">
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-700">Sub Total (Rs.)</div>
                  <div className="text-lg font-semibold">{subtotal.toFixed(2)}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-700">Discount (Rs.)</div>
                  <div className="text-lg font-semibold">{totalDiscount.toFixed(2)}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-700">Tax (Rs.)</div>
                  <div className="text-lg font-semibold">{totalTax.toFixed(2)}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-700">Grand Total (Rs.)</div>
                  <div className="text-2xl font-bold text-blue-600">{grandTotal.toFixed(2)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Terms and Conditions</h2>
            </div>
            <div className="p-6">
              <textarea
                value={formData.termsAndConditions}
                onChange={(e) => setFormData({...formData, termsAndConditions: e.target.value})}
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter terms and conditions"
              />
            </div>
          </div>

          {/* Description Information */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Description Information</h2>
            </div>
            <div className="p-6">
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter description"
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateQuote;