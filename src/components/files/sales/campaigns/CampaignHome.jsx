import React from "react";
import { useNavigate } from "react-router-dom";

const CampaignHome = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full h-full flex items-center justify-center py-10 bg-[#f5f7fb]">
      <div className="text-center -mt-10">
        <h1 className="text-2xl font-semibold mb-2">Plan Campaigns</h1>
        <p className="text-gray-600 mb-6">
          Campaigns are marketing efforts planned, executed, and monitored from
          within your CRM.
        </p>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate("/campaigns/create")}
            className="px-5 py-2 bg-[#4667d8] text-white rounded-md hover:bg-[#3c59c0] shadow-sm"
          >
            Create Campaign
          </button>

          <button
            onClick={() => navigate("/campaigns/list")}
            className="px-5 py-2 bg-[#4667d8] text-white rounded-md hover:bg-[#3c59c0] shadow-sm"
          >
            View Campaigns
          </button>

          <button
            onClick={() => navigate("/campaigns/import")}
            className="px-5 py-2 bg-[#4667d8] text-white rounded-md hover:bg-[#3c59c0] shadow-sm"
          >
            Import Campaigns
          </button>
        </div>
      </div>
    </div>
  );
};

export default CampaignHome;
