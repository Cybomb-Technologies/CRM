// src/components/files/inventory/products/CreateProductForm.jsx
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Save, Plus, X, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks';

const CreateProductForm = ({ onProductCreated, initialData = null, onCancel }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditing = !!initialData;

  const [formData, setFormData] = useState({
    // Product Information
    productOwner: initialData?.productOwner || 'DEVASHREE SALUNKE',
    productCode: initialData?.productCode || '',
    productActive: initialData?.productActive !== undefined ? initialData.productActive : true,
    productCategory: initialData?.productCategory || '',
    salesEndDate: initialData?.salesEndDate || '',
    supportEndDate: initialData?.supportEndDate || '',
    productName: initialData?.productName || '',
    vendorName: initialData?.vendorName || '',
    companyEmail: initialData?.companyEmail || '',
    companyPhone: initialData?.companyPhone || '',
    manufacturer: initialData?.manufacturer || '',
    salesStartDate: initialData?.salesStartDate || '',
    supportStartDate: initialData?.supportStartDate || '',
    status: initialData?.status || 'Active',


    // Price Information
    unitPrice: initialData?.unitPrice || '',
    tax: initialData?.tax || 'None',
    commissionRate: initialData?.commissionRate || '',
    taxable: initialData?.taxable !== undefined ? initialData.taxable : false,

    // Stock Information
    usageUnit: initialData?.usageUnit || 'Box',
    quantityInStock: initialData?.quantityInStock || '',
    handler: initialData?.handler || 'None',
    qtyOrdered: initialData?.qtyOrdered || '',
    reorderLevel: initialData?.reorderLevel || '',
    quantityInDemand: initialData?.quantityInDemand || '',

    // Description Information
    description: initialData?.description || '',

    // Image
    productImage: initialData?.productImage || null
  });

  const [imagePreview, setImagePreview] = useState(initialData?.productImage || null);

  useEffect(() => {
    if (initialData) {
      // Map the initial data to match form structure
      setFormData({
        productOwner: initialData.productOwner || 'DEVASHREE SALUNKE',
        productCode: initialData.sku || '',
        productActive: initialData.status === 'Active',
        productCategory: initialData.category || '',
        salesEndDate: '',
        supportEndDate: '',
        productName: initialData.name || '',
        vendorName: initialData.vendorName || '',
        companyEmail: initialData.email || initialData.companyEmail || '',
        companyPhone: initialData.phone || initialData.companyPhone || '',
        manufacturer: initialData.manufacturer || '',
        salesStartDate: '',
        supportStartDate: '',
        unitPrice: initialData.price || '',
        tax: 'None',
        commissionRate: '',
        taxable: false,
        usageUnit: 'Box',
        quantityInStock: initialData.stock || '',
        handler: 'None',
        qtyOrdered: initialData.qtyOrdered || '',
        reorderLevel: initialData.reorderLevel || '',
        quantityInDemand: initialData.quantityInDemand || '',
        description: initialData.description || '',
        productImage: null,
        status: initialData.status || 'Active'
      });
    }
  }, [initialData]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file); // Store file for upload
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
        // Don't set formData.productImage here as we'll send the file explicitly
      };
      reader.readAsDataURL(file);
    }
  };

  const saveProduct = async (shouldReset = false) => {
    // Validation
    if (!formData.productName || !formData.productCode) {
      toast({
        title: "Validation Error",
        description: "Product Name and Product Code are required",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const data = new FormData();

      // Append all text fields
      Object.keys(formData).forEach(key => {
        if (key === 'productImage') return; // Skip image URL

        let value = formData[key];
        if (value === null || value === undefined) value = '';

        data.append(key, value);
      });

      // Append file if selected
      if (selectedFile) {
        data.append('productImage', selectedFile);
      }

      // Get token
      const token = localStorage.getItem('token') || localStorage.getItem('crm_token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const url = isEditing
        ? `${API_URL}/products/${initialData.id}`
        : `${API_URL}/products`;

      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`
          // Content-Type is set automatically for FormData
        },
        body: data
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to save product');
      }

      toast({
        title: isEditing ? "Product Updated" : "Product Created",
        description: `Product "${formData.productName}" has been saved successfully.`
      });

      if (onProductCreated) {
        onProductCreated(result.data);
      }

      if (shouldReset) {
        // Reset form
        setFormData({
          productOwner: 'DEVASHREE SALUNKE',
          productCode: '',
          productActive: true,
          productCategory: '',
          salesEndDate: '',
          supportEndDate: '',
          productName: '',
          vendorName: '',
          companyEmail: '',
          companyPhone: '',
          manufacturer: '',
          salesStartDate: '',
          supportStartDate: '',
          unitPrice: '',
          tax: 'None',
          commissionRate: '',
          taxable: false,
          usageUnit: 'Box',
          quantityInStock: '',
          handler: 'None',
          qtyOrdered: '',
          reorderLevel: '',
          quantityInDemand: '',
          description: '',
          productImage: null,
          status: 'Active'
        });
        setImagePreview(null);
        setSelectedFile(null);
      } else if (!isEditing) {
        if (onCancel) {
          onCancel();
        } else {
          navigate('/products');
        }
      }
    } catch (error) {
      console.error('Save product error:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSave = () => {
    saveProduct(false);
  };

  const handleSaveAndNew = () => {
    saveProduct(true);
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate('/products');
    }
  };

  return (
    <>
      <Helmet>
        <title>{isEditing ? 'Edit Product' : 'Create Product'} - CloudCRM</title>
      </Helmet>

      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {isEditing ? 'Edit Product' : 'Create Product'}
            </h1>
            <p className="text-muted-foreground mt-1">
              {isEditing ? 'Update product information' : 'Add a new product to your catalog'}
            </p>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Product Image */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Image</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    {imagePreview ? (
                      <div className="space-y-2">
                        <img
                          src={imagePreview}
                          alt="Product preview"
                          className="mx-auto h-32 w-32 object-cover rounded"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setImagePreview(null);
                            handleInputChange('productImage', null);
                          }}
                        >
                          Remove Image
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="mx-auto h-8 w-8 text-gray-400" />
                        <div className="text-sm text-gray-600">
                          <label htmlFor="product-image" className="cursor-pointer">
                            <span className="font-medium text-blue-600">Click to upload</span>
                            {' '}or drag and drop
                          </label>
                          <input
                            id="product-image"
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageUpload}
                          />
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="product-active"
                      checked={formData.productActive}
                      onCheckedChange={(checked) => handleInputChange('productActive', checked)}
                    />
                    <Label htmlFor="product-active">Product Active</Label>
                  </div>
                </div>
              </CardContent>
            </Card>


          </div>

          {/* Right Column - Form Fields */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Information */}
            <Card>
              <CardHeader>
                <CardTitle>Product Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="product-owner">Product Owner</Label>
                    <Input
                      id="product-owner"
                      value={formData.productOwner}
                      onChange={(e) => handleInputChange('productOwner', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="product-code">Product Code *</Label>
                    <Input
                      id="product-code"
                      value={formData.productCode}
                      onChange={(e) => handleInputChange('productCode', e.target.value)}
                      placeholder="e.g., LAP-PRO-X1"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="product-category">Product Category</Label>
                    <Input
                      id="product-category"
                      type="text"
                      placeholder="Enter product category"
                      value={formData.productCategory}
                      onChange={(e) => handleInputChange('productCategory', e.target.value)}
                    />
                  </div>


                  <div className="space-y-2">
                    <Label htmlFor="sales-end-date">Sales End Date</Label>
                    <Input
                      id="sales-end-date"
                      type="date"
                      value={formData.salesEndDate}
                      onChange={(e) => handleInputChange('salesEndDate', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="support-end-date">Support End Date</Label>
                    <Input
                      id="support-end-date"
                      type="date"
                      value={formData.supportEndDate}
                      onChange={(e) => handleInputChange('supportEndDate', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="product-name">Product Name *</Label>
                    <Input
                      id="product-name"
                      value={formData.productName}
                      onChange={(e) => handleInputChange('productName', e.target.value)}
                      placeholder="e.g., Laptop Pro X1"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="vendor-name">Company</Label>
                    <Input
                      id="vendor-name"
                      value={formData.vendorName}
                      onChange={(e) => handleInputChange('vendorName', e.target.value)}
                      placeholder="e.g., Tech Corp Suppliers"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company-email">Email</Label>
                    <Input
                      id="company-email"
                      type="email"
                      value={formData.companyEmail}
                      onChange={(e) => handleInputChange('companyEmail', e.target.value)}
                      placeholder="e.g., info@company.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company-phone">Phone</Label>
                    <Input
                      id="company-phone"
                      type="tel"
                      value={formData.companyPhone}
                      onChange={(e) => handleInputChange('companyPhone', e.target.value)}
                      placeholder="e.g., +1 234 567 8900"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="manufacturer">Manufacturer</Label>
                    <Input
                      id="manufacturer"
                      type="text"
                      placeholder="Enter manufacturer name"
                      value={formData.manufacturer}
                      onChange={(e) => handleInputChange('manufacturer', e.target.value)}
                    />
                  </div>


                  <div className="space-y-2">
                    <Label htmlFor="sales-start-date">Sales Start Date</Label>
                    <Input
                      id="sales-start-date"
                      type="date"
                      value={formData.salesStartDate}
                      onChange={(e) => handleInputChange('salesStartDate', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="support-start-date">Support Start Date</Label>
                    <Input
                      id="support-start-date"
                      type="date"
                      value={formData.supportStartDate}
                      onChange={(e) => handleInputChange('supportStartDate', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => handleInputChange('status', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Price Information */}
            <Card>
              <CardHeader>
                <CardTitle>Price Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="unit-price">Unit Price ($)</Label>
                    <Input
                      id="unit-price"
                      type="number"
                      step="0.01"
                      value={formData.unitPrice}
                      onChange={(e) => handleInputChange('unitPrice', e.target.value)}
                      placeholder="0.00"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tax">Tax</Label>
                    <Select
                      value={formData.tax}
                      onValueChange={(value) => handleInputChange('tax', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="None">None</SelectItem>
                        <SelectItem value="GST">GST</SelectItem>
                        <SelectItem value="VAT">VAT</SelectItem>
                        <SelectItem value="Sales Tax">Sales Tax</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="commission-rate">Commission Rate (%)</Label>
                    <Input
                      id="commission-rate"
                      type="number"
                      step="0.01"
                      value={formData.commissionRate}
                      onChange={(e) => handleInputChange('commissionRate', e.target.value)}
                      placeholder="0.00"
                    />
                  </div>

                  <div className="flex items-center space-x-2 pt-6">
                    <Checkbox
                      id="taxable"
                      checked={formData.taxable}
                      onCheckedChange={(checked) => handleInputChange('taxable', checked)}
                    />
                    <Label htmlFor="taxable">Taxable</Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stock Information */}
            <Card>
              <CardHeader>
                <CardTitle>Stock Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="usage-unit">Usage Unit</Label>
                    <Select
                      value={formData.usageUnit}
                      onValueChange={(value) => handleInputChange('usageUnit', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Box">Box</SelectItem>
                        <SelectItem value="Piece">Piece</SelectItem>
                        <SelectItem value="Kg">Kg</SelectItem>
                        <SelectItem value="Liter">Liter</SelectItem>
                        <SelectItem value="Meter">Meter</SelectItem>
                        <SelectItem value="Unit">Unit</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="quantity-in-stock">Quantity in Stock</Label>
                    <Input
                      id="quantity-in-stock"
                      type="number"
                      value={formData.quantityInStock}
                      onChange={(e) => handleInputChange('quantityInStock', e.target.value)}
                      placeholder="0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="handler">Handler</Label>
                    <Select
                      value={formData.handler}
                      onValueChange={(value) => handleInputChange('handler', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="None">None</SelectItem>
                        <SelectItem value="Warehouse A">Warehouse A</SelectItem>
                        <SelectItem value="Warehouse B">Warehouse B</SelectItem>
                        <SelectItem value="Main Storage">Main Storage</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="qty-ordered">Qty Ordered</Label>
                    <Input
                      id="qty-ordered"
                      type="number"
                      value={formData.qtyOrdered}
                      onChange={(e) => handleInputChange('qtyOrdered', e.target.value)}
                      placeholder="0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reorder-level">Reorder Level</Label>
                    <Input
                      id="reorder-level"
                      type="number"
                      value={formData.reorderLevel}
                      onChange={(e) => handleInputChange('reorderLevel', e.target.value)}
                      placeholder="0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="quantity-in-demand">Quantity in Demand</Label>
                    <Input
                      id="quantity-in-demand"
                      type="number"
                      value={formData.quantityInDemand}
                      onChange={(e) => handleInputChange('quantityInDemand', e.target.value)}
                      placeholder="0"
                    />
                  </div>
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
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Enter product description..."
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

export default CreateProductForm;