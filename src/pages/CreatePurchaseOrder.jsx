// src/pages/CreatePurchaseOrder.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Copy, Trash2, Plus } from 'lucide-react';

const CreatePurchaseOrder = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    subject: '',
    requisitionNumber: '',
    contactName: '',
    dueDate: '',
    exciseDuty: '',
    status: 'Created',
    poNumber: '',
    vendorName: '',
    trackingNumber: '',
    poDate: '17/11/2025',
    carrier: 'FedEX',
    salesCommission: '',
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => navigate('/purchase-orders')}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Purchase Orders
              </button>
              <h1 className="text-2xl font-semibold text-gray-900">Create Purchase Order</h1>
            </div>
            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                Edit Page Layout
              </button>
              <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                Save
              </button>
              <button className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700">
                Save and New
              </button>
              <button 
                onClick={() => navigate('/purchase-orders')}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Purchase Order Information */}
          <div className="bg-white rounded-lg border border-gray-200 mb-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Purchase Order Information</h2>
            </div>
            <div className="p-6 grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Order Owner</label>
                  <div className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded border">DEVASHREE SALUNKE</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => handleInputChange('main', 'subject', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Requisition Number</label>
                  <input
                    type="text"
                    value={formData.requisitionNumber}
                    onChange={(e) => handleInputChange('main', 'requisitionNumber', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name</label>
                  <input
                    type="text"
                    value={formData.contactName}
                    onChange={(e) => handleInputChange('main', 'contactName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => handleInputChange('main', 'dueDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="DD/MM/YYYY"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Excise Duty</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">Rs.</span>
                    <input
                      type="number"
                      value={formData.exciseDuty}
                      onChange={(e) => handleInputChange('main', 'exciseDuty', e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('main', 'status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Created">Created</option>
                    <option value="Ordered">Ordered</option>
                    <option value="In Transit">In Transit</option>
                    <option value="Received">Received</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">PO Number</label>
                  <input
                    type="text"
                    value={formData.poNumber}
                    onChange={(e) => handleInputChange('main', 'poNumber', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vendor Name</label>
                  <input
                    type="text"
                    value={formData.vendorName}
                    onChange={(e) => handleInputChange('main', 'vendorName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tracking Number</label>
                  <input
                    type="text"
                    value={formData.trackingNumber}
                    onChange={(e) => handleInputChange('main', 'trackingNumber', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">PO Date</label>
                  <input
                    type="text"
                    value={formData.poDate}
                    onChange={(e) => handleInputChange('main', 'poDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="DD/MM/YYYY"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Carrier</label>
                  <select
                    value={formData.carrier}
                    onChange={(e) => handleInputChange('main', 'carrier', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="FedEX">FedEX</option>
                    <option value="UPS">UPS</option>
                    <option value="DHL">DHL</option>
                    <option value="USPS">USPS</option>
                    <option value="Blue Dart">Blue Dart</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sales Commission</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">Rs.</span>
                    <input
                      type="number"
                      value={formData.salesCommission}
                      onChange={(e) => handleInputChange('main', 'salesCommission', e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="bg-white rounded-lg border border-gray-200 mb-6">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Address Information</h2>
              <button
                onClick={copyBillingToShipping}
                className="flex items-center px-3 py-2 text-sm text-blue-600 hover:text-blue-700"
              >
                <Copy className="w-4 h-4 mr-1" />
                Copy Address
              </button>
            </div>
            <div className="p-6 grid grid-cols-2 gap-6">
              {/* Billing Address */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-md font-semibold text-gray-900">Billing Address</h3>
                  <button
                    onClick={() => clearAddress('billingAddress')}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Clear All
                  </button>
                </div>
                <div className="space-y-4">
                  {['country', 'building', 'street', 'city', 'state', 'zipCode'].map((field) => (
                    <div key={field}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {field.split(/(?=[A-Z])/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </label>
                      <input
                        type="text"
                        value={formData.billingAddress[field]}
                        onChange={(e) => handleInputChange('billingAddress', field, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder={field === 'country' || field === 'state' ? '-None-' : ''}
                      />
                    </div>
                  ))}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                      <input
                        type="text"
                        value={formData.billingAddress.latitude}
                        onChange={(e) => handleInputChange('billingAddress', 'latitude', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                      <input
                        type="text"
                        value={formData.billingAddress.longitude}
                        onChange={(e) => handleInputChange('billingAddress', 'longitude', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-md font-semibold text-gray-900">Shipping Address</h3>
                  <button
                    onClick={() => clearAddress('shippingAddress')}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Clear All
                  </button>
                </div>
                <div className="space-y-4">
                  {['country', 'building', 'street', 'city', 'state', 'zipCode'].map((field) => (
                    <div key={field}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {field.split(/(?=[A-Z])/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </label>
                      <input
                        type="text"
                        value={formData.shippingAddress[field]}
                        onChange={(e) => handleInputChange('shippingAddress', field, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder={field === 'country' || field === 'state' ? '-None-' : ''}
                      />
                    </div>
                  ))}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                      <input
                        type="text"
                        value={formData.shippingAddress.latitude}
                        onChange={(e) => handleInputChange('shippingAddress', 'latitude', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                      <input
                        type="text"
                        value={formData.shippingAddress.longitude}
                        onChange={(e) => handleInputChange('shippingAddress', 'longitude', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Purchase Items */}
          <div className="bg-white rounded-lg border border-gray-200 mb-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Purchase Items</h2>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">S.NO</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Product Name</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">List Price (Rs.)</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount (Rs.)</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Discount (Rs.)</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tax (Rs.)</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total (Rs.)</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, index) => (
                      <tr key={item.id} className="border-b border-gray-200">
                        <td className="px-4 py-3">{index + 1}</td>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={item.productName}
                            onChange={(e) => handleItemChange(index, 'productName', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            value={item.listPrice}
                            onChange={(e) => handleItemChange(index, 'listPrice', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            value={item.amount}
                            readOnly
                            className="w-full px-2 py-1 border border-gray-300 rounded bg-gray-50"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            value={item.discount}
                            onChange={(e) => handleItemChange(index, 'discount', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            value={item.tax}
                            onChange={(e) => handleItemChange(index, 'tax', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            value={item.total}
                            readOnly
                            className="w-full px-2 py-1 border border-gray-300 rounded bg-gray-50"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={item.description}
                            onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => removeItem(index)}
                            className="text-red-600 hover:text-red-700"
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
                onClick={addItem}
                className="mt-4 flex items-center px-4 py-2 text-blue-600 hover:text-blue-700"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add row
              </button>

              {/* Totals */}
              <div className="mt-6 grid grid-cols-4 gap-4 max-w-2xl ml-auto">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sub Total (Rs.)</label>
                  <div className="px-3 py-2 border border-gray-300 rounded bg-gray-50">
                    {totals.subTotal}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount (Rs.)</label>
                  <div className="px-3 py-2 border border-gray-300 rounded bg-gray-50">
                    {totals.totalDiscount}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tax (Rs.)</label>
                  <div className="px-3 py-2 border border-gray-300 rounded bg-gray-50">
                    {totals.totalTax}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Grand Total (Rs.)</label>
                  <div className="px-3 py-2 border border-gray-300 rounded bg-gray-50 font-semibold">
                    {totals.grandTotal}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="bg-white rounded-lg border border-gray-200 mb-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Terms and Conditions</h2>
            </div>
            <div className="p-6">
              <textarea
                value={formData.termsAndConditions}
                onChange={(e) => handleInputChange('main', 'termsAndConditions', e.target.value)}
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter terms and conditions..."
              />
            </div>
          </div>

          {/* Description Information */}
          <div className="bg-white rounded-lg border border-gray-200 mb-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Description Information</h2>
            </div>
            <div className="p-6">
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('main', 'description', e.target.value)}
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter description..."
              />
            </div>
          </div>

          {/* Form Views */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Create Form Views</h2>
            </div>
            <div className="p-6">
              <div className="flex items-center space-x-4">
                <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                  Standard View
                </button>
                <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                  Create a custom form page
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePurchaseOrder;