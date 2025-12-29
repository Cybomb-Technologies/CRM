// src/components/files/sales/leads/LeadsBulkActions.jsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  MoreHorizontal,
  Trash2,
  Edit,
  Send,
  Download,
  Printer,
  Tag,
  CheckCircle,
  Users,
  FileText,
  Code,
  Shield,
  Mail,
  Copy,
  Filter,
  CheckSquare,
  Square,
  ChevronRight,
  Building2,
} from "lucide-react";
import { leadsService } from "./leadsService";
import { useToast } from "@/components/ui/use-toast";

const LeadsBulkActions = ({
  selectedLeads,
  onBulkDelete,
  onBulkUpdate,
  onBulkConvert,
  onBulkConvertToAccount,
  onManageTags,
  onMassEmail,
  onExport,
  onAddToCampaign,
  onApproveLeads,
  onDeduplicateLeads,
  leads,
}) => {
  const { toast } = useToast();

  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [showTagsDialog, setShowTagsDialog] = useState(false);
  const [showCampaignDialog, setShowCampaignDialog] = useState(false);
  const [showSimpleCampaignDialog, setShowSimpleCampaignDialog] =
    useState(false);
  const [showScriptDialog, setShowScriptDialog] = useState(false);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showDeduplicateDialog, setShowDeduplicateDialog] = useState(false);
  const [showConvertAccountDialog, setShowConvertAccountDialog] =
    useState(false);

  const [updateData, setUpdateData] = useState({
    status: "",
    source: "",
    industry: "",
  });
  const [emailData, setEmailData] = useState({
    subject: "",
    message: "",
    template: "",
  });
  const [tagsData, setTagsData] = useState({
    tagsToAdd: "",
    tagsToRemove: "",
  });
  const [campaignData, setCampaignData] = useState({
    campaignId: "",
  });
  const [deduplicateCriteria, setDeduplicateCriteria] = useState([
    "email",
    "phone",
  ]);

  const handleBulkUpdate = () => {
    const updates = {};
    if (updateData.status) updates.leadStatus = updateData.status;
    if (updateData.source) updates.leadSource = updateData.source;
    if (updateData.industry) updates.industry = updateData.industry;

    onBulkUpdate(selectedLeads, updates);
    setShowUpdateDialog(false);
    setUpdateData({ status: "", source: "", industry: "" });
  };

  const handleMassEmail = () => {
    onMassEmail(selectedLeads, emailData);
    setShowEmailDialog(false);
    setEmailData({ subject: "", message: "", template: "" });
  };

  // Handle bulk convert to contact
  const handleBulkConvert = async () => {
    try {
      console.log("Bulk converting leads to contacts:", selectedLeads);
      await onBulkConvert(selectedLeads);
      toast({
        title: "Conversion Started",
        description: `${selectedLeads.length} leads are being converted to contacts.`,
      });
    } catch (error) {
      console.error("Bulk convert error:", error);
      toast({
        title: "Error",
        description: "Failed to start bulk conversion",
        variant: "destructive",
      });
    }
  };

  // Handle bulk convert to account
  const handleBulkConvertToAccount = async () => {
    try {
      console.log("Bulk converting leads to accounts:", selectedLeads);

      await onBulkConvertToAccount(selectedLeads);
      toast({
        title: "Conversion Started",
        description: `${selectedLeads.length} leads are being converted to accounts.`,
      });
      setShowConvertAccountDialog(false);
    } catch (error) {
      console.error("Bulk convert to account error:", error);
      toast({
        title: "Error",
        description: "Failed to start bulk conversion to accounts",
        variant: "destructive",
      });
    }
  };

  const handleManageTags = async () => {
    const tagsToAdd = tagsData.tagsToAdd
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag);
    const tagsToRemove = tagsData.tagsToRemove
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag);

    onManageTags(selectedLeads, tagsToAdd, tagsToRemove);
  };

  const handleQuickAddToCampaign = async () => {
    if (!campaignData.campaignId) {
      toast({
        title: "Error",
        description: "Please select a campaign.",
        variant: "destructive",
      });
      return;
    }

    onAddToCampaign(selectedLeads, campaignData.campaignId);
  };

  const handleCreateClientScript = async () => {
    const script = `// Client script for ${selectedLeads.length
      } leads\n// Generated on ${new Date().toLocaleString()}`;

    setShowScriptDialog(true);
    toast({
      title: "Script Generated",
      description: "Client script has been generated successfully.",
    });
  };

  const handleApproveLeads = async () => {
    onApproveLeads(selectedLeads);
  };

  const handleDeduplicateLeads = async () => {
    onDeduplicateLeads();
  };

  const handleExportSheetView = () => {
    onExport(selectedLeads);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "New":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Contacted":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Qualified":
        return "bg-green-100 text-green-800 border-green-200";
      case "Unqualified":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handlePrintView = () => {
    const printWindow = window.open("", "_blank");

    // Get selected leads data
    const selectedLeadsData = leads.filter((lead) =>
      selectedLeads.includes(lead.id || lead._id)
    );

    // Generate detailed HTML content for print
    const printContent = `
      <html>
        <head>
          <title>Leads Print View</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 20px; 
              line-height: 1.4;
            }
            .header { 
              text-align: center; 
              margin-bottom: 30px;
              border-bottom: 2px solid #333;
              padding-bottom: 20px;
            }
            .header h1 { 
              margin: 0; 
              color: #333;
            }
            .header p { 
              margin: 5px 0; 
              color: #666;
            }
            .leads-table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            .leads-table th, 
            .leads-table td {
              border: 1px solid #ddd;
              padding: 10px;
              text-align: left;
              font-size: 12px;
            }
            .leads-table th {
              background-color: #f5f5f5;
              font-weight: bold;
            }
            .leads-table tr:nth-child(even) {
              background-color: #f9f9f9;
            }
            .status-badge {
              display: inline-block;
              padding: 2px 8px;
              border-radius: 12px;
              font-size: 10px;
              font-weight: bold;
            }
            .summary {
              background-color: #f0f8ff;
              padding: 15px;
              border-radius: 5px;
              margin-bottom: 20px;
            }
            .summary h3 {
              margin-top: 0;
              color: #333;
            }
            .lead-details {
              margin-bottom: 30px;
              page-break-inside: avoid;
            }
            .lead-details h3 {
              background-color: #e9ecef;
              padding: 8px 12px;
              margin: 0;
              border-radius: 4px 4px 0 0;
            }
            .lead-info {
              border: 1px solid #ddd;
              border-top: none;
              padding: 15px;
            }
            .lead-info-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 10px;
            }
            .lead-info-item {
              margin-bottom: 8px;
            }
            .lead-info-label {
              font-weight: bold;
              color: #555;
            }
            @media print {
              body { margin: 0.5in; }
              .header { border-bottom-color: #000; }
              .leads-table th { background-color: #eee !important; }
              .summary { background-color: #f0f0f0 !important; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Leads Report</h1>
            <p>Generated on ${new Date().toLocaleString()}</p>
            <p>Total Leads Selected: ${selectedLeads.length}</p>
          </div>

          <div class="summary">
            <h3>Summary</h3>
            <p><strong>Report Date:</strong> ${new Date().toLocaleDateString()}</p>
            <p><strong>Total Leads:</strong> ${selectedLeads.length}</p>
            <p><strong>Generated By:</strong> Lead Management System</p>
          </div>

          <h2>Detailed Lead Information</h2>
          
          ${selectedLeadsData
        .map(
          (lead, index) => `
            <div class="lead-details">
              <h3>Lead #${index + 1}: ${lead.firstName || ""} ${lead.lastName || ""
            }</h3>
              <div class="lead-info">
                <div class="lead-info-grid">
                  <div class="lead-info-item">
                    <span class="lead-info-label">Name:</span> ${lead.firstName || "N/A"
            } ${lead.lastName || "N/A"}
                  </div>
                  <div class="lead-info-item">
                    <span class="lead-info-label">Company:</span> ${lead.company || "N/A"
            }
                  </div>
                  <div class="lead-info-item">
                    <span class="lead-info-label">Email:</span> ${lead.email || "N/A"
            }
                  </div>
                  <div class="lead-info-item">
                    <span class="lead-info-label">Phone:</span> ${lead.phone || "N/A"
            }
                  </div>
                  <div class="lead-info-item">
                    <span class="lead-info-label">Mobile:</span> ${lead.mobile || "N/A"
            }
                  </div>
                  <div class="lead-info-item">
                    <span class="lead-info-label">Status:</span> 
                    <span class="status-badge" style="background-color: ${lead.leadStatus === "New"
              ? "#dbeafe"
              : lead.leadStatus === "Contacted"
                ? "#fef3c7"
                : lead.leadStatus === "Qualified"
                  ? "#d1fae5"
                  : lead.leadStatus === "Unqualified"
                    ? "#fee2e2"
                    : "#f3f4f6"
            }; color: ${lead.leadStatus === "New"
              ? "#1e40af"
              : lead.leadStatus === "Contacted"
                ? "#92400e"
                : lead.leadStatus === "Qualified"
                  ? "#065f46"
                  : lead.leadStatus === "Unqualified"
                    ? "#991b1b"
                    : "#374151"
            };">${lead.leadStatus || "N/A"}</span>
                  </div>
                  <div class="lead-info-item">
                    <span class="lead-info-label">Source:</span> ${lead.leadSource || "N/A"
            }
                  </div>
                  <div class="lead-info-item">
                    <span class="lead-info-label">Industry:</span> ${lead.industry || "N/A"
            }
                  </div>
                  <div class="lead-info-item">
                    <span class="lead-info-label">Title:</span> ${lead.title || "N/A"
            }
                  </div>
                  <div class="lead-info-item">
                    <span class="lead-info-label">Website:</span> ${lead.website || "N/A"
            }
                  </div>
                  <div class="lead-info-item">
                    <span class="lead-info-label">Employees:</span> ${lead.numberOfEmployees || "N/A"
            }
                  </div>
                  <div class="lead-info-item">
                    <span class="lead-info-label">Annual Revenue:</span> ${lead.annualRevenue ? "Rs. " + lead.annualRevenue : "N/A"
            }
                  </div>
                  <div class="lead-info-item">
                    <span class="lead-info-label">Rating:</span> ${lead.rating || "N/A"
            }
                  </div>
                  <div class="lead-info-item">
                    <span class="lead-info-label">Converted:</span> ${lead.isConverted ? "Yes" : "No"
            }
                  </div>
                  <div class="lead-info-item">
                    <span class="lead-info-label">Converted to Account:</span> ${lead.convertedToAccountId ? "Yes" : "No"
            }
                  </div>
                </div>
                ${lead.streetAddress
              ? `
                <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #eee;">
                  <strong>Address Information:</strong><br>
                  ${lead.streetAddress || ""}<br>
                  ${lead.city || ""}${lead.city && lead.state ? ", " : ""}${lead.state || ""
              } ${lead.zipCode || ""}<br>
                  ${lead.country || ""}
                </div>
                `
              : ""
            }
                ${lead.description
              ? `
                <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #eee;">
                  <strong>Description:</strong><br>
                  ${lead.description}
                </div>
                `
              : ""
            }
                <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #eee;">
                  <strong>System Information:</strong><br>
                  Created: ${new Date(lead.createdAt).toLocaleString()}<br>
                  Last Updated: ${new Date(lead.updatedAt).toLocaleString()}<br>
                  Lead Owner: ${lead.leadOwner || "System"}
                </div>
              </div>
            </div>
          `
        )
        .join("")}

          <table class="leads-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Company</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Source</th>
                <th>Industry</th>
                <th>Created Date</th>
              </tr>
            </thead>
            <tbody>
              ${selectedLeadsData
        .map(
          (lead, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td>${lead.firstName || ""} ${lead.lastName || ""}</td>
                  <td>${lead.company || "N/A"}</td>
                  <td>${lead.email || "N/A"}</td>
                  <td>${lead.phone || "N/A"}</td>
                  <td>
                    <span class="status-badge" style="background-color: ${lead.leadStatus === "New"
              ? "#dbeafe"
              : lead.leadStatus === "Contacted"
                ? "#fef3c7"
                : lead.leadStatus === "Qualified"
                  ? "#d1fae5"
                  : lead.leadStatus === "Unqualified"
                    ? "#fee2e2"
                    : "#f3f4f6"
            }; color: ${lead.leadStatus === "New"
              ? "#1e40af"
              : lead.leadStatus === "Contacted"
                ? "#92400e"
                : lead.leadStatus === "Qualified"
                  ? "#065f46"
                  : lead.leadStatus === "Unqualified"
                    ? "#991b1b"
                    : "#374151"
            };">
                      ${lead.leadStatus || "N/A"}
                    </span>
                  </td>
                  <td>${lead.leadSource || "N/A"}</td>
                  <td>${lead.industry || "N/A"}</td>
                  <td>${new Date(lead.createdAt).toLocaleDateString()}</td>
                </tr>
              `
        )
        .join("")}
            </tbody>
          </table>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #333; text-align: center;">
            <p><strong>End of Report</strong></p>
            <p>Total Leads: ${selectedLeads.length}</p>
            <p>Page generated on ${new Date().toLocaleString()}</p>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();

    // Wait for content to load before printing
    printWindow.onload = () => {
      printWindow.print();
    };
  };

  const handleToggleCriteria = (criteria) => {
    setDeduplicateCriteria((prev) =>
      prev.includes(criteria)
        ? prev.filter((c) => c !== criteria)
        : [...prev, criteria]
    );
  };

  if (selectedLeads.length === 0) return null;

  return (
    <>
      <div className="flex items-center gap-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <span className="text-sm text-blue-800">
          {selectedLeads.length} lead(s) selected
        </span>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <MoreHorizontal className="w-4 h-4 mr-2" />
              Bulk Actions
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-64 max-h-80 overflow-y-auto"
          >
            {/* Mass Update */}
            <DropdownMenuItem onClick={() => setShowUpdateDialog(true)}>
              <Edit className="w-4 h-4 mr-2" />
              Mass Update
            </DropdownMenuItem>

            {/* Mass Convert to Contact */}
            <DropdownMenuItem onClick={handleBulkConvert}>
              <CheckCircle className="w-4 h-4 mr-2" />
              Mass Convert to Contact
            </DropdownMenuItem>

            {/* Mass Convert to Account */}
            <DropdownMenuItem onClick={() => setShowConvertAccountDialog(true)}>
              <Building2 className="w-4 h-4 mr-2" />
              Mass Convert to Account
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {/* Manage Tags */}
            <DropdownMenuItem onClick={() => setShowTagsDialog(true)}>
              <Tag className="w-4 h-4 mr-2" />
              Manage Tags
            </DropdownMenuItem>

            {/* Mass Email */}
            <DropdownMenuItem onClick={() => setShowEmailDialog(true)}>
              <Send className="w-4 h-4 mr-2" />
              Mass Email
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {/* Approve Leads */}
            <DropdownMenuItem onClick={() => setShowApproveDialog(true)}>
              <Shield className="w-4 h-4 mr-2" />
              Approve Leads
            </DropdownMenuItem>

            {/* Deduplicate Leads */}
            <DropdownMenuItem onClick={() => setShowDeduplicateDialog(true)}>
              <Filter className="w-4 h-4 mr-2" />
              Deduplicate Leads
            </DropdownMenuItem>

            {/* Create Client Script */}
            <DropdownMenuItem onClick={handleCreateClientScript}>
              <Code className="w-4 h-4 mr-2" />
              Create Client Script
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {/* Export */}
            <DropdownMenuItem onClick={() => onExport(selectedLeads)}>
              <Download className="w-4 h-4 mr-2" />
              Export Leads
            </DropdownMenuItem>

            {/* Sheet View */}
            <DropdownMenuItem onClick={handleExportSheetView}>
              <FileText className="w-4 h-4 mr-2" />
              Sheet View
            </DropdownMenuItem>

            {/* Print View */}
            <DropdownMenuItem onClick={handlePrintView}>
              <Printer className="w-4 h-4 mr-2" />
              Print View
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {/* Destructive Actions */}
            <DropdownMenuItem
              onClick={() => onBulkDelete(selectedLeads)}
              className="text-red-600"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Mass Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onBulkDelete(selectedLeads)}
          className="text-red-600 border-red-200 hover:bg-red-50"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete Selected
        </Button>
      </div>

      {/* Mass Update Dialog */}
      <Dialog open={showUpdateDialog} onOpenChange={setShowUpdateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mass Update Leads</DialogTitle>
            <DialogDescription>
              Update {selectedLeads.length} selected leads
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Status</Label>
              <Select
                value={updateData.status}
                onValueChange={(value) =>
                  setUpdateData((prev) => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="max-h-60 overflow-y-auto">
                  <SelectItem value="New">New</SelectItem>
                  <SelectItem value="Contacted">Contacted</SelectItem>
                  <SelectItem value="Qualified">Qualified</SelectItem>
                  <SelectItem value="Unqualified">Unqualified</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Source</Label>
              <Select
                value={updateData.source}
                onValueChange={(value) =>
                  setUpdateData((prev) => ({ ...prev, source: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent className="max-h-60 overflow-y-auto">
                  <SelectItem value="Website">Website</SelectItem>
                  <SelectItem value="Referral">Referral</SelectItem>
                  <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                  <SelectItem value="Advertisement">Advertisement</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Industry</Label>
              <Select
                value={updateData.industry}
                onValueChange={(value) =>
                  setUpdateData((prev) => ({ ...prev, industry: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent className="max-h-60 overflow-y-auto">
                  <SelectItem value="Technology">Technology</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="Healthcare">Healthcare</SelectItem>
                  <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowUpdateDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleBulkUpdate}>
              Update {selectedLeads.length} Leads
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Mass Convert to Account Dialog */}
      <Dialog
        open={showConvertAccountDialog}
        onOpenChange={setShowConvertAccountDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mass Convert to Account</DialogTitle>
            <DialogDescription>
              Convert {selectedLeads.length} selected leads to accounts
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p>
              Are you sure you want to convert {selectedLeads.length} lead(s) to
              accounts? This will create new accounts from the selected leads.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> Each lead will create a new account. The
                lead's company name will be used as the account name. If a lead
                is already converted to an account, it will be skipped.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConvertAccountDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleBulkConvertToAccount}>
              <Building2 className="w-4 h-4 mr-2" />
              Convert to Accounts
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Mass Email Dialog */}
      <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Send Mass Email</DialogTitle>
            <DialogDescription>
              Send email to {selectedLeads.length} selected leads
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Template</Label>
              <Select
                value={emailData.template}
                onValueChange={(value) =>
                  setEmailData((prev) => ({ ...prev, template: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent className="max-h-60 overflow-y-auto">
                  <SelectItem value="welcome">Welcome Email</SelectItem>
                  <SelectItem value="followup">Follow-up</SelectItem>
                  <SelectItem value="promotion">Promotion</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Subject</Label>
              <Input
                value={emailData.subject}
                onChange={(e) =>
                  setEmailData((prev) => ({ ...prev, subject: e.target.value }))
                }
                placeholder="Email subject"
              />
            </div>
            <div>
              <Label>Message</Label>
              <Textarea
                value={emailData.message}
                onChange={(e) =>
                  setEmailData((prev) => ({ ...prev, message: e.target.value }))
                }
                placeholder="Email message"
                rows={8}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEmailDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleMassEmail}>
              <Send className="w-4 h-4 mr-2" />
              Send to {selectedLeads.length} Leads
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Manage Tags Dialog */}
      <Dialog open={showTagsDialog} onOpenChange={setShowTagsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage Tags</DialogTitle>
            <DialogDescription>
              Add or remove tags for {selectedLeads.length} selected leads
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Tags to Add (comma separated)</Label>
              <Input
                value={tagsData.tagsToAdd}
                onChange={(e) =>
                  setTagsData((prev) => ({
                    ...prev,
                    tagsToAdd: e.target.value,
                  }))
                }
                placeholder="hot, enterprise, follow-up"
              />
            </div>
            <div>
              <Label>Tags to Remove (comma separated)</Label>
              <Input
                value={tagsData.tagsToRemove}
                onChange={(e) =>
                  setTagsData((prev) => ({
                    ...prev,
                    tagsToRemove: e.target.value,
                  }))
                }
                placeholder="cold, inactive"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTagsDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleManageTags}>
              <Tag className="w-4 h-4 mr-2" />
              Update Tags
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Quick Add to Campaign Dialog */}
      <Dialog
        open={showSimpleCampaignDialog}
        onOpenChange={setShowSimpleCampaignDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Quick Add to Campaign</DialogTitle>
            <DialogDescription>
              Add {selectedLeads.length} selected leads to a campaign
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Campaign</Label>
              <Select
                value={campaignData.campaignId}
                onValueChange={(value) =>
                  setCampaignData((prev) => ({ ...prev, campaignId: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select campaign" />
                </SelectTrigger>
                <SelectContent className="max-h-60 overflow-y-auto">
                  <SelectItem value="campaign1">Q4 Product Launch</SelectItem>
                  <SelectItem value="campaign2">Holiday Promotion</SelectItem>
                  <SelectItem value="campaign3">Webinar Series</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowSimpleCampaignDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleQuickAddToCampaign}>
              <Users className="w-4 h-4 mr-2" />
              Add to Campaign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Client Script Dialog */}
      <Dialog open={showScriptDialog} onOpenChange={setShowScriptDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Client Script Generated</DialogTitle>
            <DialogDescription>
              Script for {selectedLeads.length} selected leads
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-gray-100 p-4 rounded-md">
              <pre className="text-sm whitespace-pre-wrap">
                {`// Client script for ${selectedLeads.length
                  } leads\n// Generated on ${new Date().toLocaleString()}\n\n// Add your custom script logic here`}
              </pre>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowScriptDialog(false)}
            >
              Close
            </Button>
            <Button
              onClick={() => {
                navigator.clipboard.writeText(
                  `// Client script for ${selectedLeads.length} leads`
                );
                toast({
                  title: "Copied",
                  description: "Script copied to clipboard",
                });
              }}
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy Script
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approve Leads Dialog */}
      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Leads</DialogTitle>
            <DialogDescription>
              Approve {selectedLeads.length} selected leads for processing
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p>
              Are you sure you want to approve these leads? This will mark them
              as approved and ready for further processing.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowApproveDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleApproveLeads}>
              <Shield className="w-4 h-4 mr-2" />
              Approve Leads
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Deduplicate Leads Dialog */}
      <Dialog
        open={showDeduplicateDialog}
        onOpenChange={setShowDeduplicateDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deduplicate Leads</DialogTitle>
            <DialogDescription>
              Remove duplicate leads based on selected criteria
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Deduplication Criteria</Label>
              <div className="space-y-2 mt-2">
                {["email", "phone", "firstName+lastName+company"].map(
                  (criteria) => (
                    <div key={criteria} className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => handleToggleCriteria(criteria)}
                        className="flex items-center space-x-2"
                      >
                        {deduplicateCriteria.includes(criteria) ? (
                          <CheckSquare className="w-4 h-4 text-blue-600" />
                        ) : (
                          <Square className="w-4 h-4 text-gray-400" />
                        )}
                        <span>{criteria}</span>
                      </button>
                    </div>
                  )
                )}
              </div>
            </div>
            {deduplicateCriteria.length === 0 && (
              <p className="text-sm text-red-600">
                Please select at least one criteria
              </p>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeduplicateDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeduplicateLeads}
              disabled={deduplicateCriteria.length === 0}
            >
              <Filter className="w-4 h-4 mr-2" />
              Deduplicate Leads
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LeadsBulkActions;
