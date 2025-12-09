// src/components/deals/DealsBulkActions.jsx
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
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
  Users,
  FileText,
  Filter,
  Copy,
  Mail,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import dealsAPI from "./dealsAPI";

const DealsBulkActions = ({
  selectedDeals,
  onBulkDelete,
  onBulkUpdate,
  onExport,
}) => {
  const { toast } = useToast();

  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [showTagsDialog, setShowTagsDialog] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [showPrintDialog, setShowPrintDialog] = useState(false);

  const [updateData, setUpdateData] = useState({
    stage: "",
    owner: "",
    probability: "",
  });
  const [tagsData, setTagsData] = useState({
    tagsToAdd: "",
    tagsToRemove: "",
  });
  const [emailData, setEmailData] = useState({
    subject: "",
    message: "",
  });
  const [printData, setPrintData] = useState({
    includeDetails: true,
    includeContacts: true,
    includeNotes: false,
    orientation: "portrait",
  });
  const [dealStages, setDealStages] = useState({});
  const [dealsToPrint, setDealsToPrint] = useState([]);
  const [isLoadingPrintData, setIsLoadingPrintData] = useState(false);

  const printContentRef = useRef(null);

  React.useEffect(() => {
    const fetchStages = async () => {
      try {
        const stages = await dealsAPI.getDealStages();
        setDealStages(stages);
      } catch (error) {
        console.error("Error fetching deal stages:", error);
      }
    };

    fetchStages();
  }, []);

  const handleBulkUpdate = async () => {
    try {
      const updates = {};
      if (updateData.stage) updates.stage = updateData.stage;
      if (updateData.owner) updates.owner = updateData.owner;
      if (updateData.probability)
        updates.probability = parseInt(updateData.probability);

      await onBulkUpdate(selectedDeals, updates);
      setShowUpdateDialog(false);
      setUpdateData({ stage: "", owner: "", probability: "" });
    } catch (error) {
      console.error("Error in bulk update:", error);
    }
  };

  const handleManageTags = async () => {
    try {
      const tagsToAdd = tagsData.tagsToAdd
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag);
      const tagsToRemove = tagsData.tagsToRemove
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag);

      const updates = {};
      if (tagsToAdd.length > 0) {
        updates.tags = [...tagsToAdd];
      }

      await onBulkUpdate(selectedDeals, updates);

      toast({
        title: "Tags Updated",
        description: "Tags have been updated successfully",
      });
      setShowTagsDialog(false);
      setTagsData({ tagsToAdd: "", tagsToRemove: "" });
    } catch (error) {
      console.error("Error managing tags:", error);
      toast({
        title: "Error",
        description: "Failed to update tags",
        variant: "destructive",
      });
    }
  };

  const handleMassEmail = () => {
    // Simulate sending mass email
    console.log("Sending mass email to deals:", selectedDeals, emailData);
    toast({
      title: "Mass Email Sent",
      description: `Email sent for ${selectedDeals.length} deals.`,
    });
    setShowEmailDialog(false);
    setEmailData({ subject: "", message: "" });
  };

  const handleExportSheetView = async () => {
    try {
      await onExport(selectedDeals);
    } catch (error) {
      console.error("Error exporting sheet view:", error);
      toast({
        title: "Export Failed",
        description: "Failed to export deals",
        variant: "destructive",
      });
    }
  };

  // FIXED: Print View Functionality
  const handlePrintView = async () => {
    try {
      setIsLoadingPrintData(true);

      if (selectedDeals.length === 0) {
        toast({
          title: "No Deals Selected",
          description: "Please select deals to print.",
          variant: "destructive",
        });
        setIsLoadingPrintData(false);
        return;
      }

      // Fetch detailed deal information for printing
      const dealsPromises = selectedDeals.map(async (dealId) => {
        try {
          const response = await dealsAPI.getDealById(dealId);
          if (response.success) {
            return response.deal;
          }
          return null;
        } catch (error) {
          console.error(`Error fetching deal ${dealId}:`, error);
          return null;
        }
      });

      const dealsData = await Promise.all(dealsPromises);
      const validDeals = dealsData.filter((deal) => deal !== null);

      if (validDeals.length === 0) {
        toast({
          title: "No Data Available",
          description: "Could not fetch deal details for printing.",
          variant: "destructive",
        });
        setIsLoadingPrintData(false);
        return;
      }

      setDealsToPrint(validDeals);
      setShowPrintDialog(true);

      toast({
        title: "Print Preview Ready",
        description: `Loaded ${validDeals.length} deals for printing.`,
      });
    } catch (error) {
      console.error("Error preparing print view:", error);
      toast({
        title: "Print Failed",
        description: "Failed to prepare deals for printing.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingPrintData(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Generate printable content
  const generatePrintableContent = () => {
    const styles = `
      <style>
        @media print {
          body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
          .no-print { display: none !important; }
          .print-header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 15px; }
          .print-title { font-size: 24px; font-weight: bold; color: #333; }
          .print-subtitle { font-size: 14px; color: #666; margin-top: 5px; }
          .print-section { margin-bottom: 25px; }
          .print-section-title { font-size: 18px; font-weight: bold; color: #333; margin-bottom: 15px; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
          .print-table { width: 100%; border-collapse: collapse; margin-top: 15px; }
          .print-table th { background-color: #f3f4f6; border: 1px solid #ddd; padding: 10px; text-align: left; font-weight: bold; }
          .print-table td { border: 1px solid #ddd; padding: 10px; }
          .print-badge { display: inline-block; padding: 3px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; margin: 2px; }
          .print-summary { background-color: #f9fafb; padding: 15px; border-radius: 6px; margin: 20px 0; }
          .print-footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; text-align: center; }
          .page-break { page-break-before: always; }
        }
        .print-preview { font-family: Arial, sans-serif; padding: 20px; }
      </style>
    `;

    const header = `
      <div class="print-header">
        <div class="print-title">Deals Report</div>
        <div class="print-subtitle">
          Generated: ${new Date().toLocaleDateString()} | 
          Total Deals: ${dealsToPrint.length} | 
          Printed By: User
        </div>
      </div>
    `;

    const summary = `
      <div class="print-section">
        <div class="print-section-title">Summary</div>
        <div class="print-summary">
          <div><strong>Total Value:</strong> ${formatCurrency(
            dealsToPrint.reduce((sum, deal) => sum + (deal.value || 0), 0)
          )}</div>
          <div><strong>Weighted Value:</strong> ${formatCurrency(
            dealsToPrint.reduce(
              (sum, deal) =>
                sum + ((deal.value || 0) * (deal.probability || 0)) / 100,
              0
            )
          )}</div>
          <div><strong>Average Probability:</strong> ${(
            dealsToPrint.reduce(
              (sum, deal) => sum + (deal.probability || 0),
              0
            ) / dealsToPrint.length
          ).toFixed(1)}%</div>
          <div><strong>Deals by Stage:</strong> ${Object.entries(
            dealsToPrint.reduce((acc, deal) => {
              acc[deal.stage] = (acc[deal.stage] || 0) + 1;
              return acc;
            }, {})
          )
            .map(([stage, count]) => `${stage}: ${count}`)
            .join(", ")}</div>
        </div>
      </div>
    `;

    const dealsTable = `
      <div class="print-section">
        <div class="print-section-title">Deal Details (${
          dealsToPrint.length
        } deals)</div>
        <table class="print-table">
          <thead>
            <tr>
              <th>Deal Title</th>
              <th>Company</th>
              <th>Value</th>
              <th>Probability</th>
              <th>Stage</th>
              <th>Owner</th>
              <th>Close Date</th>
            </tr>
          </thead>
          <tbody>
            ${dealsToPrint
              .map(
                (deal, index) => `
              <tr>
                <td><strong>${deal.title || "N/A"}</strong></td>
                <td>${deal.company || "N/A"}</td>
                <td>${formatCurrency(deal.value)}</td>
                <td>
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <div style="width: 60px; height: 8px; background-color: #e5e7eb; border-radius: 4px; overflow: hidden;">
                      <div style="width: ${
                        deal.probability || 0
                      }%; height: 100%; background-color: ${
                  deal.probability >= 70
                    ? "#10b981"
                    : deal.probability >= 30
                    ? "#f59e0b"
                    : "#ef4444"
                };"></div>
                    </div>
                    <span>${deal.probability || 0}%</span>
                  </div>
                </td>
                <td>
                  <span class="print-badge" style="background-color: ${
                    getStageColor(deal.stage).bg
                  }; color: ${getStageColor(deal.stage).text};">
                    ${dealStages[deal.stage] || deal.stage}
                  </span>
                </td>
                <td>${deal.owner || "Unassigned"}</td>
                <td>${formatDate(deal.closeDate)}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      </div>
    `;

    const footer = `
      <div class="print-footer">
        <div>Confidential - For internal use only</div>
        <div>Page 1 of 1</div>
      </div>
    `;

    return styles + header + summary + dealsTable + footer;
  };

  const getStageColor = (stage) => {
    const colors = {
      qualification: { bg: "#dbeafe", text: "#1e40af" },
      "needs-analysis": { bg: "#e9d5ff", text: "#7c3aed" },
      "value-proposition": { bg: "#e0e7ff", text: "#4f46e5" },
      "identify-decision-makers": { bg: "#fef3c7", text: "#92400e" },
      "proposal-price-quote": { bg: "#fed7aa", text: "#ea580c" },
      "negotiation-review": { bg: "#fee2e2", text: "#dc2626" },
      "closed-won": { bg: "#d1fae5", text: "#065f46" },
      "closed-lost": { bg: "#f3f4f6", text: "#374151" },
      "closed-lost-to-competition": { bg: "#f3f4f6", text: "#374151" },
    };
    return colors[stage] || { bg: "#f3f4f6", text: "#374151" };
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank", "width=900,height=600");
    if (!printWindow) {
      toast({
        title: "Popup Blocked",
        description: "Please allow popups to print.",
        variant: "destructive",
      });
      return;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>Deals Print Preview</title>
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css">
        </head>
        <body>
          <div class="no-print p-4 bg-gray-100 border-b">
            <button onclick="window.print()" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mr-2">
              <i class="mr-2">🖨️</i> Print Now
            </button>
            <button onclick="window.close()" class="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
              Close Window
            </button>
          </div>
          <div class="print-preview">
            ${generatePrintableContent()}
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
  };

  const handleDirectPrint = () => {
    const content = generatePrintableContent();
    const printWindow = window.open("", "_blank");

    printWindow.document.write(`
      <html>
        <head>
          <title>Print Deals</title>
          <style>
            body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
            @media print {
              .no-print { display: none !important; }
            }
            .no-print { padding: 20px; background: #f3f4f6; border-bottom: 1px solid #ddd; }
            .print-button { padding: 10px 20px; background: #3b82f6; color: white; border: none; border-radius: 5px; cursor: pointer; }
            .print-button:hover { background: #2563eb; }
          </style>
        </head>
        <body>
          <div class="no-print">
            <button class="print-button" onclick="window.print()">Print Now</button>
            <button class="print-button" onclick="window.close()" style="background: #6b7280; margin-left: 10px;">Close</button>
          </div>
          ${content}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
  };

  if (selectedDeals.length === 0) return null;

  return (
    <>
      <div className="flex items-center gap-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <span className="text-sm text-blue-800">
          {selectedDeals.length} deal(s) selected
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
            className="w-64 max-h-96 overflow-y-auto"
          >
            {/* Mass Update */}
            <DropdownMenuItem onClick={() => setShowUpdateDialog(true)}>
              <Edit className="w-4 h-4 mr-2" />
              Mass Update
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

            {/* Export */}
            <DropdownMenuItem onClick={() => onExport(selectedDeals)}>
              <Download className="w-4 h-4 mr-2" />
              Export Deals
            </DropdownMenuItem>

            {/* Print View - FIXED */}
            <DropdownMenuItem
              onClick={handlePrintView}
              disabled={isLoadingPrintData}
            >
              <Printer className="w-4 h-4 mr-2" />
              {isLoadingPrintData ? "Loading..." : "Print View"}
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {/* Destructive Actions */}
            <DropdownMenuItem
              onClick={() => onBulkDelete(selectedDeals)}
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
          onClick={() => onBulkDelete(selectedDeals)}
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
            <DialogTitle>Mass Update Deals</DialogTitle>
            <DialogDescription>
              Update {selectedDeals.length} selected deals
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Stage</Label>
              <Select
                value={updateData.stage}
                onValueChange={(value) =>
                  setUpdateData((prev) => ({ ...prev, stage: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select stage" />
                </SelectTrigger>
                <SelectContent className="max-h-60 overflow-y-auto">
                  {Object.entries(dealStages).map(([stageKey, stageLabel]) => (
                    <SelectItem key={stageKey} value={stageKey}>
                      {stageLabel}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Owner</Label>
              <Input
                value={updateData.owner}
                onChange={(e) =>
                  setUpdateData((prev) => ({ ...prev, owner: e.target.value }))
                }
                placeholder="New owner name"
              />
            </div>

            <div>
              <Label>Probability</Label>
              <Select
                value={updateData.probability}
                onValueChange={(value) =>
                  setUpdateData((prev) => ({ ...prev, probability: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select probability" />
                </SelectTrigger>
                <SelectContent className="max-h-60 overflow-y-auto">
                  <SelectItem value="10">10% - Very Low</SelectItem>
                  <SelectItem value="25">25% - Low</SelectItem>
                  <SelectItem value="50">50% - Medium</SelectItem>
                  <SelectItem value="75">75% - High</SelectItem>
                  <SelectItem value="90">90% - Very High</SelectItem>
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
              Update {selectedDeals.length} Deals
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
              Add or remove tags for {selectedDeals.length} selected deals
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
                placeholder="enterprise, urgent, follow-up"
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
                placeholder="cold, inactive, old"
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

      {/* Mass Email Dialog */}
      <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Send Mass Email</DialogTitle>
            <DialogDescription>
              Send email for {selectedDeals.length} selected deals
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
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
              Send for {selectedDeals.length} Deals
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Print Dialog */}
      <Dialog open={showPrintDialog} onOpenChange={setShowPrintDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Print Deals</DialogTitle>
            <DialogDescription>
              Configure print settings for {dealsToPrint.length} selected deals
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Print Preview */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-3">Print Preview</h3>
              <div
                ref={printContentRef}
                className="border p-4 bg-white max-h-60 overflow-y-auto"
                dangerouslySetInnerHTML={{ __html: generatePrintableContent() }}
              />
              <p className="text-sm text-gray-500 mt-2">
                Preview shows first few deals. Actual print will include all{" "}
                {dealsToPrint.length} deals.
              </p>
            </div>

            {/* Print Options */}
            <div className="space-y-4">
              <h3 className="font-semibold">Print Options</h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Orientation</Label>
                  <Select
                    value={printData.orientation}
                    onValueChange={(value) =>
                      setPrintData((prev) => ({ ...prev, orientation: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="portrait">Portrait</SelectItem>
                      <SelectItem value="landscape">Landscape</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Paper Size</Label>
                  <Select defaultValue="a4">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="a4">A4</SelectItem>
                      <SelectItem value="letter">Letter</SelectItem>
                      <SelectItem value="legal">Legal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="includeDetails"
                    checked={printData.includeDetails}
                    onChange={(e) =>
                      setPrintData((prev) => ({
                        ...prev,
                        includeDetails: e.target.checked,
                      }))
                    }
                    className="rounded"
                  />
                  <Label htmlFor="includeDetails">
                    Include detailed information
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="includeContacts"
                    checked={printData.includeContacts}
                    onChange={(e) =>
                      setPrintData((prev) => ({
                        ...prev,
                        includeContacts: e.target.checked,
                      }))
                    }
                    className="rounded"
                  />
                  <Label htmlFor="includeContacts">
                    Include contact information
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="includeNotes"
                    checked={printData.includeNotes}
                    onChange={(e) =>
                      setPrintData((prev) => ({
                        ...prev,
                        includeNotes: e.target.checked,
                      }))
                    }
                    className="rounded"
                  />
                  <Label htmlFor="includeNotes">
                    Include notes and descriptions
                  </Label>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowPrintDialog(false)}>
              Cancel
            </Button>
            <Button variant="outline" onClick={handleDirectPrint}>
              <Printer className="w-4 h-4 mr-2" />
              Quick Print
            </Button>
            <Button onClick={handlePrint}>
              <Printer className="w-4 h-4 mr-2" />
              Open Print Preview
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DealsBulkActions;
