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
    manufacturer: initialData?.manufacturer || '',
    salesStartDate: initialData?.salesStartDate || '',
    supportStartDate: initialData?.supportStartDate || '',
    
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
        productImage: null
      });
    }
  }, [initialData]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
        handleInputChange('productImage', e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    // Validation
    if (!formData.productName || !formData.productCode) {
      toast({
        title: "Validation Error",
        description: "Product Name and Product Code are required",
        variant: "destructive"
      });
      return;
    }

    const productData = {
      id: initialData?.id || Date.now().toString(),
      ...formData,
      name: formData.productName,
      sku: formData.productCode,
      price: parseFloat(formData.unitPrice) || 0,
      stock: parseInt(formData.quantityInStock) || 0,
      category: formData.productCategory,
      status: formData.productActive ? 'Active' : 'Inactive',
      company: formData.vendorName || 'Unknown',
      email: '',
      phone: '',
      source: 'Direct',
      flags: '',
      created: new Date().toISOString().split('T')[0],
      qtyOrdered: parseInt(formData.qtyOrdered) || 0,
      reorderLevel: parseInt(formData.reorderLevel) || 0,
      quantityInDemand: parseInt(formData.quantityInDemand) || 0,
      commissionRate: parseFloat(formData.commissionRate) || 0,
      createdAt: initialData?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (onProductCreated) {
      onProductCreated(productData);
    }

    toast({
      title: isEditing ? "Product Updated" : "Product Created",
      description: `Product "${formData.productName}" has been ${isEditing ? 'updated' : 'created'} successfully.`
    });

    if (onCancel) {
      onCancel();
    } else {
      navigate('/products');
    }
  };

  const handleSaveAndNew = () => {
    if (!formData.productName || !formData.productCode) {
      toast({
        title: "Validation Error",
        description: "Product Name and Product Code are required",
        variant: "destructive"
      });
      return;
    }

    const productData = {
      id: Date.now().toString(),
      ...formData,
      name: formData.productName,
      sku: formData.productCode,
      price: parseFloat(formData.unitPrice) || 0,
      stock: parseInt(formData.quantityInStock) || 0,
      category: formData.productCategory,
      status: formData.productActive ? 'Active' : 'Inactive',
      company: formData.vendorName || 'Unknown',
      email: '',
      phone: '',
      source: 'Direct',
      flags: '',
      created: new Date().toISOString().split('T')[0],
      qtyOrdered: parseInt(formData.qtyOrdered) || 0,
      reorderLevel: parseInt(formData.reorderLevel) || 0,
      quantityInDemand: parseInt(formData.quantityInDemand) || 0,
      commissionRate: parseFloat(formData.commissionRate) || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (onProductCreated) {
      onProductCreated(productData);
    }

    toast({
      title: "Product Created",
      description: `Product "${formData.productName}" has been created successfully.`
    });

    // Reset form for new entry
    setFormData({
      productOwner: 'DEVASHREE SALUNKE',
      productCode: '',
      productActive: true,
      productCategory: '',
      salesEndDate: '',
      supportEndDate: '',
      productName: '',
      vendorName: '',
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
      productImage: null
    });
    setImagePreview(null);
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

            <Card>
              <CardHeader>
                <CardTitle>Edit Page Layout</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    Standard View
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    Create a custom form page
                  </p>
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
                    <Select 
                      value={formData.productCategory} 
                      onValueChange={(value) => handleInputChange('productCategory', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="-None-" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Electronics">Electronics</SelectItem>
                        <SelectItem value="Audio">Audio</SelectItem>
                        <SelectItem value="Wearables">Wearables</SelectItem>
                        <SelectItem value="Storage">Storage</SelectItem>
                        <SelectItem value="Accessories">Accessories</SelectItem>
                        <SelectItem value="Clothing">Clothing</SelectItem>
                        <SelectItem value="Books">Books</SelectItem>
                        <SelectItem value="Home & Garden">Home & Garden</SelectItem>
                        <SelectItem value="Sports">Sports</SelectItem>
                      </SelectContent>
                    </Select>
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
                    <Label htmlFor="vendor-name">Vendor Name</Label>
                    <Input
                      id="vendor-name"
                      value={formData.vendorName}
                      onChange={(e) => handleInputChange('vendorName', e.target.value)}
                      placeholder="e.g., Tech Corp Suppliers"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="manufacturer">Manufacturer</Label>
                    <Select 
                      value={formData.manufacturer} 
                      onValueChange={(value) => handleInputChange('manufacturer', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="-None-" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Tech Corp">Tech Corp</SelectItem>
                        <SelectItem value="Innovation Labs">Innovation Labs</SelectItem>
                        <SelectItem value="Growth Solutions">Growth Solutions</SelectItem>
                        <SelectItem value="Data Systems Inc">Data Systems Inc</SelectItem>
                        <SelectItem value="Audio Masters">Audio Masters</SelectItem>
                        <SelectItem value="Vision Tech">Vision Tech</SelectItem>
                        <SelectItem value="Apple">Apple</SelectItem>
                        <SelectItem value="Samsung">Samsung</SelectItem>
                        <SelectItem value="Sony">Sony</SelectItem>
                        <SelectItem value="LG">LG</SelectItem>
                      </SelectContent>
                    </Select>
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