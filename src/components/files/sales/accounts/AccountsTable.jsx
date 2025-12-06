// src/components/files/sales/accounts/AccountsTable.jsx
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  Users,
  Globe,
  Phone,
  RefreshCw,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import accountsAPI from "./accountsAPI";
import { leadsAPI } from "../leads/leadsAPI"; // CHANGED: Named import instead of default

const AccountsTable = ({
  accounts,
  loading,
  selectedAccounts,
  onAccountSelect,
  onAccountEdit,
  onAccountDelete,
  onAccountView,
}) => {
  const { toast } = useToast();
  const [convertedAccountIds, setConvertedAccountIds] = useState(new Set());
  const [isCheckingConversion, setIsCheckingConversion] = useState(false);

  // Check which accounts are converted from leads
  useEffect(() => {
    const checkConvertedAccounts = async () => {
      if (!accounts || accounts.length === 0) return;

      try {
        setIsCheckingConversion(true);
        const convertedIds = new Set();

        // Get all leads to check for converted accounts
        const leadsResponse = await leadsAPI.getLeads({}); // CHANGED: Use getLeads method

        if (leadsResponse.success && leadsResponse.data) {
          leadsResponse.data.forEach((lead) => {
            if (lead.convertedToAccountId) {
              convertedIds.add(lead.convertedToAccountId.toString());
            }
          });
        }

        setConvertedAccountIds(convertedIds);
      } catch (error) {
        console.error("Error checking converted accounts:", error);
        toast({
          title: "Warning",
          description:
            "Could not load conversion data. Some badges may not display.",
          variant: "default",
        });
      } finally {
        setIsCheckingConversion(false);
      }
    };

    checkConvertedAccounts();
  }, [accounts, toast]);

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading accounts...</p>
      </div>
    );
  }

  if (!accounts || accounts.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-600">
          No accounts found. Create your first account to get started.
        </p>
      </div>
    );
  }

  const getTypeColor = (type) => {
    switch (type) {
      case "Customer":
        return "bg-green-100 text-green-800 border-green-200";
      case "Partner":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Vendor":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Prospect":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      onAccountSelect(accounts.map((account) => account._id || account.id));
    } else {
      onAccountSelect([]);
    }
  };

  const handleSelectAccount = (accountId, checked) => {
    if (checked) {
      onAccountSelect([...selectedAccounts, accountId]);
    } else {
      onAccountSelect(selectedAccounts.filter((id) => id !== accountId));
    }
  };

  // Helper to get ID (handles both MongoDB _id and local id)
  const getAccountId = (account) => account._id || account.id;

  // Format annual revenue for display
  const formatAnnualRevenue = (revenue) => {
    if (!revenue && revenue !== 0) return "₹0";
    const numRevenue =
      typeof revenue === "number" ? revenue : parseFloat(revenue) || 0;
    return `₹${numRevenue.toLocaleString("en-IN")}`;
  };

  // Format employees for display
  const formatEmployees = (employees) => {
    if (!employees && employees !== 0) return "0";
    const numEmployees =
      typeof employees === "number" ? employees : parseInt(employees) || 0;
    return numEmployees.toLocaleString("en-IN");
  };

  // Check if account is converted from a lead
  const isAccountConverted = (account) => {
    const accountId = getAccountId(account);
    return convertedAccountIds.has(accountId.toString());
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <th className="text-left p-4 font-medium text-gray-900 dark:text-white">
              <Checkbox
                checked={
                  selectedAccounts.length === accounts.length &&
                  accounts.length > 0
                }
                onCheckedChange={handleSelectAll}
              />
            </th>
            <th className="text-left p-4 font-medium text-gray-900 dark:text-white">
              Account Name
            </th>
            <th className="text-left p-4 font-medium text-gray-900 dark:text-white">
              Website
            </th>
            <th className="text-left p-4 font-medium text-gray-900 dark:text-white">
              Phone
            </th>
            <th className="text-left p-4 font-medium text-gray-900 dark:text-white">
              Industry
            </th>
            <th className="text-left p-4 font-medium text-gray-900 dark:text-white">
              Type
            </th>
            <th className="text-left p-4 font-medium text-gray-900 dark:text-white">
              Contacts
            </th>
            <th className="text-left p-4 font-medium text-gray-900 dark:text-white">
              Employees
            </th>
            <th className="text-left p-4 font-medium text-gray-900 dark:text-white">
              Annual Revenue
            </th>
            <th className="text-left p-4 font-medium text-gray-900 dark:text-white">
              Created
            </th>
            <th className="text-right p-4 font-medium text-gray-900 dark:text-white">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((account) => {
            const accountId = getAccountId(account);
            const isConverted = isAccountConverted(account);

            return (
              <tr
                key={accountId}
                className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <td className="p-4">
                  <Checkbox
                    checked={selectedAccounts.includes(accountId)}
                    onCheckedChange={(checked) =>
                      handleSelectAccount(accountId, checked)
                    }
                  />
                </td>
                <td className="p-4 font-medium text-gray-900 dark:text-white">
                  <div className="flex items-center gap-2">
                    {account.name}
                    {isCheckingConversion ? (
                      <div className="flex items-center">
                        <RefreshCw className="w-3 h-3 animate-spin text-gray-400" />
                      </div>
                    ) : isConverted ? (
                      <Badge
                        variant="outline"
                        className="text-xs bg-green-50 text-green-700 border-green-200"
                      >
                        Converted
                      </Badge>
                    ) : null}
                  </div>
                </td>
                <td className="p-4 text-gray-600 dark:text-gray-400">
                  {account.website ? (
                    <a
                      href={account.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-blue-600 hover:underline"
                    >
                      <Globe className="w-4 h-4" />
                      {account.website}
                    </a>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="p-4 text-gray-600 dark:text-gray-400">
                  {account.phone ? (
                    <div className="flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      {account.phone}
                    </div>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="p-4 text-gray-600 dark:text-gray-400">
                  {account.industry || "-"}
                </td>
                <td className="p-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getTypeColor(
                      account.type
                    )}`}
                  >
                    {account.type || "Other"}
                  </span>
                </td>
                <td className="p-4 text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {account.contacts || 0}
                  </div>
                </td>
                <td className="p-4 text-gray-600 dark:text-gray-400">
                  {formatEmployees(account.employees)}
                </td>
                <td className="p-4 text-gray-600 dark:text-gray-400">
                  {formatAnnualRevenue(account.annualRevenue)}
                </td>
                <td className="p-4 text-gray-600 dark:text-gray-400">
                  {account.createdAt
                    ? new Date(account.createdAt).toLocaleDateString()
                    : "-"}
                </td>
                <td className="p-4 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => onAccountView && onAccountView(account)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onAccountEdit && onAccountEdit(account)}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          onAccountDelete && onAccountDelete(account)
                        }
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {isCheckingConversion && (
        <div className="p-4 text-center text-sm text-gray-500">
          <RefreshCw className="w-4 h-4 animate-spin inline mr-2" />
          Checking account conversions...
        </div>
      )}
    </div>
  );
};

export default AccountsTable;
