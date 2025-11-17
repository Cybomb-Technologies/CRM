// src/components/campaigns/CreateCampaign.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateCampaign = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    campaignOwner: "Divya Baskaran",
    campaignName: "",
    type: "",
    status: "",
    startDate: "",
    endDate: "",
    expectedRevenue: "",
    budgetedCost: "",
    actualCost: "",
    expectedResponse: "",
    numbersSent: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="w-full bg-white p-8">
      {/* Top Header */}
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
          <button className="px-4 py-2 bg-[#4667d8] text-white rounded-md">
            Save
          </button>
        </div>
      </div>

      {/* Campaign Information */}
      <h2 className="font-semibold text-lg mb-4">Campaign Information</h2>

      <div className="grid grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">

          {/* Campaign Owner */}
          <div>
            <label className="block mb-1 text-sm">Campaign Owner</label>
            <input
              type="text"
              name="campaignOwner"
              value={formData.campaignOwner}
              readOnly
              className="w-full border rounded-md px-3 py-2 outline-blue-400"
            />
          </div>

          {/* Campaign Name */}
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
            />
          </div>

          {/* Start Date */}
          <div>
            <label className="block mb-1 text-sm">Start Date</label>
            <input
              type="date"
              name="startDate"
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 outline-blue-400"
            />
          </div>

          {/* Expected Revenue */}
          <div>
            <label className="block mb-1 text-sm">Expected Revenue</label>
            <input
              type="number"
              name="expectedRevenue"
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 outline-blue-400"
            />
          </div>

          {/* Actual Cost */}
          <div>
            <label className="block mb-1 text-sm">Actual Cost</label>
            <input
              type="number"
              name="actualCost"
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 outline-blue-400"
            />
          </div>

          {/* Numbers Sent */}
          <div>
            <label className="block mb-1 text-sm">Numbers Sent</label>
            <input
              type="number"
              name="numbersSent"
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 outline-blue-400"
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">

          {/* Type */}
          <div>
            <label className="block mb-1 text-sm">Type</label>
            <select
              name="type"
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 outline-blue-400"
            >
              <option>-None-</option>
              <option>Email</option>
              <option>Telemarketing</option>
              <option>Webinar</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block mb-1 text-sm">Status</label>
            <select
              name="status"
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 outline-blue-400"
            >
              <option>-None-</option>
              <option>Planning</option>
              <option>Active</option>
              <option>Completed</option>
            </select>
          </div>

          {/* End Date */}
          <div>
            <label className="block mb-1 text-sm">End Date</label>
            <input
              type="date"
              name="endDate"
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 outline-blue-400"
            />
          </div>

          {/* Budgeted Cost */}
          <div>
            <label className="block mb-1 text-sm">Budgeted Cost</label>
            <input
              type="number"
              name="budgetedCost"
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 outline-blue-400"
            />
          </div>

          {/* Expected Response */}
          <div>
            <label className="block mb-1 text-sm">Expected Response (%)</label>
            <input
              type="number"
              name="expectedResponse"
              onChange={handleChange}
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
          className="w-full border rounded-md px-3 py-2 h-28 outline-blue-400"
        ></textarea>
      </div>
    </div>
  );
};

export default CreateCampaign;
