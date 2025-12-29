// src/components/files/inventory/purchaseorders/CreatePurchaseOrderForm.jsx
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Save, Plus, X, Trash2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks';
import { usePOStorage } from '@/hooks/usePOStorage';

const CreatePurchaseOrderForm = ({ isEditing = false, poId = null }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { savePurchaseOrder, getPurchaseOrder } = usePOStorage();
  
  const [formData, setFormData] = useState({
    // Purchase Order Information
    poOwner: 'DEVASHREE SALUNKE',
    subject: '',
    requisitionNumber: '',
    contactName: '',
    dueDate: '',
    exciseDuty: '',
    status: 'Created',
    poNumber: `PO-${Date.now().toString().slice(-6)}`,
    vendorName: '',
    trackingNumber: '',
    poDate: new Date().toISOString().split('T')[0],
    carrier: 'FedEX',
    salesCommission: '',
    
    // Address Information
    billingStreet: '',
    billingCity: '',
    billingState: '',
    billingCode: '',
    billingCountry: '',
    shippingStreet: '',
    shippingCity: '',
    shippingState: '',
    shippingCode: '',
    shippingCountry: '',
  });

  const [items, setItems] = useState([
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

  useEffect(() => {
    if (isEditing && poId) {
      const existingPO = getPurchaseOrder(poId);
      if (existingPO) {
        setFormData({
          poOwner: existingPO.poOwner || 'SANTHOSH KRISHNAMOORTHI',
          subject: existingPO.subject || '',
          requisitionNumber: existingPO.requisitionNumber || '',
          contactName: existingPO.contactName || '',
          dueDate: existingPO.dueDate || '',
          exciseDuty: existingPO.exciseDuty || '',
          status: existingPO.status || 'Created',
          poNumber: existingPO.orderNumber || `PO-${Date.now().toString().slice(-6)}`,
          vendorName: existingPO.vendorName || '',
          trackingNumber: existingPO.trackingNumber || '',
          poDate: existingPO.poDate || new Date().toISOString().split('T')[0],
          carrier: existingPO.carrier || 'FedEX',
          salesCommission: existingPO.salesCommission || '',
          billingStreet: existingPO.billingStreet || '',
          billingCity: existingPO.billingCity || '',
          billingState: existingPO.billingState || '',
          billingCode: existingPO.billingCode || '',
          billingCountry: existingPO.billingCountry || '',
          shippingStreet: existingPO.shippingStreet || '',
          shippingCity: existingPO.shippingCity || '',
          shippingState: existingPO.shippingState || '',
          shippingCode: existingPO.shippingCode || '',
          shippingCountry: existingPO.shippingCountry || '',
        });
        setItems(existingPO.items || [
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
      }
    }
  }, [isEditing, poId, getPurchaseOrder]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    const item = updatedItems[index];
    
    // Update the field
    updatedItems[index] = {
      ...item,
      [field]: field === 'productName' ? value : parseFloat(value) || 0
    };
    
    // Recalculate if quantity, price, or discount changed
    if (['quantity', 'listPrice', 'discount'].includes(field)) {
      const quantity = parseFloat(updatedItems[index].quantity) || 0;
      const listPrice = parseFloat(updatedItems[index].listPrice) || 0;
      const discount = parseFloat(updatedItems[index].discount) || 0;
      
      // Calculate amounts
      const amount = quantity * listPrice;
      const discountAmount = (amount * discount) / 100;
      const amountAfterDiscount = amount - discountAmount;
      const tax = (amountAfterDiscount * 18) / 100; // Assuming 18% tax
      const total = amountAfterDiscount + tax;
      
      updatedItems[index].amount = amount;
      updatedItems[index].tax = tax;
      updatedItems[index].total = total;
    }
    
    setItems(updatedItems);
  };

  const addItem = () => {
    const newId = items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1;
    setItems(prev => [
      ...prev,
      {
        id: newId,
        productName: '',
        quantity: 1,
        listPrice: 0,
        amount: 0,
        discount: 0,
        tax: 0,
        total: 0
      }
    ]);
  };

  const removeItem = (index) => {
    if (items.length > 1) {
      const updatedItems = items.filter((_, i) => i !== index);
      setItems(updatedItems);
    }
  };

  const copyBillingToShipping = () => {
    setFormData(prev => ({
      ...prev,
      shippingStreet: prev.billingStreet,
      shippingCity: prev.billingCity,
      shippingState: prev.billingState,
      shippingCode: prev.billingCode,
      shippingCountry: prev.billingCountry
    }));
    toast({
      title: "Address Copied",
      description: "Billing address copied to shipping address."
    });
  };

  const calculateTotals = () => {
    return items.reduce((acc, item) => {
      return {
        amount: acc.amount + (item.amount || 0),
        discount: acc.discount + ((item.amount || 0) * (item.discount || 0) / 100),
        tax: acc.tax + (item.tax || 0),
        total: acc.total + (item.total || 0)
      };
    }, { amount: 0, discount: 0, tax: 0, total: 0 });
  };

  const validateForm = () => {
    if (!formData.subject.trim()) {
      toast({
        title: "Validation Error",
        description: "Subject is required",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.vendorName.trim()) {
      toast({
        title: "Validation Error",
        description: "Vendor Name is required",
        variant: "destructive"
      });
      return false;
    }

    if (items.some(item => !item.productName.trim())) {
      toast({
        title: "Validation Error",
        description: "Product Name is required for all items",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const totals = calculateTotals();
    const poData = {
      id: poId || Date.now().toString(),
      orderNumber: formData.poNumber,
      ...formData,
      items: items.map(item => ({
        ...item,
        amount: parseFloat(item.amount.toFixed(2)),
        tax: parseFloat(item.tax.toFixed(2)),
        total: parseFloat(item.total.toFixed(2))
      })),
      totals: {
        amount: parseFloat(totals.amount.toFixed(2)),
        discount: parseFloat(totals.discount.toFixed(2)),
        tax: parseFloat(totals.tax.toFixed(2)),
        total: parseFloat(totals.total.toFixed(2))
      },
      createdAt: isEditing ? undefined : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    savePurchaseOrder(poData);

    toast({
      title: isEditing ? "Purchase Order Updated" : "Purchase Order Created",
      description: `Purchase Order "${formData.subject}" has been ${isEditing ? 'updated' : 'created'} successfully.`
    });

    navigate(`/purchase-orders/view/${poData.id}`);
  };

  const handleSaveAndNew = () => {
    if (!validateForm()) return;

    const totals = calculateTotals();
    const poData = {
      id: Date.now().toString(),
      orderNumber: formData.poNumber,
      ...formData,
      items: items.map(item => ({
        ...item,
        amount: parseFloat(item.amount.toFixed(2)),
        tax: parseFloat(item.tax.toFixed(2)),
        total: parseFloat(item.total.toFixed(2))
      })),
      totals: {
        amount: parseFloat(totals.amount.toFixed(2)),
        discount: parseFloat(totals.discount.toFixed(2)),
        tax: parseFloat(totals.tax.toFixed(2)),
        total: parseFloat(totals.total.toFixed(2))
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    savePurchaseOrder(poData);

    toast({
      title: "Purchase Order Created",
      description: `Purchase Order "${formData.subject}" has been created successfully.`
    });

    // Reset form for new entry
    setFormData({
      poOwner: 'SANTHOSH KRISHNAMOORTHI',
      subject: '',
      requisitionNumber: '',
      contactName: '',
      dueDate: '',
      exciseDuty: '',
      status: 'Created',
      poNumber: `PO-${Date.now().toString().slice(-6)}`,
      vendorName: '',
      trackingNumber: '',
      poDate: new Date().toISOString().split('T')[0],
      carrier: 'FedEX',
      salesCommission: '',
      billingStreet: '',
      billingCity: '',
      billingState: '',
      billingCode: '',
      billingCountry: '',
      shippingStreet: '',
      shippingCity: '',
      shippingState: '',
      shippingCode: '',
      shippingCountry: '',
    });
    setItems([{
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

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
      navigate('/purchase-orders');
    }
  };

  const totals = calculateTotals();

  return (
    <>
      <Helmet>
        <title>{isEditing ? 'Edit Purchase Order' : 'Create Purchase Order'} - CloudCRM</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCancel}
                  className="h-10 w-10"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900">
                    {isEditing ? 'Edit Purchase Order' : 'Create Purchase Order'}
                  </h1>
                  <p className="text-gray-600 mt-1">
                    {isEditing ? 'Update purchase order information' : 'Add a new purchase order to your procurement system'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" onClick={handleCancel}>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button variant="outline" onClick={handleSaveAndNew}>
                  <Plus className="w-4 h-4 mr-2" />
                  Save and New
                </Button>
                <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 gap-6">
              {/* Purchase Order Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Purchase Order Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="po-owner">Purchase Order Owner</Label>
                      <Input
                        id="po-owner"
                        value={formData.poOwner}
                        onChange={(e) => handleInputChange('poOwner', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject" className="flex items-center">
                        Subject <span className="text-red-500 ml-1">*</span>
                      </Label>
                      <Input
                        id="subject"
                        value={formData.subject}
                        onChange={(e) => handleInputChange('subject', e.target.value)}
                        placeholder="e.g., Office Supplies Order"
                        required
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="requisition-number">Requisition Number</Label>
                      <Input
                        id="requisition-number"
                        value={formData.requisitionNumber}
                        onChange={(e) => handleInputChange('requisitionNumber', e.target.value)}
                        placeholder="e.g., REQ-001"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contact-name">Contact Name</Label>
                      <Input
                        id="contact-name"
                        value={formData.contactName}
                        onChange={(e) => handleInputChange('contactName', e.target.value)}
                        placeholder="e.g., John Doe"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="due-date">Due Date</Label>
                      <Input
                        id="due-date"
                        type="date"
                        value={formData.dueDate}
                        onChange={(e) => handleInputChange('dueDate', e.target.value)}
                        className="border-gray-300"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="excise-duty">Excise Duty (₹)</Label>
                      <Input
                        id="excise-duty"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.exciseDuty}
                        onChange={(e) => handleInputChange('exciseDuty', e.target.value)}
                        placeholder="0.00"
                        className="border-gray-300"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select 
                        value={formData.status} 
                        onValueChange={(value) => handleInputChange('status', value)}
                      >
                        <SelectTrigger className="border-gray-300">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Created">Created</SelectItem>
                          <SelectItem value="Approved">Approved</SelectItem>
                          <SelectItem value="Sent">Sent</SelectItem>
                          <SelectItem value="Received">Received</SelectItem>
                          <SelectItem value="Partially Received">Partially Received</SelectItem>
                          <SelectItem value="Closed">Closed</SelectItem>
                          <SelectItem value="Cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="po-number">PO Number</Label>
                      <Input
                        id="po-number"
                        value={formData.poNumber}
                        onChange={(e) => handleInputChange('poNumber', e.target.value)}
                        placeholder="e.g., PO-001"
                        className="border-gray-300"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="vendor-name" className="flex items-center">
                        Vendor Name <span className="text-red-500 ml-1">*</span>
                      </Label>
                      <Input
                        id="vendor-name"
                        value={formData.vendorName}
                        onChange={(e) => handleInputChange('vendorName', e.target.value)}
                        placeholder="e.g., Tech Corp Suppliers"
                        required
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tracking-number">Tracking Number</Label>
                      <Input
                        id="tracking-number"
                        value={formData.trackingNumber}
                        onChange={(e) => handleInputChange('trackingNumber', e.target.value)}
                        placeholder="e.g., TRK-123456"
                        className="border-gray-300"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="po-date">PO Date</Label>
                      <Input
                        id="po-date"
                        type="date"
                        value={formData.poDate}
                        onChange={(e) => handleInputChange('poDate', e.target.value)}
                        className="border-gray-300"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="carrier">Carrier</Label>
                      <Select 
                        value={formData.carrier} 
                        onValueChange={(value) => handleInputChange('carrier', value)}
                      >
                        <SelectTrigger className="border-gray-300">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="FedEX">FedEX</SelectItem>
                          <SelectItem value="UPS">UPS</SelectItem>
                          <SelectItem value="DHL">DHL</SelectItem>
                          <SelectItem value="USPS">USPS</SelectItem>
                          <SelectItem value="BlueDart">BlueDart</SelectItem>
                          <SelectItem value="DTDC">DTDC</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sales-commission">Sales Commission (₹)</Label>
                      <Input
                        id="sales-commission"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.salesCommission}
                        onChange={(e) => handleInputChange('salesCommission', e.target.value)}
                        placeholder="0.00"
                        className="border-gray-300"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Address Information */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Address Information</CardTitle>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={copyBillingToShipping}
                      className="border-gray-300"
                    >
                      Copy Billing to Shipping
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Billing Address */}
                    <div className="space-y-4">
                      <h3 className="font-medium text-gray-900">Billing Address</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="billing-street">Billing Street</Label>
                          <Textarea
                            id="billing-street"
                            rows={2}
                            value={formData.billingStreet}
                            onChange={(e) => handleInputChange('billingStreet', e.target.value)}
                            placeholder="Street address"
                            className="border-gray-300 resize-none"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="billing-city">Billing City</Label>
                          <Input
                            id="billing-city"
                            value={formData.billingCity}
                            onChange={(e) => handleInputChange('billingCity', e.target.value)}
                            placeholder="City"
                            className="border-gray-300"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="billing-state">Billing State</Label>
                          <Input
                            id="billing-state"
                            value={formData.billingState}
                            onChange={(e) => handleInputChange('billingState', e.target.value)}
                            placeholder="State"
                            className="border-gray-300"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="billing-code">Billing Code</Label>
                          <Input
                            id="billing-code"
                            value={formData.billingCode}
                            onChange={(e) => handleInputChange('billingCode', e.target.value)}
                            placeholder="Postal code"
                            className="border-gray-300"
                          />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                          <Label htmlFor="billing-country">Billing Country</Label>
                          <Input
                            id="billing-country"
                            value={formData.billingCountry}
                            onChange={(e) => handleInputChange('billingCountry', e.target.value)}
                            placeholder="Country"
                            className="border-gray-300"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="space-y-4">
                      <h3 className="font-medium text-gray-900">Shipping Address</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="shipping-street">Shipping Street</Label>
                          <Textarea
                            id="shipping-street"
                            rows={2}
                            value={formData.shippingStreet}
                            onChange={(e) => handleInputChange('shippingStreet', e.target.value)}
                            placeholder="Street address"
                            className="border-gray-300 resize-none"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="shipping-city">Shipping City</Label>
                          <Input
                            id="shipping-city"
                            value={formData.shippingCity}
                            onChange={(e) => handleInputChange('shippingCity', e.target.value)}
                            placeholder="City"
                            className="border-gray-300"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="shipping-state">Shipping State</Label>
                          <Input
                            id="shipping-state"
                            value={formData.shippingState}
                            onChange={(e) => handleInputChange('shippingState', e.target.value)}
                            placeholder="State"
                            className="border-gray-300"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="shipping-code">Shipping Code</Label>
                          <Input
                            id="shipping-code"
                            value={formData.shippingCode}
                            onChange={(e) => handleInputChange('shippingCode', e.target.value)}
                            placeholder="Postal code"
                            className="border-gray-300"
                          />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                          <Label htmlFor="shipping-country">Shipping Country</Label>
                          <Input
                            id="shipping-country"
                            value={formData.shippingCountry}
                            onChange={(e) => handleInputChange('shippingCountry', e.target.value)}
                            placeholder="Country"
                            className="border-gray-300"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Purchase Items */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Purchase Items</CardTitle>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={addItem}
                      className="border-gray-300"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Item
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-16 bg-gray-50">S.NO</TableHead>
                          <TableHead className="bg-gray-50">
                            Product Name <span className="text-red-500 ml-1">*</span>
                          </TableHead>
                          <TableHead className="w-32 bg-gray-50">Quantity</TableHead>
                          <TableHead className="w-40 bg-gray-50">List Price (₹)</TableHead>
                          <TableHead className="w-40 bg-gray-50">Amount (₹)</TableHead>
                          <TableHead className="w-40 bg-gray-50">Discount (%)</TableHead>
                          <TableHead className="w-40 bg-gray-50">Tax (₹)</TableHead>
                          <TableHead className="w-40 bg-gray-50">Total (₹)</TableHead>
                          <TableHead className="w-16 bg-gray-50">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {items.map((item, index) => (
                          <TableRow key={item.id} className="border-gray-200">
                            <TableCell className="font-medium">{index + 1}</TableCell>
                            <TableCell>
                              <Input
                                value={item.productName}
                                onChange={(e) => handleItemChange(index, 'productName', e.target.value)}
                                placeholder="Enter product name"
                                className="w-full border-gray-300"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                                className="w-full border-gray-300"
                                min="1"
                                step="1"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                step="0.01"
                                min="0"
                                value={item.listPrice}
                                onChange={(e) => handleItemChange(index, 'listPrice', e.target.value)}
                                className="w-full border-gray-300"
                              />
                            </TableCell>
                            <TableCell>
                              <div className="font-medium px-3 py-2 bg-gray-50 rounded">
                                ₹{item.amount.toFixed(2)}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                step="0.01"
                                min="0"
                                max="100"
                                value={item.discount}
                                onChange={(e) => handleItemChange(index, 'discount', e.target.value)}
                                className="w-full border-gray-300"
                              />
                            </TableCell>
                            <TableCell>
                              <div className="font-medium px-3 py-2 bg-gray-50 rounded">
                                ₹{item.tax.toFixed(2)}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="font-medium text-green-600 px-3 py-2 bg-green-50 rounded">
                                ₹{item.total.toFixed(2)}
                              </div>
                            </TableCell>
                            <TableCell>
                              {items.length > 1 && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeItem(index)}
                                  className="h-8 w-8 text-red-600 hover:text-red-800 hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Totals Section */}
                  <div className="mt-6 border-t border-gray-200 pt-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="space-y-1">
                        <div className="text-sm text-gray-500">Subtotal</div>
                        <div className="text-lg font-semibold">₹{totals.amount.toFixed(2)}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm text-gray-500">Discount</div>
                        <div className="text-lg font-semibold text-red-600">
                          - ₹{totals.discount.toFixed(2)}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm text-gray-500">Tax</div>
                        <div className="text-lg font-semibold">₹{totals.tax.toFixed(2)}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm text-gray-500">Total</div>
                        <div className="text-2xl font-bold text-green-600">
                          ₹{totals.total.toFixed(2)}
                        </div>
                      </div>
                    </div>

                    {/* Additional Charges */}
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="excise-duty-display">Excise Duty</Label>
                        <div className="px-3 py-2 bg-gray-50 rounded border border-gray-200">
                          <span className="text-gray-600">₹</span>
                          <span className="ml-1">{parseFloat(formData.exciseDuty || 0).toFixed(2)}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="sales-commission-display">Sales Commission</Label>
                        <div className="px-3 py-2 bg-gray-50 rounded border border-gray-200">
                          <span className="text-gray-600">₹</span>
                          <span className="ml-1">{parseFloat(formData.salesCommission || 0).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Grand Total */}
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-500">Grand Total (including additional charges)</div>
                        <div className="text-2xl font-bold text-green-600">
                          ₹{(totals.total + parseFloat(formData.exciseDuty || 0) + parseFloat(formData.salesCommission || 0)).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons Footer */}
              <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
                <Button variant="outline" onClick={handleCancel} className="border-gray-300">
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button variant="outline" onClick={handleSaveAndNew} className="border-gray-300">
                  <Plus className="w-4 h-4 mr-2" />
                  Save and New
                </Button>
                <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                  <Save className="w-4 h-4 mr-2" />
                  {isEditing ? 'Update Purchase Order' : 'Create Purchase Order'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreatePurchaseOrderForm;