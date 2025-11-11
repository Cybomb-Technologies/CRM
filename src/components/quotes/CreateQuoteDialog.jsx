import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { useData } from '@/contexts/DataContext';

const CreateQuoteDialog = ({ open, onOpenChange, onQuoteCreated }) => {
  const { data } = useData();
  const [formData, setFormData] = useState({
    deal: '',
    total: '',
    status: 'Draft'
  });
  const { toast } = useToast();
  const allDeals = Object.values(data.deals).flat();

  const handleSubmit = (e) => {
    e.preventDefault();
    const quoteCount = data.quotes.length + 1;
    const newQuote = {
      id: Date.now(),
      quoteNumber: `Q-2025-${String(quoteCount).padStart(3, '0')}`,
      ...formData,
      total: parseFloat(formData.total) || 0,
    };
    if (onQuoteCreated) onQuoteCreated(newQuote);
    toast({ title: "Quote Created", description: "The new quote has been created." });
    onOpenChange(false);
    setFormData({ deal: '', total: '', status: 'Draft' });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Quote</DialogTitle>
          <DialogDescription>Generate a new quote for a deal.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="deal">Related Deal *</Label>
            <Select onValueChange={(value) => setFormData({...formData, deal: value})} required>
              <SelectTrigger><SelectValue placeholder="Select a deal" /></SelectTrigger>
              <SelectContent>
                {allDeals.map(deal => <SelectItem key={deal.id} value={deal.title}>{deal.title}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="total">Total Amount ($) *</Label>
              <Input id="total" type="number" value={formData.total} onChange={(e) => setFormData({...formData, total: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Sent">Sent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Create Quote</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateQuoteDialog;