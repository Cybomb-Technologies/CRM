import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';

const CreateDealDialog = ({ open, onOpenChange, onDealCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    value: '',
    stage: 'qualification',
    closeDate: ''
  });
  const { toast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newDeal = {
      id: Date.now().toString(),
      ...formData,
      value: parseInt(formData.value) || 0,
      closeDate: new Date(formData.closeDate).toISOString(),
      probability: 25,
      owner: 'John Doe'
    };
    
    if (onDealCreated) onDealCreated(newDeal);
    
    toast({
      title: "Deal Created",
      description: `${formData.title} has been added successfully.`
    });
    
    setFormData({ title: '', company: '', value: '', stage: 'qualification', closeDate: '' });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Deal</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="deal-title">Deal Title *</Label>
            <Input
              id="deal-title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="deal-company">Company *</Label>
            <Input
              id="deal-company"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              required
            />
          </div>
          
           <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
                <Label htmlFor="deal-value">Value ($)</Label>
                <Input
                  id="deal-value"
                  type="number"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deal-stage">Stage</Label>
                <Select value={formData.stage} onValueChange={(value) => setFormData({ ...formData, stage: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="qualification">Qualification</SelectItem>
                    <SelectItem value="proposal">Proposal</SelectItem>
                    <SelectItem value="negotiation">Negotiation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
          </div>
          
           <div className="space-y-2">
            <Label htmlFor="close-date">Expected Close Date</Label>
            <Input
              id="close-date"
              type="date"
              value={formData.closeDate}
              onChange={(e) => setFormData({ ...formData, closeDate: e.target.value })}
              required
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Create Deal
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateDealDialog;