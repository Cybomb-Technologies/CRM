// src/components/accounts/AccountsBulkActions.jsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Trash2, Download, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const AccountsBulkActions = ({
  selectedAccounts,
  onBulkDelete,
  accounts = [],
}) => {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);

  if (selectedAccounts.length === 0) return null;

  // Export Accounts function
  const exportAccounts = () => {
    setIsExporting(true);

    try {
      // Check if we have accounts data
      if (!accounts || accounts.length === 0) {
        toast({
          title: "No Data Available",
          description: "Please refresh the page and try again.",
          variant: "destructive",
        });
        setIsExporting(false);
        return;
      }

      // Get selected account data
      const selectedData = accounts.filter((account) => {
        if (!account) return false;
        const accountId = account._id || account.id;
        return accountId && selectedAccounts.includes(accountId);
      });

      if (selectedData.length === 0) {
        toast({
          title: "No Accounts Selected",
          description: "Please select valid accounts to export.",
          variant: "destructive",
        });
        setIsExporting(false);
        return;
      }

      // Create CSV headers
      const headers = [
        "Account Name",
        "Website",
        "Phone",
        "Email",
        "Industry",
        "Type",
        "Contacts",
        "Employees",
        "Annual Revenue (₹)",
        "Created Date",
      ];

      // Convert data to CSV rows
      const csvRows = selectedData.map((account) => {
        const row = [
          `"${account.name || ""}"`,
          `"${account.website || ""}"`,
          `"${account.phone || ""}"`,
          `"${account.email || ""}"`,
          `"${account.industry || ""}"`,
          `"${account.type || ""}"`,
          account.contacts || 0,
          account.employees || 0,
          account.annualRevenue || 0,
          `"${
            account.createdAt
              ? new Date(account.createdAt).toLocaleDateString()
              : ""
          }"`,
        ];
        return row.join(",");
      });

      // Combine headers and rows
      const csvContent = [headers.join(","), ...csvRows].join("\n");

      // Create and download file
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);

      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `accounts_export_${new Date().toISOString().split("T")[0]}.csv`
      );
      link.style.visibility = "hidden";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Export Successful",
        description: `${selectedData.length} account(s) exported to CSV.`,
      });
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Export Failed",
        description:
          error.message || "Failed to export accounts. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  // Handle bulk delete with confirmation
  const handleBulkDelete = () => {
    if (selectedAccounts.length === 0) {
      toast({
        title: "No Selection",
        description: "Please select accounts to delete.",
        variant: "destructive",
      });
      return;
    }

    if (
      confirm(
        `Are you sure you want to delete ${selectedAccounts.length} account(s)? This will also delete all associated contacts.`
      )
    ) {
      onBulkDelete(selectedAccounts);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-blue-800">
          {selectedAccounts.length} account(s) selected
        </span>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" disabled={isExporting}>
              <MoreHorizontal className="w-4 h-4 mr-2" />
              Bulk Actions
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            {/* Export Accounts Option - INSIDE DROPDOWN ONLY */}
            <DropdownMenuItem
              onClick={exportAccounts}
              disabled={isExporting}
              className="cursor-pointer"
            >
              {isExporting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              Export Accounts
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {/* Delete Option */}
            <DropdownMenuItem
              onClick={handleBulkDelete}
              className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Selected
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* REMOVED: Quick Export Button (No button outside dropdown) */}
      </div>

      {/* Delete Button - KEEP THIS ONE */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleBulkDelete}
        className="text-red-600 border-red-200 hover:bg-red-50"
      >
        <Trash2 className="w-4 h-4 mr-2" />
        Delete Selected
      </Button>
    </div>
  );
};

export default AccountsBulkActions;
