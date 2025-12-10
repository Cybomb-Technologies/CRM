import React from "react";
import { Route } from "react-router-dom";
import SalesInboxPage from "@/pages/files/integrations/SalesInboxPage";
import SocialPage from "@/pages/files/integrations/SocialPage";
import VisitsPage from "@/pages/files/integrations/VisitsPage";
import TicketsPage from "@/pages/TicketsPage";
import ProductsPage from "@/pages/files/inventory/ProductsPage";
import ReportsPage from "@/pages/reports/ReportsPage";
import WorkflowsPage from "@/pages/WorkflowsPage";
import WorkflowBuilderPage from "@/pages/WorkflowBuilderPage";
import SettingsPage from "@/pages/SettingsPage";
import CalendarPage from "@/pages/CalendarPage";
import Vendors from "@/pages/Vendors";
import CreateVendor from "@/pages/CreateVendor";

const Emp3Routes = (
  <>
    {/* Integrations Routes */}
    <Route path="sales-inbox" element={<SalesInboxPage />} />
    <Route path="social" element={<SocialPage />} />
    <Route path="visits" element={<VisitsPage />} />

    {/* Other Routes */}
    <Route path="tickets" element={<TicketsPage />} />
    <Route path="products" element={<ProductsPage />} />
    <Route path="reports" element={<ReportsPage />} />
    <Route path="workflows" element={<WorkflowsPage />} />
    <Route path="workflows/builder/:id" element={<WorkflowBuilderPage />} />
    <Route path="workflows/builder" element={<WorkflowBuilderPage />} />
    <Route path="settings" element={<SettingsPage />} />
    <Route path="calendar" element={<CalendarPage />} />
    <Route path="vendors" element={<Vendors />} />
    <Route path="create-vendor" element={<CreateVendor />} />

    {/* Reports Routes */}
    {/* <Route path="/reports" element={<ReportsPage />} />
    <Route path="/reports/:folder" element={<ReportsPage />} /> */}

    {/* Hook/Test Routes */}
   {/* Hook/Test Routes */}
<Route path="use-invoice-form" element={<useInvoiceForm />} />
<Route path="use-po-form" element={<usePOForm />} />
<Route path="use-po-storage" element={<usePOStorage />} />
<Route path="use-quote-form" element={<useQuoteForm />} />
<Route path="use-quote-storage" element={<useQuoteStorage />} />

  </>
);

export default Emp3Routes;
