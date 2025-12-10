import React from "react";
import { Route } from "react-router-dom";
import DashboardPage from "@/pages/DashboardPage";
import LeadsPage from "@/pages/files/sales/LeadsPage";
import AccountsPage from "@/pages/files/sales/AccountsPage";
import ContactsPage from "@/pages/files/sales/ContactsPage";
import DealsPage from "@/pages/files/sales/DealsPage";
import DocumentPage from "@/pages/files/sales/Document";
import CampaignsPage from "@/pages/files/sales/Campaigns";
import Forecasts from "@/pages/files/sales/Forecasts";

const Emp1Routes = (
  <>
    {/* Dashboard */}
    <Route index element={<DashboardPage />} />

    {/* Sales Routes */}
    <Route path="leads" element={<LeadsPage />} />
    <Route path="accounts" element={<AccountsPage />} />
    <Route path="contacts" element={<ContactsPage />} />
    <Route path="deals" element={<DealsPage />} />
    <Route path="documents" element={<DocumentPage />} />
    <Route path="campaigns/*" element={<CampaignsPage />} />
    <Route path="forecasts" element={<Forecasts />} />
  </>
);

export default Emp1Routes;
