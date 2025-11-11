import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';

const ConvertLeadDialog = ({ open, onOpenChange, lead, onConvert }) => {
  const [createDeal, setCreateDeal] = useState(true);
  const [dealValue, setDealValue] = useState('');
  const { toast } = useToast();

  const handleConvert = () => {
    if (!lead) return;
    
    onConvert({
      leadId: lead.id,
      accountName: lead.company,
      contact: {
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        company: lead.company,
        role: 'Contact'
      },
      createDeal,
      deal: createDeal ? {
        title: `${lead.company} Deal`,
        company: lead.company,
        value: parseInt(dealValue) || 0,
        stage: 'qualification',
        closeDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(),
      } : null
    });

    toast({ title: "Lead Converted!", description: `${lead.name} has been converted.` });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Convert Lead: {lead?.name}</DialogTitle>
          <DialogDescription>
            This will create a new Account and Contact from this lead. You can also create a new Deal.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="p-4 border rounded-md bg-secondary/50">
            <p className="font-semibold">New Account: <span className="font-normal">{lead?.company}</span></p>
            <p className="font-semibold">New Contact: <span className="font-normal">{lead?.name}</span></p>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="create-deal" checked={createDeal} onCheckedChange={setCreateDeal} />
            <Label htmlFor="create-deal">Create a new Deal for this Account</Label>
          </div>
          {createDeal && (
            <div className="space-y-2 pl-6">
              <Label htmlFor="deal-value">Deal Value ($)</Label>
              <Input 
                id="deal-value" 
                type="number" 
                placeholder="e.g., 5000"
                value={dealValue}
                onChange={(e) => setDealValue(e.target.value)}
              />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleConvert}>Convert</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConvertLeadDialog;