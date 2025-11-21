import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "@/contexts/DataContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Filter, Users, TrendingUp, Calendar } from "lucide-react";

const CampaignList = () => {
  const navigate = useNavigate();
  const { campaigns = [] } = useData();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredCampaigns = useMemo(() => {
    return campaigns.filter(campaign => {
      const matchesSearch = campaign.campaignName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           campaign.type?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || campaign.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [campaigns, searchTerm, statusFilter]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Planning': return 'bg-blue-100 text-blue-800';
      case 'Completed': return 'bg-gray-100 text-gray-800';
      case 'Inactive': return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateROI = (campaign) => {
    const revenue = parseFloat(campaign.expectedRevenue) || 0;
    const cost = parseFloat(campaign.actualCost) || parseFloat(campaign.budgetedCost) || 0;
    if (cost === 0) return 0;
    return ((revenue - cost) / cost) * 100;
  };

  return (
    <div className="w-full bg-white p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Campaigns</h1>
        <Button 
          onClick={() => navigate("/campaigns/create")}
          className="bg-[#4667d8] hover:bg-[#3c59c0]"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Campaign
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search campaigns..."
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
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCampaigns.map((campaign) => (
          <div
            key={campaign.id}
            className="border rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => navigate(`/campaigns/${campaign.id}`)}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-semibold text-lg">{campaign.campaignName}</h3>
              <Badge className={getStatusColor(campaign.status)}>
                {campaign.status}
              </Badge>
            </div>

            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>
                  {campaign.startDate ? new Date(campaign.startDate).toLocaleDateString() : 'No start date'} - 
                  {campaign.endDate ? new Date(campaign.endDate).toLocaleDateString() : 'No end date'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>{campaign.members?.length || 0} members</span>
              </div>

              {campaign.expectedRevenue && (
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>Expected: Rs. {parseInt(campaign.expectedRevenue).toLocaleString()}</span>
                </div>
              )}

              {campaign.budgetedCost && (
                <div>
                  <strong>Budget:</strong> Rs. {parseInt(campaign.budgetedCost).toLocaleString()}
                </div>
              )}

              {campaign.actualCost && (
                <div>
                  <strong>Actual Cost:</strong> Rs. {parseInt(campaign.actualCost).toLocaleString()}
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
          </div>
        ))}
      </div>

      {filteredCampaigns.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No campaigns found.</p>
          <Button 
            onClick={() => navigate("/campaigns/create")}
            className="mt-4 bg-[#4667d8] hover:bg-[#3c59c0]"
          >
            Create Your First Campaign
          </Button>
        </div>
      )}
    </div>
  );
};

export default CampaignList;