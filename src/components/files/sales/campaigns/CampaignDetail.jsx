import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { campaignsService } from "./campaignsService";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Users,
  TrendingUp,
  DollarSign,
  Target,
  Mail,
  Loader2,
  User,
} from "lucide-react";
import CampaignMembers from "./CampaignMembers";
import CampaignAnalytics from "./CampaignAnalytics";
import CampaignActivities from "./CampaignActivities";
import { useToast } from "@/components/ui/use-toast";

const CampaignDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    fetchCampaign();
  }, [id]);

  const fetchCampaign = async () => {
    setLoading(true);
    try {
      const result = await campaignsService.fetchCampaign(id);
      if (result.success) {
        setCampaign(result.data);
        calculateMetrics(result.data);
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
        navigate("/campaigns/list");
      }
    } catch (error) {
      console.error("Error fetching campaign:", error);
      toast({
        title: "Error",
        description: "Failed to fetch campaign",
        variant: "destructive",
      });
      navigate("/campaigns/list");
    } finally {
      setLoading(false);
    }
  };

  const calculateMetrics = (campaignData) => {
    const members = campaignData.members || [];
    const activities = campaignData.activities || [];
    const responses = members.filter((m) => m.responded).length;
    const converted = members.filter((m) => m.converted).length;

    const revenue = parseFloat(campaignData.expectedRevenue) || 0;
    const cost =
      parseFloat(campaignData.actualCost) ||
      parseFloat(campaignData.budgetedCost) ||
      0;
    const roi = cost > 0 ? ((revenue - cost) / cost) * 100 : 0;

    // Activities metrics
    const completedActivities = activities.filter(
      (a) => a.status === "Completed"
    ).length;
    const pendingActivities = activities.filter(
      (a) => a.status === "Pending"
    ).length;
    const activityCompletionRate =
      activities.length > 0
        ? (completedActivities / activities.length) * 100
        : 0;

    const calculatedMetrics = {
      totalMembers: members.length,
      responses,
      converted,
      responseRate: members.length > 0 ? (responses / members.length) * 100 : 0,
      conversionRate: responses > 0 ? (converted / responses) * 100 : 0,
      roi,
      totalActivities: activities.length,
      completedActivities,
      pendingActivities,
      activityCompletionRate,
    };

    setMetrics(calculatedMetrics);
  };

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

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "members", label: `Members (${metrics?.totalMembers || 0})` },
    { id: "analytics", label: "Analytics" },
    {
      id: "activities",
      label: `Activities (${metrics?.totalActivities || 0})`,
    },
  ];

  const handleDeleteCampaign = async () => {
    if (
      window.confirm(
        `Are you sure you want to delete "${campaign?.campaignName}"?`
      )
    ) {
      const result = await campaignsService.deleteCampaign(id);
      if (result.success) {
        toast({
          title: "Success",
          description: "Campaign deleted successfully",
        });
        navigate("/campaigns/list");
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    }
  };

  // Parse campaign owner name and email from the string format
  const parseCampaignOwner = (ownerString) => {
    if (!ownerString) return { name: "Not specified", email: "" };

    const match = ownerString.match(/^(.*?)\s*\((.*?)\)$/);
    if (match) {
      return { name: match[1].trim(), email: match[2].trim() };
    }
    return { name: ownerString, email: "" };
  };

  if (loading) {
    return (
      <div className="w-full bg-white p-8 text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600" />
        <p className="mt-4 text-gray-600">Loading campaign details...</p>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="w-full bg-white p-8 text-center">
        <h1 className="text-2xl font-semibold mb-4">Campaign Not Found</h1>
        <Button onClick={() => navigate("/campaigns/list")}>
          Back to Campaigns
        </Button>
      </div>
    );
  }

  const campaignOwnerInfo = parseCampaignOwner(campaign.campaignOwner);

  return (
    <div className="w-full bg-white">
      {/* Header */}
      <div className="border-b bg-gray-50 p-6">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-semibold">
                {campaign.campaignName}
              </h1>
              <Badge className={getStatusColor(campaign.status)}>
                {campaign.status}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-gray-600">
              <span>{campaign.type}</span>
              <span>•</span>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <div className="flex flex-col">
                  <span className="font-medium">{campaignOwnerInfo.name}</span>
                  {campaignOwnerInfo.email && (
                    <span className="text-sm text-gray-500">
                      {campaignOwnerInfo.email}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => navigate("/campaigns/list")}
              variant="outline"
            >
              Back to List
            </Button>
            <Button
              onClick={() => navigate(`/campaigns/${id}/edit`)}
              variant="outline"
            >
              Edit Campaign
            </Button>
            <Button onClick={handleDeleteCampaign} variant="destructive">
              Delete
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b mt-4 -mb-px">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-[#4667d8] text-[#4667d8]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold">Total Members</h3>
                </div>
                <p className="text-2xl font-bold">
                  {metrics?.totalMembers || 0}
                </p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="w-5 h-5 text-green-600" />
                  <h3 className="font-semibold">Response Rate</h3>
                </div>
                <p className="text-2xl font-bold">
                  {metrics?.responseRate?.toFixed(1) || "0.0"}%
                </p>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-5 h-5 text-purple-600" />
                  <h3 className="font-semibold">Conversion Rate</h3>
                </div>
                <p className="text-2xl font-bold">
                  {metrics?.conversionRate?.toFixed(1) || "0.0"}%
                </p>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-orange-600" />
                  <h3 className="font-semibold">ROI</h3>
                </div>
                <p className="text-2xl font-bold">
                  {metrics?.roi?.toFixed(1) || "0.0"}%
                </p>
              </div>
            </div>

            {/* Activities Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="w-5 h-5 text-gray-600" />
                  <h3 className="font-semibold">Total Activities</h3>
                </div>
                <p className="text-2xl font-bold">
                  {metrics?.totalActivities || 0}
                </p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-5 h-5 text-green-600" />
                  <h3 className="font-semibold">Completed</h3>
                </div>
                <p className="text-2xl font-bold">
                  {metrics?.completedActivities || 0}
                </p>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-5 h-5 text-yellow-600" />
                  <h3 className="font-semibold">Pending</h3>
                </div>
                <p className="text-2xl font-bold">
                  {metrics?.pendingActivities || 0}
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold">Completion Rate</h3>
                </div>
                <p className="text-2xl font-bold">
                  {metrics?.activityCompletionRate?.toFixed(1) || "0.0"}%
                </p>
              </div>
            </div>

            {/* Campaign Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Campaign Information</h3>
                <div className="space-y-3">
                  <div>
                    <strong>Type:</strong> {campaign.type || "Not specified"}
                  </div>
                  <div>
                    <strong>Goal:</strong> {campaign.goal || "Not specified"}
                  </div>
                  <div>
                    <strong>Target Audience:</strong>{" "}
                    {campaign.targetAudience || "Not specified"}
                  </div>
                  <div>
                    <strong>Expected Response:</strong>{" "}
                    {campaign.expectedResponse || "0"}%
                  </div>
                  <div>
                    <strong>Campaign Owner:</strong>
                    <div className="ml-2 mt-1">
                      <div className="font-medium">
                        {campaignOwnerInfo.name}
                      </div>
                      {campaignOwnerInfo.email && (
                        <div className="text-sm text-gray-600">
                          {campaignOwnerInfo.email}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Financial Information</h3>
                <div className="space-y-3">
                  <div>
                    <strong>Budgeted Cost:</strong>{" "}
                    {campaign.budgetedCost
                      ? `Rs. ${parseInt(
                          campaign.budgetedCost
                        ).toLocaleString()}`
                      : "Not specified"}
                  </div>
                  <div>
                    <strong>Actual Cost:</strong>{" "}
                    {campaign.actualCost
                      ? `Rs. ${parseInt(campaign.actualCost).toLocaleString()}`
                      : "Not specified"}
                  </div>
                  <div>
                    <strong>Expected Revenue:</strong>{" "}
                    {campaign.expectedRevenue
                      ? `Rs. ${parseInt(
                          campaign.expectedRevenue
                        ).toLocaleString()}`
                      : "Not specified"}
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Timeline</h3>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>
                    <strong>Start:</strong>{" "}
                    {campaign.startDate
                      ? new Date(campaign.startDate).toLocaleDateString()
                      : "Not set"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>
                    <strong>End:</strong>{" "}
                    {campaign.endDate
                      ? new Date(campaign.endDate).toLocaleDateString()
                      : "Not set"}
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            {campaign.description && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Description</h3>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {campaign.description}
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === "members" && (
          <CampaignMembers campaign={campaign} onUpdate={fetchCampaign} />
        )}

        {activeTab === "analytics" && (
          <CampaignAnalytics campaign={campaign} metrics={metrics} />
        )}

        {activeTab === "activities" && (
          <CampaignActivities campaign={campaign} onUpdate={fetchCampaign} />
        )}
      </div>
    </div>
  );
};

export default CampaignDetail;
