// src/components/files/sales/leads/LeadForm.jsx
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  User,
  Building,
  Mail,
  Phone,
  Globe,
  MapPin,
  Upload,
} from "lucide-react";
import { leadsService } from "./leadsService";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const LeadForm = ({ onSuccess, onCancel, initialData }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    // Lead Information
    leadOwner: "",
    firstName: "",
    title: "",
    phone: "",
    mobile: "",
    leadSource: "",
    industry: "",
    company: "",
    lastName: "",
    email: "",
    fax: "",
    website: "",
    leadStatus: "New",
    numberOfEmployees: "",
    annualRevenue: "",
    emailOptOut: false,
    rating: "",
    skypeID: "",
    secondaryEmail: "",
    twitter: "",

    // Address Information
    country: "",
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
    latitude: "",
    longitude: "",

    // Description
    description: "",

    // Image
    image: null,
    removeImage: false,
  });

  // Initialize form with initialData when editing and set logged-in user as owner for new leads
  useEffect(() => {
    if (initialData) {
      // For editing, use the existing data
      setFormData((prev) => ({
        ...prev,
        ...initialData,
        // Ensure image is properly handled
        image: initialData.imageUrl || initialData.image || null,
      }));
    } else {
      // For new leads, automatically set the logged-in user as owner
      if (user) {
        setFormData((prev) => ({
          ...prev,
          leadOwner: user.id || user.email, // Use user ID or email as identifier
        }));
      }
    }
  }, [initialData, user]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Image upload validation
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type and size
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid File",
          description: "Please upload an image file.",
          variant: "destructive",
        });
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast({
          title: "File Too Large",
          description: "Please upload an image smaller than 5MB.",
          variant: "destructive",
        });
        return;
      }

      handleChange("image", file);
      handleChange("removeImage", false);
    }
  };

  // Get image URL for display
  const getImageUrl = () => {
    if (!formData.image) return null;

    if (typeof formData.image === "string") {
      // It's already a URL (from existing data)
      return formData.image;
    }

    if (formData.image instanceof File) {
      // It's a new file, create object URL
      return URL.createObjectURL(formData.image);
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.company || !formData.lastName) {
        toast({
          title: "Validation Error",
          description: "Company and Last Name are required fields.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Ensure lead owner is set to current user if not already set
      const finalLeadOwner =
        formData.leadOwner || (user ? user.id || user.email : "System");

      // Prepare data for API
      const leadData = {
        ...formData,
        leadOwner: finalLeadOwner,
        // Keep the image file for upload
        image: formData.image instanceof File ? formData.image : null,
        // Set removeImage if explicitly removing an existing image
        removeImage: formData.removeImage && !formData.image,
      };

      let result;
      if (initialData) {
        // Update existing lead
        result = await leadsService.updateLead(
          initialData.id || initialData._id,
          leadData
        );
      } else {
        // Create new lead
        result = await leadsService.createLead(leadData);
      }

      if (result.success) {
        onSuccess(result.data);
        toast({
          title: initialData ? "Success" : "Success",
          description: initialData
            ? "Lead updated successfully"
            : "Lead created successfully",
        });
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast({
        title: "Error",
        description:
          error.message ||
          (initialData ? "Failed to update lead" : "Failed to create lead"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAndNew = async (e) => {
    await handleSubmit(e);
    if (!loading) {
      // Reset form for new entry, but keep the logged-in user as owner
      setFormData({
        leadOwner: user ? user.id || user.email : "", // Reset with current user
        firstName: "",
        title: "",
        phone: "",
        mobile: "",
        leadSource: "",
        industry: "",
        company: "",
        lastName: "",
        email: "",
        fax: "",
        website: "",
        leadStatus: "New",
        numberOfEmployees: "",
        annualRevenue: "",
        emailOptOut: false,
        rating: "",
        skypeID: "",
        secondaryEmail: "",
        twitter: "",
        country: "",
        streetAddress: "",
        city: "",
        state: "",
        zipCode: "",
        latitude: "",
        longitude: "",
        description: "",
        image: null,
        removeImage: false,
      });
    }
  };

  const handleRemoveImage = () => {
    if (initialData && formData.image) {
      // For existing lead with image, mark for removal
      handleChange("image", null);
      handleChange("removeImage", true);
    } else {
      // For new lead or lead without image
      handleChange("image", null);
      handleChange("removeImage", false);
    }
  };

  const leadSources = [
    "None",
    "Advertisement",
    "Cold Call",
    "Employee Referral",
    "External Referral",
    "Online Store",
    "Partner",
    "Public Relations",
    "Sales Email",
    "Seminar",
    "Trade Show",
    "Web Download",
    "Web Research",
  ];

  const industries = [
    "None",
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

  const ratings = [
    "None",
    "Acquired",
    "Active",
    "Market Failed",
    "Project Cancelled",
    "Shut Down",
  ];

  const imageUrl = getImageUrl();

  // Get current user display name for the owner field
  const getCurrentUserDisplay = () => {
    if (!user) return "Select Owner";
    return user.name || user.email || "Current User";
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lead Image */}
        <div className="lg:col-span-1">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center overflow-hidden">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="Lead"
                  className="w-32 h-32 rounded-full object-cover"
                />
              ) : (
                <User className="w-16 h-16 text-gray-400" />
              )}
            </div>
            <Button
              type="button"
              variant="outline"
              className="relative"
              onClick={() => document.getElementById("lead-image").click()}
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Image
              <input
                id="lead-image"
                type="file"
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleImageUpload}
              />
            </Button>
            {imageUrl && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleRemoveImage}
                className="text-red-600"
              >
                Remove Image
              </Button>
            )}
          </div>
        </div>

        {/* Rest of the form */}
        {/* Lead Information */}
        <div className="lg:col-span-2">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Lead Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Lead Owner</label>
                  <div className="p-2 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-800">
                    <strong>{getCurrentUserDisplay()}</strong>
                  </div>
                  <input
                    type="hidden"
                    value={formData.leadOwner}
                    onChange={(e) => handleChange("leadOwner", e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">First Name</label>
                  <Input
                    value={formData.firstName}
                    onChange={(e) => handleChange("firstName", e.target.value)}
                    placeholder="First Name"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    placeholder="Title"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Phone</label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    placeholder="Phone"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Mobile</label>
                  <Input
                    value={formData.mobile}
                    onChange={(e) => handleChange("mobile", e.target.value)}
                    placeholder="Mobile"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Lead Source</label>
                  <Select
                    value={formData.leadSource}
                    onValueChange={(value) => handleChange("leadSource", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Source" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 overflow-y-auto">
                      {leadSources.map((source) => (
                        <SelectItem key={source} value={source}>
                          {source}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Industry</label>
                  <Select
                    value={formData.industry}
                    onValueChange={(value) => handleChange("industry", value)}
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

              {/* Right Column */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Company *</label>
                  <Input
                    value={formData.company}
                    onChange={(e) => handleChange("company", e.target.value)}
                    placeholder="Company"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Last Name *</label>
                  <Input
                    value={formData.lastName}
                    onChange={(e) => handleChange("lastName", e.target.value)}
                    placeholder="Last Name"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="Email"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Fax</label>
                  <Input
                    value={formData.fax}
                    onChange={(e) => handleChange("fax", e.target.value)}
                    placeholder="Fax"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Website</label>
                  <Input
                    value={formData.website}
                    onChange={(e) => handleChange("website", e.target.value)}
                    placeholder="Website"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Lead Status</label>
                  <Select
                    value={formData.leadStatus}
                    onValueChange={(value) => handleChange("leadStatus", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="New">New</SelectItem>
                      <SelectItem value="Contacted">Contacted</SelectItem>
                      <SelectItem value="Qualified">Qualified</SelectItem>
                      <SelectItem value="Unqualified">Unqualified</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">
                    No. of Employees
                  </label>
                  <Input
                    type="number"
                    value={formData.numberOfEmployees}
                    onChange={(e) =>
                      handleChange("numberOfEmployees", e.target.value)
                    }
                    placeholder="Number of Employees"
                  />
                </div>
              </div>
            </div>

            {/* Additional Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-6 border-t">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Annual Revenue</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      Rs.
                    </span>
                    <Input
                      value={formData.annualRevenue}
                      onChange={(e) =>
                        handleChange("annualRevenue", e.target.value)
                      }
                      placeholder="Annual Revenue"
                      className="pl-12"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={formData.emailOptOut}
                    onCheckedChange={(checked) =>
                      handleChange("emailOptOut", checked)
                    }
                  />
                  <label className="text-sm font-medium">Email Opt Out</label>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Rating</label>
                  <Select
                    value={formData.rating}
                    onValueChange={(value) => handleChange("rating", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Rating" />
                    </SelectTrigger>
                    <SelectContent>
                      {ratings.map((rating) => (
                        <SelectItem key={rating} value={rating}>
                          {rating}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Skype ID</label>
                  <Input
                    value={formData.skypeID}
                    onChange={(e) => handleChange("skypeID", e.target.value)}
                    placeholder="Skype ID"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Secondary Email</label>
                  <Input
                    type="email"
                    value={formData.secondaryEmail}
                    onChange={(e) =>
                      handleChange("secondaryEmail", e.target.value)
                    }
                    placeholder="Secondary Email"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Twitter</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      @
                    </span>
                    <Input
                      value={formData.twitter}
                      onChange={(e) => handleChange("twitter", e.target.value)}
                      placeholder="Twitter"
                      className="pl-8"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Address Information */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <MapPin className="w-5 h-5 mr-2" />
          Address Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Country / Region</label>
            <Select
              value={formData.country}
              onValueChange={(value) => handleChange("country", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="india">India</SelectItem>
                <SelectItem value="usa">United States</SelectItem>
                <SelectItem value="uk">United Kingdom</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Street Address</label>
            <Input
              value={formData.streetAddress}
              onChange={(e) => handleChange("streetAddress", e.target.value)}
              placeholder="Street Address"
            />
          </div>

          <div>
            <label className="text-sm font-medium">City</label>
            <Input
              value={formData.city}
              onChange={(e) => handleChange("city", e.target.value)}
              placeholder="City"
            />
          </div>

          <div>
            <label className="text-sm font-medium">State / Province</label>
            <Select
              value={formData.state}
              onValueChange={(value) => handleChange("state", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select State" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="maharashtra">Maharashtra</SelectItem>
                <SelectItem value="karnataka">Karnataka</SelectItem>
                <SelectItem value="tamilnadu">Tamil Nadu</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Zip / Postal Code</label>
            <Input
              value={formData.zipCode}
              onChange={(e) => handleChange("zipCode", e.target.value)}
              placeholder="Zip Code"
            />
          </div>

          <div className="flex items-end gap-2">
            <div className="flex-1">
              <label className="text-sm font-medium">Latitude</label>
              <Input
                value={formData.latitude}
                onChange={(e) => handleChange("latitude", e.target.value)}
                placeholder="Latitude"
              />
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium">Longitude</label>
              <Input
                value={formData.longitude}
                onChange={(e) => handleChange("longitude", e.target.value)}
                placeholder="Longitude"
              />
            </div>
            <Button type="button" variant="outline" className="mb-1">
              Clear All
            </Button>
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
        {/* <Button
          type="button"
          variant="outline"
          onClick={handleSaveAndNew}
          disabled={loading}
        >
          Save and New
        </Button> */}
        <Button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {loading ? "Saving..." : initialData ? "Update" : "Save"}
        </Button>
      </div>
    </form>
  );
};

export default LeadForm;
