import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { campaignsService } from "./campaignsService";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CreateCampaign = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    campaignOwner: user ? `${user.name} (${user.email})` : "Current User",
    campaignName: "",
    type: "",
    status: "Planning",
    startDate: "",
    endDate: "",
    expectedRevenue: "",
    budgetedCost: "",
    actualCost: "",
    expectedResponse: "",
    numbersSent: "",
    description: "",
    targetAudience: "",
    goal: "",
  });

  const campaignTypes = [
    "Email",
    "Telemarketing",
    "Webinar",
    "Conference",
    "Trade Show",
    "Advertisement",
    "Social Media",
    "Direct Mail",
    "Partnership",
    "Other",
  ];

  const campaignStatuses = [
    "Planning",
    "Active",
    "Completed",
    "Inactive",
    "Cancelled",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.campaignName) {
      toast({
        title: "Validation Error",
        description: "Campaign Name is required.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Prepare data for backend
      const campaignData = {
        ...formData,
        // Convert empty strings to null for number fields
        expectedRevenue: formData.expectedRevenue
          ? parseFloat(formData.expectedRevenue)
          : 0,
        budgetedCost: formData.budgetedCost
          ? parseFloat(formData.budgetedCost)
          : 0,
        actualCost: formData.actualCost ? parseFloat(formData.actualCost) : 0,
        expectedResponse: formData.expectedResponse
          ? parseFloat(formData.expectedResponse)
          : 0,
        numbersSent: formData.numbersSent ? parseInt(formData.numbersSent) : 0,
        // Convert date strings to Date objects
        startDate: formData.startDate ? new Date(formData.startDate) : null,
        endDate: formData.endDate ? new Date(formData.endDate) : null,
        // Initialize arrays
        members: [],
        activities: [],
        // Ensure campaign owner is set from user context
        campaignOwner: user ? `${user.name} (${user.email})` : "Current User",
      };

      const result = await campaignsService.createCampaign(campaignData);

      if (result.success) {
        toast({
          title: "Success",
          description: "Campaign created successfully!",
        });
        navigate("/campaigns/list");
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Create campaign error:", error);
      toast({
        title: "Error",
        description: "Failed to create campaign. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-white p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold">Create Campaign</h1>

        <div className="flex gap-3">
          <button
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md disabled:opacity-50"
            onClick={() => navigate("/campaigns")}
            disabled={loading}
          >
            Cancel
          </button>
          {/* <button
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md disabled:opacity-50"
            disabled={loading}
          >
            Save and New
          </button> */}
          <button
            className="px-4 py-2 bg-[#4667d8] text-white rounded-md hover:bg-[#3c59c0] disabled:opacity-50"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Creating..." : "Save"}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <h2 className="font-semibold text-lg mb-4">Campaign Information</h2>

        <div className="grid grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Campaign Owner Field - Fixed alignment to match Task Owner UI */}
            <div>
              <label className="block mb-1 text-sm">Campaign Owner</label>
              <Select
                value={user?.id || ""}
                onValueChange={(value) => {
                  setFormData((prev) => ({
                    ...prev,
                    campaignOwner: user
                      ? `${user.name} (${user.email})`
                      : "Current User",
                  }));
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue>
                    <div className="flex flex-col text-left">
                      <span className="font-medium">
                        {user?.name || "Current User"}
                      </span>
                      {user?.email && (
                        <span className="text-sm text-gray-500">
                          {user.email}
                        </span>
                      )}
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={user?.id || "current-user"}>
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {user?.name || "Current User"}
                      </span>
                      <span className="text-sm text-gray-500">
                        {user?.email || ""}
                      </span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 mt-1">
                Currently assigned to: {user?.name || "Current User"} (
                {user?.email || "No email"})
              </p>
            </div>

            <div>
              <label className="block mb-1 text-sm text-red-600 font-medium">
                Campaign Name *
              </label>
              <input
                type="text"
                name="campaignName"
                onChange={handleChange}
                value={formData.campaignName}
                className="w-full border rounded-md px-3 py-2 outline-blue-400"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block mb-1 text-sm">Type</label>
              <select
                name="type"
                onChange={handleChange}
                value={formData.type}
                className="w-full border rounded-md px-3 py-2 outline-blue-400"
                disabled={loading}
              >
                <option value="">-None-</option>
                {campaignTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1 text-sm">Status</label>
              <select
                name="status"
                onChange={handleChange}
                value={formData.status}
                className="w-full border rounded-md px-3 py-2 outline-blue-400"
                disabled={loading}
              >
                {campaignStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1 text-sm">Start Date</label>
              <input
                type="date"
                name="startDate"
                onChange={handleChange}
                value={formData.startDate}
                className="w-full border rounded-md px-3 py-2 outline-blue-400"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block mb-1 text-sm">Expected Revenue</label>
              <input
                type="number"
                name="expectedRevenue"
                onChange={handleChange}
                value={formData.expectedRevenue}
                className="w-full border rounded-md px-3 py-2 outline-blue-400"
                disabled={loading}
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div>
              <label className="block mb-1 text-sm">Target Audience</label>
              <input
                type="text"
                name="targetAudience"
                onChange={handleChange}
                value={formData.targetAudience}
                className="w-full border rounded-md px-3 py-2 outline-blue-400"
                placeholder="e.g., Enterprise customers, Small businesses"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block mb-1 text-sm">Goal</label>
              <input
                type="text"
                name="goal"
                onChange={handleChange}
                value={formData.goal}
                className="w-full border rounded-md px-3 py-2 outline-blue-400"
                placeholder="e.g., Generate 100 leads, Increase brand awareness"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block mb-1 text-sm">End Date</label>
              <input
                type="date"
                name="endDate"
                onChange={handleChange}
                value={formData.endDate}
                className="w-full border rounded-md px-3 py-2 outline-blue-400"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block mb-1 text-sm">Budgeted Cost</label>
              <input
                type="number"
                name="budgetedCost"
                onChange={handleChange}
                value={formData.budgetedCost}
                className="w-full border rounded-md px-3 py-2 outline-blue-400"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block mb-1 text-sm">Actual Cost</label>
              <input
                type="number"
                name="actualCost"
                onChange={handleChange}
                value={formData.actualCost}
                className="w-full border rounded-md px-3 py-2 outline-blue-400"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block mb-1 text-sm">
                Expected Response (%)
              </label>
              <input
                type="number"
                name="expectedResponse"
                onChange={handleChange}
                value={formData.expectedResponse}
                min="0"
                max="100"
                className="w-full border rounded-md px-3 py-2 outline-blue-400"
                disabled={loading}
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mt-10">
          <h2 className="font-semibold text-lg mb-2">
            Description Information
          </h2>
          <textarea
            name="description"
            onChange={handleChange}
            value={formData.description}
            className="w-full border rounded-md px-3 py-2 h-28 outline-blue-400"
            placeholder="Describe the campaign objectives, target audience, and key messaging..."
            disabled={loading}
          ></textarea>
        </div>
      </form>
    </div>
  );
};

export default CreateCampaign;
