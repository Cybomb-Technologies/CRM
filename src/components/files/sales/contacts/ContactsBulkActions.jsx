// src/components/contacts/ContactsBulkActions.jsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import {
  MoreHorizontal,
  Trash2,
  Edit,
  Send,
  Download,
  Tag,
  Mail,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { contactsService } from "./contactsService";

const ContactsBulkActions = ({
  selectedContacts,
  onBulkDelete,
  onBulkUpdate,
  currentFilters = {},
}) => {
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [updateData, setUpdateData] = useState({
    department: "no-change",
    leadSource: "no-change",
  });
  const [emailData, setEmailData] = useState({
    subject: "",
    message: "",
  });
  const [exportFormat, setExportFormat] = useState("csv");
  const [exportLoading, setExportLoading] = useState(false);

  const { toast } = useToast();

  const handleBulkUpdate = () => {
    // Only send updates that have values (not 'no-change')
    const updates = {};
    if (updateData.department && updateData.department !== "no-change") {
      updates.department = updateData.department;
    }
    if (updateData.leadSource && updateData.leadSource !== "no-change") {
      updates.leadSource = updateData.leadSource;
    }

    // Only call update if there are actual updates
    if (Object.keys(updates).length > 0) {
      onBulkUpdate(selectedContacts, updates);
      setShowUpdateDialog(false);
      setUpdateData({ department: "no-change", leadSource: "no-change" });
    }
  };

  const handleMassEmail = () => {
    // Implement mass email functionality
    console.log("Sending mass email to:", selectedContacts, emailData);
    setShowEmailDialog(false);
    setEmailData({ subject: "", message: "" });
  };

  const handleExportContacts = async () => {
    setExportLoading(true);
    try {
      // Prepare filters for export
      const exportFilters = {
        ...currentFilters,
        // Include selected contacts if any are selected
        ...(selectedContacts.length > 0 && { contactIds: selectedContacts }),
      };

      console.log(
        "Exporting contacts with format:",
        exportFormat,
        "filters:",
        exportFilters
      );

      const response = await contactsService.exportContacts(
        exportFormat,
        exportFilters
      );

      if (response.success) {
        toast({
          title: "Export Successful",
          description: response.message || "Contacts exported successfully",
          variant: "default",
        });
      } else {
        toast({
          title: "Export Failed",
          description: response.message || "Failed to export contacts",
          variant: "destructive",
        });
      }
      setShowExportDialog(false);
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Export Error",
        description: "An error occurred while exporting contacts",
        variant: "destructive",
      });
    } finally {
      setExportLoading(false);
    }
  };

  if (selectedContacts.length === 0) return null;

  return (
    <>
      <div className="flex items-center gap-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <span className="text-sm text-blue-800">
          {selectedContacts.length} contact(s) selected
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
            className="w-56 max-h-80 overflow-y-auto"
          >
            {/* Mass Update */}
            <DropdownMenuItem onClick={() => setShowUpdateDialog(true)}>
              <Edit className="w-4 h-4 mr-2" />
              Mass Update
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {/* Mass Email */}
            <DropdownMenuItem onClick={() => setShowEmailDialog(true)}>
              <Send className="w-4 h-4 mr-2" />
              Mass Email
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {/* Export */}
            <DropdownMenuItem onClick={() => setShowExportDialog(true)}>
              <Download className="w-4 h-4 mr-2" />
              Export Contacts
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {/* Destructive Actions */}
            <DropdownMenuItem
              onClick={() => onBulkDelete(selectedContacts)}
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
          onClick={() => onBulkDelete(selectedContacts)}
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
            <DialogTitle>Mass Update Contacts</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Department</Label>
              <Select
                value={updateData.department}
                onValueChange={(value) =>
                  setUpdateData((prev) => ({ ...prev, department: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent className="max-h-60 overflow-y-auto">
                  <SelectItem value="no-change">No Change</SelectItem>
                  <SelectItem value="None">None</SelectItem>
                  <SelectItem value="Administration">Administration</SelectItem>
                  <SelectItem value="Engineering">Engineering</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="Human Resources">
                    Human Resources
                  </SelectItem>
                  <SelectItem value="IT">IT</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Operations">Operations</SelectItem>
                  <SelectItem value="Sales">Sales</SelectItem>
                  <SelectItem value="Support">Support</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Lead Source</Label>
              <Select
                value={updateData.leadSource}
                onValueChange={(value) =>
                  setUpdateData((prev) => ({ ...prev, leadSource: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent className="max-h-60 overflow-y-auto">
                  <SelectItem value="no-change">No Change</SelectItem>
                  <SelectItem value="None">None</SelectItem>
                  <SelectItem value="Advertisement">Advertisement</SelectItem>
                  <SelectItem value="Cold Call">Cold Call</SelectItem>
                  <SelectItem value="Employee Referral">
                    Employee Referral
                  </SelectItem>
                  <SelectItem value="External Referral">
                    External Referral
                  </SelectItem>
                  <SelectItem value="Online Store">Online Store</SelectItem>
                  <SelectItem value="Partner">Partner</SelectItem>
                  <SelectItem value="Public Relations">
                    Public Relations
                  </SelectItem>
                  <SelectItem value="Sales Email">Sales Email</SelectItem>
                  <SelectItem value="Seminar">Seminar</SelectItem>
                  <SelectItem value="Trade Show">Trade Show</SelectItem>
                  <SelectItem value="Web Download">Web Download</SelectItem>
                  <SelectItem value="Web Research">Web Research</SelectItem>
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
            <Button
              onClick={handleBulkUpdate}
              disabled={
                updateData.department === "no-change" &&
                updateData.leadSource === "no-change"
              }
            >
              Update {selectedContacts.length} Contacts
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Mass Email Dialog */}
      <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Mass Email</DialogTitle>
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
              <textarea
                value={emailData.message}
                onChange={(e) =>
                  setEmailData((prev) => ({ ...prev, message: e.target.value }))
                }
                placeholder="Email message"
                className="w-full h-32 p-2 border rounded-md resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEmailDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleMassEmail}>
              <Mail className="w-4 h-4 mr-2" />
              Send to {selectedContacts.length} Contacts
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Export Dialog */}
      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Contacts</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Export Format</Label>
              <Select
                value={exportFormat}
                onValueChange={(value) => setExportFormat(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="text-sm text-gray-500">
              <p>
                Exporting{" "}
                {selectedContacts.length > 0
                  ? `${selectedContacts.length} selected contacts`
                  : "all filtered contacts"}
              </p>
              <p className="mt-1">
                The file will be downloaded automatically with a timestamp.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowExportDialog(false)}
              disabled={exportLoading}
            >
              Cancel
            </Button>
            <Button onClick={handleExportContacts} disabled={exportLoading}>
              {exportLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Export Contacts
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ContactsBulkActions;
