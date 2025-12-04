// src/components/files/sales/leads/LeadsTable.jsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  Mail,
  UserCheck,
  Ban,
  Lock,
  Star,
  UserPlus,
  RefreshCw,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { leadsService } from "./leadsService";
import { useToast } from "@/components/ui/use-toast";

const LeadsTable = ({
  leads,
  loading,
  selectedLeads,
  onLeadSelect,
  onLeadEdit,
  onLeadDelete,
  onLeadView,
  onLeadConvert,
  onLeadEmail,
}) => {
  const { toast } = useToast();

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading leads...</p>
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-600">
          No leads found. Create your first lead to get started.
        </p>
      </div>
    );
  }

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

  const handleSelectAll = (checked) => {
    if (checked) {
      onLeadSelect(leads.map((lead) => lead.id || lead._id));
    } else {
      onLeadSelect([]);
    }
  };

  const handleSelectLead = (leadId, checked) => {
    if (checked) {
      onLeadSelect([...selectedLeads, leadId]);
    } else {
      onLeadSelect(selectedLeads.filter((id) => id !== leadId));
    }
  };

  // FIXED: Properly handle sync vs convert
  const handleSyncToContact = async (lead) => {
    try {
      console.log("Syncing lead to contact:", lead.id || lead._id);

      if (!lead.isConverted) {
        // If lead is not converted yet, convert it first
        toast({
          title: "Converting Lead",
          description: "Lead is being converted to contact first...",
        });

        // Call the convert function
        if (onLeadConvert) {
          await onLeadConvert(lead);
        }
        return;
      }

      // If lead is already converted, sync it
      const result = await leadsService.syncLeadToContact(lead.id || lead._id);

      if (result.success) {
        toast({
          title: "Sync Successful",
          description: "Contact updated with latest lead data.",
        });
        // Refresh the table to show updated status
        // Note: We don't call onLeadConvert here as it's already converted
      } else {
        toast({
          title: "Sync Failed",
          description: result.message || "Failed to sync lead to contact",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Sync error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to sync lead to contact",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <th className="text-left p-4 font-medium text-gray-900 dark:text-white">
              <Checkbox
                checked={
                  selectedLeads.length === leads.length && leads.length > 0
                }
                onCheckedChange={handleSelectAll}
              />
            </th>
            <th className="text-left p-4 font-medium text-gray-900 dark:text-white">
              Name
            </th>
            <th className="text-left p-4 font-medium text-gray-900 dark:text-white">
              Company
            </th>
            <th className="text-left p-4 font-medium text-gray-900 dark:text-white">
              Email
            </th>
            <th className="text-left p-4 font-medium text-gray-900 dark:text-white">
              Phone
            </th>
            <th className="text-left p-4 font-medium text-gray-900 dark:text-white">
              Status
            </th>
            <th className="text-left p-4 font-medium text-gray-900 dark:text-white">
              Source
            </th>
            <th className="text-left p-4 font-medium text-gray-900 dark:text-white">
              Flags
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
          {leads.map((lead) => (
            <tr
              key={lead.id || lead._id}
              className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <td className="p-4">
                <Checkbox
                  checked={selectedLeads.includes(lead.id || lead._id)}
                  onCheckedChange={(checked) =>
                    handleSelectLead(lead.id || lead._id, checked)
                  }
                />
              </td>
              <td className="p-4 font-medium text-gray-900 dark:text-white">
                <div className="flex items-center gap-2">
                  {lead.firstName} {lead.lastName}
                  {lead.isUnread && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                  {lead.isConverted && (
                    <Badge
                      variant="outline"
                      className="text-xs bg-green-50 text-green-700 border-green-200"
                    >
                      Converted
                    </Badge>
                  )}
                </div>
              </td>
              <td className="p-4 text-gray-600 dark:text-gray-400">
                {lead.company}
              </td>
              <td className="p-4 text-gray-600 dark:text-gray-400">
                {lead.email}
              </td>
              <td className="p-4 text-gray-600 dark:text-gray-400">
                {lead.phone}
              </td>
              <td className="p-4">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                    lead.leadStatus
                  )}`}
                >
                  {lead.leadStatus}
                </span>
              </td>
              <td className="p-4 text-gray-600 dark:text-gray-400">
                {lead.leadSource}
              </td>
              <td className="p-4">
                <div className="flex gap-1">
                  {lead.isConverted && (
                    <UserCheck
                      className="w-4 h-4 text-green-600"
                      title="Converted"
                    />
                  )}
                  {lead.isLocked && (
                    <Lock className="w-4 h-4 text-orange-600" title="Locked" />
                  )}
                  {lead.isJunk && (
                    <Ban className="w-4 h-4 text-red-600" title="Junk" />
                  )}
                  {lead.isUnsubscribed && (
                    <Mail
                      className="w-4 h-4 text-gray-600"
                      title="Unsubscribed"
                    />
                  )}
                </div>
              </td>
              <td className="p-4 text-gray-600 dark:text-gray-400">
                {new Date(lead.createdAt).toLocaleDateString()}
              </td>
              <td className="p-4 text-right">
                <div className="flex items-center justify-end gap-1">
                  {!lead.isConverted ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onLeadConvert && onLeadConvert(lead)}
                      className="h-8 px-2 text-green-600 border-green-200 hover:bg-green-50"
                      title="Convert to Contact"
                    >
                      <UserPlus className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSyncToContact(lead)}
                      className="h-8 px-2 text-blue-600 border-blue-200 hover:bg-blue-50"
                      title="Sync to Contact"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => onLeadView && onLeadView(lead)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onLeadEdit && onLeadEdit(lead)}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onLeadEmail && onLeadEmail(lead)}
                      >
                        <Mail className="w-4 h-4 mr-2" />
                        Send Email
                      </DropdownMenuItem>
                      {!lead.isConverted ? (
                        <DropdownMenuItem
                          onClick={() => onLeadConvert && onLeadConvert(lead)}
                        >
                          <UserPlus className="w-4 h-4 mr-2" />
                          Convert to Contact
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem
                          onClick={() => handleSyncToContact(lead)}
                        >
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Sync to Contact
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        onClick={() => onLeadDelete && onLeadDelete(lead)}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeadsTable;
