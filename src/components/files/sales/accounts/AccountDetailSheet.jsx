import React, { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

const AccountDetailSheet = ({ open, onOpenChange, account, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const { toast } = useToast();

  useEffect(() => {
    if (account) {
      setFormData(account);
      setIsEditing(false);
    }
  }, [account]);

  const handleSave = () => {
    onSave(formData);
    toast({ title: "Account Updated", description: "The account details have been saved." });
    setIsEditing(false);
  };

  if (!account) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{isEditing ? 'Edit Account' : 'Account Details'}</SheetTitle>
          <SheetDescription>{isEditing ? 'Update the details for this account.' : account.name}</SheetDescription>
        </SheetHeader>
        <div className="space-y-4 py-6">
          <div className="space-y-2">
            <Label htmlFor="name">Account Name</Label>
            <Input id="name" value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} readOnly={!isEditing} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input id="website" value={formData.website || ''} onChange={(e) => setFormData({ ...formData, website: e.target.value })} readOnly={!isEditing} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" value={formData.phone || ''} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} readOnly={!isEditing} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="industry">Industry</Label>
            <Input id="industry" value={formData.industry || ''} onChange={(e) => setFormData({ ...formData, industry: e.target.value })} readOnly={!isEditing} />
          </div>
        </div>
        <SheetFooter>
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
              <Button onClick={handleSave}>Save Changes</Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>Edit Account</Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default AccountDetailSheet;