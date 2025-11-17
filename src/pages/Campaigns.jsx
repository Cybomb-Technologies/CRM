// src/pages/Campaigns.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import CampaignHome from "../components/campaigns/CampaignHome";
import CreateCampaign from "../components/campaigns/CreateCampaign";
import ImportCampaigns from "../components/campaigns/ImportCampaigns";

const Campaigns = () => {
  return (
    <Routes>
      <Route path="/" element={<CampaignHome />} />
      <Route path="/create" element={<CreateCampaign />} />
      <Route path="/import" element={<ImportCampaigns />} />
    </Routes>
  );
};

export default Campaigns;
