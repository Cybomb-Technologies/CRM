import React, { useState, useEffect } from "react";
import { campaignsService } from "./campaignsService";
import { leadsService } from "../leads/leadsService"; // Import leads service
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Plus,
  Mail,
  UserCheck,
  UserX,
  Loader2,
  Check,
  Building,
  Phone,
  Users,
  X,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const CampaignMembers = ({ campaign, onUpdate }) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchingLeads, setFetchingLeads] = useState(false);
  const [leads, setLeads] = useState([]);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [filters, setFilters] = useState({
    status: "",
    source: "",
    industry: "",
  });

  // Parse members data - handle both objects and JSON strings
  const parseMembers = (members) => {
    if (!Array.isArray(members)) return [];

    return members.map((member) => {
      if (typeof member === "string") {
        try {
          // Try to parse as JSON
          return JSON.parse(member);
        } catch (error) {
          // If parsing fails, return a basic object
          console.error("Failed to parse member JSON:", error);
          return {
            id: member,
            name: "Unknown Member",
            type: "unknown",
            email: "",
            company: "",
            phone: "",
          };
        }
      }
      // If it's already an object, return as-is
      return member;
    });
  };

  const members = parseMembers(campaign.members || []);

  // Fetch leads when dialog opens
  useEffect(() => {
    if (showAddDialog) {
      fetchLeads();
      setSelectedLeads([]); // Reset selection when dialog opens
    }
  }, [showAddDialog]);

  // Fetch leads with filters
  const fetchLeads = async () => {
    setFetchingLeads(true);
    try {
      // Build filters object - Only search term
      const filterParams = {};
      if (searchTerm) {
        filterParams.search = searchTerm;
      }

      // Fetch leads from leads service
      const result = await leadsService.fetchLeads(filterParams);
      if (result.success) {
        setLeads(result.data || []);
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to fetch leads",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Fetch leads error:", error);
      toast({
        title: "Error",
        description: "Failed to fetch leads. Please try again.",
        variant: "destructive",
      });
    } finally {
      setFetchingLeads(false);
    }
  };

  // Handle selecting/deselecting leads - FIXED BUG HERE
  const handleSelectLead = (lead) => {
    console.log("Selecting lead:", lead._id || lead.id);
    console.log("Current selected leads:", selectedLeads);

    setSelectedLeads((prev) => {
      const leadId = lead._id || lead.id;
      const isSelected = prev.some(
        (selected) => (selected._id || selected.id) === leadId
      );

      console.log("Is selected?", isSelected);

      if (isSelected) {
        // Remove the lead if already selected
        return prev.filter(
          (selected) => (selected._id || selected.id) !== leadId
        );
      } else {
        // Add the lead if not selected
        return [...prev, lead];
      }
    });
  };

  const handleSelectAll = () => {
    console.log("Select all clicked");
    console.log("Available leads count:", availableLeads.length);
    console.log("Selected leads count:", selectedLeads.length);

    if (selectedLeads.length === availableLeads.length) {
      // Deselect all
      setSelectedLeads([]);
    } else {
      // Select all available leads
      setSelectedLeads([...availableLeads]);
    }
  };

  // Add selected leads as campaign members
  const handleAddSelectedLeads = async () => {
    if (selectedLeads.length === 0) {
      toast({
        title: "No Selection",
        description: "Please select at least one lead to add.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Convert selected leads to campaign member format
      const membersData = selectedLeads.map((lead) => {
        const leadId = lead._id || lead.id;
        const leadName =
          `${lead.firstName || ""} ${lead.lastName || ""}`.trim() ||
          `Lead ${leadId?.substring(0, 8) || "Unknown"}`;

        return {
          id: leadId,
          name: leadName,
          email: lead.email || "",
          type: "lead",
          company: lead.company || "",
          phone: lead.phone || lead.mobile || "",
        };
      });

      console.log("Adding members to campaign:", {
        campaignId: campaign._id || campaign.id,
        campaignName: campaign.campaignName,
        membersCount: membersData.length,
        members: membersData,
      });

      const result = await campaignsService.addMembersToCampaign(
        campaign._id || campaign.id,
        membersData
      );

      if (result.success) {
        toast({
          title: "Success",
          description: `${selectedLeads.length} lead(s) added to campaign successfully.`,
        });
        setShowAddDialog(false);
        setSelectedLeads([]);
        // Call onUpdate to refresh campaign data
        if (onUpdate) {
          console.log("Calling onUpdate callback...");
          onUpdate();
        }
      } else {
        throw new Error(result.message || "Failed to add leads");
      }
    } catch (error) {
      console.error("Add leads to campaign error:", error);
      console.error("Error details:", {
        campaignId: campaign._id || campaign.id,
        campaignExists: !!campaign,
        campaignName: campaign.campaignName,
      });

      let errorMessage = error.message || "Failed to add leads to campaign";

      // Provide more specific error messages
      if (error.message.includes("Campaign not found")) {
        errorMessage =
          "Campaign not found. Please refresh the page and try again.";
      } else if (error.message.includes("Failed to fetch")) {
        errorMessage =
          "Network error. Please check your connection and try again.";
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle removing members
  const handleRemoveMember = async (memberId) => {
    if (window.confirm("Are you sure you want to remove this member?")) {
      try {
        const result = await campaignsService.removeMembersFromCampaign(
          campaign._id || campaign.id,
          [memberId]
        );

        if (result.success) {
          toast({
            title: "Member Removed",
            description: "Member has been removed from the campaign",
          });
          onUpdate?.();
        } else {
          throw new Error(result.message);
        }
      } catch (error) {
        console.error("Remove member error:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to remove member",
          variant: "destructive",
        });
      }
    }
  };

  // Handle marking as responded
  const handleMarkResponded = async (memberId) => {
    try {
      const result = await campaignsService.updateMemberStatus(
        campaign._id || campaign.id,
        memberId,
        "responded",
        true
      );

      if (result.success) {
        toast({
          title: "Member Updated",
          description: "Member marked as responded",
        });
        onUpdate?.();
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error("Mark responded error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update member status",
        variant: "destructive",
      });
    }
  };

  // Handle marking as converted
  const handleMarkConverted = async (memberId) => {
    try {
      const result = await campaignsService.updateMemberStatus(
        campaign._id || campaign.id,
        memberId,
        "converted",
        true
      );

      if (result.success) {
        toast({
          title: "Member Updated",
          description: "Member marked as converted",
        });
        onUpdate?.();
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error("Mark converted error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update member status",
        variant: "destructive",
      });
    }
  };

  // Filter leads that are already members to avoid duplicates
  const availableLeads = leads.filter((lead) => {
    const leadId = lead._id || lead.id;
    return !members.some((member) => member.id === leadId);
  });

  // Helper function to get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case "New":
        return "bg-blue-100 text-blue-800";
      case "Contacted":
        return "bg-yellow-100 text-yellow-800";
      case "Qualified":
        return "bg-green-100 text-green-800";
      case "Unqualified":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Campaign Members</h3>
          <p className="text-gray-600">
            {members.length} member(s) in this campaign
          </p>
        </div>
        <Button
          onClick={() => setShowAddDialog(true)}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Members
        </Button>
      </div>

      {/* Members List */}
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-4 font-medium">Name</th>
                <th className="text-left p-4 font-medium">Email</th>
                <th className="text-left p-4 font-medium">Type</th>
                <th className="text-left p-4 font-medium">Company</th>
                <th className="text-left p-4 font-medium">Status</th>
                <th className="text-left p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.id} className="border-t hover:bg-gray-50">
                  <td className="p-4">
                    <div className="font-medium">
                      {member.name || "Unknown Member"}
                    </div>
                    {member.phone && (
                      <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <Phone className="w-3 h-3" />
                        {member.phone}
                      </div>
                    )}
                  </td>
                  <td className="p-4">{member.email || "-"}</td>
                  <td className="p-4">
                    <Badge
                      variant={member.type === "lead" ? "outline" : "default"}
                      className={
                        member.type === "lead"
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : "bg-green-50 text-green-700 border-green-200"
                      }
                    >
                      {member.type || "unknown"}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-gray-400" />
                      {member.company || "-"}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-1">
                      {member.responded && (
                        <Badge className="bg-green-100 text-green-800">
                          <Mail className="w-3 h-3 mr-1" />
                          Responded
                        </Badge>
                      )}
                      {member.converted && (
                        <Badge className="bg-blue-100 text-blue-800">
                          <UserCheck className="w-3 h-3 mr-1" />
                          Converted
                        </Badge>
                      )}
                      {!member.responded && !member.converted && (
                        <span className="text-gray-500 text-sm">No action</span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      {!member.responded && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleMarkResponded(member.id)}
                          disabled={loading}
                          className="h-8 text-xs"
                        >
                          <Mail className="w-3 h-3 mr-1" />
                          Mark Responded
                        </Button>
                      )}
                      {member.responded && !member.converted && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleMarkConverted(member.id)}
                          disabled={loading}
                          className="h-8 text-xs"
                        >
                          <UserCheck className="w-3 h-3 mr-1" />
                          Mark Converted
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleRemoveMember(member.id)}
                        disabled={loading}
                        className="h-8 text-xs"
                      >
                        <UserX className="w-3 h-3 mr-1" />
                        Remove
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {members.length === 0 && (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-4">
                <Users className="w-12 h-12 mx-auto" />
              </div>
              <p className="text-gray-500">
                No members added to this campaign yet.
              </p>
              <Button
                onClick={() => setShowAddDialog(true)}
                variant="outline"
                className="mt-4"
                disabled={loading}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Member
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Add Members Dialog */}
      {showAddDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-6xl max-h-[85vh] overflow-hidden flex flex-col">
            {/* Dialog Header */}
            <div className="flex justify-between items-center p-6 border-b">
              <div>
                <h3 className="text-lg font-semibold">Add Leads to Campaign</h3>
                <p className="text-gray-600">
                  Select leads to add as campaign members
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowAddDialog(false);
                  setSelectedLeads([]);
                  setSearchTerm("");
                }}
                className="hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Search Section */}
            <div className="p-6 border-b bg-gray-50">
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search leads by name, email, company, or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                    onKeyPress={(e) => e.key === "Enter" && fetchLeads()}
                  />
                </div>
                <Button
                  onClick={fetchLeads}
                  disabled={fetchingLeads}
                  variant="outline"
                  className="whitespace-nowrap"
                >
                  {fetchingLeads ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Search className="w-4 h-4 mr-2" />
                  )}
                  Search
                </Button>
              </div>
            </div>

            {/* Leads List */}
            <div className="flex-1 overflow-y-auto p-6">
              {fetchingLeads ? (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600 mr-3" />
                  <p className="text-gray-600">Loading leads...</p>
                </div>
              ) : availableLeads.length > 0 ? (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <span className="text-sm text-gray-600">
                        Showing {availableLeads.length} leads
                        {selectedLeads.length > 0 && (
                          <span className="ml-2 font-medium text-blue-600">
                            ({selectedLeads.length} selected)
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSelectAll}
                        className="text-xs"
                      >
                        {selectedLeads.length === availableLeads.length
                          ? "Deselect All"
                          : "Select All"}
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {availableLeads.map((lead) => {
                      const leadId = lead._id || lead.id;
                      const isSelected = selectedLeads.some(
                        (selected) => (selected._id || selected.id) === leadId
                      );
                      return (
                        <div
                          key={leadId}
                          className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                            isSelected
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => handleSelectLead(lead)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-start gap-3">
                                {/* Fixed Checkbox */}
                                <div className="mt-1">
                                  <div
                                    className={`w-5 h-5 rounded border flex items-center justify-center ${
                                      isSelected
                                        ? "bg-blue-500 border-blue-500"
                                        : "border-gray-300 bg-white"
                                    }`}
                                  >
                                    {isSelected && (
                                      <Check className="w-3 h-3 text-white" />
                                    )}
                                  </div>
                                </div>

                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <h4 className="font-medium text-base">
                                      {lead.firstName} {lead.lastName}
                                    </h4>
                                    {lead.leadStatus && (
                                      <Badge
                                        className={getStatusColor(
                                          lead.leadStatus
                                        )}
                                      >
                                        {lead.leadStatus}
                                      </Badge>
                                    )}
                                  </div>

                                  <div className="space-y-2 mt-3">
                                    {lead.email && (
                                      <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Mail className="w-4 h-4" />
                                        <span className="truncate">
                                          {lead.email}
                                        </span>
                                      </div>
                                    )}

                                    {lead.company && (
                                      <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Building className="w-4 h-4" />
                                        <span>{lead.company}</span>
                                      </div>
                                    )}

                                    {(lead.phone || lead.mobile) && (
                                      <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Phone className="w-4 h-4" />
                                        <span>{lead.phone || lead.mobile}</span>
                                      </div>
                                    )}

                                    {(lead.leadSource || lead.industry) && (
                                      <div className="text-xs text-gray-500 mt-2">
                                        {lead.leadSource && (
                                          <span>Source: {lead.leadSource}</span>
                                        )}
                                        {lead.industry && lead.leadSource && (
                                          <span> • </span>
                                        )}
                                        {lead.industry && (
                                          <span>Industry: {lead.industry}</span>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 p-6">
                  <div className="text-gray-400 mb-4">
                    <UserX className="w-12 h-12" />
                  </div>
                  <p className="text-gray-500 text-center">
                    {searchTerm
                      ? "No leads found matching your search."
                      : "No leads available to add. All leads are already members or no leads exist."}
                  </p>
                  {searchTerm && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSearchTerm("");
                        fetchLeads();
                      }}
                      className="mt-4"
                    >
                      Clear Search
                    </Button>
                  )}
                </div>
              )}
            </div>

            {/* Dialog Footer */}
            <div className="border-t p-6 bg-gray-50">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-sm text-gray-600">
                    {selectedLeads.length} lead(s) selected
                  </span>
                  {selectedLeads.length > 0 && (
                    <p className="text-xs text-gray-500 mt-1">
                      Click "Add to Campaign" to add selected leads
                    </p>
                  )}
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowAddDialog(false);
                      setSelectedLeads([]);
                      setSearchTerm("");
                    }}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddSelectedLeads}
                    disabled={selectedLeads.length === 0 || loading}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Add {selectedLeads.length} Lead(s) to Campaign
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignMembers;
