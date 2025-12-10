import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { campaignsService } from "./campaignsService";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

const AddToCampaignDialog = ({
  open,
  onOpenChange,
  selectedLeads,
  onSuccess,
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCampaign, setSelectedCampaign] = useState("");

  useEffect(() => {
    if (open) {
      fetchCampaigns();
    }
  }, [open]);

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const result = await campaignsService.fetchCampaigns({
        status: "Active,Planning",
      });

      if (result.success) {
        setCampaigns(result.data);
      }
    } catch (error) {
      console.error("Fetch campaigns error:", error);
      toast({
        title: "Error",
        description: "Failed to fetch campaigns",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Safe filtering with null checks
  const filteredCampaigns = campaigns.filter((campaign) => {
    if (!campaign) return false;

    const campaignName = campaign.campaignName || "";
    const campaignType = campaign.type || "";
    const campaignStatus = campaign.status || "";

    const matchesSearch =
      campaignName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaignType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaignStatus.toLowerCase().includes(searchTerm.toLowerCase());

    const isActive =
      campaign.status === "Active" || campaign.status === "Planning";

    return matchesSearch && isActive;
  });

  const handleAddToCampaign = async () => {
    if (!selectedCampaign) {
      toast({
        title: "Error",
        description: "Please select a campaign.",
        variant: "destructive",
      });
      return;
    }

    const campaign = campaigns.find(
      (c) => c._id === selectedCampaign || c.id === selectedCampaign
    );
    if (!campaign) {
      toast({
        title: "Error",
        description: "Selected campaign not found.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Convert selected leads to campaign members format
      const members = selectedLeads.map((leadId) => {
        // In real implementation, you would fetch lead details from leadsService
        return {
          id: leadId,
          name: `Lead ${leadId}`, // This should come from lead data
          email: "", // This should come from lead data
          type: "lead",
          company: "", // This should come from lead data
        };
      });

      const result = await campaignsService.addMembersToCampaign(
        campaign._id || campaign.id,
        members
      );

      if (result.success) {
        toast({
          title: "Success",
          description: `${selectedLeads.length} leads added to ${
            campaign.campaignName || "the campaign"
          }.`,
        });

        setSelectedCampaign("");
        setSearchTerm("");
        onOpenChange(false);

        if (onSuccess) {
          onSuccess();
        }
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error("Add to campaign error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to add leads to campaign",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Leads to Campaign</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-4">
              Adding {selectedLeads.length} selected leads to a campaign.
            </p>

            <Input
              placeholder="Search active campaigns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-4"
              disabled={loading}
            />

            {loading ? (
              <div className="text-center py-8">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600" />
                <p className="mt-2 text-gray-600">Loading campaigns...</p>
              </div>
            ) : (
              <div className="max-h-60 overflow-y-auto border rounded-md">
                {filteredCampaigns.length > 0 ? (
                  filteredCampaigns.map((campaign) => (
                    <div
                      key={campaign._id || campaign.id}
                      className={`p-3 border-b cursor-pointer hover:bg-gray-50 ${
                        selectedCampaign === (campaign._id || campaign.id)
                          ? "bg-blue-50 border-blue-200"
                          : ""
                      }`}
                      onClick={() =>
                        setSelectedCampaign(campaign._id || campaign.id)
                      }
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">
                            {campaign.campaignName || "Unnamed Campaign"}
                          </p>
                          <p className="text-sm text-gray-600">
                            {campaign.type || "No type"} •{" "}
                            {Array.isArray(campaign.members)
                              ? campaign.members.length
                              : 0}{" "}
                            members
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {campaign.startDate
                              ? new Date(
                                  campaign.startDate
                                ).toLocaleDateString()
                              : "No start date"}
                          </p>
                          <p className="text-sm text-gray-600">
                            {campaign.expectedResponse || 0}% expected response
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    {searchTerm
                      ? "No matching campaigns found."
                      : "No active campaigns available."}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddToCampaign}
            disabled={!selectedCampaign || loading}
          >
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Add to Campaign
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddToCampaignDialog;
