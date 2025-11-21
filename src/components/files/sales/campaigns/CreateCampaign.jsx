import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "@/contexts/DataContext";
import { useToast } from "@/components/ui/use-toast";

const CreateCampaign = () => {
  const navigate = useNavigate();
  const { addDataItem } = useData();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    campaignOwner: "Current User",
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
    "Other"
  ];

  const campaignStatuses = [
    "Planning",
    "Active",
    "Completed",
    "Inactive",
    "Cancelled"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.campaignName) {
      toast({
        title: "Validation Error",
        description: "Campaign Name is required.",
        variant: "destructive"
      });
      return;
    }

    const newCampaign = {
      id: Date.now().toString(),
      ...formData,
      members: [],
      responses: 0,
      convertedLeads: 0,
      roi: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    addDataItem('campaigns', newCampaign);
    
    toast({
      title: "Success",
      description: "Campaign created successfully!",
    });

    navigate("/campaigns/list");
  };

  return (
    <div className="w-full bg-white p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold">Create Campaign</h1>

        <div className="flex gap-3">
          <button
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
            onClick={() => navigate("/campaigns")}
          >
            Cancel
          </button>
          <button className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md">
            Save and New
          </button>
          <button 
            className="px-4 py-2 bg-[#4667d8] text-white rounded-md"
            onClick={handleSubmit}
          >
            Save
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <h2 className="font-semibold text-lg mb-4">Campaign Information</h2>

        <div className="grid grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            <div>
              <label className="block mb-1 text-sm">Campaign Owner</label>
              <input
                type="text"
                name="campaignOwner"
                value={formData.campaignOwner}
                readOnly
                className="w-full border rounded-md px-3 py-2 outline-blue-400 bg-gray-50"
              />
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
              />
            </div>

            <div>
              <label className="block mb-1 text-sm">Type</label>
              <select
                name="type"
                onChange={handleChange}
                value={formData.type}
                className="w-full border rounded-md px-3 py-2 outline-blue-400"
              >
                <option value="">-None-</option>
                {campaignTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
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
              >
                {campaignStatuses.map(status => (
                  <option key={status} value={status}>{status}</option>
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
              />
            </div>

            <div>
              <label className="block mb-1 text-sm">Expected Response (%)</label>
              <input
                type="number"
                name="expectedResponse"
                onChange={handleChange}
                value={formData.expectedResponse}
                min="0"
                max="100"
                className="w-full border rounded-md px-3 py-2 outline-blue-400"
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mt-10">
          <h2 className="font-semibold text-lg mb-2">Description Information</h2>
          <textarea
            name="description"
            onChange={handleChange}
            value={formData.description}
            className="w-full border rounded-md px-3 py-2 h-28 outline-blue-400"
            placeholder="Describe the campaign objectives, target audience, and key messaging..."
          ></textarea>
        </div>
      </form>
    </div>
  );
};

export default CreateCampaign;