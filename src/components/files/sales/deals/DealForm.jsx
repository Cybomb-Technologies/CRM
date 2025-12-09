// src/components/deals/DealForm.jsx
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
import { Badge } from "@/components/ui/badge";
import { IndianRupee, Target, Calendar, User, Building, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import dealsAPI from "./dealsAPI";
import contactsAPI from "../contacts/contactsAPI";
import accountsAPI from "../accounts/accountsAPI";

const DealForm = ({ onSuccess, onCancel, initialData, currentUser }) => {
  const { toast } = useToast();
  const { user: authUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [contacts, setContacts] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(true);
  const [isLoadingContacts, setIsLoadingContacts] = useState(true);

  const hasSubmitted = useRef(false);
  const formRef = useRef(null);

  const user = currentUser || authUser;

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    contactId: "",
    accountId: "",
    value: "",
    probability: 0,
    stage: "qualification",
    closeDate: "",
    owner: "",
    description: "",
    leadSource: "",
    industry: "",
    tags: [],
    sourceLeadId: "",
  });

  // Check if this is an edit operation
  const isEditMode = Boolean(initialData?._id || initialData?.id);

  useEffect(() => {
    hasSubmitted.current = false;

    const fetchData = async () => {
      setIsLoadingAccounts(true);
      setIsLoadingContacts(true);

      try {
        // Fetch contacts
        try {
          const contactsResponse = await contactsAPI.getContacts({
            limit: 100,
            page: 1,
          });
          setContacts(
            contactsResponse.success ? contactsResponse.contacts || [] : []
          );
        } catch (contactError) {
          console.error("Error fetching contacts:", contactError);
          setContacts([]);
        } finally {
          setIsLoadingContacts(false);
        }

        // Fetch accounts
        try {
          const accountsResponse = await accountsAPI.fetchAccounts({
            limit: 100,
            page: 1,
          });

          let accountsData = [];
          if (accountsResponse.success) {
            accountsData =
              accountsResponse.accounts || accountsResponse.data || [];
          }

          const uniqueAccounts = [];
          const seenNames = new Set();

          accountsData.forEach((account) => {
            const name = account.name || `Company ${account._id || account.id}`;
            if (!seenNames.has(name)) {
              seenNames.add(name);
              uniqueAccounts.push({
                ...account,
                displayName: name,
                uniqueId: account._id || account.id || Math.random().toString(),
              });
            }
          });

          setAccounts(uniqueAccounts);
        } catch (accountsError) {
          console.error("Error using accountsAPI:", accountsError);
          setAccounts([]);
        } finally {
          setIsLoadingAccounts(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoadingAccounts(false);
        setIsLoadingContacts(false);
      }
    };

    fetchData();

    // Initialize form data
    if (initialData) {
      console.log("Initializing form with data:", initialData);

      // Format date for input field
      let formattedDate = "";
      if (initialData.closeDate) {
        const date = new Date(initialData.closeDate);
        if (!isNaN(date.getTime())) {
          formattedDate = date.toISOString().split("T")[0];
        }
      }

      // Format owner display (name with email if available)
      let ownerDisplay = initialData.owner || "";
      if (
        user &&
        ownerDisplay &&
        user.email &&
        !ownerDisplay.includes(user.email)
      ) {
        ownerDisplay = `${ownerDisplay} (${user.email})`;
      } else if (!ownerDisplay && user) {
        ownerDisplay = user.name || user.displayName || "You";
        if (user.email) {
          ownerDisplay = `${ownerDisplay} (${user.email})`;
        }
      }

      setFormData({
        title: initialData.title || "",
        company: initialData.company || "",
        contactId: initialData.contactId || "",
        accountId: initialData.accountId || "",
        value: initialData.value?.toString() || "0",
        probability: initialData.probability || 0,
        stage: initialData.stage || "qualification",
        closeDate: formattedDate,
        owner: ownerDisplay,
        description: initialData.description || "",
        leadSource: initialData.leadSource || "",
        industry: initialData.industry || "",
        tags: Array.isArray(initialData.tags) ? initialData.tags : [],
        sourceLeadId: initialData.sourceLeadId || "",
      });
    } else {
      // New deal - set defaults
      const defaultCloseDate = new Date();
      defaultCloseDate.setDate(defaultCloseDate.getDate() + 30);

      const defaultOwnerName = user?.name || user?.displayName || "You";
      const defaultOwnerDisplay = user
        ? `${defaultOwnerName}${user?.email ? ` (${user.email})` : ""}`
        : "You";

      setFormData((prev) => ({
        ...prev,
        owner: defaultOwnerDisplay,
        closeDate: defaultCloseDate.toISOString().split("T")[0],
        probability: 20,
        stage: "qualification",
        contactId: "",
        accountId: "",
      }));
    }
  }, [initialData, user]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleTagInputKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const getContactName = (contactId) => {
    if (!contactId) return "";
    const contact = contacts.find(
      (c) => c._id === contactId || c.id === contactId
    );
    return contact
      ? contact.name ||
          `${contact.firstName || ""} ${contact.lastName || ""}`.trim()
      : "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (hasSubmitted.current || loading) {
      console.log("🚫 Form already submitted, blocking");
      return;
    }

    hasSubmitted.current = true;
    setLoading(true);

    if (formRef.current) {
      const formElements = formRef.current.querySelectorAll(
        "input, button, textarea, select"
      );
      formElements.forEach((el) => (el.disabled = true));
    }

    try {
      // Validate required fields
      if (!formData.title?.trim() || !formData.company?.trim()) {
        toast({
          title: "Validation Error",
          description: "Title and Company are required fields.",
          variant: "destructive",
        });
        hasSubmitted.current = false;
        setLoading(false);
        return;
      }

      console.log(
        `🚀 ${isEditMode ? "Updating" : "Creating"} deal:`,
        formData.title
      );

      // Extract just the name from the owner field (remove email in parentheses if present)
      let ownerName = formData.owner;
      if (ownerName.includes("(") && ownerName.includes(")")) {
        ownerName = ownerName.split("(")[0].trim();
      }

      // Prepare deal data
      const dealData = {
        title: formData.title.trim(),
        company: formData.company.trim(),
        contactId: formData.contactId || undefined,
        contactName: formData.contactId
          ? getContactName(formData.contactId)
          : "",
        value: parseFloat(formData.value) || 0,
        probability: Math.min(
          100,
          Math.max(0, parseInt(formData.probability) || 0)
        ),
        stage: formData.stage || "qualification",
        closeDate: formData.closeDate
          ? new Date(formData.closeDate).toISOString()
          : new Date().toISOString(),
        owner: ownerName || user?.name || "Current User",
        description: formData.description?.trim() || "",
        leadSource: formData.leadSource || "",
        industry: formData.industry || "",
        tags: Array.isArray(formData.tags) ? formData.tags : [],
        sourceLeadId: formData.sourceLeadId || undefined,
      };

      // Add createdBy for new deals only
      if (!isEditMode) {
        dealData.createdBy = user?.id || "current-user";
      }

      console.log("📤 Submitting deal data:", dealData);

      let response;
      const dealId = initialData?._id || initialData?.id;

      if (dealId) {
        // Update existing deal
        response = await dealsAPI.updateDeal(dealId, dealData);
      } else {
        // Create new deal
        response = await dealsAPI.createDeal(dealData);
      }

      if (response?.success) {
        console.log(
          `✅ Deal ${isEditMode ? "updated" : "created"} successfully`
        );

        if (onSuccess && typeof onSuccess === "function") {
          onSuccess({
            success: true,
            deal: response.deal,
            isNew: !isEditMode,
          });
        }
      } else {
        throw new Error(
          response?.message ||
            `Failed to ${isEditMode ? "update" : "create"} deal`
        );
      }
    } catch (error) {
      console.error(
        `❌ Error ${isEditMode ? "updating" : "creating"} deal:`,
        error
      );
      toast({
        title: "Error",
        description:
          error.message || `Failed to ${isEditMode ? "update" : "create"} deal`,
        variant: "destructive",
      });
      hasSubmitted.current = false;

      if (onSuccess && typeof onSuccess === "function") {
        onSuccess({
          success: false,
          error: error.message,
          isEdit: isEditMode,
        });
      }
    } finally {
      console.log("🏁 Form submission completed");
    }
  };

  const getStageColor = (stage) => {
    const colors = {
      qualification: "bg-blue-100 text-blue-800",
      "needs-analysis": "bg-purple-100 text-purple-800",
      "value-proposition": "bg-indigo-100 text-indigo-800",
      "identify-decision-makers": "bg-yellow-100 text-yellow-800",
      "proposal-price-quote": "bg-orange-100 text-orange-800",
      "negotiation-review": "bg-red-100 text-red-800",
      "closed-won": "bg-green-100 text-green-800",
      "closed-lost": "bg-gray-100 text-gray-800",
      "closed-lost-to-competition": "bg-gray-100 text-gray-800",
    };
    return colors[stage] || "bg-gray-100 text-gray-800";
  };

  const stageOptions = [
    { value: "qualification", label: "Qualification" },
    { value: "needs-analysis", label: "Needs Analysis" },
    { value: "value-proposition", label: "Value Proposition" },
    { value: "identify-decision-makers", label: "Identify Decision Makers" },
    { value: "proposal-price-quote", label: "Proposal/Price Quote" },
    { value: "negotiation-review", label: "Negotiation/Review" },
    { value: "closed-won", label: "Closed Won" },
    { value: "closed-lost", label: "Closed Lost" },
    {
      value: "closed-lost-to-competition",
      label: "Closed Lost to Competition",
    },
  ];

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
      {/* Deal Mode Indicator */}
      {isEditMode && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center">
            <div className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
              EDIT MODE
            </div>
            <span className="ml-2 text-sm text-blue-700">
              Editing: {initialData?.title || "Deal"}
            </span>
          </div>
        </div>
      )}

      {/* Deal Owner Field - FIXED ALIGNMENT */}
      <div>
        <label className="text-sm font-medium mb-2 block">Deal Owner</label>
        <Select
          value={user?.id || ""}
          onValueChange={(value) => {
            const ownerDisplay = user
              ? `${user.name || user.displayName || "You"}${
                  user?.email ? ` (${user.email})` : ""
                }`
              : "You";
            handleChange("owner", ownerDisplay);
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select owner">
              {/* Custom display for the selected value */}
              <div className="flex flex-col text-left">
                <span className="font-medium truncate">
                  {formData.owner && formData.owner.includes("(")
                    ? formData.owner.split("(")[0].trim()
                    : formData.owner || user?.name || "You"}
                </span>
                {formData.owner &&
                  formData.owner.includes("(") &&
                  formData.owner.includes(")") && (
                    <span className="text-xs text-gray-500 truncate">
                      {formData.owner.match(/\(([^)]+)\)/)?.[1]}
                    </span>
                  )}
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={user?.id || "current-user"}>
              <div className="flex flex-col">
                <span className="font-medium">
                  {user?.name || user?.displayName || "You"}
                </span>
                <span className="text-sm text-gray-500">
                  {user?.email || ""}
                </span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-gray-500 mt-1">
          Currently assigned to: {user?.name || "You"} (
          {user?.email || "No email"})
        </p>
      </div>

      {/* Basic Information */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">Deal Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Deal Title *</label>
            <Input
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="e.g., Enterprise Software License"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Company *</label>
            <Select
              value={formData.company}
              onValueChange={(value) => handleChange("company", value)}
              disabled={isLoadingAccounts || loading}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    isLoadingAccounts
                      ? "Loading companies..."
                      : "Select Company"
                  }
                />
              </SelectTrigger>
              <SelectContent className="max-h-60 overflow-y-auto">
                {isLoadingAccounts ? (
                  <div className="py-2 px-3 text-sm text-gray-500">
                    Loading companies...
                  </div>
                ) : accounts.length > 0 ? (
                  accounts.map((account) => (
                    <SelectItem
                      key={account.uniqueId}
                      value={account.displayName}
                    >
                      {account.displayName}
                    </SelectItem>
                  ))
                ) : (
                  <div className="py-2 px-3 text-sm text-gray-500">
                    No companies available.
                  </div>
                )}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Contact</label>
            <Select
              value={formData.contactId}
              onValueChange={(value) => handleChange("contactId", value)}
              disabled={isLoadingContacts || loading}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    isLoadingContacts ? "Loading contacts..." : "Select Contact"
                  }
                />
              </SelectTrigger>
              <SelectContent className="max-h-60 overflow-y-auto">
                {isLoadingContacts ? (
                  <div className="py-2 px-3 text-sm text-gray-500">
                    Loading contacts...
                  </div>
                ) : contacts.length > 0 ? (
                  contacts.map((contact) => (
                    <SelectItem
                      key={contact._id || contact.id || Math.random()}
                      value={contact._id || contact.id}
                    >
                      {contact.name ||
                        `${contact.firstName} ${contact.lastName}`}
                      {contact.company || contact.accountName
                        ? ` (${contact.company || contact.accountName})`
                        : ""}
                    </SelectItem>
                  ))
                ) : (
                  <div className="py-2 px-3 text-sm text-gray-500">
                    No contacts available.
                  </div>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Deal Details */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <IndianRupee className="w-5 h-5 mr-2" />
          Deal Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium">Deal Value (₹)</label>
            <div className="relative">
              <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="number"
                value={formData.value}
                onChange={(e) => handleChange("value", e.target.value)}
                placeholder="0.00"
                className="pl-10"
                min="0"
                step="0.01"
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Probability (%)</label>
            <div className="relative">
              <Target className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="number"
                min="0"
                max="100"
                value={formData.probability}
                onChange={(e) => handleChange("probability", e.target.value)}
                placeholder="0"
                className="pl-10"
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Expected Close Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="date"
                value={formData.closeDate}
                onChange={(e) => handleChange("closeDate", e.target.value)}
                className="pl-10"
                required
                disabled={loading}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="text-sm font-medium">Stage</label>
            <Select
              value={formData.stage}
              onValueChange={(value) => handleChange("stage", value)}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-60 overflow-y-auto">
                {stageOptions.map((stage) => (
                  <SelectItem key={stage.value} value={stage.value}>
                    <div className="flex items-center">
                      <Badge className={`mr-2 ${getStageColor(stage.value)}`}>
                        {stage.label}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Lead Source</label>
            <Select
              value={formData.leadSource}
              onValueChange={(value) => handleChange("leadSource", value)}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Source" />
              </SelectTrigger>
              <SelectContent className="max-h-60 overflow-y-auto">
                <SelectItem value="Website">Website</SelectItem>
                <SelectItem value="Referral">Referral</SelectItem>
                <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                <SelectItem value="Advertisement">Advertisement</SelectItem>
                <SelectItem value="Cold Call">Cold Call</SelectItem>
                <SelectItem value="Trade Show">Trade Show</SelectItem>
                <SelectItem value="Email Campaign">Email Campaign</SelectItem>
                <SelectItem value="Social Media">Social Media</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">Tags</h3>
        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagInputKeyDown}
              placeholder="Add a tag (press Enter to add)..."
              className="flex-1"
              disabled={loading}
            />
            <Button
              type="button"
              onClick={handleAddTag}
              variant="outline"
              disabled={!tagInput.trim() || loading}
            >
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag, index) => (
              <Badge
                key={`${tag}-${index}`}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {tag}
                <X
                  className="w-3 h-3 cursor-pointer"
                  onClick={() => !loading && handleRemoveTag(tag)}
                />
              </Badge>
            ))}
            {formData.tags.length === 0 && (
              <span className="text-sm text-gray-500">No tags added yet</span>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">Description</h3>
        <Textarea
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Describe the deal, requirements, and next steps..."
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
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              {isEditMode ? "Updating..." : "Creating..."}
            </>
          ) : isEditMode ? (
            "Update Deal"
          ) : (
            "Create Deal"
          )}
        </Button>
      </div>
    </form>
  );
};

export default React.memo(DealForm);
