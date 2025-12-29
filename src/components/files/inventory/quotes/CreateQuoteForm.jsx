// src/components/files/inventory/quotes/CreateQuoteForm.jsx
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Save, Plus, X, Upload, Copy as CopyIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks';
// import { XIcon } from 'kinetic-icons';
// import { HomeIcon } from 'kinetic-icons';

const CreateQuoteForm = ({ initialData = null, onQuoteCreated, onCancel }) => {
  const { toast } = useToast();
  const isEditing = !!initialData;

  const [quoteData, setQuoteData] = useState({
    // Quote Information
    quoteOwner: initialData?.quoteOwner || 'DEVASHREE SALUNKE',
    subject: initialData?.subject || '',
    quoteStage: initialData?.quoteStage || 'Draft',
    team: initialData?.team || '',
    carrier: initialData?.carrier || 'FedEX',
    dealName: initialData?.dealName || '',
    validUntil: initialData?.validUntil || '',
    contactName: initialData?.contactName || '',
    accountName: initialData?.accountName || '',

    // Billing Address
    billingStreet: initialData?.billingStreet || '',
    billingCity: initialData?.billingCity || '',
    billingState: initialData?.billingState || '',
    billingCode: initialData?.billingCode || '',
    billingCountry: initialData?.billingCountry || '',

    // Shipping Address
    shippingStreet: initialData?.shippingStreet || '',
    shippingCity: initialData?.shippingCity || '',
    shippingState: initialData?.shippingState || '',
    shippingCode: initialData?.shippingCode || '',
    shippingCountry: initialData?.shippingCountry || '',

    // Quoted Items
    items: initialData?.items || [
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
    ],

    // Totals
    subTotal: initialData?.subTotal || 0,
    discountTotal: initialData?.discountTotal || 0,
    taxTotal: initialData?.taxTotal || 0,
    adjustment: initialData?.adjustment || 0,
    grandTotal: initialData?.grandTotal || 0,

    // Terms and Conditions
    termsAndConditions: initialData?.termsAndConditions || '',

    // Description
    description: initialData?.description || '',

    // View
    useStandardView: initialData?.useStandardView !== undefined ? initialData.useStandardView : true
  });

  const [copyAddress, setCopyAddress] = useState(false);


  const handleInputChange = (field, value) => {
    setQuoteData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...quoteData.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value
    };

    // Recalculate amount and total
    if (field === 'quantity' || field === 'listPrice') {
      const quantity = field === 'quantity' ? Number(value) || 0 : updatedItems[index].quantity;
      const listPrice = field === 'listPrice' ? Number(value) || 0 : updatedItems[index].listPrice;
      const amount = quantity * listPrice;
      const discount = updatedItems[index].discount || 0;
      const tax = updatedItems[index].tax || 0;
      const total = amount - discount + tax;

      updatedItems[index].amount = amount;
      updatedItems[index].total = total;
    } else if (field === 'discount' || field === 'tax') {
      const amount = updatedItems[index].quantity * updatedItems[index].listPrice;
      const discount = field === 'discount' ? Number(value) || 0 : updatedItems[index].discount;
      const tax = field === 'tax' ? Number(value) || 0 : updatedItems[index].tax;
      const total = amount - discount + tax;

      updatedItems[index].amount = amount;
      updatedItems[index].total = total;
    } else {
      updatedItems[index][field] = value;
    }

    // Calculate totals
    const subTotal = updatedItems.reduce((sum, item) => sum + (item.amount || 0), 0);
    const discountTotal = updatedItems.reduce((sum, item) => sum + (item.discount || 0), 0);
    const taxTotal = updatedItems.reduce((sum, item) => sum + (item.tax || 0), 0);
    const grandTotal = subTotal - discountTotal + taxTotal + quoteData.adjustment;

    setQuoteData(prev => ({
      ...prev,
      items: updatedItems,
      subTotal,
      discountTotal,
      taxTotal,
      grandTotal
    }));
  };

  const handleAddRow = () => {
    const newId = quoteData.items.length > 0
      ? Math.max(...quoteData.items.map(item => item.id)) + 1
      : 1;

    setQuoteData(prev => ({
      ...prev,
      items: [
        ...prev.items,
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
      ]
    }));
  };

  const handleDeleteRow = (id) => {
    if (quoteData.items.length > 1) {
      setQuoteData(prev => ({
        ...prev,
        items: prev.items.filter(item => item.id !== id)
      }));
    }
  };

  const handleCopyAddress = () => {
    setCopyAddress(!copyAddress);
    if (!copyAddress) {
      setQuoteData(prev => ({
        ...prev,
        shippingStreet: prev.billingStreet,
        shippingCity: prev.billingCity,
        shippingState: prev.billingState,
        shippingCode: prev.billingCode,
        shippingCountry: prev.billingCountry
      }));
    } else {
      setQuoteData(prev => ({
        ...prev,
        shippingStreet: '',
        shippingCity: '',
        shippingState: '',
        shippingCode: '',
        shippingCountry: ''
      }));
    }
  };

  const handleSave = () => {
    // Validation
    if (!quoteData.subject || !quoteData.accountName) {
      toast({
        title: "Validation Error",
        description: "Subject and Account Name are required",
        variant: "destructive"
      });
      return;
    }

    // Filter out items with empty product names
    const validItems = quoteData.items.filter(item => item.productName && item.productName.trim() !== '');

    const quoteDataToSave = {
      ...quoteData,
      id: initialData?.id || Date.now().toString(),
      quoteNumber: initialData?.quoteNumber || `QT-${Math.floor(1000 + Math.random() * 9000)}`,
      date: initialData?.date || new Date().toISOString().split('T')[0],
      expiryDate: quoteData.validUntil,
      status: quoteData.quoteStage,
      total: quoteData.grandTotal,
      createdAt: initialData?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      items: validItems
    };

    if (onQuoteCreated) {
      onQuoteCreated(quoteDataToSave);
    }

    toast({
      title: isEditing ? "Quote Updated" : "Quote Created",
      description: `Quote "${quoteData.subject}" has been ${isEditing ? 'updated' : 'created'} successfully.`
    });

    if (onCancel) {
      onCancel();
    }
  };

  const handleSaveAndNew = () => {
    if (!quoteData.subject || !quoteData.accountName) {
      toast({
        title: "Validation Error",
        description: "Subject and Account Name are required",
        variant: "destructive"
      });
      return;
    }

    // Filter out items with empty product names
    const validItems = quoteData.items.filter(item => item.productName && item.productName.trim() !== '');

    const quoteDataToSave = {
      ...quoteData,
      id: Date.now().toString(),
      quoteNumber: `QT-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split('T')[0],
      expiryDate: quoteData.validUntil,
      status: quoteData.quoteStage,
      total: quoteData.grandTotal,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      items: validItems
    };                     

    if (onQuoteCreated) {
      onQuoteCreated(quoteDataToSave);
    }

    toast({
      title: "Quote Created",
      description: `Quote "${quoteData.subject}" has been created successfully.`
    });

    // Reset form for new entry
    setQuoteData({
      quoteOwner: 'DEVASHREE SALUNKE',
      subject: '',
      quoteStage: 'Draft',
      team: '',
      carrier: 'FedEX',
      dealName: '',
      validUntil: '',
      contactName: '',
      accountName: '',
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
      items: [{
        id: 1,
        productName: '',
        quantity: 1,
        listPrice: 0,
        amount: 0,
        discount: 0,
        tax: 0,
        total: 0
      }],
      subTotal: 0,
      discountTotal: 0,
      taxTotal: 0,
      adjustment: 0,
      grandTotal: 0,
      termsAndConditions: '',
      description: '',
      useStandardView: true
    });
    setCopyAddress(false);
  };

  const quoteStages = ['Draft', 'Sent', 'Accepted', 'Rejected', 'Expired'];
  const carriers = ['FedEX', 'UPS', 'DHL', 'USPS', 'Other'];

  return (
    <>
      <Helmet>
        <title>{isEditing ? 'Edit Quote' : 'Create Quote'} - CloudCRM</title>
      </Helmet>
      {/* <XIcon size={48} animated={true} repeat={true} lines={[{color:"#ff1744"},{color:"#2979ff"}]}/>
      <HomeIcon size={48} animated={true} animationType="draw" repeat={true}  house={{color:"#ff1744"}} door={{color:"#2979ff"}}/> */}

      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {isEditing ? 'Edit Quote' : 'Create Quote'}
            </h1>
            <p className="text-muted-foreground mt-1">
              {isEditing ? 'Update quote information' : 'Create a new quote for your customer'}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={onCancel}>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-6">
            {/* Edit Page Layout */}
            <Card>
              <CardHeader>
                <CardTitle>Create Form Views</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="standard-view"
                      checked={quoteData.useStandardView}
                      onCheckedChange={(checked) => handleInputChange('useStandardView', checked)}
                    />
                    <Label htmlFor="standard-view">Standard View</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Create a custom form page
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Form Fields */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quote Information */}
            <Card>
              <CardHeader>
                <CardTitle>Quote Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quote-owner">Quote Owner</Label>
                    <Input
                      id="quote-owner"
                      value={quoteData.quoteOwner}
                      onChange={(e) => handleInputChange('quoteOwner', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      value={quoteData.subject}
                      onChange={(e) => handleInputChange('subject', e.target.value)}
                      placeholder="Quote subject"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="quote-stage">Quote Stage</Label>
                    <Select
                      value={quoteData.quoteStage}
                      onValueChange={(value) => handleInputChange('quoteStage', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {quoteStages.map(stage => (
                          <SelectItem key={stage} value={stage}>{stage}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="team">Team</Label>
                    <Input
                      id="team"
                      value={quoteData.team}
                      onChange={(e) => handleInputChange('team', e.target.value)}
                      placeholder="Team name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="carrier">Carrier</Label>
                    <Select
                      value={quoteData.carrier}
                      onValueChange={(value) => handleInputChange('carrier', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {carriers.map(carrier => (
                          <SelectItem key={carrier} value={carrier}>{carrier}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deal-name">Deal Name</Label>
                    <Input
                      id="deal-name"
                      value={quoteData.dealName}
                      onChange={(e) => handleInputChange('dealName', e.target.value)}
                      placeholder="Deal name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="valid-until">Valid Until</Label>
                    <Input
                      id="valid-until"
                      type="date"
                      value={quoteData.validUntil}
                      onChange={(e) => handleInputChange('validUntil', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact-name">Contact Name</Label>
                    <Input
                      id="contact-name"
                      value={quoteData.contactName}
                      onChange={(e) => handleInputChange('contactName', e.target.value)}
                      placeholder="Contact person name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="account-name">Account Name *</Label>
                    <Input
                      id="account-name"
                      value={quoteData.accountName}
                      onChange={(e) => handleInputChange('accountName', e.target.value)}
                      placeholder="Account/Company name"
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Address Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Address Information</span>
                  <Button
                    variant={copyAddress ? "default" : "outline"}
                    size="sm"
                    onClick={handleCopyAddress}
                  >
                    <CopyIcon className="w-4 h-4 mr-2" />
                    Copy Address
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Billing Address */}
                  <div>
                    <h3 className="text-sm font-medium mb-3">Billing Address</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="billing-street">Billing Street</Label>
                        <Input
                          id="billing-street"
                          value={quoteData.billingStreet}
                          onChange={(e) => handleInputChange('billingStreet', e.target.value)}
                          placeholder="Street address"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="billing-city">Billing City</Label>
                        <Input
                          id="billing-city"
                          value={quoteData.billingCity}
                          onChange={(e) => handleInputChange('billingCity', e.target.value)}
                          placeholder="City"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="billing-state">Billing State</Label>
                        <Input
                          id="billing-state"
                          value={quoteData.billingState}
                          onChange={(e) => handleInputChange('billingState', e.target.value)}
                          placeholder="State"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="billing-code">Billing Code</Label>
                        <Input
                          id="billing-code"
                          value={quoteData.billingCode}
                          onChange={(e) => handleInputChange('billingCode', e.target.value)}
                          placeholder="Postal code"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="billing-country">Billing Country</Label>
                        <Input
                          id="billing-country"
                          value={quoteData.billingCountry}
                          onChange={(e) => handleInputChange('billingCountry', e.target.value)}
                          placeholder="Country"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div>
                    <h3 className="text-sm font-medium mb-3">Shipping Address</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="shipping-street">Shipping Street</Label>
                        <Input
                          id="shipping-street"
                          value={quoteData.shippingStreet}
                          onChange={(e) => handleInputChange('shippingStreet', e.target.value)}
                          placeholder="Street address"
                          disabled={copyAddress}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="shipping-city">Shipping City</Label>
                        <Input
                          id="shipping-city"
                          value={quoteData.shippingCity}
                          onChange={(e) => handleInputChange('shippingCity', e.target.value)}
                          placeholder="City"
                          disabled={copyAddress}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="shipping-state">Shipping State</Label>
                        <Input
                          id="shipping-state"
                          value={quoteData.shippingState}
                          onChange={(e) => handleInputChange('shippingState', e.target.value)}
                          placeholder="State"
                          disabled={copyAddress}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="shipping-code">Shipping Code</Label>
                        <Input
                          id="shipping-code"
                          value={quoteData.shippingCode}
                          onChange={(e) => handleInputChange('shippingCode', e.target.value)}
                          placeholder="Postal code"
                          disabled={copyAddress}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="shipping-country">Shipping Country</Label>
                        <Input
                          id="shipping-country"
                          value={quoteData.shippingCountry}
                          onChange={(e) => handleInputChange('shippingCountry', e.target.value)}
                          placeholder="Country"
                          disabled={copyAddress}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quoted Items */}
            <Card>
              <CardHeader>
                <CardTitle>Quoted Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-16">S.NO</TableHead>
                          <TableHead>Product Name</TableHead>
                          <TableHead className="w-24">Quantity</TableHead>
                          <TableHead className="w-32">List Price (Rs.)</TableHead>
                          <TableHead className="w-32">Amount (Rs.)</TableHead>
                          <TableHead className="w-32">Discount (Rs.)</TableHead>
                          <TableHead className="w-32">Tax (Rs.)</TableHead>
                          <TableHead className="w-32">Total (Rs.)</TableHead>
                          <TableHead className="w-16">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {quoteData.items.map((item, index) => (
                          <TableRow key={item.id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>
                              <Input
                                value={item.productName}
                                onChange={(e) => handleItemChange(index, 'productName', e.target.value)}
                                placeholder="Product name"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                                min="1"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                value={item.listPrice}
                                onChange={(e) => handleItemChange(index, 'listPrice', e.target.value)}
                                placeholder="0.00"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                value={item.amount}
                                disabled
                                className="bg-gray-50"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                value={item.discount}
                                onChange={(e) => handleItemChange(index, 'discount', e.target.value)}
                                placeholder="0.00"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                value={item.tax}
                                onChange={(e) => handleItemChange(index, 'tax', e.target.value)}
                                placeholder="0.00"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                value={item.total}
                                disabled
                                className="bg-gray-50 font-medium"
                              />
                            </TableCell>
                            <TableCell>
                              {quoteData.items.length > 1 && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteRow(item.id)}
                                  className="h-8 w-8 p-0 text-red-600 hover:text-red-800"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <Button onClick={handleAddRow} variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Add row
                  </Button>
                </div>

                {/* Totals */}
                <div className="mt-6 pt-6 border-t">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div className="space-y-2">
                      <Label>Sub Total (Rs.)</Label>
                      <Input
                        value={quoteData.subTotal}
                        disabled
                        className="bg-gray-50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Discount (Rs.)</Label>
                      <Input
                        value={quoteData.discountTotal}
                        disabled
                        className="bg-gray-50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Tax (Rs.)</Label>
                      <Input
                        value={quoteData.taxTotal}
                        disabled
                        className="bg-gray-50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Adjustment (Rs.)</Label>
                      <Input
                        type="number"
                        value={quoteData.adjustment}
                        onChange={(e) => {
                          const adjustment = Number(e.target.value) || 0;
                          handleInputChange('adjustment', adjustment);
                          handleInputChange('grandTotal',
                            quoteData.subTotal - quoteData.discountTotal + quoteData.taxTotal + adjustment
                          );
                        }}
                        placeholder="0.00"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-semibold">Grand Total (Rs.)</Label>
                      <Input
                        value={quoteData.grandTotal}
                        disabled
                        className="bg-gray-50 font-bold"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Terms and Conditions */}
            <Card>
              <CardHeader>
                <CardTitle>Terms and Conditions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="terms">Terms and Conditions</Label>
                  <Textarea
                    id="terms"
                    rows={4}
                    value={quoteData.termsAndConditions}
                    onChange={(e) => handleInputChange('termsAndConditions', e.target.value)}
                    placeholder="Enter terms and conditions..."
                    className="resize-none"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Description Information */}
            <Card>
              <CardHeader>
                <CardTitle>Description Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    rows={4}
                    value={quoteData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Enter quote description..."
                    className="resize-none"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateQuoteForm;