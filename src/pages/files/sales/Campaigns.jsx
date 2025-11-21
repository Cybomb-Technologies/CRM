import React from "react";
import { Routes, Route } from "react-router-dom";
import CampaignHome from "../../../components/files/sales/campaigns/CampaignHome";
import CreateCampaign from "../../../components/files/sales/campaigns/CreateCampaign";
import CampaignList from "../../../components/files/sales/campaigns/CampaignList";
import CampaignDetail from "../../../components/files/sales/campaigns/CampaignDetail";
import ImportCampaigns from "../../../components/files/sales/campaigns/ImportCampaigns";

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