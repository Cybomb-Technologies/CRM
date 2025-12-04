import React, { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import accountsAPI from "./accountsAPI";

const AccountDetailSheet = ({ open, onOpenChange, account, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (account) {
      setFormData(account);
      setIsEditing(false);
    }
  }, [account]);

  const handleInputChange = (field, value) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleSave = async () => {
    if (!account?._id && !account?.id) {
      toast({
        title: "Error",
        description: "Account ID not found.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await accountsAPI.updateAccount(
        account._id || account.id,
        formData
      );

      if (response.success) {
        toast({
          title: "Account Updated",
          description: "The account details have been saved.",
        });
        setIsEditing(false);
        if (onSave) {
          onSave(response.data);
        }
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to update account",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save account details.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!account) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            {isEditing ? "Edit Account" : "Account Details"}
          </SheetTitle>
          <SheetDescription>
            {isEditing ? "Update the details for this account." : account.name}
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-4 py-6">
          <div className="space-y-2">
            <Label htmlFor="name">Account Name</Label>
            <Input
              id="name"
              value={formData.name || ""}
              onChange={(e) => handleInputChange("name", e.target.value)}
              readOnly={!isEditing}
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              value={formData.website || ""}
              onChange={(e) => handleInputChange("website", e.target.value)}
              readOnly={!isEditing}
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={formData.phone || ""}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              readOnly={!isEditing}
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="industry">Industry</Label>
            <Input
              id="industry"
              value={formData.industry || ""}
              onChange={(e) => handleInputChange("industry", e.target.value)}
              readOnly={!isEditing}
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={formData.email || ""}
              onChange={(e) => handleInputChange("email", e.target.value)}
              readOnly={!isEditing}
              disabled={loading}
            />
          </div>
        </div>
        <SheetFooter>
          {isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </Button>
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
