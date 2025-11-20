import React from "react";
import { Routes, Route } from "react-router-dom";
import CampaignHome from "../components/campaigns/CampaignHome";
import CreateCampaign from "../components/campaigns/CreateCampaign";
import CampaignList from "../components/campaigns/CampaignList";
import CampaignDetail from "../components/campaigns/CampaignDetail";
import ImportCampaigns from "../components/campaigns/ImportCampaigns";

const Campaigns = () => {
  return (
    <Routes>
      <Route path="/" element={<CampaignHome />} />
      <Route path="/list" element={<CampaignList />} />
      <Route path="/create" element={<CreateCampaign />} />
      <Route path="/:id" element={<CampaignDetail />} />
      <Route path="/import" element={<ImportCampaigns />} />
    </Routes>
  );
};

export default Campaigns;