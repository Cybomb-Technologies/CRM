import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

const CreateProductDialog = ({ open, onOpenChange, onProductCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    price: '',
    category: ''
  });
  const { toast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    const newProduct = {
      id: Date.now(),
      ...formData,
      price: parseFloat(formData.price) || 0,
    };
    if (onProductCreated) onProductCreated(newProduct);
    toast({ title: "Product Created", description: "The new product has been added." });
    onOpenChange(false);
    setFormData({ name: '', sku: '', price: '', category: '' });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Product</DialogTitle>
          <DialogDescription>Add a new product to your catalog.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name *</Label>
            <Input id="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sku">SKU</Label>
              <Input id="sku" value={formData.sku} onChange={(e) => setFormData({...formData, sku: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price ($) *</Label>
              <Input id="price" type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} required />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input id="category" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Create Product</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProductDialog;