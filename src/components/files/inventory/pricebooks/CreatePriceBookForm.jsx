import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Save, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks';

const CreatePriceBookForm = ({ onPriceBookCreated, initialData = null }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditing = !!initialData;

  const [formData, setFormData] = useState({
    // Price Book Information
    priceBookOwner: initialData?.priceBookOwner || 'DEVASHREE SALUNKE',
    active: initialData?.active !== undefined ? initialData.active : true,
    priceBookName: initialData?.priceBookName || '',
    pricingModel: initialData?.pricingModel || '',
    
    // Description Information
    description: initialData?.description || '',
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    // Validation
    if (!formData.priceBookName) {
      toast({
        title: "Validation Error",
        description: "Price Book Name is required",
        variant: "destructive"
      });
      return;
    }

    const priceBookData = {
      id: initialData?.id || Date.now().toString(),
      ...formData,
      createdAt: initialData?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      products: initialData?.products || 0,
      // For compatibility with the list view
      name: formData.priceBookName,
      description: formData.description
    };

    if (onPriceBookCreated) {
      onPriceBookCreated(priceBookData);
    }

    toast({
      title: isEditing ? "Price Book Updated" : "Price Book Created",
      description: `Price Book "${formData.priceBookName}" has been ${isEditing ? 'updated' : 'created'} successfully.`
    });

    navigate('/price-books');
  };

  const handleSaveAndNew = () => {
    if (!formData.priceBookName) {
      toast({
        title: "Validation Error",
        description: "Price Book Name is required",
        variant: "destructive"
      });
      return;
    }

    const priceBookData = {
      id: Date.now().toString(),
      ...formData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      products: 0,
      name: formData.priceBookName
    };

    if (onPriceBookCreated) {
      onPriceBookCreated(priceBookData);
    }

    toast({
      title: "Price Book Created",
      description: `Price Book "${formData.priceBookName}" has been created successfully.`
    });

    // Reset form for new entry
    setFormData({
      priceBookOwner: 'DEVASHREE SALUNKE',
      active: true,
      priceBookName: '',
      pricingModel: '',
      description: '',
    });
  };

  const handleCancel = () => {
    navigate('/price-books');
  };

  return (
    <>
      <Helmet>
        <title>{isEditing ? 'Edit Price Book' : 'Create Price Book'} - CloudCRM</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header Actions */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {isEditing ? 'Edit Price Book' : 'Create Price Book'}
              </h1>
              <p className="text-gray-600 mt-1">
                {isEditing ? 'Update price book information' : 'Add a new price book to your catalog'}
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

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Column - Layout Options */}
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Edit Page Layout</CardTitle>
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

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Create Form Views</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      Standard View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Form Fields */}
            <div className="lg:col-span-3 space-y-6">
              {/* Price Book Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Price Book Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="price-book-owner">Price Book Owner</Label>
                        <Input
                          id="price-book-owner"
                          value={formData.priceBookOwner}
                          onChange={(e) => handleInputChange('priceBookOwner', e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="price-book-name">Price Book Name *</Label>
                        <Input
                          id="price-book-name"
                          value={formData.priceBookName}
                          onChange={(e) => handleInputChange('priceBookName', e.target.value)}
                          placeholder="Enter price book name"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center space-x-2 pt-6">
                        <Checkbox 
                          id="active"
                          checked={formData.active}
                          onCheckedChange={(checked) => handleInputChange('active', checked)}
                        />
                        <Label htmlFor="active">Active</Label>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="pricing-model">Pricing Model</Label>
                        <Select 
                          value={formData.pricingModel} 
                          onValueChange={(value) => handleInputChange('pricingModel', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="-None-" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="standard">Standard Pricing</SelectItem>
                            <SelectItem value="tiered">Tiered Pricing</SelectItem>
                            <SelectItem value="volume">Volume Pricing</SelectItem>
                            <SelectItem value="subscription">Subscription Pricing</SelectItem>
                            <SelectItem value="custom">Custom Pricing</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
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
                      placeholder="Enter price book description..."
                      className="resize-none"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreatePriceBookForm;