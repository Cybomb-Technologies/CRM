// src/components/files/sales/accounts/AccountForm.jsx
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Building2,
  Globe,
  Phone,
  Mail,
  MapPin,
  IndianRupee,
  Users,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import accountsAPI from "./accountsAPI";

const AccountForm = ({ onSuccess, onCancel, initialData }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef(null);

  const [formData, setFormData] = useState({
    // Account Information
    name: "",
    website: "",
    phone: "",
    email: "",
    industry: "",
    type: "Customer",
    employees: "",
    annualRevenue: "",

    // Address Information
    billingAddress: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
    shippingAddress: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },

    // Description
    description: "",
  });

  // Initialize form with initialData when editing
  useEffect(() => {
    if (initialData) {
      // Create a clean copy WITHOUT _id or id for form
      const cleanData = { ...initialData };
      delete cleanData._id;
      delete cleanData.id;
      delete cleanData.__v;
      delete cleanData.createdAt;
      delete cleanData.updatedAt;
      delete cleanData.createdBy;
      delete cleanData.updatedBy;

      setFormData((prev) => ({
        ...prev,
        ...cleanData,
        employees: cleanData.employees?.toString() || "",
        annualRevenue: cleanData.annualRevenue?.toString() || "0",
        billingAddress: cleanData.billingAddress || {
          street: "",
          city: "",
          state: "",
          zipCode: "",
          country: "",
        },
        shippingAddress: cleanData.shippingAddress || {
          street: "",
          city: "",
          state: "",
          zipCode: "",
          country: "",
        },
      }));
    }
  }, [initialData]);

  const handleChange = (field, value) => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // PREVENT DOUBLE SUBMISSION
    if (isSubmitting || loading) {
      console.log("Already submitting, ignoring duplicate click");
      return;
    }

    setIsSubmitting(true);
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.name || !formData.name.trim()) {
        toast({
          title: "Validation Error",
          description: "Account Name is a required field.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        setLoading(false);
        return;
      }

      // Prepare CLEAN data for API - NO ID FIELDS
      const apiData = {
        name: formData.name.trim(),
        website: formData.website?.trim() || "",
        phone: formData.phone?.trim() || "",
        email: formData.email?.trim() || "",
        industry: formData.industry?.trim() || "",
        type: formData.type,
        employees: formData.employees ? parseInt(formData.employees, 10) : 0,
        annualRevenue: formData.annualRevenue
          ? parseFloat(formData.annualRevenue.replace(/[^\d.]/g, "")) || 0
          : 0,
        contacts: initialData?.contacts || 0,
        description: formData.description?.trim() || "",
        billingAddress: formData.billingAddress,
        shippingAddress: formData.shippingAddress,
      };

      // Ensure NO id fields are present
      delete apiData.id;
      delete apiData._id;
      delete apiData.__v;
      delete apiData.createdAt;
      delete apiData.updatedAt;

      console.log("Creating/updating account with data:", apiData);
      console.log(
        "Annual revenue being sent:",
        apiData.annualRevenue,
        "Type:",
        typeof apiData.annualRevenue
      );

      let response;

      if (initialData) {
        // Update existing account
        const accountId = initialData._id || initialData.id;
        if (!accountId) {
          throw new Error("Account ID not found for update");
        }
        response = await accountsAPI.updateAccount(accountId, apiData);
      } else {
        // Create new account - SINGLE API CALL
        response = await accountsAPI.createAccount(apiData);
      }

      console.log("API Response:", response);

      if (response.success) {
        toast({
          title: initialData ? "Success" : "Success",
          description: initialData
            ? "Account updated successfully"
            : "Account created successfully",
          duration: 3000,
        });
        // Call onSuccess only ONCE
        onSuccess(response.data);
      } else {
        toast({
          title: "Error",
          description:
            response.message ||
            (initialData
              ? "Failed to update account"
              : "Failed to create account"),
          variant: "destructive",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      toast({
        title: "Error",
        description:
          error.message ||
          (initialData
            ? "Failed to update account"
            : "Failed to create account"),
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  // Handle annual revenue input with formatting
  const handleAnnualRevenueChange = (value) => {
    // Remove non-numeric characters except decimal point
    const cleanedValue = value.replace(/[^\d.]/g, "");
    handleChange("annualRevenue", cleanedValue);
  };

  // Format annual revenue for display
  const formatAnnualRevenue = (value) => {
    if (!value) return "0";
    const numValue = parseFloat(value) || 0;
    return numValue.toLocaleString("en-IN");
  };

  const industries = [
    "Agriculture",
    "Apparel",
    "Banking",
    "Biotechnology",
    "Chemicals",
    "Communications",
    "Construction",
    "Consulting",
    "Education",
    "Electronics",
    "Energy",
    "Engineering",
    "Entertainment",
    "Environmental",
    "Finance",
    "Food & Beverage",
    "Government",
    "Healthcare",
    "Hospitality",
    "Insurance",
    "Machinery",
    "Manufacturing",
    "Media",
    "Not For Profit",
    "Recreation",
    "Retail",
    "Shipping",
    "Technology",
    "Telecommunications",
    "Transportation",
    "Utilities",
    "Other",
  ];

  const accountTypes = ["Customer", "Partner", "Vendor", "Prospect", "Other"];

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
      {/* Account Information */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Building2 className="w-5 h-5 mr-2" />
          Account Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Account Name *</label>
              <Input
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Account Name"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Website</label>
              <Input
                value={formData.website}
                onChange={(e) => handleChange("website", e.target.value)}
                placeholder="Website"
                disabled={loading}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Phone</label>
              <Input
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="Phone"
                disabled={loading}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Industry</label>
              <Select
                value={formData.industry}
                onValueChange={(value) => handleChange("industry", value)}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Industry" />
                </SelectTrigger>
                <SelectContent className="max-h-60 overflow-y-auto">
                  {industries.map((industry) => (
                    <SelectItem key={industry} value={industry}>
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="Email"
                disabled={loading}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Account Type</label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleChange("type", value)}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-60 overflow-y-auto">
                  {accountTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Number of Employees</label>
              <Input
                type="number"
                value={formData.employees}
                onChange={(e) => handleChange("employees", e.target.value)}
                placeholder="Employees"
                disabled={loading}
                min="0"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Annual Revenue (₹)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  ₹
                </span>
                <Input
                  value={formData.annualRevenue}
                  onChange={(e) => handleAnnualRevenueChange(e.target.value)}
                  placeholder="0"
                  className="pl-8"
                  disabled={loading}
                />
                <div className="text-xs text-gray-500 mt-1">
                  Current value: ₹{formatAnnualRevenue(formData.annualRevenue)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Billing Address */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <MapPin className="w-5 h-5 mr-2" />
          Billing Address
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Street</label>
            <Input
              value={formData.billingAddress.street}
              onChange={(e) =>
                handleChange("billingAddress.street", e.target.value)
              }
              placeholder="Street Address"
              disabled={loading}
            />
          </div>

          <div>
            <label className="text-sm font-medium">City</label>
            <Input
              value={formData.billingAddress.city}
              onChange={(e) =>
                handleChange("billingAddress.city", e.target.value)
              }
              placeholder="City"
              disabled={loading}
            />
          </div>

          <div>
            <label className="text-sm font-medium">State</label>
            <Input
              value={formData.billingAddress.state}
              onChange={(e) =>
                handleChange("billingAddress.state", e.target.value)
              }
              placeholder="State"
              disabled={loading}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Zip Code</label>
            <Input
              value={formData.billingAddress.zipCode}
              onChange={(e) =>
                handleChange("billingAddress.zipCode", e.target.value)
              }
              placeholder="Zip Code"
              disabled={loading}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Country</label>
            <Input
              value={formData.billingAddress.country}
              onChange={(e) =>
                handleChange("billingAddress.country", e.target.value)
              }
              placeholder="Country"
              disabled={loading}
            />
          </div>
        </div>
      </div>

      {/* Shipping Address */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <MapPin className="w-5 h-5 mr-2" />
          Shipping Address
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Street</label>
            <Input
              value={formData.shippingAddress.street}
              onChange={(e) =>
                handleChange("shippingAddress.street", e.target.value)
              }
              placeholder="Street Address"
              disabled={loading}
            />
          </div>

          <div>
            <label className="text-sm font-medium">City</label>
            <Input
              value={formData.shippingAddress.city}
              onChange={(e) =>
                handleChange("shippingAddress.city", e.target.value)
              }
              placeholder="City"
              disabled={loading}
            />
          </div>

          <div>
            <label className="text-sm font-medium">State</label>
            <Input
              value={formData.shippingAddress.state}
              onChange={(e) =>
                handleChange("shippingAddress.state", e.target.value)
              }
              placeholder="State"
              disabled={loading}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Zip Code</label>
            <Input
              value={formData.shippingAddress.zipCode}
              onChange={(e) =>
                handleChange("shippingAddress.zipCode", e.target.value)
              }
              placeholder="Zip Code"
              disabled={loading}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Country</label>
            <Input
              value={formData.shippingAddress.country}
              onChange={(e) =>
                handleChange("shippingAddress.country", e.target.value)
              }
              placeholder="Country"
              disabled={loading}
            />
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">Description</h3>
        <Textarea
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Enter description..."
          rows={4}
          disabled={loading}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {loading
            ? "Saving..."
            : initialData
            ? "Update Account"
            : "Create Account"}
        </Button>
      </div>
    </form>
  );
};

export default AccountForm;
