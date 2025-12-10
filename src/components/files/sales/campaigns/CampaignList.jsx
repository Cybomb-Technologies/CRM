import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { campaignsService } from "./campaignsService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Plus,
  Filter,
  Users,
  TrendingUp,
  Calendar,
  Download,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const CampaignList = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exportLoading, setExportLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  // Fetch campaigns on component mount
  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const filters = {
        search: searchTerm,
        status: statusFilter !== "all" ? statusFilter : undefined,
      };

      const result = await campaignsService.fetchCampaigns(filters);
      if (result.success) {
        setCampaigns(result.data);
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      toast({
        title: "Error",
        description: "Failed to fetch campaigns",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Refetch when filters change
  useEffect(() => {
    fetchCampaigns();
  }, [searchTerm, statusFilter]);

  // Export campaigns to CSV (Frontend only)
  const handleExportCampaigns = () => {
    setExportLoading(true);

    // Simulate loading for better UX
    setTimeout(() => {
      try {
        if (filteredCampaigns.length === 0) {
          toast({
            title: "No Data",
            description: "No campaigns to export",
            variant: "destructive",
          });
          setExportLoading(false);
          return;
        }

        // Prepare CSV data
        const headers = [
          "Campaign ID",
          "Campaign Name",
          "Type",
          "Status",
          "Start Date",
          "End Date",
          "Campaign Owner",
          "Budgeted Cost",
          "Actual Cost",
          "Expected Revenue",
          "Expected Response (%)",
          "Total Members",
          "Responded Members",
          "Converted Members",
          "Response Rate (%)",
          "Conversion Rate (%)",
          "Goal",
          "Target Audience",
          "Description",
          "Created Date",
          "Last Updated",
        ];

        const csvData = filteredCampaigns.map((campaign) => {
          const members = campaign.members || [];
          const respondedMembers = members.filter((m) => m.responded).length;
          const convertedMembers = members.filter((m) => m.converted).length;
          const responseRate =
            members.length > 0
              ? ((respondedMembers / members.length) * 100).toFixed(2)
              : 0;
          const conversionRate =
            respondedMembers > 0
              ? ((convertedMembers / respondedMembers) * 100).toFixed(2)
              : 0;

          // Helper to escape CSV values
          const escapeCsv = (value) => {
            if (value === null || value === undefined) return "";
            const stringValue = String(value);
            // Escape quotes and wrap in quotes if contains comma, quote, or newline
            if (
              stringValue.includes(",") ||
              stringValue.includes('"') ||
              stringValue.includes("\n")
            ) {
              return `"${stringValue.replace(/"/g, '""')}"`;
            }
            return stringValue;
          };

          return [
            escapeCsv(campaign._id || campaign.id || ""),
            escapeCsv(campaign.campaignName || ""),
            escapeCsv(campaign.type || ""),
            escapeCsv(campaign.status || ""),
            escapeCsv(
              campaign.startDate
                ? new Date(campaign.startDate).toLocaleDateString()
                : ""
            ),
            escapeCsv(
              campaign.endDate
                ? new Date(campaign.endDate).toLocaleDateString()
                : ""
            ),
            escapeCsv(campaign.campaignOwner || ""),
            escapeCsv(campaign.budgetedCost || 0),
            escapeCsv(campaign.actualCost || 0),
            escapeCsv(campaign.expectedRevenue || 0),
            escapeCsv(campaign.expectedResponse || 0),
            escapeCsv(members.length),
            escapeCsv(respondedMembers),
            escapeCsv(convertedMembers),
            escapeCsv(responseRate),
            escapeCsv(conversionRate),
            escapeCsv(campaign.goal || ""),
            escapeCsv(campaign.targetAudience || ""),
            escapeCsv(campaign.description || ""),
            escapeCsv(
              campaign.createdAt
                ? new Date(campaign.createdAt).toLocaleString()
                : ""
            ),
            escapeCsv(
              campaign.updatedAt
                ? new Date(campaign.updatedAt).toLocaleString()
                : ""
            ),
          ];
        });

        // Convert to CSV string
        const csvContent = [
          headers.join(","),
          ...csvData.map((row) => row.join(",")),
        ].join("\n");

        // Create blob and download
        const blob = new Blob([csvContent], {
          type: "text/csv;charset=utf-8;",
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `campaigns_export_${new Date().toISOString().split("T")[0]}.csv`
        );
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);

        toast({
          title: "✅ Export Successful",
          description: `Exported ${filteredCampaigns.length} campaigns to CSV`,
        });
      } catch (error) {
        console.error("Export error:", error);
        toast({
          title: "Export Failed",
          description: "Failed to export campaigns",
          variant: "destructive",
        });
      } finally {
        setExportLoading(false);
      }
    }, 500); // Small delay for better UX
  };

  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((campaign) => {
      const matchesSearch =
        campaign.campaignName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        campaign.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || campaign.status === statusFilter;
      const matchesType = typeFilter === "all" || campaign.type === typeFilter;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [campaigns, searchTerm, statusFilter, typeFilter]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Planning":
        return "bg-blue-100 text-blue-800";
      case "Completed":
        return "bg-gray-100 text-gray-800";
      case "Inactive":
        return "bg-yellow-100 text-yellow-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const calculateROI = (campaign) => {
    const revenue = parseFloat(campaign.expectedRevenue) || 0;
    const cost =
      parseFloat(campaign.actualCost) || parseFloat(campaign.budgetedCost) || 0;
    if (cost === 0) return 0;
    return ((revenue - cost) / cost) * 100;
  };

  const handleDeleteCampaign = async (campaignId, campaignName, e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${campaignName}"?`)) {
      const result = await campaignsService.deleteCampaign(campaignId);
      if (result.success) {
        toast({
          title: "Success",
          description: "Campaign deleted successfully",
        });
        fetchCampaigns(); // Refresh the list
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="w-full bg-white p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Campaigns</h1>
        <div className="flex gap-3">
          <Button
            onClick={handleExportCampaigns}
            disabled={exportLoading || filteredCampaigns.length === 0}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
          >
            {exportLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Exporting...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Export Campaigns (CSV)
              </>
            )}
          </Button>
          <Button
            onClick={() => navigate("/campaigns/create")}
            className="bg-[#4667d8] hover:bg-[#3c59c0]"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Campaign
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search campaigns by name, type, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded-md px-3 py-2 outline-blue-400"
        >
          <option value="all">All Statuses</option>
          <option value="Planning">Planning</option>
          <option value="Active">Active</option>
          <option value="Completed">Completed</option>
          <option value="Inactive">Inactive</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="border rounded-md px-3 py-2 outline-blue-400"
        >
          <option value="all">All Types</option>
          <option value="Email">Email</option>
          <option value="Telemarketing">Telemarketing</option>
          <option value="Webinar">Webinar</option>
          <option value="Conference">Conference</option>
          <option value="Trade Show">Trade Show</option>
          <option value="Advertisement">Advertisement</option>
          <option value="Social Media">Social Media</option>
          <option value="Direct Mail">Direct Mail</option>
          <option value="Partnership">Partnership</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Stats Summary */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">
              Showing {filteredCampaigns.length} of {campaigns.length} campaigns
            </p>
            {filteredCampaigns.length > 0 && (
              <div className="flex gap-4 mt-2 text-xs text-gray-500">
                <span>
                  📊 Active:{" "}
                  {
                    filteredCampaigns.filter((c) => c.status === "Active")
                      .length
                  }
                </span>
                <span>
                  📝 Planning:{" "}
                  {
                    filteredCampaigns.filter((c) => c.status === "Planning")
                      .length
                  }
                </span>
                <span>
                  ✅ Completed:{" "}
                  {
                    filteredCampaigns.filter((c) => c.status === "Completed")
                      .length
                  }
                </span>
                <span>
                  👥 Total Members:{" "}
                  {filteredCampaigns.reduce(
                    (sum, c) => sum + (c.members?.length || 0),
                    0
                  )}
                </span>
              </div>
            )}
          </div>
          <div className="text-sm text-gray-600">
            <span className="font-medium">Export Ready:</span>{" "}
            {filteredCampaigns.length} campaign(s)
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading campaigns...</p>
        </div>
      )}

      {/* Campaigns Grid */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCampaigns.map((campaign) => (
            <div
              key={campaign._id || campaign.id}
              className="border rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() =>
                navigate(`/campaigns/${campaign._id || campaign.id}`)
              }
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-semibold text-lg">
                  {campaign.campaignName}
                </h3>
                <Badge className={getStatusColor(campaign.status)}>
                  {campaign.status}
                </Badge>
              </div>

              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {campaign.startDate
                      ? new Date(campaign.startDate).toLocaleDateString()
                      : "No start date"}{" "}
                    -{" "}
                    {campaign.endDate
                      ? new Date(campaign.endDate).toLocaleDateString()
                      : "No end date"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>{campaign.members?.length || 0} members</span>
                </div>

                {campaign.expectedRevenue && (
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    <span>
                      Expected: Rs.{" "}
                      {parseInt(campaign.expectedRevenue).toLocaleString()}
                    </span>
                  </div>
                )}

                {campaign.budgetedCost && (
                  <div>
                    <strong>Budget:</strong> Rs.{" "}
                    {parseInt(campaign.budgetedCost).toLocaleString()}
                  </div>
                )}

                {campaign.actualCost && (
                  <div>
                    <strong>Actual Cost:</strong> Rs.{" "}
                    {parseInt(campaign.actualCost).toLocaleString()}
                  </div>
                )}

                {(campaign.expectedRevenue || campaign.actualCost) && (
                  <div className="pt-2 border-t">
                    <strong>ROI:</strong> {calculateROI(campaign).toFixed(1)}%
                  </div>
                )}
              </div>

              {campaign.description && (
                <p className="mt-4 text-sm text-gray-500 line-clamp-2">
                  {campaign.description}
                </p>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/campaigns/${campaign._id || campaign.id}`);
                  }}
                >
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/campaigns/${campaign._id || campaign.id}/edit`);
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={(e) =>
                    handleDeleteCampaign(
                      campaign._id || campaign.id,
                      campaign.campaignName,
                      e
                    )
                  }
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && filteredCampaigns.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <div className="text-gray-400 mb-4">
            <svg
              className="w-12 h-12 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              ></path>
            </svg>
          </div>
          <p className="text-gray-500">No campaigns found.</p>
          <p className="text-sm text-gray-400 mt-2">
            {searchTerm || statusFilter !== "all" || typeFilter !== "all"
              ? "Try changing your search or filters"
              : "Create your first campaign to get started"}
          </p>
          <Button
            onClick={() => navigate("/campaigns/create")}
            className="mt-4 bg-[#4667d8] hover:bg-[#3c59c0]"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Campaign
          </Button>
        </div>
      )}
    </div>
  );
};

export default CampaignList;
