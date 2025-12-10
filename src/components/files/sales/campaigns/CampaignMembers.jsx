import React, { useState } from "react";
import { campaignsService } from "./campaignsService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Mail, UserCheck, UserX } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const CampaignMembers = ({ campaign, onUpdate }) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [availableLeads, setAvailableLeads] = useState([]);
  const [availableContacts, setAvailableContacts] = useState([]);

  const members = campaign.members || [];

  const handleAddMember = async (leadOrContact) => {
    setLoading(true);
    try {
      const memberData = {
        id: leadOrContact.id || leadOrContact._id,
        name: `${leadOrContact.firstName || ""} ${
          leadOrContact.lastName || ""
        }`.trim(),
        email: leadOrContact.email || "",
        type: leadOrContact.company ? "lead" : "contact",
        company: leadOrContact.company || leadOrContact.accountName || "",
      };

      const result = await campaignsService.addMembersToCampaign(
        campaign._id || campaign.id,
        [memberData]
      );

      if (result.success) {
        toast({
          title: "Member Added",
          description: `${memberData.name} has been added to the campaign.`,
        });
        setShowAddDialog(false);
        onUpdate?.();
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error("Add member error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to add member to campaign",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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

  // Note: In a real implementation, you would fetch leads and contacts from their respective services
  // For now, I'll show a simplified version. You would need to import leadsService and contactsService

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Campaign Members</h3>
        <Button onClick={() => setShowAddDialog(true)} disabled={loading}>
          <Plus className="w-4 h-4 mr-2" />
          Add Members
        </Button>
      </div>

      {/* Members List */}
      <div className="border rounded-lg">
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
                <td className="p-4">{member.name}</td>
                <td className="p-4">{member.email}</td>
                <td className="p-4">
                  <Badge
                    variant={member.type === "lead" ? "outline" : "default"}
                  >
                    {member.type}
                  </Badge>
                </td>
                <td className="p-4">{member.company || "-"}</td>
                <td className="p-4">
                  <div className="flex gap-1">
                    {member.responded && (
                      <Badge className="bg-green-100 text-green-800">
                        Responded
                      </Badge>
                    )}
                    {member.converted && (
                      <Badge className="bg-blue-100 text-blue-800">
                        Converted
                      </Badge>
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
                      >
                        <Mail className="w-4 h-4 mr-1" />
                        Mark Responded
                      </Button>
                    )}
                    {member.responded && !member.converted && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleMarkConverted(member.id)}
                        disabled={loading}
                      >
                        <UserCheck className="w-4 h-4 mr-1" />
                        Mark Converted
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleRemoveMember(member.id)}
                      disabled={loading}
                    >
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
            <p className="text-gray-500">
              No members added to this campaign yet.
            </p>
          </div>
        )}
      </div>

      {/* Add Members Dialog */}
      {showAddDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">
              Add Members to Campaign
            </h3>

            <Input
              placeholder="Search leads and contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-4"
              disabled={loading}
            />

            <div className="mb-6">
              <h4 className="font-medium mb-2">Available Leads & Contacts</h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                <div className="p-4 text-center text-gray-500">
                  <p>
                    Note: In a real implementation, this would fetch from leads
                    and contacts services
                  </p>
                  <p className="text-sm mt-2">
                    You would need to import leadsService and contactsService
                    and fetch available records
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowAddDialog(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  // Demo: Add a sample member
                  handleAddMember({
                    id: `demo_${Date.now()}`,
                    firstName: "Demo",
                    lastName: "Member",
                    email: "demo@example.com",
                    company: "Demo Company",
                  });
                }}
                disabled={loading}
              >
                Add Demo Member
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignMembers;
